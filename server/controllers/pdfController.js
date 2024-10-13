// controllers/pdfController.js
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
import admin from 'firebase-admin';
import {PDF , babyNames} from '../models/PDF.js'; 
import dotenv from 'dotenv';
import { PDFDocument,rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

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
        // Construct the correct path to the PDF template
        const pdfPath = path.join(__dirname, '../assets/Template.pdf');
        const existingPdfBytes = fs.readFileSync(pdfPath);

        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        await loadFonts(pdfDoc);
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];
        const secondPage = pages[1];
        const thirdPage = pages[2];

        // Static data to fill in the placeholders on the first page
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

// Load the standard font and make it bold if possible
const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

// Adjusted text with new font size, bold, and moved slightly downward
// Adjust the y-coordinates, increase font size, and maintain proper spacing
// Adjust the y-coordinates, increase font size, and maintain proper spacing
const fontSize = 25; // Increase font size for better visibility
const lineSpacing = 40; // Maintain space between values
const lineSpacing1=52;
// Initial y-position, adjusted to move everything downward
let textYPosition = 620;  // Renamed variable

// Add text with adjusted font size and spacing
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
// Numerology




        // Use the second page to display the list of names
        let yPosition = 600;


        

        // List names on the second page and use the third page if needed
        names.forEach(({ name, meaning }, index) => {
            if (yPosition < 100 && index < names.length - 1) {
                // Switch to the third page if space runs out on the second page
                secondPage = thirdPage;
                yPosition = 600;  // Reset position for the third page
            }
            secondPage.drawText(`name: ${name}`, { x: 50, y: yPosition, size: 25,font});
            yPosition-=60
            secondPage.drawText(`meaning": ${meaning}`, { x: 50, y: yPosition, size: 25,font });
            yPosition -= 80; // Maintain space between names
        });



        // Save the modified PDF to bytes
        const pdfBytes = await pdfDoc.save();

        // Convert the PDF to base64
        const base64Pdf = Buffer.from(pdfBytes).toString('base64');

        // Save the PDF in MongoDB
        const newPdf = new PDF({ uniqueId, customer: customerId, base64Pdf });
        const savedPdf = await newPdf.save();

        // Send the saved PDF as a JSON response
        res.status(200).json(savedPdf);
    } catch (err) {
        console.error('Error generating PDF:', err);
        res.status(500).json({ error: 'Failed to generate PDF' });
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