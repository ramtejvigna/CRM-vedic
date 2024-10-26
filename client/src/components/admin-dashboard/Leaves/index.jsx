import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Filter, Search, ChevronDown } from "lucide-react";
import { CircularProgress } from "@mui/material";
import LeaveRequestTable from "./Table";
import { LeaveDetailsModal, ConfirmationModal } from "./Modals";

const Leaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
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
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);

  // Fetch leaves logic remains the same
  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://vedic-backend-neon.vercel.app/admin/${activeTab}-leaves`, {
        params: { ...filters, page, rowsPerPage },
      });
      setLeaves(response.data.leaves);
      if (activeTab === 'pending') {
        setPendingCount(response.data.totalLeaves);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [activeTab, filters, page, rowsPerPage]);

  const handleTabChange = (status) => {
    setActiveTab(status);
  };

  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center h-64 text-center p-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="bg-blue-50 rounded-full p-6 mb-4"
      >
        <Calendar className="w-12 h-12 text-blue-500" />
      </motion.div>
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-semibold text-gray-900 mb-2"
      >
        No Leave Requests Found
      </motion.h3>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-gray-500 max-w-md"
      >
        {activeTab === "pending"
          ? "There are no pending leave requests to review at the moment."
          : "No completed leave requests found for the selected filters."}
      </motion.p>
    </motion.div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900">Leave Management</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
        >
          <Filter className="w-4 h-4" />
          <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
        </motion.button>
      </motion.div>

      <div className="mb-8">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-2">
            {["pending", "completed"].map((status) => (
              <motion.button
                key={status}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleTabChange(status)}
                className={`
                  relative px-6 py-3 text-sm font-medium transition-all duration-200
                  ${
                    activeTab === status
                      ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-500"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }
                `}
              >
                {status === "pending" ? "Pending Requests" : "Completed Requests"}
                {activeTab === status && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                  />
                )}
                {activeTab === "pending" && pendingCount > 0 && status !== 'completed' && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1"
                  >
                    {pendingCount}
                  </motion.span>
                )}
              </motion.button>
            ))}
          </nav>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="overflow-hidden"
          >
            {/* Filter content remains the same */}
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex justify-center items-center h-64"
        >
          <CircularProgress size={64} className="text-blue-500" />
        </motion.div>
      ) : leaves.length === 0 ? (
        <EmptyState />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <LeaveRequestTable
            activeTab={activeTab}
            leaves={leaves}
            fetchLeaves={fetchLeaves}
            page={page}
            rowsPerPage={rowsPerPage}
            // handleChangePage={handleChangePage}
            // handleChangeRowsPerPage={handleChangeRowsPerPage}
            totalLeaves={leaves.length}
            setSelectedLeave={setSelectedLeave}
            setIsDetailModalOpen={setIsDetailModalOpen}
            setConfirmationAction={setConfirmationAction}
            setIsConfirmModalOpen={setIsConfirmModalOpen}
          />
        </motion.div>
      )}

      <AnimatePresence>
        {isDetailModalOpen && (
          <LeaveDetailsModal
            isOpen={isDetailModalOpen}
            onClose={() => setIsDetailModalOpen(false)}
            leave={selectedLeave}
            isDarkMode={false}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isConfirmModalOpen && (
          <ConfirmationModal
            isOpen={isConfirmModalOpen}
            onClose={() => setIsConfirmModalOpen(false)}
            onConfirm={async () => {
              try {
                await axios.put(
                  `https://vedic-backend-neon.vercel.app/admin/leaves/${selectedLeave._id}`,
                  {
                    status: confirmationAction,
                    adminComments: "",
                  }
                );
                fetchLeaves();
                setIsConfirmModalOpen(false);
                setIsDetailModalOpen(false);
              } catch (error) {
                console.error(error);
              }
            }}
            action={confirmationAction}
            isDarkMode={false}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Leaves;
