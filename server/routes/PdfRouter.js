import { Router } from "express";
import { createPdf, sendPdfByEmail,sendPdfByWhatsApp } from '../controllers/pdfControllers.js';

const router = Router();

router.post('/create-pdf' , createPdf);
router.post('/send-pdf-email' , sendPdfByEmail);
router.post('/send-pdf-whatsapp',sendPdfByWhatsApp);
export default router;