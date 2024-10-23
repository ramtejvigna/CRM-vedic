import React, { useEffect, useState } from 'react'
import { useStore } from '../../../store';
import { AnimatePresence , motion } from 'framer-motion';
import { Delete, Edit , Eye, Trash } from 'lucide-react';
import { TextField , InputLabel } from '@mui/material';
import axios from 'axios';
import {AiOutlineUpload , AiOutlineDelete , AiOutlineClose, AiOutlineDownload, AiOutlinePrinter} from "react-icons/ai"
import { ADD_SALARY_STATEMENT, HOST } from '../../../utils/constants';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { Search, Upload, User, Users, Filter  } from 'lucide-react';
import {AiOutlineAlipay} from "react-icons/ai"
import noImage from "../../../assets/noimage.jpg"
import noData from "../../../assets/nodata.jpg"
function Salaries() {
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
    years.push(year);
  }

  const [salaryStatements , setSalaryStatements] = useState([]);


  const fetchSalries = async () => {
    try {
      const response = await axios.get("http://localhost:3000/salaries/");
      setSalaryStatements(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {

    }
  };


  useEffect(() => {
      fetchSalries();
  } , [])


  const handleDelete = async () => {
    if(selectedEventId) {
      try {
        const response = await axios.delete(`http://localhost:3000/salaries/delete/${selectedEventId}`);
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

    if(filterData || filteringMonth) {
        try {
          const response = await axios.get(`http://localhost:3000/salaries/search?month=${filteringMonth}&year=${filteringYear}`);
          if(response.status === 200) {
            setSalaryStatements(response.data);
          }

        } catch (error) {
          console.error("Error filtering statements:", error.message);
          toast.error("Error filtering statement")
        }
    }else {
      toast.error("Please select year and month")
    }

  }

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = salaryStatements.slice(indexOfFirstRecord, indexOfLastRecord);
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
            currentPage === i ? "bg-blue-500 text-white" : ""
          }`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };
  
  const downloadImage =  async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
  
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = url.split('/').pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // Clean up
    } catch (error) {
      console.error('Error downloading the image:', error);
      toast.error(error.message)
    }
  };

  const printImage = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Image</title>
          <style>
            body {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background-color: white;
            }
            img {
              max-width: 100%;
              height: auto;
            }
          </style>
        </head>
        <body>
          <img src="${image}" alt="Image to print" />
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  useEffect(() => {
    filterData();
  } , [filteringMonth , filteringYear]);

  useEffect(() => {
    if(searchTerm) {
      const filteredData = salaryStatements.filter((statement) => (statement.employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || statement.employee.lastName.toLowerCase().includes(searchTerm.toLowerCase())) )
      setSalaryStatements(filteredData)
    }else {
      fetchSalries();
    }
  } , [searchTerm]);


  return (
    <div className='flex p-8 h-full w-full flex-col gap-5'>
        <h1 className="text-4xl font-bold mb-20">Salaries</h1>
        
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
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
                        className="px-4 py-2 rounded-lg bg-indigo-600 text-white transition duration-300"
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
                  <Link className='flex gap-2 items-center justify-center' to={"/admin-dashboard/add-salaries"}>
                    <AiOutlineAlipay/> <span>add salary </span>
                  </Link>
                </motion.button>
            </div>
          {
            showFilters && (
                <div className="flex gap-5   items-center justify-center ">
                  <form  className='flex w-full gap-5 flex-wrap' >
                    <div className='flex gap-5 items-center justify-center   min-w-[250px]'>
                      <label htmlFor="month"> Month:</label>
                      <select value={filteringMonth} onChange={(e) => setFilteringMonth(e.target.value)} id="month" name="month" className=" p-2 transition duration-200 border border-gray-300 focus:outline-none focus:ring-2 rounded-lg focus:ring-indigo-600 focus:ring-offset-2 focus:ring-offset-white  gap-5">
                        <option value="select month">select month</option>
                        {months.map((month, index) => (
                          <option key={index} value={month}>
                            {month}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className='flex gap-5 items-center justify-center   min-w-[250px]'>
                      <label htmlFor="year"> Year:</label>
                      <select value={filteringYear} onChange={(e) => setFilteringYear(e.target.value)} id="year" name="year"  className="p-2 transition duration-200 border border-gray-300 focus:outline-none focus:ring-2 rounded-lg focus:ring-indigo-600 focus:ring-offset-2 focus:ring-offset-white  gap-5">
                      <option value="select year">select year</option>
                        {years.map(year => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                  </form>
                </div>
            )
          }

        <div className="flex flex-1">
          <div className="overflow-x-auto w-full">
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
                        {["s no", "Employee name" , "Amount paid" , "year", "month" , "status" , "Actions"].map(
                          (header) => (
                            <th
                              key={header}
                              className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                isDarkMode ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              {header}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody
                      className={`divide-y ${
                        isDarkMode ? "divide-gray-700" : "divide-gray-200"
                      }`}
                    >
                      <AnimatePresence>
                        { 
                          currentRecords.map((statement, index) =>  (
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
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm">{index + 1}</span>
                              </td>                        
                              
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm">{statement.employee?.firstName}</span>
                              </td>
  
                              {/* Amount Paid Section */}
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium">
                                  <div className="flex flex-col">
                                    <strong>{statement.amountPaid}</strong>
                                  </div>
                                </div>
                              </td>
  
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm">{statement.year}</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm">{statement.month}</span>
                              </td>
  
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                {statement?.bankStatement ? (
                                  <span className="text-sm px-3 py-1.5 text-green-800 bg-green-100 font-semibold tracking-wide  rounded-full  transition-all duration-200  ">
                                    paid
                                  </span>
                                ) : (
                                  <span className="text-sm px-3 py-1.5 text-red-800 bg-red-100 font-semibold tracking-wide rounded-full  transition-all duration-200  ">
                                    Pending
                                  </span>
                                )}
                              </td>
  
  
                              <td className="px-6  py-4 flex gap-3 flex-wrap whitespace-nowrap text-sm font-medium">
                                <button
                                  onClick={() => setImage(`http://localhost:3000/${statement.bankStatement}`)}
                                  className={`mr-4 flex gap-3 items-center justify-center  transition-colors duration-300 ${
                                    isDarkMode
                                      ? "text-green-400 hover:text-green-200"
                                      : "text-green-600 hover:text-green-900"
                                  }`}
                                >
                                  <Eye size={18} /> {"VIEW PAYSLIP"}
                                </button>
                                <button
                                  onClick={() => {setSelectedEventId(statement._id) ; setShowDeleteCard(true)}}
                                  className={`mr-4 flex gap-3 transition-colors duration-300 ${
                                    isDarkMode
                                      ? "text-red-400 hover:text-red-200"
                                      : "text-red-600 hover:text-red-900"
                                  }`}
                                >
                                  <Trash size={18} /> {"DELETE"}
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
        </div>

        <div
              className={`px-4 py-3 flex items-center justify-between border-t ${
                isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
              } sm:px-6`}
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

      {showDeleteCard && (
          <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
            <motion.div
                                initial={{opacity : 0 , scale : 0}}
                                animate={{opacity : 1 , scale : 1}}
                                exit={{opacity : 0 , scale : 0}}
                                transition={{duration : 0.5 , ease : "backInOut"} }
            className='bg-white rounded-xl shadow-2xl p-7 gap-5 min-w-[400px] flex flex-col'
            >
              <div className='text-3xl font-bold uppercase  text-center'>ARE YOU SURE  </div>
              <div className='text-xs  text-center'>you want to delete this statement ? </div>
              <div  className='flex justify-end gap-2 mt-4'>
                <button onClick={() => {setShowDeleteCard(false) , setSelectedEventId(null)}} className='rounded-lg border border-gray-200 uppercase   px-3 py-2'>cancel </button>
                <button onClick={() => handleDelete()} type="submit" className=" px-4 float- rounded-lg w-fit flex items-center justify-center bg-red-500 text-white py-2 hover:bg-red-600">
                                      {false ? <div className="w-[25px] h-[25px] rounded-full border-[2px] border-dotted border-gray-200 border-t-black animate-spin transition-all duration-200" /> : "delete"}
                </button>
              </div>
            </motion.div>
          </div>
      )}


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
                          <span className='text-xl text-white tracking-wider capitalize'>Bank statement</span>
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
                          src={image} 
                          className="w-full image-iframe  h-full object-fill" // Ensures image scales within the iframe
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