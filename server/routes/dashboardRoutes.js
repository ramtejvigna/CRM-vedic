import express from "express"
import { Customer } from '../models/User.js';
import { Employee } from '../models/User.js';
import { PDF } from '../models/PDF.js';
import mongoose, { get } from 'mongoose';
import { getStatistics } from "../controllers/dashboardControllers.js";

const router = express.Router();

router.get('/statistics', getStatistics);

export default router;