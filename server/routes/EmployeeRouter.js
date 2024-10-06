import { Router } from "express";
import { addEmployee , getEmployee, getEmployees, updateEmployee } from "../controllers/EmployeeControllers.js";

const router = Router();

router.post('/add-employee' , addEmployee);
router.get('/get-employees' , getEmployees);
router.get('/get-employee' , getEmployee);
router.put('/update-employee' , updateEmployee);
export default router;