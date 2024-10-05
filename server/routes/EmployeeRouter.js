import { Router } from "express";
import { addEmployee , getEmployee, getEmployees } from "../controllers/EmployeeControllers.js";

const router = Router();

router.post('/add-employee' , addEmployee);
router.get('/get-employees' , getEmployees);
router.get('/get-employee' , getEmployee);
export default router;