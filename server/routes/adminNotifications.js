// routes/notificationRoutes.js
import express from 'express'
import { getNotifications, markAsRead } from '../controllers/adminNotificationController.js';
const router = express.Router();

router.get('/notifications/get', getNotifications);
router.put('/notifications/:id/read', markAsRead);

export default router