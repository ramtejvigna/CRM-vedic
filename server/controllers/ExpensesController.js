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
    const expenses = await Expense.find().select('-bank_statement'); // Exclude base64 data from list view
    res.status(200).json({ expenses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getExpenseFile = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.json({ 
      bank_statement: expense.bank_statement,
      file_type: expense.file_type 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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

const addExpense = async (req, res) => {
  try {
    const { expense_name, amount, date } = req.body;
    let bank_statement = '';
    let file_type = '';

    if (req.file) {
      bank_statement = req.file.buffer.toString('base64'); // Convert file to base64 string
      file_type = req.file.mimetype; // Get the file MIME type
    }

    const expense = await Expense.create({
      expense_name,
      amount: parseFloat(amount),
      date: new Date(date),
      bank_statement, // Ensure this is populated
      file_type, // Ensure this is populated
    });

    res.status(201).json({
      message: "Expense added successfully",
      expense: {
        id: expense._id,
        expense_name: expense.expense_name,
        amount: expense.amount,
        date: expense.date,
      },
    });
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(500).json({
      message: "Failed to add expense",
      error: error.message,
    });
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
