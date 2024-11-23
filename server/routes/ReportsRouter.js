import { Router } from "express";
import { getExpensesByMonth, getPdfsGenByEmployee, getRevenueData, pdfGeneratedByEmployee} from "../controllers/ReportControllers.js";

const router = Router();

router.get('/pdf-gen-today' , getPdfsGenByEmployee);
router.get('/month-expenses' , getExpensesByMonth);
router.get('/revenue' , getRevenueData);
router.get('/api/pdfs/generated-by-employee', pdfGeneratedByEmployee);

export default router;