import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Filter, X, ChevronDown, Search, CheckCircle, XCircle, Eye, Check, XOctagon } from "lucide-react";
import { CircularProgress } from "@mui/material";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import LeaveRequestTable from "./Table";

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
      if(activeTab === 'pending')
      {
        setPendingCount(response.data.totalLeaves)

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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  console.log(pendingCount)
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
        {activeTab === "pending"
          ? "There are no pending leave requests to review at the moment."
          : "No completed leave requests found for the selected filters."}
      </p>
    </motion.div>
  );

  const DetailModal = () => (
    <Transition show={isDetailModalOpen} as={Fragment}>
      <Dialog
        onClose={() => setIsDetailModalOpen(false)}
        className="relative z-50"
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
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-2xl bg-white rounded-2xl p-6 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <Dialog.Title className="text-2xl font-bold">
                  Leave Request Details
                </Dialog.Title>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {selectedLeave && (
                <div className="space-y-4">
                  <DetailRow
                    label="Employee"
                    value={selectedLeave.employee.firstName}
                  />
                  <DetailRow
                    label="Leave Type"
                    value={selectedLeave.leaveType}
                  />
                  <DetailRow
                    label="From"
                    value={new Date(
                      selectedLeave.startDate
                    ).toLocaleDateString()}
                  />
                  <DetailRow
                    label="To"
                    value={new Date(selectedLeave.endDate).toLocaleDateString()}
                  />
                  <DetailRow label="Reason" value={selectedLeave.reason} />

                  {activeTab === "pending" && (
                    <div className="flex justify-end gap-4 pt-4 border-t mt-6">
                      <button
                        onClick={() => {
                          setConfirmationAction("Approved");
                          setIsConfirmModalOpen(true);
                        }}
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          setConfirmationAction("Rejected");
                          setIsConfirmModalOpen(true);
                        }}
                        className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        <XOctagon className="w-4 h-4 mr-2" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              )}
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );

  const DetailRow = ({ label, value }) => (
    <div>
      <div className="text-sm font-medium text-gray-500">{label}</div>
      <div className="mt-1 text-gray-900">{value}</div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Leave Management</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
        >
          <Filter className="w-4 h-4" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>
      <div className="flex gap-4 mb-6">
       
      <button
    key="pending"
    onClick={() => setActiveTab('pending')}
    className={`relative px-6 py-3 rounded-lg font-medium ${
      activeTab == 'pending'
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`}
  >
    Pending Requests
    {activeTab === activeTab && pendingCount > 0 && (
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
        {pendingCount}
      </span>
    )}
  </button>

  {/* Completed Requests Tab */}
  <button
    key="completed"
    onClick={() => setActiveTab('completed')}
    className={`relative px-6 py-3 rounded-lg font-medium ${
      activeTab === 'completed'
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`}
  >
    Completed Requests
  </button>
  {/* <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="employee"
                    value={filters.employee}
                    onChange={handleFilterChange}
                    placeholder="Enter employee name..."
                    className="w-full p-2 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
       */}
      </div>
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Date Range
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      name="startDate"
                      value={filters.startDate || ""}
                      onChange={(e) =>
                        handleFilterDateChange("startDate", e.target.value)
                      }
                      className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="relative flex-1">
                    <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      name="endDate"
                      value={filters.endDate || ""}
                      onChange={(e) =>
                        handleFilterDateChange("endDate", e.target.value)
                      }
                      className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block ml-[30px] text-sm font-medium text-gray-700">
                  Leave Type
                </label>
                <div className="relative w-[300px] ml-[30px]">
                  <select
                    name="leaveType"
                    value={filters.leaveType}
                    onChange={handleFilterChange}
                    className="w-full p-2 border rounded-lg appearance-none pl-4 pr-10 focus:ring-2 focus:ring-blue-500"
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
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <div className="relative">
                  <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="w-full p-2 border rounded-lg appearance-none pl-4 pr-10 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Statuses</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Search Employee
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="employee"
                    value={filters.employee}
                    onChange={handleFilterChange}
                    placeholder="Enter employee name..."
                    className="w-full p-2 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
            setSelectedLeave={setSelectedLeave}
            setIsDetailModalOpen={setIsDetailModalOpen}
            setConfirmationAction={setConfirmationAction}
            setIsConfirmModalOpen={setIsConfirmModalOpen}
          />
        </motion.div>
      )}

      {/* Confirmation Modal */}
      <Transition show={isConfirmModalOpen} as={Fragment}>
        <Dialog
          onClose={() => setIsConfirmModalOpen(false)}
          className="relative z-50"
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
            <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl">
                <Dialog.Title className="text-xl font-semibold text-gray-900 mb-4">
                  Confirm Action
                </Dialog.Title>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to {confirmationAction?.toLowerCase()}{" "}
                  this leave request?
                </p>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={async () => {
                      try {
                        await axios.put(
                          `http://localhost:3000/admin/leaves/${selectedLeave._id}`,
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
                    className={`px-4 py-2 rounded-lg text-white ${
                      confirmationAction === "Approved"
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setIsConfirmModalOpen(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Detail Modal */}
      <DetailModal />
    </div>
  );
};

export default Leaves;
