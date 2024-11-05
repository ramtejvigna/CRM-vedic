
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { X, Filter, Download, Eye, Trash, Search } from "lucide-react";
import { useStore } from "../../../store";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AiOutlineDownload, AiOutlinePrinter, AiOutlineClose } from 'react-icons/ai';

// Delete Modal Component
const DeleteModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ duration: 0.5, ease: "backInOut" }}
        className="bg-white rounded-xl shadow-2xl p-7 min-w-[400px] flex flex-col justify-between"
      >
        <div className='text-3xl font-bold uppercase text-center'>ARE YOU SURE</div>
        <div className='text-xs text-center'>you want to delete this expense?</div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className='rounded-lg border border-gray-200 uppercase px-3 py-2'>Cancel</button>
          <button onClick={onConfirm} className="px-4 rounded-lg flex items-center justify-center bg-red-500 text-white py-2 hover:bg-red-600">Delete</button>
        </div>
      </motion.div>
    </div>
  );
};

const PayslipModal = ({ isOpen, onClose, payslipData, fileType }) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `data:${fileType};base64,${payslipData}`;
    link.download = 'payslip.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Payslip</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              background-color: white;
            }
            img {
              display: block;
              margin: 0 auto;
              max-width: 100%;
              height: auto;
            }
          </style>
        </head>
        <body>
          <img src="data:${fileType};base64,${payslipData}" />
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="fixed z-[1000] top-0 left-0 right-0 bottom-0 bg-black/20 backdrop-blur-md flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ duration: 0.5, ease: "backInOut" }}
      className="bg-white p-7 mx-auto w-[700px] h-[700px] shadow-xl relative"
    >
        <div className="flex absolute top-1 right-1">
          <AiOutlineClose className="text-xl cursor-pointer" onClick={onClose} />
        </div>
        <div className="flex items-center justify-between bg-black p-4"> {/* Changed p-2 to p-4 */}
  <span className="text-xl text-white">Bank Statement</span>
  <div className="flex gap-2">
    <button onClick={handleDownload} className="px-4 py-2 text-white font-semibold rounded-md transition-all hover:bg-gray-800">
      <AiOutlineDownload />
    </button>
    <button onClick={handlePrint} className="px-4 py-2 text-white font-semibold rounded-md transition-all hover:bg-gray-800">
      <AiOutlinePrinter />
    </button>
  </div>
