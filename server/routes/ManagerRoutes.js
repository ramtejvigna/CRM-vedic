import { Router } from "express";
import { getEmployees, getNewCustomers } from "../controllers/ManagerControllers.js";

const router = Router();

router.get('/newrequests' ,getNewCustomers )
router.get('/employees' , getEmployees)
export default router;