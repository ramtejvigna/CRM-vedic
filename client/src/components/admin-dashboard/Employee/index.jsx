import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AiOutlineUserAdd } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Eye } from "lucide-react";
import { useStore } from "../../../store";
import { CircularProgress } from "@mui/material";
import { GET_ALL_EMPLOYEES } from "../../../utils/constants";
import { Search, Filter } from 'lucide-react';
import { Link } from "react-router-dom";
import axios from "axios";
import BabyNamesStatus from "./BabyNameStatus";
import ConfirmationModal from "./ConfirmationModal";

const EmployeeTable = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { isDarkMode } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [originalEmployees, setOriginalEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [role, setRole] = useState("all");
  const recordsPerPage = 5;
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  const handleOpenModal = (employeeId) => {
    setSelectedEmployeeId(employeeId);
    setIsModalOpen(true);
  };

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(GET_ALL_EMPLOYEES);
      if (!res.ok) throw new Error("Failed to fetch employees");
      const data = await res.json();
      if (data?.employees) {
        setEmployees(data.employees);
        setOriginalEmployees(data.employees);
      } else {
        throw new Error("Invalid data format");
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error("Error fetching employees!");
      setEmployees([]);
      setOriginalEmployees([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
    const intervalId = setInterval(fetchEmployees, 10 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Combined filtering function for search, status, and role
  const filterEmployees = () => {
    let filteredResults = [...originalEmployees];

    // Apply search filter
    if (searchTerm) {
      filteredResults = filteredResults.filter(
        (employee) =>
          employee?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (status !== 'all') {
      filteredResults = filteredResults.filter(
        (employee) => 
          status === 'online' ? employee.isOnline : !employee.isOnline
      );
    }

    // Apply role filter
    if (role !== 'all') {
      filteredResults = filteredResults.filter(
        (employee) => employee.role.toLowerCase() === role.toLowerCase()
      );
    }

    setEmployees(filteredResults);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Combined useEffect for all filters
  useEffect(() => {
    filterEmployees();
  }, [searchTerm, status, role, originalEmployees]);

  const handleView = (id) => navigate(`view-employee`, {
    state: { 
      employee_id: id 
    }
  });
  const handleEdit = (id) => navigate(`edit-employee`, {
    state: {
      employee_id: id
    }
  });

  const currentRecords = employees?.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  ) || [];

  const totalPages = Math.ceil((employees?.length || 0) / recordsPerPage);

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

  const handleConfirm = async (employeeId) => {
    try {
      const response = await axios.post('https://vedic-backend-neon.vercel.app/api/employees/confirmRequest', {
        employeeId
      });

      if (response?.data?.accepted) {
        setIsModalOpen(false);
        toast.success("Request accepted");
        await fetchEmployees();
      }
    } catch (error) {
      console.error('Confirmation error:', error);
      toast.error("Failed to accept the request");
    }
  };

  const indexOfFirstRecord = (currentPage - 1) * recordsPerPage;
  const indexOfLastRecord = currentPage * recordsPerPage;

  return isLoading ? (
    <div className="h-full w-full flex items-center justify-center">
      <CircularProgress />
    </div>
  ) : (
    <div
      className={`h-full p-8 transition-colors duration-300 flex flex-col items-center ${
        isDarkMode ? "bg-gray-900 text-white" : "text-gray-900"
      }`}
    >
      <h1 className="text-3xl w-full max-w-7xl font-bold mb-10">Employee Management</h1>
      <div className="max-w-7xl gap-1 flex-1 w-full mx-auto flex flex-col h-full">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
              <AiOutlineUserAdd /> <span>Add Employee</span>
            </Link>
          </motion.button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 70, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="flex bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden"
            >
              <form className="flex px-4 py-3 w-full flex-wrap gap-y-4">
                <div className="flex gap-x-3 min-w-[250px] items-center">
                  <label
                    htmlFor="role"
                    className="capitalize tracking-wider text-gray-700 font-medium"
                  >
                    Role:
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    id="role"
                    name="Role"
                    className="transition cursor-pointer duration-200 border border-gray-300 bg-gray-50 text-gray-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:ring-offset-white hover:shadow-md"
                  >
                    <option value="all">All</option>
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>
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
                    <option value="all">All</option>
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div
          className={`border mt-2 rounded-lg overflow-hidden transition-colors duration-300 ${isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead
                className={`${isDarkMode ? "bg-gray-700" : "bg-gray-200"
                  }`}
              >
                <tr>
                  {["Employee", "Role", "phone", "Status", "Requested Baby", "Actions"].map(
                    (header) => (
                      <th
                        key={header}
                        className={`px-6 py-3 text-left text-xs font-medium capitalize tracking-wider ${isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                      >
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody
                className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-200"
                  }`}
              >
                <AnimatePresence>
                  {currentRecords.map((employee, i) => (
                    <>
                      <motion.tr
                        key={employee.email}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className={` ${isDarkMode
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
                                className={`text-sm font-medium ${isDarkMode
                                  ? "text-white"
                                  : "text-gray-900"
                                  }`}
                              >
                                {employee.firstName}
                              </div>
                              <div
                                className={`text-sm ${isDarkMode
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
                          className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? "text-gray-300" : "text-gray-500"
                            }`}
                        >
                          {employee.role}
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? "text-gray-300" : "text-gray-500"
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

                        <td>
                          <BabyNamesStatus
                            isRequested={employee?.requestedBabyNames}
                            employeeId={employee._id}
                            handleClick={handleOpenModal}
                            setIsModalOpen={setIsModalOpen}
                          />
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEdit(employee._id)}
                            className={`mr-4 transition-colors duration-300 ${isDarkMode
                              ? "text-indigo-400 hover:text-indigo-200"
                              : "text-indigo-600 hover:text-indigo-900"
                              }`}
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleView(employee._id)}
                            className={`mr-4 transition-colors duration-300 ${isDarkMode
                              ? "text-green-400 hover:text-green-200"
                              : "text-green-600 hover:text-green-900"
                              }`}
                          >
                            <Eye size={18} />
                            {/* <MessageCircle size={18} /> */}
                          </button>

                        </td>
                      </motion.tr>
                    </>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
        <div
            className={`px-4 py-3 flex items-center justify-between sm:px-6`}
          >
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
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-white"
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
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-white"
                      } text-sm font-medium text-gray-500 hover:bg-gray-50`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
      </div>

      {
        selectedEmployeeId &&
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          employeeId={selectedEmployeeId}
          onConfirm={handleConfirm}
        />
      }
    </div>
  );
};

export default EmployeeTable;