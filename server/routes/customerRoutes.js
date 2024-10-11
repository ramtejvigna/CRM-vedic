import express from "express";
import { addCustomerWithAssignment,getCustomerDetails, getCustomerData, getCustomers, getCustomersBasedOnRequests } from "../controllers/customerControllers.js";

const router = express.Router();

router.post('/addCustomerWithAssignment', addCustomerWithAssignment); 
router.get('/getCustomers', getCustomers); 
router.get('/employees/:employeeId/customers', getCustomersBasedOnRequests);
router.put('/:id', getCustomerData);
router.get('/getCustomerDetails/:fatherName', getCustomerDetails);
export default router