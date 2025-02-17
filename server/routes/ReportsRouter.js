import { Router } from "express";
import { getAnalyticsData, getExpensesByDateRange, getPdfsGenByEmployee, getRegionalDistribution, getRevenueData, pdfGeneratedByEmployee} from "../controllers/ReportControllers.js";

const router = Router();

router.get('/pdf-gen-range' , getPdfsGenByEmployee);
router.get('/range-expenses' , getExpensesByDateRange);
router.get('/revenue' , getRevenueData);
router.get('/api/pdfs/generated-by-employee', pdfGeneratedByEmployee);
router.get('/regional-distribution-range', getRegionalDistribution);
router.get('/analytics', getAnalyticsData);

export default router;