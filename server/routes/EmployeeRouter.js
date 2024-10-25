import express from 'express';
import multer from "multer"
import { addEmployee , filterEmployeesByStatus, getEmployee, getEmployees, updateEmployee } from "../controllers/EmployeeControllers.js";
import { applyLeave, getLeaveHistory, getPendingLeaves, getLeaveBalance,deleteLeave} from "../controllers/LeaveController.js";
const router = express.Router();

import { auth } from "../middleware/auth.js";
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

router.post('/leaves/apply',auth,applyLeave)
router.get('/leaves/pending',auth, getPendingLeaves)
router.get('/leaves/history',auth , getLeaveHistory)
router.get('/leave-balance',auth,getLeaveBalance)

router.delete('/leaves/:id',deleteLeave );

router.get("/search" , filterEmployeesByStatus)
export default router;