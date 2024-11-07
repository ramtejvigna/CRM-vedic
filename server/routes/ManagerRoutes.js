import { Router } from "express";
import { getNewCustomers } from "../controllers/ManagerControllers.js";

const router = Router();

router.get('/newrequests' ,getNewCustomers )

export default router;