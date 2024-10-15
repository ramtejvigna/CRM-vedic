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

let boldFont, normalFont;

const loadFonts = async (pdfDoc) => {
    if (!boldFont || !normalFont) {
        boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        normalFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    }
}

export const createPdf = async (req, res) => {
    const { names, customerId } = req.body;
    const uniqueId = uuidv4();

    try {
        // Load PDF template
        const pdfPath = path.join(__dirname, '../assets/Template.pdf');
        const existingPdfBytes = fs.readFileSync(pdfPath);

        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        await loadFonts(pdfDoc); // Assuming you have this function
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];
        let secondPage = pages[1];
        const thirdPage = pages[2];

        // Static data
        const staticData = {
            gender: 'Girl',
            zodiacSign: 'Cancer',
            nakshatra: 'Punarvasu',
            gemstone: 'Pearl',
            destinyNumber: 6,
            luckyColour: 'White',
            birthDate: '02/08/2024',
            birthTime: '10:05 PM',
            numerology: 2,
            luckyDay: 'Sunday',
            luckyGod: 'Shiva',
            luckyMetal: 'Silver',
        };

        const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const fontSize = 25;
        const lineSpacing = 40;
        const lineSpacing1 = 52;
        let textYPosition = 620;

        // Draw static data on the first page
        firstPage.drawText(staticData.gender, { x: 320, y: textYPosition, size: fontSize, font }); // Gender
        textYPosition -= lineSpacing;  // Move down for the next value

        firstPage.drawText(staticData.birthDate, { x: 320, y: textYPosition, size: fontSize, font }); // Birth Date
        textYPosition -= lineSpacing;

        firstPage.drawText(staticData.birthTime, { x: 320, y: textYPosition, size: fontSize, font }); // Birth Time
        textYPosition -= lineSpacing;

        firstPage.drawText(staticData.zodiacSign, { x: 320, y: textYPosition, size: fontSize, font }); // Zodiac Sign
        textYPosition -= lineSpacing;

        firstPage.drawText(staticData.nakshatra, { x: 320, y: textYPosition, size: fontSize, font }); // Nakshatra
        textYPosition -= lineSpacing;

        firstPage.drawText(staticData.destinyNumber.toString(), { x: 320, y: textYPosition, size: fontSize, font }); // Destiny Number
        textYPosition -= lineSpacing;

        firstPage.drawText(staticData.luckyDay, { x: 320, y: textYPosition, size: fontSize, font }); // Lucky Day
        textYPosition -= lineSpacing1;

        firstPage.drawText(staticData.gemstone, { x: 320, y: textYPosition, size: fontSize, font }); // Gemstone
        textYPosition -= lineSpacing1;

        firstPage.drawText(staticData.luckyGod, { x: 320, y: textYPosition, size: fontSize, font }); // Lucky God
        textYPosition -= lineSpacing1;

        firstPage.drawText(staticData.luckyMetal, { x: 320, y: textYPosition, size: fontSize, font }); // Lucky Metal
        textYPosition -= lineSpacing1;

        firstPage.drawText(staticData.luckyColour, { x: 320, y: textYPosition, size: fontSize, font }); // Lucky Colour
        textYPosition -= lineSpacing1;

        firstPage.drawText(staticData.numerology.toString(), { x: 320, y: textYPosition, size: fontSize, font }); // Numerology

        // Draw names on the second and third pages
        let yPosition = 600;
        names.forEach(({ name, meaning }, index) => {
            if (yPosition < 100 && index < names.length - 1) {
                secondPage = thirdPage;
                yPosition = 600;
            }
            secondPage.drawText(`Name: ${name}`, { x: 50, y: yPosition, size: 25, font });
            yPosition -= 60;
            secondPage.drawText(`Meaning: ${meaning}`, { x: 50, y: yPosition, size: 25, font });
            yPosition -= 80;
        });

        // Save the modified PDF
        const pdfBytes = await pdfDoc.save();

        // Compress the PDF using zlib
        zlib.gzip(pdfBytes, async (err, compressedPdf) => {
            if (err) {
                console.error('Error compressing PDF:', err);
                return res.status(500).json({ error: 'Failed to compress PDF' });
            }

            // Convert compressed PDF to Base64
            const base64Pdf = compressedPdf.toString('base64');

            // Save the compressed PDF to MongoDB
            const newPdf = new PDF({ uniqueId, customer: customerId, base64Pdf });
            const savedPdf = await newPdf.save();

            // Decompress the PDF after saving
            zlib.gunzip(Buffer.from(savedPdf.base64Pdf, 'base64'), (decompressErr, decompressedPdf) => {
                if (decompressErr) {
                    console.error('Error decompressing PDF:', decompressErr);
                    return res.status(500).json({ error: 'Failed to decompress PDF' });
                }

                // Convert decompressed PDF to Base64 for response
                const decompressedBase64Pdf = decompressedPdf.toString('base64');

                // Respond with the decompressed PDF
                res.status(200).json({
                    ...savedPdf.toObject(),
                    base64Pdf: decompressedBase64Pdf, // Send the decompressed PDF
                });
            });
        });
    } catch (err) {
        console.error('Error generating PDF:', err);
        res.status(500).json({ error: 'Failed to generate PDF' });
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
            }
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
