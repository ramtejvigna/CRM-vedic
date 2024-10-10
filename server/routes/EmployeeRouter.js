import { Router } from "express";
import { addEmployee , getEmployees , getEmployee , updateEmployee } from "../controllers/EmployeeControllers.js";
import multer from 'multer';

const storage = multer.diskStorage({
    destination : (req , file , cb) => {
        cb(null , 'uploads/')
    },
    filename : (req , file , cb) => {
        cb(null , `${req.body.username}_${Date.now()}_${file.originalname}`);
    }
})
const router = Router();


const uploads = multer({storage});

router.post('/add-employee' , uploads.fields([
    {name : "passport" , maxCount : 1} , 
    {name : "degrees" , maxCount : 1} , 
    {name : "transcripts" , maxCount : 1},
    {name : "aadhar" , maxCount : 1} ,
    {name : "pan" , maxCount : 1}]) , addEmployee);
router.get('/get-employees' , getEmployees);
router.get('/get-employee' , getEmployee);
router.put('/update-employee' , updateEmployee);

export default router;