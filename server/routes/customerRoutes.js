import express from "express";
import { 
  addCustomerWithAssignment,
  getCustomerDetails,
  getCustomerPdfs,
  getCustomerData,
  getCustomers,
  getCustomersBasedOnRequests,
  updateCustomerData, 
  getLocationSuggestions,
  getCustomersByEmployeeId,
  getAllCustomers,
  updateNote
} from "../controllers/customerControllers.js";

const router = express.Router();

// Define the routes for customer-related operations
router.post('/addCustomerWithAssignment', addCustomerWithAssignment);
router.get('/getCustomers', getCustomers);
router.get('/employees/:employeeId/customers', getCustomersBasedOnRequests);
router.put('/:id', updateCustomerData); // Update customer by ID
router.get('/getCustomerDetails/:id', getCustomerDetails);
router.get('/getAllCustomers', getAllCustomers);
router.get('/assigned/:employeeId', getCustomersByEmployeeId);
router.get('/getCustomerPdfs/:fatherName', getCustomerPdfs);
router.get('/locations', getLocationSuggestions)
router.patch('/updateNote/:customerID',updateNote);

export default router;
