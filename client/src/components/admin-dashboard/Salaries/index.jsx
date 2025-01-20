import React, { useEffect, useState } from 'react'
import { useStore } from '../../../store';
import { AnimatePresence , motion } from 'framer-motion';
import { Delete, Edit , Eye, Plus, Trash } from 'lucide-react';
import { TextField , InputLabel, CircularProgress, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import axios from 'axios';
import {AiOutlineUpload , AiOutlineDelete , AiOutlineClose, AiOutlineDownload, AiOutlinePrinter} from "react-icons/ai"
import { ADD_SALARY_STATEMENT, GET_ALL_SALARIES, HOST } from '../../../utils/constants';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Upload, User, Users, Filter  } from 'lucide-react';
import {AiOutlineAlipay} from "react-icons/ai"
import noImage from "../../../assets/noimage.jpg"
import noData from "../../../assets/nodata.jpg"
function Salaries() {
  const navigate = useNavigate();
  const [isLoading , setIsLoading] = useState(false);
  const [showFilters , setShowFilters] = useState(false);
  const [showDeleteCard , setShowDeleteCard] = useState(false);
  const [selectedEventId , setSelectedEventId] = useState(null);
  const { isDarkMode, toggleDarkMode } = useStore();
  const [image , setImage] = useState(false);
  const [filteringYear , setFilteringYear] = useState("")
  const [filteringMonth , setFilteringMonth] = useState("")
  const [currentPage , setCurrentPage ] = useState(1)
  const recordsPerPage = 6
  const [searchTerm , setSearchTerm] = useState("")
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Generate years from 1950 to 10 years ahead of the current year
  const currentYear = new Date().getFullYear();
  const startYear = 2010;
  const endYear = currentYear;
  const years = [];
  
  for (let year = endYear; year >= startYear; year--) {
    years.push(''+ year);
  }

  const [salaryStatements , setSalaryStatements] = useState([]);


  const fetchSalries = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(GET_ALL_SALARIES);
      const data = await response.json()
      setSalaryStatements(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
      fetchSalries();
  } , [])


  const handleDelete = async () => {
    if(selectedEventId) {
      try {
        const response = await axios.delete(`${HOST}/salaries/delete/${selectedEventId}`);
        if(response.status === 200) {
          toast.success("Salary statement deleted successfully")
          setShowDeleteCard(false);
        }

        fetchSalries();
        
      } catch (error) {
        console.error("Error deletion salary statement:", error.message);
        toast.error("Error deletion salary statement")
      }
    }
  }



  const filterData = async () => {

    if(filteringYear || filteringMonth && (filteringMonth !== "search" && filteringYear !== "search")) {
        try {
          setIsLoading(true);
          const response = await axios.post(`${HOST}/salaries/filter?month=${filteringMonth}&year=${filteringYear}` , {});
          if(response.status === 200) {
            setSalaryStatements(response.data);
            setIsLoading(false)
          }

        } catch (error) {
          setIsLoading(false);
        }
    }
  }

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = salaryStatements?.slice(indexOfFirstRecord, indexOfLastRecord) || [];
  const totalPages = Math.ceil(salaryStatements.length / recordsPerPage);


  
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
            currentPage === i ? "bg-blue-500 text-black" : ""
          }`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };
  
  const downloadImage = (base64String) => {
    const link = document.createElement('a');
    link.href = `data:image/jpeg;base64,${base64String}`;
    link.download = 'bank_statement.jpg'; // Name of the downloaded file
    link.click();
};
  
  
const printImage = (base64String) => {
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
      <html>
          <head>
              <title>Print Image</title>
          </head>
          <body>
              <img src="data:image/jpeg;base64,${base64String}" style="max-width:100%;"/>
          </body>
      </html>
  `);
  printWindow.document.close();
  printWindow.print();
};

