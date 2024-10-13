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
                    <div className='h-full flex items-center justify-center'>
                        <div className="w-10 h-10 border-gray-500 border-t-black border-[3px] animate-spin rounded-full" />
                    </div>
                ) : (
                    <TableContainer className='flex-1' sx={{ marginTop: '30px' }}>
                        <Table sx={{ minWidth: 700 }} aria-label="employee table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Employee Name</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>phone</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {records.map((employee) => (
                                    <TableRow key={employee._id}>
                                        {/* Avatar and Name */}
                                        <TableCell component="th" scope="row">
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <Avatar>

                                                </Avatar>
                                                <div style={{ marginLeft: 10 }}>
                                                    <Typography variant="body1" fontWeight="bold">{employee.name}</Typography>
                                                    <Typography variant="body2" color="textSecondary">{employee.email}</Typography>
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* Status */}
                                        <TableCell>
                                            {employee?.status ? 
                                            <span style={{
                                                padding: '4px 8px',
                                                borderRadius: '12px',
                                                color: '#fff',
                                                backgroundColor: '#4caf50'
                                            }}>
                                                {"Online"}
                                            </span> :
                                            <span style={{
                                                padding: '4px 8px',
                                                borderRadius: '12px',
                                                color: '#fff',
                                                backgroundColor: 'black'
                                            }}>
                                                {"Offline"}
                                            </span>
                                            }
                                        </TableCell>

                                        {/* Employed Phone */}
                                        <TableCell>{employee.phone}</TableCell>

                                        {/* Edit Action */}
                                        <TableCell className='space-x-1'>
                                            <Button onClick={() => navigate(`edit-employee/${employee._id}`)} variant="outlined" size="small" color="primary">
                                                Edit
                                            </Button>
                                            <Button onClick={() => navigate(`view-employee/${employee._id}`)} variant="outlined" size="small" color="primary">
                                                view
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )
                }

                {/* page nation */}
                <ul className='flex items-center p-5 gap-5'>
                    <li onClick={handlePrev} className={`${currentPage == 1 ? "hidden" : " bg-blue-500 text-white"} link cursor-pointer p-2 text-base px-5 rounded-xl`}>
                        <a href="#"> Prev </a>
                    </li>
                    <li className='flex-1 flex overflow-x-scroll scrollbar-hide gap-1'>
                        {
                            numbers.map((n, i) => (
                                <a onClick={() => handleChangeCPage(n)} className={`${currentPage == n ? "bg-blue-500 text-white" : "border-blue-500 border text-blue-500"} text-sm  rounded-full p-2 px-4`} href="#">{n}</a>
                            ))
                        }
                    </li>
                    <li onClick={handleNext} className={`${currentPage == npages ? "hidden" : " bg-blue-500 text-white"} link cursor-pointer p-2 text-base px-5 rounded-xl `}>
                        <a href="#"> Next </a>
                    </li>
                </ul>
            </div>
        </div>
    );
}
