import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../../store";
import { motion, AnimatePresence } from "framer-motion";
import { GET_ALL_EMPLOYEES } from "../../../utils/constants";
import { ChevronLeft, ChevronRight, CheckCircle, AlertCircle, Clock,XCircle,Filter, Eye, Search } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const CustomerDetails = () => {
  const { isDarkMode } = useStore();
  const [filteredGender, setFilteredGender] = useState("All");
  const [filteredStatus, setFilteredStatus] = useState("All");
  const [filteredAssignedEmployee, setFilteredAssignedEmployee] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [showFilters, setShowFilters] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
    fetchEmployees();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(
        "https://vedic-backend-neon.vercel.app/customers/getCustomers"
      );
      // Sort customers in reverse chronological order
      const sortedCustomers = response.data.sort((a, b) => {
        return new Date(b.createdDateTime) - new Date(a.createdDateTime); // Change to createdDateTime
      });
      setCustomers(sortedCustomers);
    } catch (err) {
      console.error("Error fetching customers", err);
      toast.error("Failed to fetch customers!");
    }
  };
  
  
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

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
    setPage(0); // Reset to first page when searching
  };

  const filteredData = customers.filter((row) => {
    const genderMatch = filteredGender === "All" || row.babyGender === filteredGender;
    const statusMatch = filteredStatus === "All" || row.customerStatus === filteredStatus;
    const employeeMatch = filteredAssignedEmployee === "All" || row.assignedEmployeeName === filteredAssignedEmployee;
    const searchMatch =
      row.fatherName?.toLowerCase().includes(searchTerm) ||
      row.customerId?.toLowerCase().includes(searchTerm) ||
      row.whatsappNumber?.toLowerCase().includes(searchTerm) ||
      row.babyGender?.toLowerCase().includes(searchTerm) ||
      row.assignedEmployeeName?.toLowerCase().includes(searchTerm) ||
      row.customerStatus?.toLowerCase().includes(searchTerm);

    return genderMatch && statusMatch && employeeMatch && searchMatch;
  });

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const handleGenderChange = (event) => {
    setFilteredGender(event.target.value);
    setPage(0); // Reset to first page when filter changes
  };

  const handleStatusChange = (event) => {
    setFilteredStatus(event.target.value);
    setPage(0); // Reset to first page when filter changes
  };

  const handleAssignedEmployeeChange = (event) => {
    setFilteredAssignedEmployee(event.target.value);
    setPage(0); // Reset to first page when filter changes
  };

  const handleChangePage = (newPage) => setPage(newPage);

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0); // Reset to first page when rows per page changes
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-8 px-4 transition-colors duration-300 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
      <div className="max-w-7xl mx-auto">
      <div className="flex flex-col mb-4">
  <h1 className="text-4xl font-bold mb-8">Customer Details</h1>
  <div className="flex items-center space-x-4 mt-8"> {/* Added mt-2 for margin-top */}
  <div className="relative w-full" style={{ width: '22%' }}>
  <input
    type="text"
    value={searchTerm}
    onChange={handleSearch}
    placeholder="Search..."
    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
  />
  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
</div>

    <button
      onClick={() => setShowFilters(!showFilters)}
      className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-300"
    >
      <Filter size={20} />
      <span>Filter</span>
    </button>
  </div>