const SalaryStatementComponent = ({ bankStatement }) => {
  return (
      <div>
          <h2>Bank Statement</h2>
          {bankStatement && (
              <div>
                  <img 
                      src={`data:image/jpeg;base64,${bankStatement}`} 
                      alt="Bank Statement" 
                      style={{ maxWidth: '100%', height: 'auto' }} 
                  />
                  <button onClick={() => downloadImage(bankStatement)}>Download Image</button>
                  <button onClick={() => printImage(bankStatement)}>Print Image</button>
              </div>
          )}
      </div>
  );
};


  useEffect(() => {
    filterData();
  } , [filteringMonth , filteringYear]);

  
  useEffect(() => {
    if(searchTerm) {
      const filteredData = salaryStatements.filter((statement) => (statement.employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || statement.employee.lastName.toLowerCase().includes(searchTerm.toLowerCase())) )
      setSalaryStatements(filteredData);
    }else {
      fetchSalries();
    }
  } , [searchTerm]);

  return isLoading ? (
      <div className="h-full w-full flex items-center justify-center">
        <CircularProgress/>
      </div>
  ) :  (
    <div className='flex p-8 h-full w-full items-center flex-col gap-5'>
        <h1 className="text-4xl font-bold mb-10 w-full max-w-7xl">Salaries</h1>
        
        <div className="mb-6 w-full max-w-7xl flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search Names"
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                        />
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                    <motion.button
                        onClick={() => setShowFilters((prev) => !prev)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 rounded-lg bg-blue-500 text-white transition duration-300"
                    >
                        <Filter className="h-5 w-5 inline-block mr-2" />
                        Filters
                    </motion.button>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-500 flex gap-2 items-center justify-center text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition duration-300"
                >
                  <Link className='flex gap-2 items-center justify-center' to={"/admin-dashboard/salaries/add-salaries"}>
                    <Plus/> <span>Add Salary</span>
                  </Link>
                </motion.button>
        </div>

          <AnimatePresence>
            {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 70, opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="flex w-full max-w-7xl  bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden"
                  >
                    <form className="flex w-full  flex-wrap p-4 py-3">
                      <div className="flex gap-x-5 items-center min-w-[250px]">
                        <label htmlFor="month" className="text-gray-700 font-medium">
                          Month:
                        </label>
                        <select
                          value={filteringMonth}
                          onChange={(e) => setFilteringMonth(e.target.value)}
                          id="month"
                          name="month"
                          className="transition cursor-pointer duration-200 border border-gray-300 bg-gray-50 text-gray-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:ring-offset-white hover:shadow-md"
                        >
                          <option value="select month">Select Month</option>
                          {months.map((month, index) => (
                            <option key={index} value={month}>
                              {month}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex gap-x-5 items-center justify-center min-w-[250px]">
                        <label htmlFor="year" className="text-gray-700 font-medium">
                          Year:
                        </label>
                        <select
                          value={filteringYear}
                          onChange={(e) => setFilteringYear(e.target.value)}
                          id="year"
                          name="year"
                          className="transition cursor-pointer duration-200 border border-gray-300 bg-gray-50 text-gray-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:ring-offset-white hover:shadow-md"
                        >
                          <option value="select year">Select Year</option>
                          {years.map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </div>
                    </form>
                  </motion.div>
              )
            }
          </AnimatePresence>



            <div className="flex w-full max-w-7xl flex-col items-center">
              <div className="overflow-x-auto w-full max-w-7xl">
                  {currentRecords.length === 0 ? (
                        <div className='h-full w-full flex flex-col gap-5 items-center justify-center'>
                            <span className='font-bold tracking-wider text-2xl'>No data found</span>
                            <div className='h-72 w-72'> 
                              <img src={noData} className='object-cover' alt="no data" />
                            </div>
                        </div>       
                  ) : (
                        <table className="w-full">
                          <thead
                            className={`${
                              isDarkMode ? "bg-gray-700" : "bg-gray-200"
                            }`}
                          >
                          <tr>
                              {["s no", "Employee name", "Amount paid", "year", "month", "Bank Statement", "Actions"].map((header) => (
                                <th
                                  key={header}
                                  className={`px-6 py-3 text-xs font-medium capitalize tracking-wider ${
                                    isDarkMode ? "text-gray-300" : "text-gray-700"
                                  }`}
                                  style={{
                                    textAlign: "left", // Ensures the text aligns to the left
                                  }}
                                >
                                  {header}
                                </th>
                              ))}
                            </tr>

                          </thead>
                          <tbody
                            className={`divide-y ${
                              isDarkMode ? "divide-gray-700" : "divide-gray-200"
                            }`}
                          >
                            <AnimatePresence>
                              { 
                                currentRecords?.map((statement, index) =>  (
                                  <motion.tr
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className={`${
                                      isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
                                    } transition-colors duration-150`}
                                  >
                                    <td className="px-6 py-4  whitespace-nowrap">
                                      <span className="text-sm">{index + 1}</span>
                                    </td>                        
                                    
                                    <td className="px-6 py-4  whitespace-nowrap">
                                      <span className="text-sm capitalize">{statement.employee?.firstName}</span>
                                    </td>
        
                                    {/* Amount Paid Section */}
                                    <td className="px-6 py-4  whitespace-nowrap">
                                      <div className="text-sm font-medium">
                                        <div className="flex flex-col">
                                          <strong>{statement.amountPaid}</strong>
                                        </div>
                                      </div>
                                    </td>
        
                                    <td className="px-6 py-4  whitespace-nowrap">
                                      <span className="text-sm">{statement.year}</span>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <span className="text-sm">{statement.month}</span>
                                    </td>
        
                                    <td className="px-6 py-4 whitespace-nowrap ">
                                      {statement?.bankStatement ? (
                                        <span className="text-sm px-2 py-1.5 text-green-800 bg-green-100 font-semibold tracking-wide  rounded-full  transition-all duration-200  ">
                                          Uploaded
                                        </span>
                                      ) : (
                                        <span className="text-sm px-2 py-1.5 text-red-800 bg-red-100 font-semibold tracking-wide rounded-full  transition-all duration-200  ">
                                          Pending
                                        </span>
                                      )}
                                    </td>
        
        
                                    <td className="px-6  py-4 flex gap-3 flex-wrap whitespace-nowrap text-sm font-medium">
                                      <button
                                        onClick={() =>{ setImage(statement?.bankStatement)}}
                                        className={`mr-4 flex gap-3 items-center justify-center  transition-colors duration-300 ${
                                          isDarkMode
                                            ? "text-green-400 hover:text-green-200"
                                            : "text-green-600 hover:text-green-900"
                                        }`}
                                      >
                                        <Eye size={18} />
                                      </button>
                                      <button
                                        onClick={() => {setSelectedEventId(statement._id) ; setShowDeleteCard(true)}}
                                        className={`mr-4 transition-colors duration-300 ${
                                          isDarkMode
                                            ? "text-red-400 hover:text-red-200"
                                            : "text-red-600 hover:text-red-900"
                                        }`}
                                      >
                                        <Trash size={18} />
                                      </button>
                                      <button
                                        onClick={() => navigate(`/admin-dashboard/salaries/edit-salaries/${statement._id}`)}
                                        className={`transition-colors duration-300 ${
                                          isDarkMode
                                            ? "text-indigo-400 hover:text-indigo-200"
                                            : "text-indigo-600 hover:text-indigo-900"
                                        }`}
                                      >
                                        <Edit size={18} />
                                      </button>
                                    </td>
                                  </motion.tr>
                                ))
                              }
                            </AnimatePresence>
                          </tbody>
                        </table>
                  )}
                </div>

                <div
                      className={`px-4 py-3 flex items-center w-full max-w-7xl justify-between border-t sm:px-6`}
                    >
                      <div className="flex-1 flex justify-between sm:hidden">
                        <button
                          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          Next
                        </button>
                      </div>
                      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-gray-700">
                            Showing {indexOfFirstRecord + 1} to {indexOfLastRecord} of {salaryStatements.length} results
                          </p>
                        </div>
                        <div>
                          <nav
                            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                            aria-label="Pagination"
                          >
                            <button
                              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                              disabled={currentPage === 1}
                              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${
                                isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-white"
                              } text-sm font-medium text-gray-500 hover:bg-gray-50`}
                            >
                              Previous
                            </button>
                            {renderPaginationButtons()}
                            <button
                              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                              disabled={currentPage === totalPages}
                              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${
                                isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-white"
                              } text-sm font-medium text-gray-500 hover:bg-gray-50`}
                            >
                              Next
                            </button>
                          </nav>
                        </div>
                      </div>
                </div>
            </div>




      <Dialog
          open={showDeleteCard}
          onClose={() => setShowDeleteCard(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Delete Salary Statement"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this 
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDeleteCard(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDelete} color="secondary" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>


          {image && (
              <div className="fixed z-[1000] top-0 left-0 right-0 bottom-0 bg-black/20 backdrop-blur-md flex items-center justify-center overflow-scroll scrollbar-hide">
                      <motion.div 
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ duration: 0.5, ease: "backInOut" }}
                        className="bg-white w-full overflow-scroll scrollbar-hide p-7 mx-auto max-w-[800px] shadow-xl h-full my-auto max-h-[600px] relative"
                      >
                        {/* Close button */}
                        <div className='flex absolute top-1 right-1 justify-end items-end '>
                          <AiOutlineClose className='text-xl cursor-pointer' onClick={() => setImage(null)} />
                        </div>

                        {/* Download and Print Buttons */}
                        <div className='w-full p-5 flex items-center justify-between bg-black'>
                          <div className='p-2'>
                            <span className='text-xl text-white tracking-wider capitalize'>Salary statement</span>
                          </div>
                          <div>
                            <button
                              onClick={() => downloadImage(image)} 
                              className="px-4 py-2 text-white font-semibold rounded-md transition-all"
                            >
                              <AiOutlineDownload className='text-xl' />
                            </button>

                            {/* Print Button */}
                            <button
                              onClick={() => printImage()} 
                              className="px-4 py-2 text-white font-semibold rounded-md transition-all"
                            >
                              <AiOutlinePrinter className='text-xl' />
                            </button>
                          </div>
                        </div>

                        {/* Iframe Container */}
                        <div className='flex items-center justify-center w-full h-[90%]'>
                          <iframe
                            src={`data:image/jpeg;base64,${image}`}  
                            height={"100%"}
                            width={"100%"}
                            className='object-cover'
                            // Ensures image scales within the iframe
                          />
                          {/* <img src={image} className='w-full h-full object-cover' alt="displayed" /> */}
                        </div>
                      </motion.div>
              </div>
          )}
    </div>
  )
}

export default Salaries;