import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useStore } from "../../../store";
import axios from 'axios';
import { XCircleIcon, ArrowLeft } from 'lucide-react';

const ADD_EXPENSE = "https://vedic-backend-neon.vercel.app/api/expenses"; // Define your API URL here

const AddExpense = () => {
  const { isDarkMode } = useStore();
  const [expenseName, setExpenseName] = useState("");
  const [amountSpent, setAmountSpent] = useState("");
  const [bankStatement, setBankStatement] = useState(null);
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split("T")[0]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const validateForm = () => {
    const formErrors = {};
    if (!expenseName) formErrors.expenseName = "Expense name is required";
    if (!amountSpent || amountSpent <= 0) formErrors.amountSpent = "Amount spent is required";
    if (!bankStatement) formErrors.bankStatement = "Bank statement is required";
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
            toast.error("Only JPG, PNG, and PDF files are allowed.");
            setBankStatement(null);
            return;
        }

        // Set the file object directly to state instead of a base64 string
        setBankStatement(file); // Store the file object for URL creation

        const reader = new FileReader();
        reader.onloadend = () => {
            // You could also use this base64 string if needed for other purposes
            const base64String = reader.result; // This is the base64 string
            // Do something with base64String if needed
        };

        reader.readAsDataURL(file); // Convert file to base64 (if needed)
    }
};

  

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (validateForm()) {
      try {
        setIsLoading(true);
        
        // Convert file to base64
        const base64String = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(bankStatement);
          reader.onload = () => resolve(reader.result.split(',')[1]); // Remove data:image/jpeg;base64, prefix
          reader.onerror = error => reject(error);
        });
  
        const expenseData = {
          expense_name: expenseName,
          amount: parseFloat(amountSpent),
          date: expenseDate,
          bank_statement: base64String,
          file_type: bankStatement.type
        };
  
        const response = await axios.post(ADD_EXPENSE, expenseData, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
  
        if (response.data) {
          toast.success("Expense added successfully!");
          navigate("/admin-dashboard/expenses");
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error(error.response?.data?.message || "Failed to add expense");
      } finally {
        setIsLoading(false);
      }
    }
  };
  return (
    <div className={`min-h-screen py-8 px-4 transition-colors duration-300 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-10">
      <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate(-1)} // Navigate back
            className="flex items-center text-gray-600 hover:text-blue-500"
          >
            <ArrowLeft size={20} className="mr-2" /> {/* Back arrow icon */}
           
          </button>
        </div>
        <h1 className="text-3xl font-bold mb-6 text-center">Add Expense</h1>

        {/* Form Grid Layout */}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          
          {/* Expense Name */}
          <div className="flex flex-col gap-3">
            <label htmlFor="expenseName" className="uppercase text-xs tracking-wider font-semibold">Expense Name</label>
            <input
              type="text"
              id="expenseName"
              value={expenseName}
              onChange={(e) => setExpenseName(e.target.value)}
              className={`p-4 rounded-sm border ${errors.expenseName ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2`}
              required
            />
            {errors.expenseName && <span className="text-xs text-red-400">{errors.expenseName}</span>}
          </div>

          {/* Amount Spent */}
          <div className="flex flex-col gap-3">
            <label htmlFor="amountSpent" className="uppercase text-xs tracking-wider font-semibold">Amount Spent</label>
            <input
              type="number"
              id="amountSpent"
              value={amountSpent}
              onChange={(e) => setAmountSpent(e.target.value)}
              className={`p-4 rounded-sm border ${errors.amountSpent ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2`}
              required
            />
            {errors.amountSpent && <span className="text-xs text-red-400">{errors.amountSpent}</span>}
          </div>

          {/* Date */}
          <div className="flex flex-col gap-3">
            <label htmlFor="expenseDate" className="uppercase text-xs tracking-wider font-semibold">Date</label>
            <input
              type="date"
              id="expenseDate"
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
              className="p-4 rounded-sm border border-gray-300 focus:outline-none focus:ring-2"
            />
          </div>

         {/* Bank Statement File Upload */}
<div className="col-span-2 flex flex-col gap-3">
  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
    Bank Statement
  </label>
  {!bankStatement ? (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="mt-2 p-8 border-2 border-dashed border-blue-400 rounded-lg bg-blue-50 cursor-pointer"
    >
      <label className="w-full cursor-pointer">
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="text-sm font-medium text-gray-600">Click or drag file to upload</p>
          <p className="text-xs text-gray-500">Supported formats: JPG, PNG, JPEG, PDF</p>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".jpg,.png,.jpeg,.pdf"
          className="hidden"
        />
      </label>
    </motion.div>
  ) : (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mt-2"
    >
      <div className="relative w-40 h-40 rounded-lg overflow-hidden">
        {bankStatement.type === 'application/pdf' ? (
          <div className="flex items-center justify-center h-full bg-gray-200">
            <p className="text-sm">PDF uploaded</p>
          </div>
        ) : (
          <img
            src={URL.createObjectURL(bankStatement)}
            alt="Bank Statement"
            className="w-full h-full object-cover"
          />
        )}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setBankStatement(null)}
          className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white"
        >
          <XCircleIcon size={20} />
        </motion.button>
      </div>
    </motion.div>
  )}
  {errors.bankStatement && <span className="text-xs text-red-400">{errors.bankStatement}</span>}
</div>


          {/* Submit Button */}
          <div className="col-span-2 flex items-center justify-end gap-5">
            <button
              type="button"
              onClick={() => navigate("/admin-dashboard/expenses")}
              className="flex items-center px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-5 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg"
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Expense"}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;