import express from "express";
import { addCustomerWithAssignment, getCustomerData, getCustomers, getCustomersBasedOnRequests } from "../controllers/customerControllers.js";

const router = express.Router();

router.post('/addCustomerWithAssignment', addCustomerWithAssignment);  
router.get('/getCustomers', getCustomers);
router.get('/getCustomersRequests', getCustomersBasedOnRequests);
router.put('/:id', getCustomerData);

export default router