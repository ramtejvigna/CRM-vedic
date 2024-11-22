import { Router } from "express";
import { getExpensesByMonth, getPdfsGenByEmployee, getRevenueData } from "../controllers/ReportControllers.js";

const router = Router();

router.get('/pdf-gen-today' , getPdfsGenByEmployee);
router.get('/month-expenses' , getExpensesByMonth);
router.get('/revenue' , getRevenueData)

export default router;