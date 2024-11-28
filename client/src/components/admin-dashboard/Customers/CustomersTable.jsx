import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Check, X, User, Briefcase, MoreHorizontal } from "lucide-react";
import EmptyState from "./EmptyState";
import RejectConfirmationModal from "./RejectConfirmationModal";


const CustomersTable = ({
  customers,
  fromSection,
  nextSection,
  handleActionClick,
  moveCustomer,
  activeTab,
  setSelectedCustomer,
  setNextSection,
  setShowModal,
  setPaymentStatus,
  setSelectedCustomerForAssign,
  setActiveDropdown,
  activeDropdown,
  isDarkMode,
}) => {
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [customerToReject, setCustomerToReject] = useState(null);

  const renderTableHeaders = () => {
    switch (fromSection) {
      case "newRequests":
        return [
          "S.no",
          "application ID",
          "Customer ID",
          "Customer Name",
         
          "Baby Gender",
          "WhatsApp Number",
          "Actions",
        ];
      case "inProgress":
        return [
          "S.no",
          "Customer ID",
          "Customer Name",
          "Baby Gender",
          "WhatsApp Number",
          "Pdfs Generated",
          "Actions",
        ];
        case "assignTo":
          return [
          "S.no",
          "Customer ID",
          "Customer Name",
          "WhatsApp Number",
          "Baby Gender",
          "Employee Assigned",
          "Pdfs Generated",
          "Work Deadline",
          "Actions",
          ];
      case "rejected":
        return [
          "S.no",
          "Customer ID",
          "Customer Name",
          "Baby Gender",
          "WhatsApp Number",
          "Actions",
        ];
      default:
        return [
          "S.no",
          "Customer ID",
          "Customer Name",
          "WhatsApp Number",
          "Baby Gender",
          "Employee Assigned",
          "Actions",
        ];
    }
  };

  const renderTableRows = (customer, index) => {
    console.log(fromSection)

    switch (fromSection) {
      case "newRequests":
        return (
          <tr
            key={customer._id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 ease-in-out"
          >
            <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-900 dark:text-gray-100">
              {index + 1}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-900 dark:text-gray-100">
              {customer.applicationID}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-900 dark:text-gray-100">
              {customer.customerID}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-900 dark:text-gray-100">
              {customer.customerName}
            </td>
           
            <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-900 dark:text-gray-100">
              {customer.babyGender}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-900 dark:text-gray-100">
              {customer.whatsappNumber}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-normal relative">
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-200"
                  onClick={() => {
                    setSelectedCustomer(customer);
                    setNextSection(nextSection);
                    setShowModal(true);
                    if (fromSection === "newRequests") {
                      setPaymentStatus(true);
                    }
                  }}
                >
                  <Check size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
                  onClick={() => {
                    setCustomerToReject(customer);
                    setRejectModalOpen(true);
                  }}
                >
                  <X size={20} />
                </motion.button>
              </div>
            </td>
          </tr>
        );
      case "inProgress":
        return (
          <tr
            key={customer._id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 ease-in-out"
          >
            <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-900 dark:text-gray-100">
              {index + 1}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-900 dark:text-gray-100">
              {customer.customerID}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-900 dark:text-gray-100">
              {customer.customerName}
            </td>
           
            <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-900 dark:text-gray-100">
              {customer.babyGender}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-900 dark:text-gray-100">
              {customer.whatsappNumber}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
          {customer.pdfGenerated.length || '0'}
          </td>
            <td className="px-6 py-4 space-x-3 whitespace-nowrap text-sm font-normal relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200"
                onClick={() => handleActionClick("view", customer, fromSection, nextSection)}
              >
                <Eye size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200"
                onClick={() => handleActionClick("assign", customer, fromSection, nextSection)}
              >
                <User size={20} />
              </motion.button>
            </td>
          </tr>
        );
      case "rejected":
        return (
          <tr
            key={customer._id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 ease-in-out"
          >
            <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-900 dark:text-gray-100">
              {index + 1}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-900 dark:text-gray-100">
              {customer.customerID}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-900 dark:text-gray-100">
              {customer.customerName}
            </td>
           
            <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-900 dark:text-gray-100">
              {customer.babyGender}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-900 dark:text-gray-100">
              {customer.whatsappNumber}
            </td>
            <td className="px-6 py-4 space-x-3 whitespace-nowrap text-sm font-normal relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200"
                onClick={() => handleActionClick("view", customer, fromSection, nextSection)}
              >
                <Eye size={20} />
              </motion.button>
            </td>
          </tr>
        );
        case "assignTo" : 
          return(
          <tr
          key={customer._id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 ease-in-out"
        >
          <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-900 dark:text-gray-100">
            {index + 1}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-900 dark:text-gray-100">
            {customer.customerID}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-900 dark:text-gray-100">
            {customer.customerName}
          </td>
          
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
            {customer.whatsappNumber}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
            {customer.babyGender}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
            {customer.assignedEmployee?.firstName +
              " " +
              customer.assignedEmployee?.lastName ||
              customer.assignedEmployee?.email ||
              "Not Assigned"}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
          {customer.pdfGenerated.length || '0'}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
          {customer.deadline ? new Date(customer.deadline).toLocaleDateString() : 'No deadline'}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-normal relative">
            <div className="flex space-x-2">
              {(fromSection === "inProgress" ||
                fromSection === "completed" ||
                activeTab === "assignedTo") && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200"
                    onClick={() => handleActionClick("view", customer, fromSection, nextSection)}
                  >
                    <Eye size={20} />
                  </motion.button>
                  {fromSection === "inProgress" && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200"
                      onClick={() => handleActionClick("assign", customer, fromSection, nextSection)}
                    >
                      <User size={20} />
                    </motion.button>
                  )}
                </>
              )}
            </div>
          </td>
        </tr>
      );
        
      default:
        return (
          <tr
            key={customer._id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 ease-in-out"
          >
            <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-900 dark:text-gray-100">
              {index + 1}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-900 dark:text-gray-100">
              {customer.customerID}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-900 dark:text-gray-100">
              {customer.customerName}
            </td>
           
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
              {customer.whatsappNumber}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
              {customer.babyGender}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
              {customer.assignedEmployee?.firstName +
                " " +
                customer.assignedEmployee?.lastName ||
                customer.assignedEmployee?.email ||
                "Not Assigned"}
            </td>
           
            <td className="px-6 py-4 whitespace-nowrap text-sm font-normal relative">
              <div className="flex space-x-2">
                {(fromSection === "inProgress" ||
                  fromSection === "completed" ||
                  activeTab === "assignedTo") && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200"
                      onClick={() => handleActionClick("view", customer, fromSection, nextSection)}
                    >
                      <Eye size={20} />
                    </motion.button>
                    {fromSection === "inProgress" && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200"
                        onClick={() => handleActionClick("assign", customer, fromSection, nextSection)}
                      >
                        <User size={20} />
                      </motion.button>
                    )}
                  </>
                )}
              </div>
            </td>
          </tr>
        );
    }
  };

  const handleRejectConfirm = () => {
    moveCustomer(customerToReject, fromSection, "rejected");
    setRejectModalOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="overflow-x-auto rounded-lg border-gray-300 dark:border-gray-700"
    >
      <table className="min-w-full overflow-x-auto table-auto overflow-hidden rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {renderTableHeaders().map((header) => (
              <th
                key={header}
                className="px-6 py-3 text-left text-sm bg-gray-200 font-medium text-gray-900 dark:text-gray-300 capitalize tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          <AnimatePresence>
            {customers.map((customer, index) =>
              renderTableRows(customer, index)
            )}
          </AnimatePresence>
        </tbody>
      </table>

      {customers.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center p-4 py-8 text-gray-500 dark:text-gray-300"
        >
          <EmptyState />
        </motion.div>
      )}
      {rejectModalOpen && (
        <RejectConfirmationModal
          isOpen={rejectModalOpen}
          onClose={() => setRejectModalOpen(false)}
          onConfirm={handleRejectConfirm}
          customer={customerToReject}
        />
      )}
    </motion.div>
  );
};

export default CustomersTable;
