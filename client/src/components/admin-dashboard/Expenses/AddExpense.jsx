import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useStore } from "../../../store";

const ADD_EXPENSE = "http://localhost:3000/api/expenses"; // Define your API URL here

const AddExpense = () => {
  const { isDarkMode } = useStore();
  const [expenseName, setExpenseName] = useState("");
  const [amountSpent, setAmountSpent] = useState("");
  const [bankStatement, setBankStatement] = useState(null);
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split("T")[0]); // Allow editing
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setBankStatement(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Log form data before sending
    console.log("Expense Name:", expenseName);
    console.log("Amount Spent:", amountSpent);
    console.log("Bank Statement File:", bankStatement);
    
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

      // Log the form data object
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      const res = await fetch(ADD_EXPENSE, {
        method: "POST",
        body: formData,
      });

      // Log the raw response
      console.log("Response:", res);

      if (!res.ok) throw new Error("Failed to add expense");

      const data = await res.json();
      console.log("Response Data:", data);

      if (data.success) {
        toast.success("Expense added successfully!");
        navigate("/admin-dashboard/expenses"); // Redirect to the correct URL
      } else {
        toast.error("Failed to add expense!");
      }
    } catch (error) {
      // Log any errors that occur during submission
      console.error("Error adding expense:", error);
      toast.error("Error adding expense!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen py-8 px-4 transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6 text-center">Add Expense</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col space-y-4">
              {/* Expense Name */}
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

              {/* Amount Spent */}
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

              {/* Date (Editable) */}
              <div className="flex flex-col">
                <label htmlFor="expenseDate" className="text-sm font-medium mb-2">
                  Date
                </label>
                <input
                  type="date"
                  id="expenseDate"
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)} // Handle date change
                  className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Bank Statement File Upload */}
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
                    Upload paySlip
                  </button>
                  {bankStatement && (
                    <a
                      href={URL.createObjectURL(bankStatement)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {bankStatement.name}
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
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
