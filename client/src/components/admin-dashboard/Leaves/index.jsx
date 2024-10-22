import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LeaveRequestTable from './Table';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Filter, X, ChevronDown, Search } from 'lucide-react';
import { CircularProgress } from '@mui/material';

const Leaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    leaveType: "",
    employee: "",
    status: "",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

    const fetchLeaves = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/admin/${activeTab}-leaves`, {
          params: {
            ...filters,
            page,
            rowsPerPage,
          },
        });
        setLeaves(response.data.leaves);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchLeaves();
    }, [activeTab, filters, page, rowsPerPage]);
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };
  
    const handleFilterChange = (e) => {
      const { name, value } = e.target;
      setFilters({
        ...filters,
        [name]: value,
      });
    };
  
    const handleFilterDateChange = (name, date) => {
      setFilters({
        ...filters,
        [name]: date,
      });
    };  
    // ... (keep existing fetch and handler functions)
  
    const EmptyState = () => (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center h-64 text-center p-8"
      >
        <div className="bg-blue-50 rounded-full p-6 mb-4">
          <Calendar className="w-12 h-12 text-blue-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No Leave Requests Found
        </h3>
        <p className="text-gray-500 max-w-md">
          {activeTab === 'pending' 
            ? "There are no pending leave requests to review at the moment."
            : "No completed leave requests found for the selected filters."}
        </p>
      </motion.div>
    );
  
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 font-display">
            Leave Management
          </h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-200"
          >
            <Filter className="w-4 h-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
  
        <div className="flex gap-4 mb-6">
          {['pending', 'completed'].map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Requests
            </motion.button>
          ))}
        </div>
  
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Date Range</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <input
                        type="date"
                        name="startDate"
                        value={filters.startDate || ''}
                        onChange={(e) => handleFilterDateChange('startDate', e.target.value)}
                        className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="relative flex-1">
                      <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <input
                        type="date"
                        name="endDate"
                        value={filters.endDate || ''}
                        onChange={(e) => handleFilterDateChange('endDate', e.target.value)}
                        className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
  
                <div className="space-y-2">
                  <label className="block text-sm ml-[30px] font-medium text-gray-700">Leave Type</label>
                  <div className="relative ml-[30px] w-[300px]">
                    <select
                      name="leaveType"
                      value={filters.leaveType}
                      onChange={handleFilterChange}
                      className="w-full p-2 border rounded-lg appearance-none bg-white pl-4 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Types</option>
                      <option value="Loss of pay">Loss of Pay</option>
                      <option value="Sick">Sick</option>
                      <option value="Privileged">Privileged</option>
                      <option value="Other">Other</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                  </div>
                </div>
  
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <div className="relative">
                    <select
                      name="status"
                      value={filters.status}
                      onChange={handleFilterChange}
                      className="w-full p-2 border rounded-lg appearance-none bg-white pl-4 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Statuses</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                  </div>
                </div>
  
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Search Employee</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="employee"
                      value={filters.employee}
                      onChange={handleFilterChange}
                      placeholder="Enter employee name..."
                      className="w-full p-2 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
  
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <CircularProgress size={64} className="text-blue-500" />
          </div>
        ) : leaves.length === 0 ? (
          <EmptyState />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <LeaveRequestTable
              activeTab={activeTab}
              leaves={leaves}
              fetchLeaves={fetchLeaves}
              page={page}
              rowsPerPage={rowsPerPage}
              handleChangePage={handleChangePage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              totalLeaves={leaves.length}
            />
          </motion.div>
        )}
      </div>
    );
  };
  
  export default Leaves;