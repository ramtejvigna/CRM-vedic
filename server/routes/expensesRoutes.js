// routes/expenseRoutes.js
import express from 'express';
import { 
  addExpense, 
  getAllExpenses, 
  getExpenseById, 
  updateExpense, 
  deleteExpense,
  checkFile,serveFile 
} from '../controllers/ExpensesController.js';

const router = express.Router();

// Routes
router.post('/', addExpense);
router.get('/getAllExpenses', getAllExpenses);
router.get('/:id', getExpenseById);
router.put('/:id', updateExpense);
router.delete('/deleteExpense/:id', deleteExpense);
router.get('/file/:filename', serveFile);
router.get('/check-file/:filename', checkFile)

export default router;