</div>

        <div className="flex items-center justify-center">
          <img
            src={`data:${fileType};base64,${payslipData}`}
            alt="Payslip"
            style={{
              maxWidth: '100%',
              height: 'auto'
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};


// Main ViewExpenses Component
const ViewExpenses = () => {
  const navigate = useNavigate();
  const { isDarkMode, setIsDarkMode } = useStore(); // Make sure to get setIsDarkMode from store
  const [isLoading, setIsLoading] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [payslipModalOpen, setPayslipModalOpen] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [fileType, setFileType] = useState('');

  const currentYear = new Date().getFullYear();
  const startYear = 2010;
  const endYear = currentYear;
  const years = [];

  for (let year = endYear; year >= startYear; year--) {
    years.push(year);
  }

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Calculate pagination values
  const totalExpenses = filteredExpenses.length;
  const totalPages = Math.ceil(totalExpenses / rowsPerPage);
  const indexOfLastRecord = currentPage * rowsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - rowsPerPage;
  const currentRecords = filteredExpenses.slice(indexOfFirstRecord, indexOfLastRecord);

  useEffect(() => {
    const fetchExpenses = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://vedic-backend-neon.vercel.app/api/expenses');
        const data = await response.json();
        
        const sortedExpenses = data.expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        setExpenses(sortedExpenses);
        setFilteredExpenses(sortedExpenses);
      } catch (error) {
        toast.error("Error fetching expenses");
      } finally {
        setIsLoading(false);
      }
    };
    fetchExpenses();
  }, []);
  

  useEffect(() => {
    handleFilterAndSearch();
  }, [searchTerm, selectedMonth, selectedYear]);

  const handlePayslip = async (expenseId) => {
    try {
      const response = await fetch(`https://vedic-backend-neon.vercel.app/api/expenses/file/${expenseId}`);
      if (!response.ok) throw new Error("Failed to fetch payslip");
      const data = await response.json();
      if (data.bank_statement) {
        setSelectedPayslip(data.bank_statement);
        setFileType(data.file_type);
        setPayslipModalOpen(true);
      } else {
        toast.error("No valid payslip available for this expense");
      }
    } catch (error) {
      toast.error("Error fetching payslip: " + error.message);
    }
  };

  const handleFilterAndSearch = () => {
    let filtered = [...expenses];

    if (searchTerm) {
      filtered = filtered.filter((expense) =>
        Object.values(expense).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (selectedMonth || selectedYear) {
      filtered = filtered.filter((expense) => {
        const expenseDate = new Date(expense.date);
        const expenseMonth = months[expenseDate.getMonth()];
        const expenseYear = expenseDate.getFullYear().toString();

        const monthMatch = !selectedMonth || expenseMonth === selectedMonth;
        const yearMatch = !selectedYear || expenseYear === selectedYear;

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

  

  const handleAddExpense = () => navigate("add-expense");
  const handleEdit = (id) => navigate(`edit-expense/${id}`);

  const renderPaginationButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`relative inline-flex items-center px-2 py-2 border ${
            currentPage === i ? (isDarkMode ? "bg-gray-700" : "bg-gray-200") : (isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-white")
          } text-sm font-medium text-gray-500 hover:bg-gray-50`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <div className={`min-h-screen py-8 px-4`}>
     <AnimatePresence>
        {deleteModalOpen && (
          <DeleteModal
            isOpen={deleteModalOpen}
            onClose={() => {
              setDeleteModalOpen(false);
              setExpenseToDelete(null);
            }}
            onConfirm={handleDelete}
          />
        )}

{payslipModalOpen && (
          <PayslipModal
            isOpen={payslipModalOpen}
            onClose={() => {
              setPayslipModalOpen(false);
              setSelectedPayslip(null);
            }}
            payslipData={selectedPayslip}
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
          
            <div className="relative w-full" style={{ width: '60%' }}>
  <input
    type="text"
    placeholder="Search expense..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
  />
  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
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

            {showFilters && (
      <div className="flex gap-5 items-center justify-start">
        <form className='flex w-full gap-5 flex-wrap'>
          <div className='flex gap-2 items-center min-w-[150px]'>
            <label htmlFor="month" className="mr-2">Month:</label>
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)} 
              id="month" 
              name="month" 
              className="p-1 transition duration-200 border border-gray-300 focus:outline-none focus:ring-2 rounded-lg focus:ring-indigo-600 focus:ring-offset-2 focus:ring-offset-white"
            >
              <option value="">Select Month</option>
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
      
          <div className='flex gap-2 items-center min-w-[150px]'>
            <label htmlFor="year" className="mr-2">Year:</label>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(e.target.value)} 
              id="year" 
              name="year"  
              className="p-1 transition duration-200 border border-gray-300 focus:outline-none focus:ring-2 rounded-lg focus:ring-indigo-600 focus:ring-offset-2 focus:ring-offset-white"
            >
              <option value="">Select Year</option>
              {years.map(year => (
                <option key={year} value={year.toString()}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </form>
      </div>
    )}

          

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
                    {["S.No", "Expense Name", "Amount", "Date", "Actions"].map((header) => (
                      <th key={header} className={`px-6 py-3 text-left text-xs font-medium  tracking-wider ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-200"}`}>
                  {currentRecords.map((expense, index) => (
                    <tr key={expense._id} className={`${isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"} transition-colors duration-150`}>
                      <td className="px-6 py-4 text-sm whitespace-nowrap">
                        {indexOfFirstRecord + index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap">{expense.expense_name}</td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap">{expense.amount}</td>
                      <td className="px-6 py-4 text-smwhitespace-nowrap">
                        {new Date(expense.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center">
                          
                        <button
        onClick={() => handlePayslip(expense._id)}
        className={`mr-7 flex gap-2 transition-colors duration-300 ${
          isDarkMode
            ? "text-green-400 hover:text-green-200"
            : "text-green-600 hover:text-green-900"
        }`}
      >
        <Eye size={18} />
      </button>
                          <button
                            onClick={() => initiateDelete(expense._id)}
                            className={`mr-3 flex gap-2 transition-colors duration-300 ${
                              isDarkMode
                                ? "text-red-400 hover:text-red-200"
                                : "text-red-600 hover:text-red-900"
                            }`}
                          >
                            <Trash size={18} /> 
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
  <div className={`px-4 py-3 flex items-center justify-between border-t sm:px-6`}>
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
         
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${
                  isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-white"
                } text-sm font-medium text-gray-500 hover:bg-gray-50`}
              >
                Previous
              </button>
              {renderPaginationButtons()}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${
                  isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-white"
                } text-sm font-medium text-gray-500 hover:bg-gray-50`}
              >
                Next
              </button>
            </nav>
          </div>
        </div>
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

