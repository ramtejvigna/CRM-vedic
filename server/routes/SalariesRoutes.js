import { Router } from "express";
import {createSalaryStatement, deleteSalaryStatement, filterSalariesByYearAndMonth, getAllSalaryStatements, updateSalaryStatement} from "../controllers/SalaryControllers.js"
import multer from "multer"
const storage = multer.diskStorage({
    destination : (req , file , cb) => {
        cb(null , 'uploads/salaries')
    },
    filename: (req, file, cb) => {
        const userId = req.body.employee; 
        const date = Date.now();
        const fileExtension = file.originalname.substring(file.originalname.lastIndexOf('.')); 

        cb(null, `${userId}_${date}_salaries${fileExtension}`);
    }
    
})
const router = Router() ;
const uploads = multer({storage})

router.post("/" , uploads.single("bankStatement") , createSalaryStatement )
router.get("/"  , getAllSalaryStatements )
router.put("/"  , updateSalaryStatement )
router.delete("/delete/:id"  , deleteSalaryStatement )
router.get("/search" , filterSalariesByYearAndMonth)

export default router