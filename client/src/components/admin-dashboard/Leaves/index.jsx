import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LeaveRequestTable from './Table';
import { motion } from 'framer-motion';
import {CircularProgress} from '@mui/material'
const Leaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(true);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/admin/${activeTab}-leaves`);
      setLeaves(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [activeTab]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Leave Management</h1>
      <div className="mb-4 flex space-x-4">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded ${activeTab === 'pending' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} transition-colors duration-300`}
        >
          Pending Requests
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 rounded ${activeTab === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} transition-colors duration-300`}
        >
          Completed Requests
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
        <CircularProgress size={64} />
      </div>
      ) : (
        <LeaveRequestTable activeTab={activeTab} leaves={leaves} fetchLeaves={fetchLeaves} />
      )}
    </div>
  );
};

export default Leaves;
