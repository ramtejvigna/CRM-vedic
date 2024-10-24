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
import fs from 'fs';
import path from 'path';

const uploadDirectory = 'uploads/bank_statements';
const FIXED_FILENAME = '1729677932207-833729398-Bankstatement.jpg';

// Ensure the upload directory exists
fs.mkdirSync(uploadDirectory, { recursive: true });

// Configure multer storage with fixed filename including .jpg extension
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    // Always use the fixed filename with .jpg extension
    cb(null, FIXED_FILENAME);
  }
});

// Add file filter for allowed types
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, JPEG, PNG, and PDF files are allowed.'));
  }
};

// Before saving new file, delete any existing file
const deleteExistingFile = () => {
  const filePath = path.join(uploadDirectory, FIXED_FILENAME);
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('Error deleting existing file:', error);
  }
};

export const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
}).single('bank_statement');

const router = express.Router();

// Modify the post route to handle file deletion before upload
router.post('/', (req, res, next) => {
  deleteExistingFile(); // Delete existing file before new upload
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}, addExpense);

router.get('/', getAllExpenses);
router.get('/:id', getExpenseById);
router.put('/:id', updateExpense);
router.delete('/deleteExpense/:id', deleteExpense);
router.get('/file/:filename', serveFile);
router.get('/check-file/:filename', checkFile);

export default router;