import express from "express";
import { addCustomerWithAssignment, getCustomerData,customerDetails, getCustomers, getCustomersBasedOnRequests } from "../controllers/customerControllers.js";

const router = express.Router();

router.post('/addCustomerWithAssignment', addCustomerWithAssignment);  
router.get('/getCustomers', getCustomers);
router.get('/getCustomersRequests', getCustomersBasedOnRequests);
router.put('/:id', getCustomerData);
router.get('/:id', customerDetails);

export default router