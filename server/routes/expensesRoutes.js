import express from 'express';
import { 
  addExpense, 
  getAllExpenses, 
  getExpenseFile,
  updateExpense, 
  deleteExpense
} from '../controllers/ExpensesController.js';

const router = express.Router();

router.post('/', addExpense);
router.get('/', getAllExpenses);
router.get('/file/:id', getExpenseFile);
router.put('/:id', updateExpense);
router.delete('/deleteExpense/:id', deleteExpense);

export default router;