import express from 'express';
import { 
  addExpense, 
  getAllExpenses, 
  getExpenseFile,
  updateExpense, 
  deleteExpense
} from '../controllers/ExpensesController.js';

const router = express.Router();

// Change the route to match the frontend URL
router.post('/', addExpense);  // This will match /api/expenses when properly mounted
router.get('/', getAllExpenses);
router.get('/file/:id', getExpenseFile);
router.put('/:id', updateExpense);
router.delete('/deleteExpense/:id', deleteExpense);

export default router;