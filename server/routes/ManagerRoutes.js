
import { Router } from "express";
import { assignCustomerToEmployee, getEmployees, getNewCustomers, login, logout } from "../controllers/ManagerControllers.js";

const router = Router();
router.post('/login',login)
router.post('logout',logout)
router.get('/newrequests' ,getNewCustomers )
router.get('/employees' , getEmployees)
router.put('/assign/:customerId/to/:employeeId' , assignCustomerToEmployee)
export default router;