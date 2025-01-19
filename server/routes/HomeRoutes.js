import express from 'express';
import { getWeeklyStats, getDailyStats } from '../controllers/HomeController.js';

const router = express.Router();

// Route for weekly statistics
router.get('/weekly-stats', getWeeklyStats);

// Route for daily statistics
router.get('/daily-stats', getDailyStats);

export default router;
