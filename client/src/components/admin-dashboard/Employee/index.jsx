import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AiOutlineUserAdd } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Trash, Eye } from "lucide-react";
import { useStore } from "../../../store";
import { GET_ALL_EMPLOYEES } from "../../../utils/constants";

const EmployeeTable = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(GET_ALL_EMPLOYEES);
      if (!res.ok) throw new Error("Failed to fetch employees");
      const data = await res.json();
      console.log(data.employees)
      setEmployees(data.employees);
    } catch (error) {
      toast.error("Error fetching employees!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEmployee = () => navigate("add-employee");
  const handleEdit = (id) => navigate(`edit-employee/${id}`);
  const handleView = (id) => navigate(`view-employee/${id}`);
  const handleDelete = (id) => navigate(`delete-employee/${id}`);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = employees.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(employees.length / recordsPerPage);

  const getStatusColor = (isOnline) =>
    isOnline
      ? `${isDarkMode ? "bg-green-800 text-green-100" : "bg-green-100 text-green-800"}`
      : `${isDarkMode ? "bg-red-800 text-red-100" : "bg-red-100 text-red-800"}`;

  const renderPaginationButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`relative inline-flex items-center px-4 py-2 border ${
            isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-white"
          } text-sm font-medium text-gray-500 hover:bg-gray-50 ${
            currentPage === i ? "bg-blue-500 text-white" : ""
          }`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <div
      className={`min-h-screen py-8 px-4 transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Employee Management</h1>
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddEmployee}
              className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
            >
              <AiOutlineUserAdd size={20} />
              <span>Add Employee</span>
            </motion.button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <TableContainer className="flex-1" sx={{ marginTop: "30px" }}>
            <Table sx={{ minWidth: 700 }} aria-label="employee table">
              <TableHead>
                <TableRow>
                  <TableCell>Employee Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentRecords.map((employee) => (
                  <TableRow key={employee._id}>
                    {/* Avatar and Name */}
                    <TableCell component="th" scope="row">
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Avatar />
                        <div style={{ marginLeft: 10 }}>
                          <Typography variant="body1" fontWeight="bold">
                            {employee.firstName}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {employee.email}
                          </Typography>
                        </div>
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      {employee?.status ? (
                        <span
                          style={{
                            padding: "4px 8px",
                            borderRadius: "12px",
                            color: "#fff",
                            backgroundColor: "#4caf50",
                          }}
                        >
                          Online
                        </span>
                      ) : (
                        <span
                          style={{
                            padding: "4px 8px",
                            borderRadius: "12px",
                            color: "#fff",
                            backgroundColor: "black",
                          }}
                        >
                          Offline
                        </span>
                      )}
                    </TableCell>

                    {/* Phone */}
                    <TableCell>{employee.phone}</TableCell>

                    {/* Actions */}
                    <TableCell className="space-x-1">
                      <Button onClick={() => handleEdit(employee._id)} variant="outlined" size="small" color="primary">
                        Edit
                      </Button>
                      <Button onClick={() => handleView(employee._id)} variant="outlined" size="small" color="primary">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Pagination */}
        <ul className="flex items-center p-5 gap-5">{renderPaginationButtons()}</ul>
      </div>
    </div>
  );
};

export default EmployeeTable;