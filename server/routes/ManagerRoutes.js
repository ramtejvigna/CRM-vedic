import { Router } from "express";
import { assignCustomerToEmployee, getCompletedReq, getEmployees, getNewCustomers, login, logout } from "../controllers/ManagerControllers.js";
import { isManager } from "../middleware/auth.js";
import { getManagerDashboardStats } from "../controllers/ManagerDashboardController.js";

const router = Router();

router.post('/login',login)
router.post('/logout',logout)
router.get('/newrequests' ,getNewCustomers )
router.get('/completed' ,getCompletedReq )
router.get('/stats/:employeeId',isManager, getManagerDashboardStats);

router.get('/employees' , getEmployees)
router.put('/assign/:customerId/to/:employeeId' , assignCustomerToEmployee)
export default router;