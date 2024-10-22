import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Eye, Trash } from "lucide-react";
import { useStore } from "../../../store";

// Delete Modal Component
const DeleteModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-lg p-6 shadow-xl z-50 w-96 relative"
      >
        <h3 className="text-lg font-semibold mb-4">Delete Expense</h3>
        <p className="text-gray-600 mb-6">Are you sure you want to delete this expense? This action cannot be undone.</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-transparent text-red-600 border border-red-600 rounded-md hover:bg-red-600 hover:text-white transition-colors duration-200"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const ViewExpenses = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const recordsPerPage = 5;

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    if (selectedMonth || selectedYear) {
      const filtered = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        const expenseMonth = expenseDate.getMonth() + 1;
        const expenseYear = expenseDate.getFullYear();
        return (
          (selectedMonth ? expenseMonth === parseInt(selectedMonth) : true) &&
          (selectedYear ? expenseYear === parseInt(selectedYear) : true)
        );
      });
      setFilteredExpenses(filtered);
    } else {
      setFilteredExpenses(expenses);
    }
  }, [selectedMonth, selectedYear, expenses]);

  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("http://localhost:3000/api/expenses/getAllExpenses");
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch expenses");
      }
      const data = await res.json();
      setExpenses(data.expenses);
      setFilteredExpenses(data.expenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      toast.error(error.message || "Error fetching expenses!");
    } finally {
      setIsLoading(false);
    }
  };

  const initiateDelete = (id) => {
    setExpenseToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!expenseToDelete) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/expenses/deleteExpense/${expenseToDelete}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete expense");
      }

      setExpenses((prevExpenses) =>
        prevExpenses.filter((expense) => expense._id !== expenseToDelete)
      );
      setFilteredExpenses((prevFiltered) =>
        prevFiltered.filter((expense) => expense._id !== expenseToDelete)
      );

      toast.success("Expense deleted successfully");
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error(error.message || "Failed to delete expense");
    } finally {
      setDeleteModalOpen(false);
      setExpenseToDelete(null);
    }
  };

  const handleAddExpense = () => navigate("add-expense");
  const handleEdit = (id) => navigate(`edit-expense/${id}`);

  const handlePayslip = (id) => {
    const expense = filteredExpenses.find((exp) => exp._id === id);
    if (expense && expense.bank_statement) {
      const fileUrl = `http://localhost:3000/api/expenses/file/${expense.bank_statement}`;
      
      fetch(`http://localhost:3000/api/expenses/check-file/${expense.bank_statement}`)
        .then(response => response.json())
        .then(data => {
          if (data.exists) {
            window.open(fileUrl, "_blank");
          } else {
            toast.error("File not found on server");
          }
        })
        .catch(error => {
          console.error('Error checking file:', error);
          toast.error("Error accessing file");
        });
    } else {
      toast.info("No bank statement available for this expense");
    }
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredExpenses.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredExpenses.length / recordsPerPage);

  return (
    <div className={`min-h-screen py-8 px-4 transition-colors duration-300 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <AnimatePresence>
        <DeleteModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setExpenseToDelete(null);
          }}
          onConfirm={handleDelete}
        />
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        <div className="mb-8 w-full">
          <div className="flex items-end justify-start mb-4 w-full">
            <div className="flex-1">
              <label htmlFor="month" className="block text-sm font-medium text-gray-700">Month</label>
              <select
                id="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="mt-1 block px-9 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select Month</option>
                {[
                  'January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'
                ].map((month, index) => (
                  <option key={index} value={index + 1}>{month}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year</label>
              <input
                type="number"
                id="year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="mt-1 mr-12 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter Year"
              />
            </div>
            <div className="flex justify-end flex-1">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddExpense}
                className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
              >
                <span>Add Expense</span>
              </motion.button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className={`shadow-xl rounded-lg overflow-hidden transition-colors duration-300 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                  <tr>
                    {["Serial No", "Expense Name", "Amount", "Date", "Actions"].map((header) => (
                      <th key={header} className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-200"}`}>
                  {currentRecords.map((expense, index) => (
                    <tr key={expense._id} className={`${isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"} transition-colors duration-150`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {indexOfFirstRecord + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{expense.expense_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{expense.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(expense.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center">
                          <button
                            onClick={() => initiateDelete(expense._id)}
                            className={`mr-3 flex gap-2 transition-colors duration-300 ${
                              isDarkMode
                                ? "text-red-400 hover:text-red-200"
                                : "text-red-600 hover:text-red-900"
                            }`}
                          >
                            <Trash size={18} /> {"DELETE"}
                          </button>
                          <button
                            onClick={() => handlePayslip(expense._id)}
                            className={`mr-3 flex gap-2 transition-colors duration-300 ${
                              isDarkMode
                                ? "text-green-400 hover:text-green-200"
                                : "text-green-600 hover:text-green-900"
                            }`}
                          >
                            <Eye size={18} /> {"PAYSLIP"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div className="flex justify-between items-center p-4">
                <div>
                  Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, filteredExpenses.length)} of {filteredExpenses.length} entries
                </div>
                
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewExpenses;