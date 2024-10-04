import express from "express";
import { addCustomerWithAssignment, getCustomers } from "../controllers/customerControllers.js";

const router = express.Router();

router.post('/addCustomerWithAssignment', addCustomerWithAssignment);  
router.get('/getCustomers', getCustomers);

export default router