// routes/adminRoutes.js
import express from 'express';
import { getPendingLeaves, getCompletedLeaves, updateLeaveStatus } from '../controllers/adminLeaveController.js';

const router = express.Router();

router.get('/pending-leaves',  getPendingLeaves);
router.get('/completed-leaves',  getCompletedLeaves);
router.put('/leaves/:id',  updateLeaveStatus);

export default router;
