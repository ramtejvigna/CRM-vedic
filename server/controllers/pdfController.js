// controllers/pdfController.js

import { v4 as uuidv4 } from 'uuid';
import PDFDocument from 'pdfkit';
import nodemailer from 'nodemailer';
import admin from 'firebase-admin';
import {PDF , babyNames} from '../models/PDF.js'; 
import dotenv from 'dotenv';


dotenv.config();

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

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
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

  export const createPdf = async (req, res) => {
    const { names, customerId } = req.body;
    const uniqueId = uuidv4();
    const doc = new PDFDocument();
    let buffers = [];
  
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', async () => {
      const pdfBuffer = Buffer.concat(buffers);
      const base64Pdf = pdfBuffer.toString('base64');
  
      try {
        const newPdf = new PDF({ uniqueId, customer: customerId, base64Pdf });
        const savedPdf = await newPdf.save();
  
        res.status(200).json(savedPdf);
      } catch (err) {
        console.error('Error saving PDF to the database:', err);
        res.status(500).json({ error: 'Failed to save PDF to the database' });
      }
    });
  
    doc.fontSize(25).text('Suggested Names', { align: 'center' });
    doc.moveDown(2);
  
    names.forEach(({ name, meaning }) => {
      doc.fontSize(14).text(`Name: ${name}`, { align: 'left' });
      doc.fontSize(12).text(`Meaning: ${meaning}`, { align: 'left' });
      doc.moveDown(2);
    });
  
    doc.end();
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
