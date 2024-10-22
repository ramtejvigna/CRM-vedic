import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  expense_name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  // Required field to store the bank statement filename
  bank_statement: {
    type: String,
    required: true,  // Now it's mandatory
  },
});

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;
