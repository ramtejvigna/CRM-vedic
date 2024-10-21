// controllers/pdfController.js
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
import admin from 'firebase-admin';
import { Customer } from '../models/User.js';
import { PDF, babyNames } from '../models/PDF.js';
import dotenv from 'dotenv';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import zlib from 'zlib';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


const uploadPdfToFirebase = async (base64Pdf, uniqueId, bucket) => {
    const buffer = Buffer.from(base64Pdf, 'base64');
    const file = bucket.file(`${uniqueId}.pdf`);

    await file.save(buffer, {
        metadata: { contentType: 'application/pdf' },
    });

    await file.makePublic();

    const publicUrl =` https://storage.googleapis.com/${bucket.name}/${file.name}`;
    return publicUrl;
};

export const getBabyNames = async (req, res) => {
    try {
        const names = await babyNames.find({});
        res.json(names);
    } catch (error) {
        console.error('Error fetching names:', error);
        res.status(500).send('Error fetching names');
    }
};

export const sendDetails = async (req, res) => {
    const { names, customerId } = req.body;

    if (!names || names.length === 0) {
        return res.status(400).json({ error: 'No baby names selected' });
    }

    try {
        // Fetch the selected baby names from the database using the provided names
        const selectedNames = await babyNames.find({ name: { $in: names } });

        console.log("Selected names from DB:", selectedNames);

        if (!selectedNames || selectedNames.length === 0) {
            return res.status(404).json({ error: 'Baby names not found' });
        }

        // Extract the IDs of the selected baby names
        const selectedNamesIds = selectedNames.map(name => name._id);

        // Save the baby names' IDs and other PDF metadata in the PDF collection
        const newPdf = new PDF({
            babyNames: selectedNamesIds,  // Store baby names' IDs
        });

        const savedPdf = await newPdf.save();

        console.log("PDF saved:", savedPdf);

        // Store the PDF document ID in the customer's record
        await Customer.findByIdAndUpdate(customerId, {
            $push: { pdfGenerated: savedPdf._id }  // Add the PDF document's ID to the customer record
        });

        console.log("PDF ID added to customer record");

        // Send a response indicating success and the stored PDF metadata
        res.status(200).json({
            message: 'PDF details saved successfully',
            pdfId: savedPdf._id,
            customerId: customerId,
        });
    } catch (err) {
        console.error('Error generating PDF:', err);
        res.status(500).json({ error: 'Failed to generate PDF' });
    }
}

export const getPdfsByCustomerId = async (req, res) => {
    const { customerId } = req.query;

    if (!customerId) {
        return res.status(400).json({ error: 'Customer ID is required' });
    }

    try {
        const customer = await Customer.findById(customerId).populate({
            path: 'pdfGenerated',
            populate: {
                path: 'babyNames',
                model: 'babyNames'
            },
            options: { sort: { createdAt: -1 } }
        });

        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        const pdfs = customer.pdfGenerated;

        if (!pdfs || pdfs.length === 0) {
            return res.status(404).json({ error: 'No PDFs found for this customer' });
        }

        res.status(200).json(pdfs);
    } catch (error) {
        console.error('Error fetching PDFs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


export const sendPdfEmail = async (req, res) => {
    const { email, base64Pdf, uniqueId } = req.body;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Generated PDF',
        text: 'Here is your PDF document.',
        attachments: [{
            filename: `${uniqueId}.pdf`,
            content: base64Pdf,
            encoding: 'base64'
        }]
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
};


export const sendPdfWhatsApp = async (req, res) => {
    const { phoneNumber, base64Pdf, uniqueId } = req.body;

    try {
        const pdfUrl = await uploadPdfToFirebase(base64Pdf, uniqueId, bucket);

        await twilioClient.messages.create({
            from: 'whatsapp:+14155238886',
            to: `whatsapp:+${phoneNumber}`,
            mediaUrl: pdfUrl,
            body: 'Here is your requested PDF',
        });

        return res.status(200).json({
            message: `PDF sent to WhatsApp: ${phoneNumber}`,
            pdfUrl,
        });
    } catch (error) {
        console.error('Error sending PDF via WhatsApp:', error);
        return res.status(500).json({
            error: 'Failed to send PDF via WhatsApp.',
        });
    }
};


// export const getPdfsByCustomerId = async (req, res) => {
//   const { customerId } = req.query;
  
//   if (!customerId) {
//       return res.status(400).json({ error: 'Customer ID is required' });
//   }

//   try {
//       const pdfs = await PDF.find({ customer: customerId }).sort({ createdAt: -1 });
//       if (!pdfs) {
//           return res.status(404).json({ error: 'No PDFs found for this customer' });
//       }
      
//       res.status(200).json(pdfs);
//   } catch (error) {
//       console.error('Error fetching PDFs:', error);
//       res.status(500).json({ error: 'Internal server error' });
//   }
// };