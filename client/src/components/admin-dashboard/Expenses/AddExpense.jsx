import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useStore } from "../../../store";
import { AiOutlineArrowLeft, AiOutlineDelete, AiOutlineUpload } from "react-icons/ai"; // Import your icons

const ADD_EXPENSE = "https://vedic-backend.netlify.app/api/expenses"; // Define your API URL here

const AddExpense = () => {
  const { isDarkMode } = useStore();
  const [expenseName, setExpenseName] = useState("");
  const [amountSpent, setAmountSpent] = useState("");
  const [bankStatement, setBankStatement] = useState(null);
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split("T")[0]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleClear = () => {
    setBankStatement(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBankStatement(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!expenseName || !amountSpent || !bankStatement) {
      toast.error("Please fill all fields!");
      return;
    }

    const formData = new FormData();
    formData.append("expense_name", expenseName);
    formData.append("amount_spent", amountSpent);
    formData.append("date", expenseDate);
    formData.append("bank_statement", bankStatement);

    try {
      setIsLoading(true);
      const res = await fetch(ADD_EXPENSE, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to add expense");

      const data = await res.json();
      if (data.success) {
        toast.success("Expense added successfully!");
        navigate("/admin-dashboard/expenses");
      } else {
        toast.error("Failed to add expense!");
      }
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Error adding expense!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen py-8 px-4 transition-colors duration-300 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <div className='w-full flex mb-4 justify-start'>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 transition duration-200 transform hover:scale-105 active:scale-95"
          >
            <AiOutlineArrowLeft className="text-xl" />
            Back
          </button>
        </div>
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6 text-center">Add Expense</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col">
                <label htmlFor="expenseName" className="text-sm font-medium mb-2">
                  Expense Name
                </label>
                <input
                  type="text"
                  id="expenseName"
                  value={expenseName}
                  onChange={(e) => setExpenseName(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="amountSpent" className="text-sm font-medium mb-2">
                  Amount Spent
                </label>
                <input
                  type="number"
                  id="amountSpent"
                  value={amountSpent}
                  onChange={(e) => setAmountSpent(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="expenseDate" className="text-sm font-medium mb-2">
                  Date
                </label>
                <input
                  type="date"
                  id="expenseDate"
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="bankStatement" className="text-sm font-medium mb-2">
                  Bank Statement
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    id="bankStatement"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleUploadClick}
                    className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                   <span className="text-gray-500 flex gap-2 items-center">
                                    <AiOutlineUpload /> Upload File
                                </span>
                  </button>
                  {bankStatement ? (
                    <div className="flex flex-col">
                      <div className="mt-2 p-4 h-36 w-36 border-dashed border-2 border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center">
                        <img
                          src={URL.createObjectURL(bankStatement)}
                          alt="Bank Statement Preview"
                          className="object-cover"
                        />
                      </div>
                      <button
                        onClick={handleClear}
                        className="text-red-500 mt-2 flex items-center gap-2"
                      >
                        <AiOutlineDelete /> Clear Upload
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="flex items-center justify-center w-2/4 max-w-sm py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Expense"}
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddExpense;
