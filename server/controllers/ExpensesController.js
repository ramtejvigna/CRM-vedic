// controllers/ExpensesController.js
import Expense from '../models/Expenses.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Get all expenses
export const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.status(200).json({ expenses });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch expenses' });
  }
};

// Get a specific expense by ID
export const getExpenseById = async (req, res) => {
  const { id } = req.params;
  try {
    const expense = await Expense.findById(id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch expense' });
  }
};

// Add new expense
export const addExpense = async (req, res) => {
  const { expense_name, amount_spent, date } = req.body;
  const bank_statement = req.file ? req.file.filename : null;
  try {
    const newExpense = new Expense({
      expense_name,
      amount: amount_spent,
      date,
      bank_statement
    });
    await newExpense.save();
    res.status(201).json({ success: true, expense: newExpense });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to add expense' });
  }
};

// Update expense
export const updateExpense = async (req, res) => {
  const { id } = req.params;
  const { expense_name, amount, date } = req.body;
  const bank_statement = req.file ? req.file.filename : null;
  
  try {
    const updateData = { expense_name, amount, date };
    if (bank_statement) {
      updateData.bank_statement = bank_statement;
    }
    
    const updatedExpense = await Expense.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.status(200).json({ success: true, expense: updatedExpense });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to update expense' });
  }
};

// Delete expense
export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Attempting to delete expense with ID:", id);
    const deletedExpense = await Expense.findByIdAndDelete(id);
    
    if (!deletedExpense) {
      console.log("No expense found with ID:", id);
      return res.status(404).json({ message: 'Expense not found' });
    }
    console.log("Successfully deleted expense:", deletedExpense);
    res.status(200).json({ 
      message: 'Expense deleted successfully',
      deletedExpense 
    });
  } catch (error) {
    console.error("Error in deleteExpense:", error);
    res.status(500).json({ 
      message: 'Failed to delete expense',
      error: error.message 
    });
  }
};

// Check if file exists
export const checkFile = (req, res) => {
  const filePath = path.join(__dirname, '..', 'uploads', 'bank_statements', req.params.filename);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.status(404).json({
        exists: false,
        error: err.message,
        checkedPath: filePath
      });
    } else {
      res.json({
        exists: true,
        path: filePath
      });
    }
  });
};
export const serveFile = (req, res) => {
  const filePath = path.join(__dirname, '..', 'uploads', 'bank_statements', req.params.filename);
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }
  });
};