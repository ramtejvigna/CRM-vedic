import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Eye, Check, XOctagon } from "lucide-react";
import axios from "axios";
import { TablePagination } from "@mui/material";

const LeaveRequestTable = ({
  leaves,
  activeTab,
  fetchLeaves,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  totalLeaves,
  setSelectedLeave,
  setIsDetailModalOpen,
  setConfirmationAction,
  setIsConfirmModalOpen,
}) => {
  const handleOpenDetailModal = (leave) => {
    setSelectedLeave(leave);
    setIsDetailModalOpen(true);
  };

  const handleConfirmation = (action, leave) => {
    setSelectedLeave(leave);
    setConfirmationAction(action);
    setIsConfirmModalOpen(true);
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
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Leave Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                From
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                To
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Leave applied on
              </th>
              {activeTab !== "pending" && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {leaves.map((leave) => (
              <tr key={leave._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{leave.employee.firstName}</td>
                <td className="px-6 py-4">{leave.leaveType}</td>
                <td className="px-6 py-4">
                  {new Date(leave.startDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  {new Date(leave.endDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  {Math.ceil(
                    (new Date(leave.endDate) - new Date(leave.startDate)) /
                      (1000 * 60 * 60 * 24) +
                      1
                  )}{" "}
                  days
                </td>
                <td className="px-6 py-4">
                 {new Date(leave.createdAt).toLocaleDateString()}
                </td>
                {activeTab !== "pending" && (
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${
                        leave.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {leave.status === "Approved" ? (
                        <CheckCircle className="w-4 h-4 mr-1" />
                      ) : (
                        <XCircle className="w-4 h-4 mr-1" />
                      )}
                      {leave.status}
                    </span>
                  </td>
                )}
                <td className="px-6 py-4 space-x-2">
                  <button
                    onClick={() => handleOpenDetailModal(leave)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  {activeTab === "pending" && (
                    <>
                      <button
                        onClick={() => handleConfirmation("Approved", leave)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleConfirmation("Rejected", leave)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <XOctagon className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TablePagination
        component="div"
        count={totalLeaves}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default LeaveRequestTable;
