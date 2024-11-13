import { Router } from "express";
import { getPdfsGenByEmployeeToday } from "../controllers/ReportControllers.js";

const router = Router();

router.get('/pdf-gen-today' , getPdfsGenByEmployeeToday);

export default router;