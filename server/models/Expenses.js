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
  bank_statement: {
    type: String,  // Will store base64 string
    required: true,
  },
  file_type: {     // Store the file type (pdf, jpeg, etc)
    type: String,
    required: true
  }
});

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;