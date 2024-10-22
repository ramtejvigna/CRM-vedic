import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Eye, Trash } from "lucide-react";
import { useStore } from "../../../store";
import { X, Download } from 'lucide-react';

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
        className="bg-white rounded-lg p-8 shadow-xl z-50 w-96 relative min-h-[200px] flex flex-col justify-between"
      >
        <div className='text-3xl font-bold uppercase text-center'>ARE YOU SURE</div>
        <div className='text-xs text-center'>you want to delete this statement?</div>
        
        <div className="flex justify-center space-x-4 mt-auto">
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

// Payslip Modal Component
const PayslipModal = ({ fileUrl, onClose }) => {
    const isPdf = fileUrl.toLowerCase().endsWith('.pdf');
    const isImage = /\.(jpeg|jpg|png|gif)$/.test(fileUrl.toLowerCase());
  
    const handleDownload = async () => {
      try {
        const response = await fetch(fileUrl, {
          method: 'GET',
          headers: {
            'Content-Type': isPdf ? 'application/pdf' : 'image/*',
          },
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('download', isPdf ? 'payslip.pdf' : 'payslip.png');
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error downloading the file:', error);
        toast.error('Error downloading the file.');
      }
    };
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-lg p-0 shadow-xl z-50 w-[800px] relative" // Increased width
        >
          {/* Top Navbar */}
          <div className="bg-black text-white p-4 rounded-t-lg">
            <h3 className="text-lg font-semibold">Payslip</h3>
          </div>
  
          <div className="p-6"> {/* Added padding for content */}
            {isPdf ? (
              <iframe
                src={fileUrl}
                className="w-full h-[70vh] mb-4 border rounded-md"
                title="Payslip PDF"
              />
            ) : isImage ? (
              <img
                src={fileUrl}
                alt="Payslip"
                className="w-full h-[70vh] mb-4 border rounded-md"
              />
            ) : (
              <p>Unsupported file type</p>
            )}
          </div>
  
          <div className="absolute top-4 right-4 flex space-x-2">
            <button
              onClick={handleDownload}
              className="text-gray-500 hover:text-blue-500 transition-colors"
            >
              <Download size={24} />
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-red-500 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </motion.div>
      </div>
    );
  };
  

// Main ViewExpenses Component
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
  const [payslipModalOpen, setPayslipModalOpen] = useState(false);
  const [payslipUrl, setPayslipUrl] = useState(null);

  const recordsPerPage = 5;
  const currentYear = new Date().getFullYear();
  const startYear = 2000;
  const endYear = currentYear + 10;
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);

  useEffect(() => {
    fetchExpenses();
  }, []);

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

  const handleFilter = () => {
    let filtered = [...expenses];

    if (selectedMonth || selectedYear) {
      filtered = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        const expenseMonth = expenseDate.getMonth() + 1;
        const expenseYear = expenseDate.getFullYear();

        const monthMatch = !selectedMonth || expenseMonth === parseInt(selectedMonth);
        const yearMatch = !selectedYear || expenseYear === parseInt(selectedYear);

        return monthMatch && yearMatch;
      });
    }

    setFilteredExpenses(filtered);
    setCurrentPage(1);
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

  const handlePayslip = (id) => {
    const expense = filteredExpenses.find((exp) => exp._id === id);
    if (expense && expense.bank_statement) {
      const fileUrl = `http://localhost:3000/api/expenses/file/${expense.bank_statement}`;
      
      fetch(`http://localhost:3000/api/expenses/check-file/${expense.bank_statement}`)
        .then(response => response.json())
        .then(data => {
          if (data.exists) {
            setPayslipUrl(fileUrl);
            setPayslipModalOpen(true);
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

  const handleAddExpense = () => navigate("add-expense");
  const handleEdit = (id) => navigate(`edit-expense/${id}`);

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

        {payslipModalOpen && (
          <PayslipModal
            fileUrl={payslipUrl}
            onClose={() => setPayslipModalOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
  <div className="mb-8 w-full">
    <div className="flex items-center justify-between mb-4 w-full"> {/* Changed to justify-between for space distribution */}
      <div className="flex items-center space-x-4"> {/* Use space-x-4 for horizontal spacing */}
        <div className="flex-1 min-w-[150px]"> {/* Adjusted min-width for better fit */}
          <label htmlFor="month" className="block text-sm font-medium text-gray-700">Month</label>
          <select
            id="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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

        <div className="flex-1 min-w-[150px]"> {/* Adjusted min-width for better fit */}
          <label htmlFor="year" className="block text-sm font-medium mb-1">Year</label>
          <select
            id="year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select Year</option>
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleFilter}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-300"
        >
          Submit
        </motion.button>
      </div>

      <div className="flex justify-end">
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
