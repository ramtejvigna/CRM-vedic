import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, Transition } from "@headlessui/react";
import { X as CloseIcon } from "lucide-react";

const CustomerModal = ({
  showModal,
  setShowModal,
  activeTab,
  selectedCustomer,
  employees,
  selectedEmployee,
  setSelectedEmployee,
  handleAssignEmployee,
  handleAccept,
  paymentDate,
  setPaymentDate,
  paymentTime,
  setPaymentTime,
  amountPaid,
  setAmountPaid,
  transactionId,
  setTransactionId,
  leadSource,
  setLeadSource,
  socialMediaId,
  setSocialMediaId,
  otherSource,
  setOtherSource,
  deadline,
  setDeadline,
  reason,
  setReason,
  isDarkMode,
}) => {
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
      },
    },
  };

  return (
    <AnimatePresence>
      {showModal && (
        <Transition appear show={showModal} as={React.Fragment}>
          <Dialog as="div" className="relative z-50" onClose={() => setShowModal(false)}>
            <Transition.Child
              as={React.Fragment}
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
                  as={React.Fragment}
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
                      className={`p-6 ${isDarkMode ? "bg-slate-800" : "bg-white"} shadow-xl`}
                    >
                      <div className="relative">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setShowModal(false)}
                          className={`absolute right-0 top-0 p-1.5 rounded-full ${
                            isDarkMode
                              ? "hover:bg-slate-700 text-slate-400 hover:text-slate-200"
                              : "hover:bg-slate-100 text-slate-500 hover:text-slate-700"
                          } transition-colors`}
                        >
                          <CloseIcon className="w-5 h-5" />
                        </motion.button>

                        <Dialog.Title
                          className={`text-xl font-semibold mb-6 ${
                            isDarkMode ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {activeTab === "rejected"
                            ? "Reason for Accepting"
                            : activeTab === "inProgress"
                            ? "Employees"
                            : "Payment Details"}
                        </Dialog.Title>

                        {activeTab === "newRequests" && (
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm ml-1 font-medium text-gray-700">
                                Payment Date
                              </label>
                              <input
                                type="date"
                                required
                                value={paymentDate}
                                onChange={(e) => setPaymentDate(e.target.value)}
                                className="w-full mt-1 p-2 border rounded dark:bg-gray-700 dark:text-white"
                              />
                            </div>

                            <div>
                              <label className="text-sm ml-1 font-medium text-gray-700">
                                Payment Time
                              </label>
                              <input
                                type="time"
                                required
                                value={paymentTime}
                                onChange={(e) => setPaymentTime(e.target.value)}
                                className="w-full mt-1 p-2 border rounded dark:bg-gray-700 dark:text-white"
                              />
                            </div>

                            <input
                              type="text"
                              required
                              value={amountPaid}
                              onChange={(e) => setAmountPaid(e.target.value)}
                              placeholder="Amount Paid"
                              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                            />
                            <input
                              type="text"
                              required
                              value={transactionId}
                              onChange={(e) => setTransactionId(e.target.value)}
                              placeholder="Transaction ID"
                              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                            />

                            <p className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              Requested on:
                              <span className="ml-2 text-gray-500 dark:text-gray-400">
                                {selectedCustomer?.createdDateTime &&
                                  new Date(selectedCustomer.createdDateTime).toLocaleString()}
                              </span>
                            </p>
                            <div>
                              <label className="text-sm ml-1 font-medium text-gray-700">
                                Deadline
                              </label>
                              <input
                                type="date"
                                required
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                className="w-full p-3 mt-1 border rounded dark:bg-gray-700 dark:text-white"
                              />
                            </div>

                            <div className="relative">
                              <div className="flex items-center space-x-2 mb-2">
                                <label className="text-sm font-medium text-gray-700">
                                  Lead Source
                                </label>
                              </div>
                              <select
                                value={leadSource}
                                onChange={(e) => setLeadSource(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                              >
                                <option value="">Select Lead Source</option>
                                <option value="Instagram 1">Instagram 1</option>
                                <option value="Instagram 2">Instagram 2</option>
                                <option value="Facebook">Facebook</option>
                                <option value="Whatsapp">Whatsapp</option>
                                <option value="Meta Ads">Meta Ads</option>
                                <option value="Google Ads">Google Ads</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                            {(leadSource === "Instagram 1" ||
                              leadSource === "Instagram 2" ||
                              leadSource === "Facebook") && (
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="relative"
                              >
                                <div className="flex items-center space-x-2 mb-2">
                                  <label className="text-sm font-medium text-gray-700">
                                    {leadSource} ID
                                  </label>
                                </div>
                                <input
                                  type="text"
                                  value={socialMediaId}
                                  onChange={(e) => setSocialMediaId(e.target.value)}
                                  placeholder={`Enter your ${leadSource} ID`}
                                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                                />
                              </motion.div>
                            )}
                            {leadSource === "Other" && (
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="relative"
                              >
                                <div className="flex items-center space-x-2 mb-2">
                                  <label className="text-sm font-medium text-gray-700">
                                    Please specify the source
                                  </label>
                                </div>
                                <input
                                  type="text"
                                  value={otherSource}
                                  onChange={(e) => setOtherSource(e.target.value)}
                                  placeholder="Please specify where you heard about us"
                                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                                />
                              </motion.div>
                            )}
                          </div>
                        )}
                        {activeTab === "inProgress" && (
                          <div className="space-y-4">
                            <div className="w-full flex flex-col gap-1 min-h-[300px] max-h-[300px] overflow-y-scroll">
                              {employees.map((employee, index) => (
                                <label htmlFor={`employee-${index}`}>
                                  <div className="w-full p-1 flex gap-3 items-center cursor-pointer hover:bg-gray-100 ">
                                    <input
                                      type="radio"
                                      name="employeeSelection"
                                      id={`employee-${index}`}
                                      checked={selectedEmployee === employee}
                                      onChange={() => setSelectedEmployee(employee)}
                                    />
                                    <div className="avatar bg-gray-500 rounded-full w-10 h-10 text-white flex items-center justify-center ">
                                      {employee.firstName[0].toUpperCase()}
                                    </div>
                                    <div className="flex flex-col">
                                      {employee.firstName}
                                      <small className="text-[.7em] font-thin text-opacity-45">
                                        {employee.email}
                                      </small>
                                    </div>
                                  </div>
                                </label>
                              ))}
                            </div>
                            {/* <div>
                              <label className="text-sm ml-1 font-medium text-gray-700">
                                Deadline
                              </label>
                              <input
                                type="date"
                                required
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                className="w-full p-3 mt-1 border rounded dark:bg-gray-700 dark:text-white"
                              />
                            </div> */}
                          </div>
                        )}
                        {activeTab === "completed" && (
                          <div className="space-y-4">
                            <p className="text-gray-600 dark:text-gray-300">
                              {selectedCustomer?.email}
                            </p>
                            <p className="text-gray-600 dark:text-gray-300">
                              Payment Date & Time:{" "}
                              {new Date(selectedCustomer?.paymentDate).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}{" "}
                              - {selectedCustomer?.paymentTime}
                            </p>
                            <p className="text-gray-600 dark:text-gray-300">
                              Preferred God : {selectedCustomer?.preferredGod}
                            </p>
                            <p className="text-gray-600 dark:text-gray-300">
                              Given Feedback : {selectedCustomer?.feedback}
                            </p>
                            <button
                              className="p-2 px-4 bg-yellow-500 bg-opacity-80 rounded-lg my-10"
                              onClick={() =>
                                moveCustomer(selectedCustomer, "completed", "inProgress")
                              }
                            >
                              Move to In Progress
                            </button>
                          </div>
                        )}
                        {activeTab === "rejected" && (
                          <div className="space-y-4">
                            <input
                              type="text"
                              required
                              value={reason}
                              onChange={(e) => setReason(e.target.value)}
                              placeholder="Reason for Acceptance"
                              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                        )}

                        <div className="mt-10">
                          <button
                            onClick={
                              activeTab == "inProgress"
                                ? handleAssignEmployee
                                : handleAccept
                            }
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => {
                              setShowModal(false);
                              setSelectedCustomerForAssign(null);
                            }}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded ml-2"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}
    </AnimatePresence>
  );
};

export default CustomerModal;
