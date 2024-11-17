import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AiOutlineUserAdd , AiOutlineAlipay } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Trash, Eye, SearchCheck, Loader } from "lucide-react";
import { useStore } from "../../../store";
import { CircularProgress } from "@mui/material";
import { GET_ALL_EMPLOYEES } from "../../../utils/constants";
import { Search, Upload, User, Users, Filter  } from 'lucide-react';
import { Link } from "react-router-dom";
import axios from "axios";
const EmployeeTable = () => {
  const navigate = useNavigate();
  const [status , setStatus] = useState("");
  const [showFilters , setShowFilters ] = useState(false)
  const [searchTerm , setSearchTerm] = useState("")
  const { isDarkMode, toggleDarkMode } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  useEffect(() => {
    if(!employees) {
      fetchEmployees();
    }
  }, []);

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
  const handleDelete = (id) => navigate(`delete-employee/${id}`);
  const indexOfFirstRecord = (currentPage - 1) * recordsPerPage;
  const indexOfLastRecord = currentPage * recordsPerPage;
  
  const currentRecords = employees?.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(employees.length / recordsPerPage);

  const getStatusColor = (isOnline) =>
    isOnline
      ? `${isDarkMode ? "bg-green-800 text-green-100" : "bg-green-100 text-green-800"}`
      : `${isDarkMode ? "bg-red-800 text-red-100" : "bg-red-100 text-red-800"}`;

      const renderPaginationButtons = () => {
        const buttons = [];
        for (let i = 1; i <= totalPages; i++) {
          buttons.push(
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              className={`relative inline-flex items-center px-4 py-2 border ${
                isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-white"
              } text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                currentPage === i ? "bg-blue-500 text-black" : ""
              }`}
            >
              {i}
            </button>
          );
        }
        return buttons;
      };
      

  const handleSearchTerm = (e) => {
    setCurrentPage(1);
    setSearchTerm(e.target.value)
  }

  useEffect(() => {
    if(searchTerm) {
      const filteredEmployees = employees.filter((employee) => employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || employee.email.slice(0 , employee.email.lastIndexOf("@")).toLowerCase().includes(searchTerm.toLowerCase()) || employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) )
      setEmployees(filteredEmployees)
    }else {
      fetchEmployees();
    }
  } , [searchTerm])

  const filterData = async () => {

    if(status) {
        try {
          setIsLoading(true)
          const response = await axios.get(`https://vedic-backend-neon.vercel.app/api/employees/search?status=${status}`);
          if(response.status === 200) {
            setEmployees(response.data);
            setIsLoading(false)
          }
          
        } catch (error) {
          console.error("Error filtering employees:", error.message);
          setIsLoading(false)
          toast.error("Error filtering employees")
        }
    }else {
      toast.error("Please select Status")
    }

  }
  useEffect(() => {
    filterData();
  } , [status])

  return isLoading ? (
      <div className="h-full w-full flex items-center justify-center">
        <CircularProgress/>
      </div>
  ) :  (
    <div
      className={`h-full p-8 transition-colors duration-300 flex flex-col items-center  ${
        isDarkMode ? "bg-gray-900 text-white" : "text-gray-900"
      }`}
      >
      <h1 className="text-3xl w-full max-w-7xl  font-bold mb-10">Employee Management</h1>
      <div className="max-w-7xl gap-1 flex-1 w-full mx-auto flex flex-col  h-full">
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => handleSearchTerm(e)}
                            placeholder="Search Names"
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                        />
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                    <motion.button
                        onClick={() => setShowFilters((prev) => !prev)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 rounded-lg bg-indigo-600 text-white transition duration-300"
                    >
                        <Filter className="h-5 w-5 inline-block mr-2" />
                        Filters
                    </motion.button>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-500 flex gap-2 items-center justify-center text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition duration-300"
                >
                  <Link className='flex gap-2 items-center justify-center' to={"/admin-dashboard/employees/add-employee"}>
                    <AiOutlineUserAdd/> <span className="">Add Employee</span>
                  </Link>
                </motion.button>
            </div>
            <div className="mb-4 ml-2 font-mono text-gray-600 text-sm">
                Showing {employees.length} results
            </div>
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 70, opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="flex  bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden"
                >
                  <form className="flex px-4 py-3 w-full flex-wrap gap-y-4">
                    <div className="flex gap-x-3 min-w-[250px] items-center">
                      <label
                        htmlFor="status"
                        className="capitalize tracking-wider text-gray-700 font-medium"
                      >
                        Status:
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        id="status"
                        name="status"
                        className="transition cursor-pointer duration-200 border border-gray-300 bg-gray-50 text-gray-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:ring-offset-white hover:shadow-md"
                      >
                        <option className="cursor-pointer" value="select status" disabled>
                          Select status
                        </option>
                        <option className="cursor-pointer" value="online">
                          Online
                        </option>
                        <option className="cursor-pointer" value="offline">
                          Offline
                        </option>
                      </select>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

          <div
            className={`border mt-2 rounded-lg overflow-hidden transition-colors duration-300 ${
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
                    {["Employee" , "Role", "phone" , "Status", "Actions"].map(
                      (header) => (
                        <th
                          key={header}
                          className={`px-6 py-3 text-left text-xs font-medium capitalize tracking-wider ${
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
                                    {employee?.firstName?.charAt(0).toUpperCase()}
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
                                {employee.firstName}
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
                          {employee.role}
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
                    {
                    renderPaginationButtons()
                    }
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
  );
};

export default EmployeeTable;