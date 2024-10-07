import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import admin from 'firebase-admin';
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import PDFDocument from 'pdfkit';
import { v4 as uuidv4 } from 'uuid';
import { PDF as PdfModel } from '../models/PDF.js';
import fs from 'fs';
import mongoose from 'mongoose';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import serviceAccount from './base64-ca5d9-firebase-adminsdk-n09fb-08a8fa9e65.json' assert { type: 'json' };

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "gs://base64-ca5d9.appspot.com",
});

// Access Firebase storage bucket
const bucket = admin.storage().bucket();

// Configure Nodemailer for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Initialize Twilio for sending WhatsApp messages
//const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Controller to handle server status
export const getServerStatus = (req, res) => {
    res.send('Server is running!');
};


// Updated createPdf Controller
export const createPdf = async (req, res) => {
    const { customerId, names } = req.body;  // Receive customerId from the request body
    const uniqueId = uuidv4();

    try {
        // Create a PDF document in memory
        const doc = new PDFDocument();
        let buffers = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', async () => {
            const pdfBuffer = Buffer.concat(buffers);
            const base64Pdf = pdfBuffer.toString('base64');

            // Save PDF data in the database
            const newPdf = new PdfModel({
                uniqueId,
                customer: new mongoose.Types.ObjectId(customerId), // Store customerId as an ObjectId
                base64Pdf: [base64Pdf],  // Store base64 as an array of strings (if multiple files are needed in the future)
                createdAt: new Date(),
            });

            const savedPdf = await newPdf.save();

            // Return the inserted object including uniqueId, customer, and base64Pdf
            res.status(200).json({
                uniqueId: savedPdf.uniqueId,
                customer: savedPdf.customer,
                base64Pdf: savedPdf.base64Pdf,
                createdAt: savedPdf.createdAt,
            });
        });

        // Add content to the PDF
        doc.fontSize(25).text(`Suggested names for the customer`, { align: 'center' });
        doc.moveDown();
        names.forEach((name) => doc.fontSize(14).text(name));

        // Finalize the PDF
        doc.end();
    } catch (error) {
        console.error('Error creating PDF:', error);
        res.status(500).json({ error: 'Error creating PDF' });
    }
};


// Helper function to upload PDF to Firebase Storage
const uploadPdfToFirebase = async (base64Pdf, uniqueId) => {
    const buffer = Buffer.from(base64Pdf, 'base64');
    const file = bucket.file(`${uniqueId}.pdf`);

    await file.save(buffer, {
        metadata: { contentType: 'application/pdf' },
    });

    await file.makePublic();
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;

    return publicUrl;
};

// Controller to send PDF via email
export const sendPdfByEmail = async (req, res) => {
    const { email, base64Pdf, uniqueId } = req.body;

    try {
        const pdfUrl = await uploadPdfToFirebase(base64Pdf, uniqueId);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your PDF',
            text: 'Here is the PDF you requested!',
            attachments: [
                {
                    filename: `${uniqueId}.pdf`,
                    path: pdfUrl,
                    contentType: 'application/pdf',
                },
            ],
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({
            message: `PDF sent to email: ${email}`,
            pdfUrl,
        });
    } catch (error) {
        console.error('Error sending PDF via email:', error);
        res.status(500).json({ error: 'Failed to send PDF via email.' });
    }
};

// Controller to send PDF via WhatsApp
export const sendPdfByWhatsApp = async (req, res) => {
    const { phoneNumber, base64Pdf, uniqueId } = req.body;

    try {
        const pdfUrl = await uploadPdfToFirebase(base64Pdf, uniqueId);

        await twilioClient.messages.create({
            from: 'whatsapp:+14155238886', // Twilio WhatsApp sandbox number
            to: `whatsapp:+${phoneNumber}`,
            mediaUrl: pdfUrl,
            body: 'Here is your requested PDF',
        });

        res.status(200).json({
            message: `PDF sent to WhatsApp: ${phoneNumber}`,
            pdfUrl,
        });
    } catch (error) {
        console.error('Error sending PDF via WhatsApp:', error);
        res.status(500).json({ error: 'Failed to send PDF via WhatsApp.' });
    }
};
