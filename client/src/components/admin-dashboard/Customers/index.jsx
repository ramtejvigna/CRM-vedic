import React, { useState, useEffect, useCallback, Fragment } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import {
  Eye,
  Check,
  X,
  MoreHorizontal,
  FileText,
  MessageCircle,
  User,
  AlignVerticalJustifyCenter,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Briefcase,
  AlertCircle,
  Clock,
  XCircle,
  Filter,
  Search,
} from "lucide-react";
import { useStore } from "../../../store"; // Assuming you have a store for dark mode
import { useNavigate } from "react-router-dom";
import CheckBoxListPage from "./CheckBoxList";
import { FaAvianex } from "react-icons/fa";
import { Dialog, Transition } from "@headlessui/react";
import { api } from "../../../utils/constants";
import CustomPagination from "./Pagination";
import {
  X as CloseIcon,
  Calendar,
  Clock as ClockIcon,
  FileText as FileIcon,
  AlertCircle as AlertCircleIcon,
  CalendarDays,
  CheckCircle2,
  XCircle as XCircleIcon,
  Clock4,
} from "lucide-react";
import Loader from "./LoadingState";
import CustomersTable from "./CustomersTable";
import CustomerModal from "./CustomerModal";
export const Customers = () => {
  const {tab, setTab} = useStore()
  console.log(tab)

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [customerData, setCustomerData] = useState({});
  const [activeTab, setActiveTab] = useState(tab || "newRequests");
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [nextSection, setNextSection] = useState("");
  const [details, setDetails] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(false);
  const [leadSource, setLeadSource] = useState("");
  const [socialMediaId, setSocialMediaId] = useState("");
  const [otherSource, setOtherSource] = useState("");
  const [feedback, setFeedback] = useState("");
  const [generatePdf, setGeneratePdf] = useState(false);
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentTime, setPaymentTime] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [reason, setReason] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [showCheckBoxList, setShowCheckBoxList] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deadline, setDeadline] = useState(null);
  const { isDarkMode } = useStore();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [selectedCustomerForAssign, setSelectedCustomerForAssign] = useState(null);

  const [filteredGender, setFilteredGender] = useState("All");
  const [filteredStatus, setFilteredStatus] = useState("All");
  const [filteredAssignedEmployee, setFilteredAssignedEmployee] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const getEmployees = async () => {
      try {
        const response = await axios.get(`${api}/api/manager/employees`);
        setEmployees(response.data.employees);
      } catch (error) {
        console.log(error.message);
      }
    };

    const getNewRequests = async () => {
      try {
        const response = await axios.get(`${api}/api/manager/newrequests`);
        setCustomerData(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error.message);
        setLoading(false);
      }
    };
    getNewRequests();
    getEmployees();
  }, []);

  const handleActionClick = (action, customer, fromSection, nextSection) => {
    switch (action) {
      case "view":
        navigate("viewDetailsIn", {
          state: {
            customerData: customer, // Pass customer data
            fromSection: fromSection, // Pass current section
            section: nextSection, // Pass section info
            activeTab: activeTab, // Pass active tab info
          },
        });
        break;
      case "assign":
        setSelectedCustomerForAssign(customer)
        setShowModal(true);
        break;
    }
  };

  const handleAssignEmployee = async () => {
    if (selectedEmployee && selectedCustomerForAssign) {
      const customerId = selectedCustomerForAssign._id;
  
      try {
        const response = await axios.put(
          `${api}/api/manager/assign/${customerId}/to/${selectedEmployee._id}`,
        );
  
        if (response.status === 200) {
          toast.success("Customer successfully assigned to employee");
          setShowModal(false);
          setActiveTab("assignedTo");
          setTab("assignedTo");
          // Refresh the customer data after successful assignment
          getNewRequests(); // Call the function again to refresh the data
          // Optionally, filter out the assigned customer from the "In Progress" tab data here
          setCustomerData(prevData => {
            return {
              ...prevData,
              // Assuming the 'inProgress' section is part of the customer data and you want to exclude assigned customers
              inProgress: prevData.inProgress.filter(customer => customer._id !== customerId),
            };
          });
        }
      } catch (error) {
        console.error("Error assigning employee:", error);
        toast.error("Failed to assign employee, please try again.");
      }
    } else {
      toast.error("Please select both an employee and a customer.");
    }
  };
  
  // Reloading the customer data function
  const getNewRequests = async () => {
    try {
      const response = await axios.get(`${api}/api/manager/newrequests`);
      setCustomerData(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  };
  
  // Optionally, add a "Refresh" button to manually trigger a reload of data
  const handleRefreshData = () => {
    setLoading(true);
    getNewRequests();
  };
  
  const moveCustomer = (customer, fromSection, toSection, details) => {
    const updatedCustomer = { ...customer, additionalDetails: details };

    if (toSection === "inProgress") {
      if (!paymentDate || !paymentTime || !amountPaid || !transactionId || !deadline) {
        alert("Please enter all payment details before moving to In Progress.");
        return;
      }
      updatedCustomer.paymentStatus = paymentStatus;
      updatedCustomer.customerStatus = "inProgress";
      updatedCustomer.paymentDate = paymentDate;
      updatedCustomer.paymentTime = paymentTime;
      updatedCustomer.amountPaid = amountPaid;
      updatedCustomer.transactionId = transactionId;
      updatedCustomer.leadSource = leadSource;
      updatedCustomer.socialMediaId = socialMediaId;
      updatedCustomer.deadline = deadline;
    } else if (toSection === "completed") {
      updatedCustomer.feedback = feedback;
      updatedCustomer.customerStatus = "completed";
    } else if (toSection === "newRequests") {
      updatedCustomer.feedback = "";
      updatedCustomer.paymentStatus = paymentStatus;
      updatedCustomer.customerStatus = "newRequests";
    } else if (toSection === "rejected") {
      updatedCustomer.customerStatus = "rejected";
    }

    setCustomerData((prevData) => ({
      ...prevData,
      [fromSection]: prevData[fromSection].filter(
        (c) => c._id !== customer._id
      ),
      [toSection]: [...prevData[toSection], updatedCustomer],
    }));

    axios
      .put(`${api}/customers/${customer._id}`, updatedCustomer)
      .then(() => toast.success("Customer moved successfully"))
      .catch((error) => {
        console.error("Error moving customer:", error);
        toast.error("Failed to move customer, please try again.");
      });
  };

  const handleAccept = useCallback(() => {
    if (selectedCustomer) {
      if (activeTab === "newRequests" && nextSection === "inProgress") {
        if (
          !paymentDate ||
          !paymentTime ||
          !amountPaid ||
          !transactionId ||
          !leadSource ||
          !deadline
        ) {
          alert(
            "Please enter all payment details before moving to In Progress."
          );
          return;
        }
      }
      moveCustomer(selectedCustomer, activeTab, nextSection, details);
      setShowModal(false);
      toast.success("Successfully accepted customer")
    }
  }, [
    selectedCustomer,
    paymentDate,
    paymentTime,
    nextSection,
    details,
    activeTab,
    amountPaid,
    transactionId,
    paymentStatus,
    leadSource,
    socialMediaId,
    deadline
  ]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
    setPage(0); // Reset to first page when searching
  };

  const handleGenderChange = (event) => {
    setFilteredGender(event.target.value);
    setPage(0); // Reset to first page when filter changes
  };

  const handleStatusChange = (event) => {
    setFilteredStatus(event.target.value);
    setPage(0); // Reset to first page when filter changes
  };

  const handleAssignedEmployeeChange = (event) => {
    setFilteredAssignedEmployee(event.target.value);
    setPage(0); // Reset to first page when filter changes
  };

  const handleChangePage = (newPage) => setPage(newPage);

  const handleRowsPerPageChange = (val) => {
    setRowsPerPage(val);
    setPage(0);
  };

  const filteredData = Object.values(customerData).flat().filter((row) => {
    const genderMatch = filteredGender === "All" || row.babyGender === filteredGender;
    const statusMatch = filteredStatus === "All" || row.customerStatus === filteredStatus;
    const employeeMatch = filteredAssignedEmployee === "All" || row.assignedEmployeeName === filteredAssignedEmployee;
    const searchMatch =
      row.fatherName?.toLowerCase().includes(searchTerm) ||
      row.customerID?.toLowerCase().includes(searchTerm) ||
      row.whatsappNumber?.toLowerCase().includes(searchTerm) ||
      row.babyGender?.toLowerCase().includes(searchTerm) ||
      row.assignedEmployeeName?.toLowerCase().includes(searchTerm) ||
      row.customerStatus?.toLowerCase().includes(searchTerm);

    return genderMatch && statusMatch && employeeMatch && searchMatch;
  });

  const activeTabData = customerData[`${activeTab}`] || [];
  const paginatedData = activeTabData.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const renderContent = () => {
    switch (activeTab) {
      case "newRequests":
        return (
          <AnimatePresence>
          <CustomersTable
            customers={paginatedData}
            fromSection="newRequests"
            nextSection="inProgress"
            handleActionClick={handleActionClick}
            moveCustomer={moveCustomer}
            activeTab={activeTab}
            setSelectedCustomer={setSelectedCustomer}
            setNextSection={setNextSection}
            setShowModal={setShowModal}
            setPaymentStatus={setPaymentStatus}
            setSelectedCustomerForAssign={setSelectedCustomerForAssign}
            setActiveDropdown={setActiveDropdown}
            activeDropdown={activeDropdown}
            isDarkMode={isDarkMode}
          />
          </AnimatePresence>
        );
      case "inProgress":
        return (
          <AnimatePresence>
          <CustomersTable
            customers={paginatedData}
            fromSection="inProgress"
            nextSection="completed"
            handleActionClick={handleActionClick}
            moveCustomer={moveCustomer}
            activeTab={activeTab}
            setSelectedCustomer={setSelectedCustomer}
            setNextSection={setNextSection}
            setShowModal={setShowModal}
            setPaymentStatus={setPaymentStatus}
            setSelectedCustomerForAssign={setSelectedCustomerForAssign}
            setActiveDropdown={setActiveDropdown}
            activeDropdown={activeDropdown}
            isDarkMode={isDarkMode}
          />
          </AnimatePresence>
        );
      case "assignedTo":
        return (
          <AnimatePresence>
          <CustomersTable
            customers={paginatedData}
            fromSection="assignTo"
            nextSection="completed"
            handleActionClick={handleActionClick}
            moveCustomer={moveCustomer}
            activeTab={activeTab}
            setSelectedCustomer={setSelectedCustomer}
            setNextSection={setNextSection}
            setShowModal={setShowModal}
            setPaymentStatus={setPaymentStatus}
            setSelectedCustomerForAssign={setSelectedCustomerForAssign}
            setActiveDropdown={setActiveDropdown}
            activeDropdown={activeDropdown}
            isDarkMode={isDarkMode}
          />
          </AnimatePresence>
        );
      case "completed":
        return (
          <motion.div>
          <AnimatePresence>
          <CustomersTable
            customers={paginatedData}
            fromSection="completed"
            nextSection="inProgress"
            handleActionClick={handleActionClick}
            moveCustomer={moveCustomer}
            activeTab={activeTab}
            setSelectedCustomer={setSelectedCustomer}
            setNextSection={setNextSection}
            setShowModal={setShowModal}
            setPaymentStatus={setPaymentStatus}
            setSelectedCustomerForAssign={setSelectedCustomerForAssign}
            setActiveDropdown={setActiveDropdown}
            activeDropdown={activeDropdown}
            isDarkMode={isDarkMode}
          />
          </AnimatePresence>
          </motion.div>
        );
      case "rejected":
        return (
          <AnimatePresence>
          <CustomersTable
            customers={paginatedData}
            fromSection="rejected"
            nextSection="newRequests"
            handleActionClick={handleActionClick}
            moveCustomer={moveCustomer}
            activeTab={activeTab}
            setSelectedCustomer={setSelectedCustomer}
            setNextSection={setNextSection}
            setShowModal={setShowModal}
            setPaymentStatus={setPaymentStatus}
            setSelectedCustomerForAssign={setSelectedCustomerForAssign}
            setActiveDropdown={setActiveDropdown}
            activeDropdown={activeDropdown}
            isDarkMode={isDarkMode}
          />
          </AnimatePresence>
        );
      default:
        return null;
    }
  };

  const newRequestsCount = Array.isArray(customerData["newRequests"])
    ? customerData["newRequests"].length
    : 0;
  const inProgressCount = Array.isArray(customerData["inProgress"])
    ? customerData["inProgress"].length
    : 0;
  const assignedCount = Array.isArray(customerData["assignedTo"])
    ? customerData["assignedTo"].length
    : 0;

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

  const totalPages = Math.ceil(activeTabData.length / rowsPerPage);

  // Reset pagination when tab changes
  useEffect(() => {
    setPage(0);
  }, [activeTab]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen p-4 sm:p-8 ${isDarkMode ? "bg-gray-900" : ""}`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col mb-4">
          <h1 className="text-3xl font-bold text-slate-600 mb-3">Customer Management</h1>
        </div>

        <div className="flex p-2 mb-6 justify-center space-x-2 overflow-x-auto">
          {[
            "newRequests",
            "inProgress",
            "assignedTo",
            "completed",
            "rejected",
          ].map((tab) => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setActiveTab(tab);
                setTab(tab)

              }}
              className={`relative px-4 py-2 text-sm rounded-lg transition-colors duration-150 ease-in-out ${
                activeTab === tab
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {tab.charAt(0).toUpperCase() +
                tab.slice(1).replace(/([A-Z])/g, " $1")}
              {tab === "newRequests" && newRequestsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-xs text-white p-1 px-2 rounded-full">
                  {newRequestsCount}
                </span>
              )}
              {tab === "inProgress" && inProgressCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-xs text-white p-1 px-2 rounded-full">
                  {inProgressCount}
                </span>
              )}
              {tab === "assignedTo" && assignedCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-xs text-white p-1 px-2 rounded-full">
                  {assignedCount}
                </span>
              )}
            </motion.button>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-visible"
        >
          {loading ? <Loader /> : renderContent()}
        </motion.div>
      </div>

      <CustomerModal
        showModal={showModal}
        setShowModal={setShowModal}
        activeTab={activeTab}
        selectedCustomer={selectedCustomer}
        employees={employees}
        selectedEmployee={selectedEmployee}
        setSelectedEmployee={setSelectedEmployee}
        handleAssignEmployee={handleAssignEmployee}
        handleAccept={handleAccept}
        paymentDate={paymentDate}
        setPaymentDate={setPaymentDate}
        paymentTime={paymentTime}
        setPaymentTime={setPaymentTime}
        amountPaid={amountPaid}
        setAmountPaid={setAmountPaid}
        transactionId={transactionId}
        setTransactionId={setTransactionId}
        leadSource={leadSource}
        setLeadSource={setLeadSource}
        socialMediaId={socialMediaId}
        setSocialMediaId={setSocialMediaId}
        otherSource={otherSource}
        setOtherSource={setOtherSource}
        deadline={deadline}
        setDeadline={setDeadline}
        reason={reason}
        setReason={setReason}
        isDarkMode={isDarkMode}
      />

      {showCheckBoxList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md"
          >
            <CheckBoxListPage
              selectedCustomer={selectedCustomer}
              handleClose={handleClose}
            />
          </motion.div>
        </div>
      )}
    <CustomPagination
          totalItems={activeTabData.length}
          itemsPerPage={rowsPerPage}
          currentPage={page}
        onPageChange={handleChangePage}
        onItemsPerPageChange={handleRowsPerPageChange}
        isDarkMode={isDarkMode}
    />
    <ToastContainer />
    </div>
  );
};

export default Customers;

