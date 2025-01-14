// routes/pdfRoutes.js

import express from 'express';
import * as pdfController from '../controllers/pdfController.js';

const router = express.Router();

router.get('/generatedpdf', pdfController.getPdfsByCustomerId);
router.get('/names', pdfController.getBabyNames);
router.post('/names',pdfController.addBabyName);
router.post('/create-pdf', pdfController.sendDetails);
router.post('/send-pdf-email', pdfController.sendPdfEmail);
router.post('/send-pdf-whatsapp', pdfController.sendPdfWhatsApp);
router.get('/generatedpdf', pdfController.getPdfsByCustomerId);
router.put('/feedback',pdfController.submitFeedback);

export default router;

