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


// Add new expense
export const addExpense = async (req, res) => {
  try {
    const { expense_name, amount, date, bank_statement, file_type } = req.body;

    const expense = new Expense({
      expense_name,
      amount,
      date: new Date(date),
      bank_statement,
      file_type,
    });

    await expense.save();

    res.status(201).json({ message: 'Expense added successfully', expense });
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).json({ message: 'Failed to add expense', error: error.message });
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
