import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { X, Filter, Download, Eye, Trash, Search } from "lucide-react";
import { useStore } from "../../../store";
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
        className="bg-white rounded-lg p-0 shadow-xl z-50 w-[800px] relative"
      >
        <div className="bg-black text-white p-4 rounded-t-lg">
          <h3 className="text-lg font-semibold">Payslip</h3>
        </div>

        <div className="p-6">
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
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5); // State for rows per page

  const recordsPerPage = 5;
  const currentYear = new Date().getFullYear();
  const startYear = 2000;
  const endYear = currentYear + 10;
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    handleFilterAndSearch();
  }, [searchTerm, expenses, selectedMonth, selectedYear]);

  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("https://vedic-backend-neon.vercel.app/api/expenses/getAllExpenses");
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

  const handleFilterAndSearch = () => {
    let filtered = [...expenses];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((expense) =>
        Object.values(expense).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply month/year filters
    if (selectedMonth || selectedYear) {
      filtered = filtered.filter((expense) => {
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
        `https://vedic-backend-neon.vercel.app/api/expenses/deleteExpense/${expenseToDelete}`,
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
      const fileUrl = `https://vedic-backend-neon.vercel.app/api/expenses/file/${expense.bank_statement}`;
      
      fetch(`https://vedic-backend-neon.vercel.app/api/expenses/check-file/${expense.bank_statement}`)
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
    <div className={`min-h-screen py-8 px-4 transition-colors duration-300 ${
      isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
    }`}>
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
          <div className="flex flex-col space-y-4">
            {/* Search Bar */}
           
            <h1 className="text-4xl font-bold mb-8">Expenses</h1>

            <div className="flex justify-between items-center">

            <div className="flex items-center space-x-2"> 
          
  <div className="relative" style={{ width: '60%' }}> 
    <input
      type="text"
      placeholder="Search expenses..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
  </div>

  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={() => setShowFilters(!showFilters)}
    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-300 flex items-center space-x-2"
  >
    <Filter size={13} />
    <span>Filters</span>
  </motion.button>
</div>



              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddExpense}
                className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
              >
                <span>Add Expense</span>
              </motion.button>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center space-x-4 py-4">
                    <div className="flex-1 min-w-[150px]">
                      <label htmlFor="month" className="block text-sm font-medium text-gray-700">Month</label>
                      <select
  id="month"
  value={selectedMonth}
  onChange={(e) => setSelectedMonth(e.target.value)} // Remove handleFilterAndSearch() call
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

                    <div className="flex-1 min-w-[150px]">
                      <label htmlFor="year" className="block text-sm font-medium mb-1">Year</label>
                      <select
  id="year"
  value={selectedYear}
  onChange={(e) => setSelectedYear(e.target.value)} // Remove handleFilterAndSearch() call
  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
>
  <option value="">Select Year</option>
  {years.map((year) => (
    <option key={year} value={year}>{year}</option>
  ))}
</select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className={` rounded-lg overflow-hidden transition-colors duration-300 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
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
              <div className="mt-4 flex items-center justify-between">
  {/* Rows per page dropdown on the left */}
  <div className="flex items-center">
    <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Rows per page:</span>
    <select
      className={`ml-2 p-1 border rounded-md ${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"}`}
      value={rowsPerPage}
      onChange={(e) => setRowsPerPage(Number(e.target.value))} // Handle rows per page change
    >
      <option value={5}>6</option>
      <option value={10}>10</option>
      <option value={15}>15</option>
    </select>
  </div>

  {/* Pagination controls on the right */}
  <div className="flex items-center space-x-4">
  <button
    onClick={() => handleChangePage(currentPage - 1)}
    disabled={currentPage === 1}
    className={`flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${isDarkMode
      ? "bg-gray-800 text-white hover:bg-gray-700"
      : "bg-white text-gray-700 hover:bg-gray-50"
    } ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
  >
    <ChevronLeft size={20} className="mr-2" />
    Previous
  </button>

  <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
    Page {currentPage} of {totalPages}
  </span>

  <button
    onClick={() => handleChangePage(currentPage + 1)}
    disabled={currentPage >= totalPages}
    className={`flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${isDarkMode
      ? "bg-gray-800 text-white hover:bg-gray-700"
      : "bg-white text-gray-700 hover:bg-gray-50"
    } ${currentPage >= totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
  >
    Next
    <ChevronRight size={20} className="ml-2" />
  </button>
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