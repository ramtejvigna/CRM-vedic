
import { Router } from "express";
import { assignCustomerToEmployee, getEmployees, getNewCustomers } from "../controllers/ManagerControllers.js";

const router = Router();

router.get('/newrequests' ,getNewCustomers )
router.get('/employees' , getEmployees)
router.put('/assign/:customerId/to/:employeeId' , assignCustomerToEmployee)
export default router;