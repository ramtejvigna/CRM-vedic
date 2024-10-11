import React, { useState, useEffect } from 'react';
import { useStore } from "../../../store";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Filter, Eye, Sun, Moon } from "lucide-react";
import axios from 'axios';

const CustomerDetails = () => {
  const { isDarkMode, toggleDarkMode } = useStore();
  const [filteredGender, setFilteredGender] = useState('All');
  const [filteredStatus, setFilteredStatus] = useState('All');
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(6);
  const [showFilters, setShowFilters] = useState(false);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/customers/getCustomers');
      setCustomers(response.data);
    } catch (err) {
      console.error('Error fetching customers', err);
    }
  };

  const filteredData = customers.filter((row) => {
    const genderMatch = filteredGender === 'All' || row.babyGender === filteredGender;
    const statusMatch = filteredStatus === 'All' || row.customerStatus === filteredStatus;
    return genderMatch && statusMatch;
  });

  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const handleGenderChange = (event) => setFilteredGender(event.target.value);
  const handleStatusChange = (event) => setFilteredStatus(event.target.value);
  const handleChangePage = (newPage) => setPage(newPage);

  return (
    <div className={`min-h-screen py-8 px-4 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="bg-blue-600 text-white p-6 rounded-xl shadow-lg mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Customer Details</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors duration-300"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-colors duration-300"
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
              className={`mb-6 p-4 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium mb-1">Gender</label>
                  <select
                    id="gender"
                    value={filteredGender}
                    onChange={handleGenderChange}
                    className={`w-full p-2 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
                  >
                    <option value="All">All</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium mb-1">Status</label>
                  <select
                    id="status"
                    value={filteredStatus}
                    onChange={handleStatusChange}
                    className={`w-full p-2 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
                  >
                    <option value="All">All</option>
                    <option value="In progress">In progress</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={`overflow-x-auto rounded-lg shadow ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <table className="w-full table-auto">
            <thead className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <tr>
                {['S:no', 'Customer Name', 'WhatsApp Number', "Baby's Gender", 'Preferred Starting Letter', 'Preferred God', 'Actions'].map((header) => (
                  <th key={header} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
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
                    className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors duration-150`}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">{index + 1}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{row.username}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{row.whatsappNumber}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{row.babyGender}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{row.preferredStartingLetter}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{row.preferredGod}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <Eye size={18} className="mr-2" />
                        View
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => handleChangePage(page - 1)}
            disabled={page === 0}
            className={`flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
              isDarkMode
                ? 'bg-gray-800 text-white hover:bg-gray-700'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } ${page === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <ChevronLeft size={20} className="mr-2" />
            Previous
          </button>
          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => handleChangePage(page + 1)}
            disabled={page >= totalPages - 1}
            className={`flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
              isDarkMode
                ? 'bg-gray-800 text-white hover:bg-gray-700'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } ${page >= totalPages - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Next
            <ChevronRight size={20} className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;