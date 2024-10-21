import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Edit, Trash } from "lucide-react";
import { useStore } from "../../../store";

const ViewExpenses = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]); // New state for filtered expenses
  const [selectedMonth, setSelectedMonth] = useState(""); // Add state for selectedMonth
  const [selectedYear, setSelectedYear] = useState("");   // Add state for selectedYear
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  // Fetch Expenses
  useEffect(() => {
    fetchExpenses();
  }, []);

  // Filter Expenses based on Month and Year
  useEffect(() => {
    if (selectedMonth || selectedYear) {
      const filtered = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        const expenseMonth = expenseDate.getMonth() + 1; // getMonth() returns 0-11, so adding 1
        const expenseYear = expenseDate.getFullYear();
        return (
          (selectedMonth ? expenseMonth === parseInt(selectedMonth) : true) &&
          (selectedYear ? expenseYear === parseInt(selectedYear) : true)
        );
      });
      setFilteredExpenses(filtered);
    } else {
      setFilteredExpenses(expenses); // If no filter, show all expenses
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
      setFilteredExpenses(data.expenses); // Initially show all expenses
    } catch (error) {
      console.error("Error fetching expenses:", error);
      toast.error(error.message || "Error fetching expenses!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddExpense = () => navigate("add-expense");
  const handleEdit = (id) => navigate(`edit-expense/${id}`);
  const handleView = (id) => navigate(`view-expense/${id}`);

  const handlePayslip = (expenseId) => {
    // Fetch the expense details, including the bank statement file URL
    const expense = filteredExpenses.find((exp) => exp.expense_id === expenseId);
    if (expense && expense.bank_statement) {
      const fileUrl = `http://localhost:3000/uploads/${expense.bank_statement}`;
      window.open(fileUrl, "_blank"); // Opens the bank statement in a new tab
    } else {
      console.log("No bank statement available for this expense");
    }
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredExpenses.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredExpenses.length / recordsPerPage);

  return (
    <div className={`min-h-screen py-8 px-4 transition-colors duration-300 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Expenses</h1>
          
        </div>

        {/* Filter Section */}
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
          'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
        ].map((month, index) => (
          <option key={index} value={index + 1}>
            {month}
          </option>
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
        {/* Display Expenses Table */}
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
                    <tr key={expense.expense_id} className={`${isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"} transition-colors duration-150`}>
                      <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{expense.expense_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{expense.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(expense.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => handleEdit(expense.expense_id)} 
                          className={`mr-4 transition-colors duration-300 ${isDarkMode ? "text-indigo-400 hover:text-indigo-200" : "text-indigo-600 hover:text-indigo-900"}`}>
                          <Edit size={18} />
                        </button>

                        {/* Payslip Button */}
                        <button 
                          onClick={() => handlePayslip(expense.expense_id)} 
                          className={`mr-4 transition-colors duration-300 ${isDarkMode ? "text-white bg-green-500 hover:bg-green-600" : "text-green-900 bg-green-200 hover:bg-green-300"} px-3 py-2 rounded text-sm`}>
                          <span>Payslip</span>
                        </button>

                        {/* Delete Button */}
                        <button 
                          onClick={() => handleDelete(expense.expense_id)} 
                          className={`transition-colors duration-300 ${isDarkMode ? "text-red-400 hover:text-red-200" : "text-red-600 hover:text-red-900"}`}>
                          <Trash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewExpenses;
