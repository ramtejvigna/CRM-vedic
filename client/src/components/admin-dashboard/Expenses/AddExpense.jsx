import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useStore } from "../../../store";
import uploadImage from "../../../assets/upload3.jpg"; // Use the same upload image
import axios from 'axios';

const ADD_EXPENSE = "http://localhost:3000/api/expenses"; // Define your API URL here

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
    setBankStatement(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const formData = new FormData();
      formData.append("expense_name", expenseName);
      formData.append("amount_spent", amountSpent);
      formData.append("date", expenseDate);
      formData.append("bank_statement", bankStatement);
      try {
        setIsLoading(true);
        const res = await axios.post(ADD_EXPENSE, formData);
        if (res.status === 200) {
          toast.success("Expense added successfully!");
          navigate("/admin-dashboard/expenses");
        }
      } catch (error) {
        console.error("Error adding expense:", error);
        toast.error("Error adding expense!");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={`min-h-screen py-8 px-4 transition-colors duration-300 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-10">
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
            <label className="uppercase text-xs tracking-wider font-semibold">Bank Statement</label>
            {!bankStatement ? (
              <div className="h-36 p-4 border-dashed border-2 border-blue-500 rounded-lg bg-gray-50 flex items-center justify-center cursor-pointer">
                <label className="w-full cursor-pointer h-full flex flex-col items-center justify-center">
                  <img src={uploadImage} alt="Upload" className="h-28 w-28" />
                  <span className="font-bold text-xl">Upload File</span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    required
                  />
                </label>
              </div>
            ) : (
              <div className="h-36 p-4 border-dashed border-2 border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center">
                <img src={URL.createObjectURL(bankStatement)} alt="Bank Statement" className="object-cover h-full" />
                <button
                  type="button"
                  onClick={() => setBankStatement(null)}
                  className="text-red-500 mt-2"
                >
                  Clear Upload
                </button>
              </div>
            )}
            {errors.bankStatement && <span className="text-xs text-red-400">{errors.bankStatement}</span>}
          </div>

          {/* Submit Button */}
          <div className="col-span-2 flex items-center justify-end gap-5">
            <button
              type="button"
              onClick={() => navigate("/admin-dashboard/expenses")}
              className="px-5 py-2 border border-red-500 text-red-500 hover:bg-gray-100"
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
