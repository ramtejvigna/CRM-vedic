import express from 'express';
import { 
  addExpense, 
  getAllExpenses, 
  getExpenseFile,
  updateExpense, 
  deleteExpense
} from '../controllers/ExpensesController.js';

const router = express.Router();


// Routes
router.post('/', addExpense);

router.get('/', getAllExpenses);
router.get('/file/:id', getExpenseFile);
router.delete('/deleteExpense/:id', deleteExpense);

export default router;