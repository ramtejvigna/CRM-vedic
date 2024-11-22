import { Router } from "express";
import { getExpensesByMonth, getPdfsGenByEmployee } from "../controllers/ReportControllers.js";

const router = Router();

router.get('/pdf-gen-today' , getPdfsGenByEmployee);
router.get('/month-expenses' , getExpensesByMonth);

export default router;