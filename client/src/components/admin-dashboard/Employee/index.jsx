import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Avatar, Typography, Button } from "@mui/material";
import { toast } from "react-toastify";
import { AiOutlineUserAdd } from "react-icons/ai";
import { motion } from "framer-motion";
import { useStore } from "../../../store";
import { GET_ALL_EMPLOYEES } from "../../../utils/constants";

export const EmployeeTable = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  useEffect(() => {
    fetchEmployees();
  }, []); // Empty dependency ensures `fetchEmployees` runs only once on mount.

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(GET_ALL_EMPLOYEES);
      if (!res.ok) throw new Error("Failed to fetch employees");
      const data = await res.json();
      setEmployees(data.employees);
    } catch (error) {
      toast.error("Error fetching employees!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEmployee = () => navigate("add-employee");
  const handleEdit = (id) => navigate(`edit-employee/${id}`);
  const handleView = (id) => navigate(`view-employee/${id}`);
  
  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = employees.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(employees.length / recordsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleChangeCPage = (page) => {
    setCurrentPage(page);
  };

  const renderPaginationButtons = () => {
    const numbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    return (
      <>
        <li onClick={handlePrev} className={`${currentPage === 1 ? "hidden" : "bg-blue-500 text-white"} link cursor-pointer p-2 text-base px-5 rounded-xl`}>
          <a href="#">Prev</a>
        </li>
        <li className="flex-1 flex overflow-x-scroll scrollbar-hide gap-1">
          {numbers.map((n) => (
            <a
              key={n}
              onClick={() => handleChangeCPage(n)}
              className={`${currentPage === n ? "bg-blue-500 text-white" : "border-blue-500 border text-blue-500"} text-sm rounded-full p-2 px-4`}
              href="#"
            >
              {n}
            </a>
          ))}
        </li>
        <li onClick={handleNext} className={`${currentPage === totalPages ? "hidden" : "bg-blue-500 text-white"} link cursor-pointer p-2 text-base px-5 rounded-xl`}>
          <a href="#">Next</a>
        </li>
      </>
    );
  };

  return (
    <div
      className={`min-h-screen py-8 px-4 transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Employee Management</h1>
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddEmployee}
              className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
            >
              <AiOutlineUserAdd size={20} />
              <span>Add Employee</span>
            </motion.button>
          </div>
        </div>

        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="w-10 h-10 border-gray-500 border-t-black border-[3px] animate-spin rounded-full" />
          </div>
        ) : (
          <div
            className={`shadow-xl rounded-lg overflow-hidden transition-colors duration-300 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead
                  className={`${
                    isDarkMode ? "bg-gray-700" : "bg-gray-200"
                  }`}
                >
                  <tr>
                    {["Employee", "phone" , "Status", "Actions"].map(
                      (header) => (
                        <th
                          key={header}
                          className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {header}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody
                  className={`divide-y ${
                    isDarkMode ? "divide-gray-700" : "divide-gray-200"
                  }`}
                >
                  <AnimatePresence>
                    {currentRecords.map((employee) => (
                      <motion.tr
                        key={employee._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className={` ${
                          isDarkMode
                            ? "hover:bg-gray-600"
                            : "hover:bg-gray-100"
                        } transition-colors duration-150`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {employee.avatar ? (
                                <img
                                  className="h-10 w-10 rounded-full"
                                  src={employee.avatar}
                                  alt={employee.name}
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-500 flex items-center justify-center">
                                  <span className="text-white font-bold">
                                    {employee?.name?.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="ml-4">
                              <div
                                className={`text-sm font-medium ${
                                  isDarkMode
                                    ? "text-white"
                                    : "text-gray-900"
                                }`}
                              >
                                {employee.name}
                              </div>
                              <div
                                className={`text-sm ${
                                  isDarkMode
                                    ? "text-gray-300"
                                    : "text-gray-500"
                                }`}
                              >
                                {employee.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap text-sm ${
                            isDarkMode ? "text-gray-300" : "text-gray-500"
                          }`}
                        >
                          {employee.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                              employee.isOnline
                            )}`}
                          >
                            {employee.isOnline ? "Online" : "Offline"}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEdit(employee._id)}
                            className={`mr-4 transition-colors duration-300 ${
                              isDarkMode
                                ? "text-indigo-400 hover:text-indigo-200"
                                : "text-indigo-600 hover:text-indigo-900"
                            }`}
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleView(employee._id)}
                            className={`mr-4 transition-colors duration-300 ${
                              isDarkMode
                                ? "text-green-400 hover:text-green-200"
                                : "text-green-600 hover:text-green-900"
                            }`}
                          >
                            <Eye size={18} />
                            {/* <MessageCircle size={18} /> */}
                          </button>
                          {/* <button
                            onClick={() => handleDelete(employee._id)}
                            className={`transition-colors duration-300 ${
                              isDarkMode
                                ? "text-red-400 hover:text-red-200"
                                : "text-red-600 hover:text-red-900"
                            }`}
                          >
                            <Trash size={18} />
                          </button> */}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
            <div
              className={`px-4 py-3 flex items-center justify-between border-t ${
                isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
              } sm:px-6`}
            >
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
                  <p className="text-sm text-gray-700">
                    Showing {indexOfFirstRecord + 1} to {indexOfLastRecord} of {employees.length} results
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
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
        )}
      </div>
    </div>
  );
};
