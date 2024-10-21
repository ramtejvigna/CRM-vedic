import express from 'express';
import { addExpense, getAllExpenses, getExpenseById, updateExpense, deleteExpense } from '../controllers/ExpensesController.js';
import upload from '../middleware/upload.js';  // Import the multer upload middleware

const router = express.Router();

// Routes
router.post('/', upload.single('bank_statement'), addExpense);  // Add expense with file upload
router.get('/getAllExpenses', getAllExpenses);        // Get all expenses
router.get('/:id', getExpenseById);    // Get a specific expense by ID
router.put('/:id', updateExpense);     // Update an expense
router.delete('/:id', deleteExpense);  // Delete an expense

export default router;