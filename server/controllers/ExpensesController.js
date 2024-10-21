// controllers/ExpensesController.js
import Expense from '../models/Expenses.js';

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

// Add a new expense
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

// Update an expense
export const updateExpense = async (req, res) => {
  const { id } = req.params;
  const { expense_name, amount, date } = req.body;
  try {
    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      { expense_name, amount, date },
      { new: true }
    );
    if (!updatedExpense) return res.status(404).json({ message: 'Expense not found' });
    res.status(200).json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update expense' });
  }
};

// Delete an expense
export const deleteExpense = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedExpense = await Expense.findByIdAndDelete(id);
    if (!deletedExpense) return res.status(404).json({ message: 'Expense not found' });
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete expense' });
  }
};
