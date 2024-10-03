import { Router } from "express";
import { addEmployee , getEmployees } from "../controllers/EmployeeControllers.js";

const router = Router();

router.post('/add-employee' , addEmployee);
router.get('/get-employees' , getEmployees);
export default router;