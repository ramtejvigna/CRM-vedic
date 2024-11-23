import { Router } from "express";
import { expensesEmployee, getExpensesByMonth, getPdfsGenByEmployee, getRevenueData, pdfGeneratedByEmployee, revenueEmployee } from "../controllers/ReportControllers.js";

const router = Router();

router.get('/pdf-gen-today' , getPdfsGenByEmployee);
router.get('/month-expenses' , getExpensesByMonth);
router.get('/revenue' , getRevenueData);
router.get('/api/pdfs/generated-by-employee', pdfGeneratedByEmployee);
router.get('/api/expenses/by-employee', expensesEmployee);
router.get('/api/revenue/by-employee', revenueEmployee)

export default router;