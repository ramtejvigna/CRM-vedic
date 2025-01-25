import { Router } from "express";
import { getExpensesByMonth, getPdfsGenByEmployee, getRegionalDistribution, getRevenueData, pdfGeneratedByEmployee} from "../controllers/ReportControllers.js";

const router = Router();

router.get('/pdf-gen-today' , getPdfsGenByEmployee);
router.get('/month-expenses' , getExpensesByMonth);
router.get('/revenue' , getRevenueData);
router.get('/api/pdfs/generated-by-employee', pdfGeneratedByEmployee);
router.get('/regional-distribution', getRegionalDistribution);

export default router;