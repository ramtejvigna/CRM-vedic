import express from 'express';
import { body } from 'express-validator';
import { createNotification, getNotifications, markNotificationAsRead,markAsRead } from '../controllers/NotificationController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post(
  '/',
  auth,
  [
    body('message').notEmpty().withMessage('Message is required'),
    body('recipients').isArray().withMessage('Recipients must be an array')
  ],
  createNotification
);

router.get('/get', auth,  getNotifications);

router.put('/:id/read',auth, markAsRead);

export default router;