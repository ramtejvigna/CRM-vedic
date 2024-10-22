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
import upload from '../middleware/upload.js';

const router = express.Router();

// Routes
router.post('/', upload.single('bank_statement'), addExpense);
router.get('/getAllExpenses', getAllExpenses);
router.get('/:id', getExpenseById);
router.put('/:id', upload.single('bank_statement'), updateExpense);
router.delete('/deleteExpense/:id', deleteExpense);
router.get('/file/:filename', serveFile);
router.get('/check-file/:filename', checkFile)

export default router;