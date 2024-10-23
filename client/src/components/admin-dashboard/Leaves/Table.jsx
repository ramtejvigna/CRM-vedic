import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, MessageCircle } from "lucide-react";
import axios from "axios";
import {
  TablePagination,
} from "@mui/material";

const LeaveRequestTable = ({
  leaves,
  activeTab,
  fetchLeaves,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  totalLeaves,
}) => {
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null);

  const handleOpenDetailModal = (leave) => {
    setSelectedLeave(leave);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedLeave(null);
    setShowModal(false);
  };

  const handleConfirmation = (action, leave) => {
    setSelectedLeave(leave);
    setConfirmationAction(action);
    setShowConfirmationModal(true);
  };

  const handleConfirm = async () => {
    try {
      await axios.put(
        `https://vedic-backend-neon.vercel.app/admin/leaves/${selectedLeave._id}`,
        {
          status: confirmationAction,
          adminComments: "",
        }
      );
      fetchLeaves();
      setShowConfirmationModal(false);
      setShowModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelConfirmation = () => {
    setShowConfirmationModal(false);
    setConfirmationAction(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "text-green-600";
      case "Rejected":
        return "text-red-600";
      default:
        return "text-yellow-600";
    }
  };

  return (
    <div>
      <div className="overflow-x-auto w-full h-full">
        <table className="w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                S.No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Employee Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Leave Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                From
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                To
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                No. of Days
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Leave applied date
              </th>
              {activeTab === "pending" ? (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              ) : (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            <AnimatePresence>
              {leaves.map((leave, index) => (
                <motion.tr
                  key={leave._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer hover:underline"
                      onClick={() => handleOpenDetailModal(leave)}
                    >
                      {leave.employee.firstName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {leave.leaveType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(leave.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(leave.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {(new Date(leave.endDate) - new Date(leave.startDate)) /
                      (1000 * 60 * 60 * 24) +
                      1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(leave.createdAt).toLocaleDateString()}
                  </td>
                  {activeTab === "pending" ? (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleConfirmation("Approved", leave)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-200 mr-4"
                      >
                        <CheckCircle size={18} />
                      </button>
                      <button
                        onClick={() => handleConfirmation("Rejected", leave)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200 mr-4"
                      >
                        <XCircle size={18} />
                      </button>
                    </td>
                  ) : (
                    <td
                      className={`whitespace-nowrap text-sm font-medium ${getStatusColor(leave.status)}`}
                    >
                      <div className="flex items-center">
                        {leave.status === "Approved" ? (
                          <CheckCircle
                            className="mr-2 text-green-500"
                            size={18}
                          />
                        ) : (
                          <XCircle className="mr-2 text-red-500" size={18} />
                        )}
                        {leave.status}
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalLeaves}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

{showModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75">
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-1/2 max-w-lg">
      <h2 className="text-xl font-bold mb-4">Leave Details</h2>
      <p>
        <strong>Employee Name:</strong> {selectedLeave.employee.firstName}
      </p>
      <p>
        <strong>Leave Type:</strong> {selectedLeave.leaveType}
      </p>
      <p>
        <strong>From:</strong> {new Date(selectedLeave.startDate).toLocaleDateString()}
      </p>
      <p>
        <strong>To:</strong> {new Date(selectedLeave.endDate).toLocaleDateString()}
      </p>
      <p>
        <strong>No. of Days:</strong> {(new Date(selectedLeave.endDate) - new Date(selectedLeave.startDate)) / (1000 * 60 * 60 * 24) + 1}
      </p>
      <p>
        <strong>Reason:</strong> {selectedLeave.reason}
      </p>
      <button
        onClick={handleCloseModal}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Close
      </button>
    </div>
  </div>
)}

{showConfirmationModal && (
  <div className="fixed inset-0  z-50 flex items-center justify-center bg-gray-500 bg-opacity-75">
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-1/2 max-w-lg">
      <h2 className="text-xl font-bold mb-4">Confirmation</h2>
      <p>
        Are you sure you want to {confirmationAction.toLowerCase()} this leave request?
      </p>
      <div className="flex justify-end mt-4">
        <button
          onClick={handleConfirm}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 mr-2"
        >
          Confirm
        </button>
        <button
          onClick={handleCancelConfirmation}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default LeaveRequestTable;
