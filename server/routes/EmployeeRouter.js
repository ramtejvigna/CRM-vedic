
import { Router } from "express";
import { addEmployee , getEmployee, getEmployees, updateEmployee } from "../controllers/EmployeeControllers.js";
import multer from "multer"
const storage = multer.diskStorage({
    destination : (req , file , cb) => {
        cb(null , 'uploads/')
    },
    filename: (req, file, cb) => {
        const username = req.body.username; 
        const date = Date.now();
        const fieldName = file.fieldname; 
        const fileExtension = file.originalname.substring(file.originalname.lastIndexOf('.')); 

        cb(null, `${username}_${date}_${fieldName}${fileExtension}`);
    }
    
})
const router = Router();


const uploads = multer({storage});

router.post('/add-employee' , uploads.fields([
    {name : "passport" , maxCount : 1} , 
    {name : "degrees" , maxCount : 1} , 
    {name : "transcripts" , maxCount : 1},
    {name : "aadharOrPan" , maxCount : 1} ,]) , addEmployee);

router.get('/get-employees' , getEmployees);
router.get('/get-employee' , getEmployee);

router.put('/update-employee', uploads.fields([
    {name : "passport" , maxCount : 1} , 
    {name : "degrees" , maxCount : 1} , 
    {name : "transcripts" , maxCount : 1},
    {name : "aadharOrPan" , maxCount : 1} ,])  , updateEmployee);



export default router;