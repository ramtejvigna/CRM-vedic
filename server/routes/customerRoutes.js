import express from "express";
import { 
  addCustomerWithAssignment,
  getCustomerDetails,
  getCustomerPdfs,
  getCustomerData,
  getCustomers,
  getCustomersBasedOnRequests,
  updateCustomerData 
} from "../controllers/customerControllers.js";

const router = express.Router();

// Define the routes for customer-related operations
router.post('/addCustomerWithAssignment', addCustomerWithAssignment);
router.get('/getCustomers', getCustomers);
router.get('/employees/:employeeId/customers', getCustomersBasedOnRequests);
router.put('/:id', updateCustomerData); // Update customer by ID
router.get('/getCustomerDetails/:id', getCustomerDetails);
router.get('/getCustomerPdfs/:fatherName', getCustomerPdfs);


export default router;
