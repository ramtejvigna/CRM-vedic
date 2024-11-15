import { Router } from "express";
import {createSalaryStatement, deleteSalaryStatement, filterSalariesByYearAndMonth, getAllSalaryStatements, getSalaryById, updateSalaryStatement} from "../controllers/SalaryControllers.js"
const router = Router() ;
import multer from "multer";

const uploads = multer({
    limits : {fileSize : 1 * 1024 * 1024}
})
router.post("", uploads.single("bankStatement") , createSalaryStatement )
router.put("/edit-salary", uploads.single("bankStatement") , updateSalaryStatement );
router.get("/:id"  ,getSalaryById );
router.get(""  , getAllSalaryStatements );
router.put(""  , updateSalaryStatement )
router.delete("/delete/:id"  , deleteSalaryStatement )
router.post("/filter" , filterSalariesByYearAndMonth)

export default router;