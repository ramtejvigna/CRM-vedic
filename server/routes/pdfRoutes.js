// routes/pdfRoutes.js

import express from 'express';
import * as pdfController from '../controllers/pdfController.js';

const router = express.Router();

router.get('/names', pdfController.getBabyNames);
router.post('/create-pdf', pdfController.createPdf);
router.post('/send-pdf-email', pdfController.sendPdfEmail);
router.post('/send-pdf-whatsapp', pdfController.sendPdfWhatsApp);

export default router;