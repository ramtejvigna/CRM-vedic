import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Modal = ({ isOpen, onClose, children, title }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-y-auto"
        >
          {/* Overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
          
          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative min-h-screen flex items-center justify-center p-4"
          >
            {/* Modal Content */}
            <div className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-xl">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
              
              {/* Body */}
              <div className="p-6 max-h-[calc(100vh-12rem)] overflow-y-auto">
                {children}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const LeaveDetailsModal = ({ isOpen, onClose, leave }) => {
  if (!leave) return null;

  const leaveDetails = [
    { label: "Employee Name", value: leave.employee.firstName },
    { label: "Leave Type", value: leave.leaveType },
    { label: "From", value: new Date(leave.startDate).toLocaleDateString() },
    { label: "To", value: new Date(leave.endDate).toLocaleDateString() },
    { 
      label: "No. of Days", 
      value: (new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24) + 1 
    },
    { label: "Reason", value: leave.reason },
    { label: "Status", value: leave.status },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Leave Request Details">
      <div className="space-y-6">
        {leaveDetails.map((detail, index) => (
          <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              {detail.label}
            </div>
            <div className="text-lg font-medium text-gray-900 dark:text-white">
              {detail.value}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, action }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Action">
      <div className="space-y-6">
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Are you sure you want to {action?.toLowerCase()} this leave request?
        </p>
        
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
};

export { LeaveDetailsModal, ConfirmationModal };