</div>

        <AnimatePresence>
  {showFilters && (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`mb-6 p-4 rounded-lg shadow-md ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="gender" className="block text-sm font-medium mb-1">
            Gender
          </label>
          <select
            id="gender"
            value={filteredGender}
            onChange={handleGenderChange}
            className={`w-full p-2 rounded-md ${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"}`}
          >
            <option value="All">All</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div>
          <label htmlFor="customerStatus" className="block text-sm font-medium mb-1">
            Status
          </label>
          <select
            id="customerStatus"
            value={filteredStatus}
            onChange={handleStatusChange}
            className={`w-full p-2 rounded-md ${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"}`}
          >
            <option value="All">All</option>
            <option value="inProgress">Inprogress</option>
            <option value="completed">Completed</option>
            <option value="newRequests">New Requests</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div>
          <label htmlFor="assignedEmployee" className="block text-sm font-medium mb-1">
            Assigned Employee
          </label>
          <select
  id="assignedEmployee"
  value={filteredAssignedEmployee}
  onChange={handleAssignedEmployeeChange}
  className={`w-full p-2 rounded-md ${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"}`}
>
  <option value="All">All Employees</option>
  {employees.map((employee) => (
    <option key={employee.id} value={employee.firstName}>
      {employee.firstName}
    </option>
  ))}
</select>
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>



        <div
          className={`overflow-x-auto rounded-lg shadow ${isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
        >
          <table className="w-full table-auto">
            <thead className={`${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
              <tr>
                {[
                  "S.no",
                  "Customer Id",
                  "Father Name",
                  "WhatsApp Number",
                  "Baby Gender",
                  "EmployeeAssigned",
                  "Work Status",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-4 py-3 text-left text-xm font-medium  tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <AnimatePresence>
                {paginatedData.map((row, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                      } transition-colors duration-150`}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">{index + 1}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                     {row.customerID
}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {row.fatherName}
                    </td>
                    
               <td className="px-4 py-3 whitespace-nowrap">
                      {row.whatsappNumber}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {row.babyGender}
                    </td>
                    
<td className="px-4 py-3 whitespace-nowrap">
    {row.assignedEmployeeName || 'Not Assigned'}
</td>


                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                       className={`
                        px-2 py-1 rounded-full text-sm inline-flex leading-5 font-semibold
                        ${row.customerStatus === "newRequests" 
                          ? "text-yellow-600 bg-yellow-100" 
                          : ""}
                        ${row.customerStatus === "inProgress" 
                          ? "text-gray-900 bg-gray-100" 
                          : ""}
                        ${row.customerStatus === "completed" 
                          ? " text-green-500 bg-green-100" 
                          : ""}
                        ${row.customerStatus === "rejected" 
                          ? "text-red-800 bg-red-100" 
                          : ""}
                      `}
                      
                      >
                        {row.customerStatus === "newRequests" && (
      <>
        <AlertCircle className="w-4 h-4 mr-1" />
        New Requests
      </>
    )}
    {row.customerStatus === "inProgress" && (
      <>
        <Clock className="w-4 h-4 mr-1" />
        Inprogress
      </>
    )}
    {row.customerStatus === "completed" && (
      <>
        <CheckCircle className="w-4 h-4 mr-1" />
        Completed
      </>
    )}
    {row.customerStatus === "rejected" && (
      <>
        <XCircle className="w-4 h-4 mr-1" />
        Rejected
      </>
    )}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                    <button
  className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
  onClick={() => navigate(`${row._id}`)}
>
  <Eye size={18} className="mr-2 text-blue-600" />
</button>

                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between">
  {/* Rows per page dropdown on the left */}
  <div className="flex items-center">
    <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Rows per page:</span>
    <select
      className={`ml-2 p-1 border rounded-md ${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"}`}
      value={rowsPerPage}
      onChange={(e) => setRowsPerPage(Number(e.target.value))} // Handle rows per page change
    >
      <option value={6}>6</option>
      <option value={10}>10</option>
      <option value={15}>15</option>
    </select>
  </div>

  {/* Pagination controls on the right */}
  <div className="flex items-center space-x-4">
    <button
      onClick={() => handleChangePage(page - 1)}
      disabled={page === 0}
      className={`flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${isDarkMode
        ? "bg-gray-800 text-white hover:bg-gray-700"
        : "bg-white text-gray-700 hover:bg-gray-50"
      } ${page === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <ChevronLeft size={20} className="mr-2" />
      Previous
    </button>

    <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
      Page {page + 1} of {totalPages}
    </span>

    <button
      onClick={() => handleChangePage(page + 1)}
      disabled={page >= totalPages - 1}
      className={`flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${isDarkMode
        ? "bg-gray-800 text-white hover:bg-gray-700"
        : "bg-white text-gray-700 hover:bg-gray-50"
      } ${page >= totalPages - 1 ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      Next
      <ChevronRight size={20} className="ml-2" />
    </button>
  </div>
</div>


        
      </div>
    </div>
  );
};

export default CustomerDetails;