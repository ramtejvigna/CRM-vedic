import express from 'express';
import { 
  addExpense, 
  getAllExpenses, 
  getExpenseById, 
  updateExpense, 
  deleteExpense,
  checkFile, 
  serveFile 
} from '../controllers/ExpensesController.js';
import multer from 'multer';
import fs from 'fs'; // Import fs module

const uploadDirectory = 'uploads/bank_statements';

// Ensure the upload directory exists
fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory); // Path to save uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Unique filename
  }
});

export const upload = multer({ storage });

const router = express.Router();

// Routes
router.post('/', upload.single('bank_statement'), addExpense);
router.get('/', getAllExpenses);
router.get('/:id', getExpenseById);
router.put('/:id', updateExpense);
router.delete('/deleteExpense/:id', deleteExpense);
router.get('/file/:filename', serveFile);
router.get('/check-file/:filename', checkFile);

export default router;
