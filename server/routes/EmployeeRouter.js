import express from 'express';
import { addEmployee , filterEmployeesByStatus, getEmployee, getEmployees, updateEmployee } from "../controllers/EmployeeControllers.js";
import { applyLeave, getLeaveHistory, getPendingLeaves, getLeaveBalance,deleteLeave} from "../controllers/LeaveController.js";
const router = express.Router();

import { auth } from "../middleware/auth.js";


router.post('/add-employee' , addEmployee);

router.get('/get-employees' , getEmployees);
router.get('/get-employee' , getEmployee);

router.put('/update-employee'  , updateEmployee);

router.post('/leaves/apply',auth,applyLeave)
router.get('/leaves/pending',auth, getPendingLeaves)
router.get('/leaves/history',auth , getLeaveHistory)
router.get('/leave-balance',auth,getLeaveBalance)

router.delete('/leaves/:id',deleteLeave );

router.get("/search" , filterEmployeesByStatus)
export default router;