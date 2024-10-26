import { Router } from "express";
import {createSalaryStatement, deleteSalaryStatement, filterSalariesByYearAndMonth, getAllSalaryStatements, updateSalaryStatement} from "../controllers/SalaryControllers.js"
const router = Router() ;
import multer from "multer";

const uploads = multer({
    limits : {fileSize : 1 * 1024 * 1024}
})
router.post("/", uploads.single("bankStatement") , createSalaryStatement )
router.get("/"  , getAllSalaryStatements )
router.put("/"  , updateSalaryStatement )
router.delete("/delete/:id"  , deleteSalaryStatement )
router.get("/search" , filterSalariesByYearAndMonth)

export default router