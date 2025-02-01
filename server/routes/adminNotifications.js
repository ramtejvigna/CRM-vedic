// routes/notificationRoutes.js
import express from 'express'
import { deleteAllNotifications, getNotifications, markAsRead } from '../controllers/adminNotificationController.js';
const router = express.Router();

router.get('/notifications/get', getNotifications);
router.put('/notifications/:id/read', markAsRead);
router.delete('/notifications/clear-all', deleteAllNotifications);

export default router