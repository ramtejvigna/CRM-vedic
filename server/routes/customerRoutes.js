import express from "express";
import { 
    addCustomerWithAssignment,
    getCustomerPdfs,
    getCustomerDetails, 
    getCustomerData, 
    getCustomers, 
    getCustomersBasedOnRequests 
} from "../controllers/customerControllers.js";

const router = express.Router();

// Define the routes for customer-related operations
router.post('/addCustomerWithAssignment', addCustomerWithAssignment); 
router.get('/getCustomers', getCustomers); 
router.get('/employees/:employeeId/customers', getCustomersBasedOnRequests);
router.put('/:id', getCustomerData);
router.get('/getCustomerDetails/:fatherName', getCustomerDetails);
router.get('/getCustomerPdfs/:fatherName', getCustomerPdfs); // Fetch customer PDFs by fatherName

export default router;
