import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { 
  X, 
  Calendar, 
  User, 
  Clock, 
  FileText, 
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock4
} from 'lucide-react';
import { motion } from 'framer-motion';

const StatusBadge = ({ status }) => {
  const getStatusStyles = () => {
    switch (status.toLowerCase()) {
      case 'approved':
        return {
          bg: 'bg-green-50',
          text: 'text-green-700',
          border: 'border-green-100',
          icon: <CheckCircle2 className="w-4 h-4 text-green-500" />
        };
      case 'rejected':
        return {
          bg: 'bg-red-50',
          text: 'text-red-700',
          border: 'border-red-100',
          icon: <XCircle className="w-4 h-4 text-red-500" />
        };
      case 'pending':
        return {
          bg: 'bg-yellow-50',
          text: 'text-yellow-700',
          border: 'border-yellow-100',
          icon: <Clock4 className="w-4 h-4 text-yellow-500" />
        };
      default:
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-700',
          border: 'border-gray-100',
          icon: <AlertCircle className="w-4 h-4 text-gray-500" />
        };
    }
  };

  const styles = getStatusStyles();

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${styles.bg} ${styles.text} border ${styles.border}`}>
      {styles.icon}
      <span className="text-sm font-medium">{status}</span>
    </div>
  );
};

const LeaveDetailsModal = ({ isOpen, onClose, leave, isDarkMode }) => {
  if (!leave) return null;

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    }
  };

  const topSection = [
    { 
      label: "Employee",
      value: leave.employee.firstName,
      icon: <User className="w-4 h-4" />
    },
    { 
      label: "Leave Type",
      value: leave.leaveType,
      icon: <Calendar className="w-4 h-4" />
    }
  ];

  const dateSection = [
    { 
      label: "From",
      value: new Date(leave.startDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      icon: <CalendarDays className="w-4 h-4" />
    },
    { 
      label: "To",
      value: new Date(leave.endDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      icon: <CalendarDays className="w-4 h-4" />
    }
  ];

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog 
        as="div" 
        className="relative z-50" 
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className={`p-6 ${
                    isDarkMode ? "bg-slate-800" : "bg-white"
                  } shadow-xl`}
                >
                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onClose}
                      className={`absolute right-0 top-0 p-1.5 rounded-full ${
                        isDarkMode
                          ? "hover:bg-slate-700 text-slate-400 hover:text-slate-200"
                          : "hover:bg-slate-100 text-slate-500 hover:text-slate-700"
                      } transition-colors`}
                    >
                      <X className="w-5 h-5" />
                    </motion.button>

                    <Dialog.Title
                      className={`text-xl font-semibold mb-6 ${
                        isDarkMode ? "text-white" : "text-slate-900"
                      }`}
                    >
                      Leave Request Details
                    </Dialog.Title>

                    {/* Top Section - Employee & Leave Type */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {topSection.map((item, index) => (
                        <div key={index} className={`p-4 rounded-lg ${
                          isDarkMode ? "bg-slate-700" : "bg-slate-50"
                        }`}>
                          <div className={`text-sm mb-1 flex items-center gap-2 ${
                            isDarkMode ? "text-slate-400" : "text-slate-500"
                          }`}>
                            {item.icon}
                            {item.label}
                          </div>
                          <div className={`text-base font-medium ${
                            isDarkMode ? "text-white" : "text-slate-900"
                          }`}>
                            {item.value}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Date Section */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {dateSection.map((item, index) => (
                        <div key={index} className={`p-4 rounded-lg ${
                          isDarkMode ? "bg-slate-700" : "bg-slate-50"
                        }`}>
                          <div className={`text-sm mb-1 flex items-center gap-2 ${
                            isDarkMode ? "text-slate-400" : "text-slate-500"
                          }`}>
                            {item.icon}
                            {item.label}
                          </div>
                          <div className={`text-base font-medium ${
                            isDarkMode ? "text-white" : "text-slate-900"
                          }`}>
                            {item.value}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Duration */}
                    <div className={`p-4 rounded-lg mb-6 ${
                      isDarkMode ? "bg-slate-700" : "bg-slate-50"
                    }`}>
                      <div className={`text-sm mb-1 flex items-center gap-2 ${
                        isDarkMode ? "text-slate-400" : "text-slate-500"
                      }`}>
                        <Clock className="w-4 h-4" />
                        Duration
                      </div>
                      <div className={`text-base font-medium ${
                        isDarkMode ? "text-white" : "text-slate-900"
                      }`}>
                        {(new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24) + 1} days
                      </div>
                    </div>

                    {/* Reason Section */}
                    <div className={`p-4 rounded-lg mb-6 ${
                      isDarkMode ? "bg-slate-700" : "bg-slate-50"
                    }`}>
                      <div className={`text-sm mb-1 flex items-center gap-2 ${
                        isDarkMode ? "text-slate-400" : "text-slate-500"
                      }`}>
                        <FileText className="w-4 h-4" />
                        Reason
                      </div>
                      <div className={`text-base ${
                        isDarkMode ? "text-white" : "text-slate-900"
                      }`}>
                        {leave.reason}
                      </div>
                    </div>

                    {/* Status Section */}
                    <div className="flex justify-between items-center">
                      <div className={`text-sm ${
                        isDarkMode ? "text-slate-400" : "text-slate-500"
                      }`}>
                        Status
                      </div>
                      <StatusBadge status={leave.status} />
                    </div>
                  </div>
                </motion.div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, action, isDarkMode }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`w-full max-w-md transform overflow-hidden rounded-2xl ${
                  isDarkMode ? "bg-slate-800" : "bg-white"
                } p-6 shadow-xl transition-all`}
              >
                <div className="relative">
                  <button
                    onClick={onClose}
                    className={`absolute right-0 top-0 p-1 rounded-full ${
                      isDarkMode
                        ? "hover:bg-slate-700 text-slate-400 hover:text-slate-200"
                        : "hover:bg-slate-100 text-slate-500 hover:text-slate-700"
                    } transition-colors`}
                  >
                    <X size={20} />
                  </button>

                  <Dialog.Title
                    className={`text-lg font-medium ${
                      isDarkMode ? "text-white" : "text-slate-900"
                    }`}
                  >
                    Confirm Action
                  </Dialog.Title>

                  <div className="space-y-6 mt-4">
                    <p className="text-lg text-gray-700 dark:text-gray-300">
                      Are you sure you want to {action?.toLowerCase() === 'approved' ? 'approve' : 'reject'} this leave request?
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
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
export { LeaveDetailsModal, ConfirmationModal };