import React, { useEffect, useState } from 'react'
import { useStore } from '../../../store';
import { AnimatePresence , motion } from 'framer-motion';
import { Delete, Edit , Eye, Trash } from 'lucide-react';
import { TextField , InputLabel } from '@mui/material';
import axios from 'axios';
import {AiOutlineUpload , AiOutlineDelete , AiOutlineClose} from "react-icons/ai"
import { ADD_SALARY_STATEMENT, HOST } from '../../../utils/constants';
import { toast } from 'react-toastify';
function Salaries() {
  const [showDeleteCard , setShowDeleteCard] = useState(false);
  const [errors , setErrors] = useState({})
  const [formData , setFormData] = useState({
    employee : "" ,
    basicSalary : undefined ,
    totalAllowance : undefined ,
    totalDeduction : undefined ,
    year : "" ,
    month : '' ,
    bankStatement : null
  })
  const [selectedEventId , setSelectedEventId] = useState(null);
  const { isDarkMode, toggleDarkMode } = useStore();
  const [showForm , setShowForm] = useState(false)
  const [image , setImage] = useState(false);
  const [employees , setEmployees] = useState([]);
  const [filteringYear , setFilteringYear] = useState("")
  const [filteringMonth , setFilteringMonth] = useState("")
  const [currentPage , setCurrentPage ] = useState(1)
  const recordsPerPage = 5
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Generate years from 1950 to 10 years ahead of the current year
  const currentYear = new Date().getFullYear();
  const startYear = currentYear;
  const endYear = currentYear + 10;
  const years = [];
  
  for (let year = startYear; year <= endYear; year++) {
    years.push(year);
  }

  const [salaryStatements , setSalaryStatements] = useState([
    {
      "employee": { name : "Srikar"},
      "basicSalary": 50000,
      "totalAllowance": 10000,
      "totalDeduction": 5000,
      "totalSalary": 55000,
      "year": 2024,
      "month": "January",
      "bankStatement": "ICICI Bank - Transaction ID: 12345ABC"
    },
    {
      "employee": "6513f1a5c9d6c710cc229d16",
      "basicSalary": 60000,
      "totalAllowance": 15000,
      "totalDeduction": 8000,
      "totalSalary": 67000,
      "year": 2024,
      "month": "February",
      "bankStatement": "HDFC Bank - Transaction ID: 67890XYZ"
    },
    {
      "employee": "6513f1a5c9d6c710cc229d17",
      "basicSalary": 45000,
      "totalAllowance": 5000,
      "totalDeduction": 2000,
      "totalSalary": 48000,
      "year": 2024,
      "month": "March",
      "bankStatement": "SBI Bank - Transaction ID: 11223DEF"
    },
    {
      "employee": "6513f1a5c9d6c710cc229d18",
      "basicSalary": 55000,
      "totalAllowance": 12000,
      "totalDeduction": 7000,
      "totalSalary": 60000,
      "year": 2024,
      "month": "April",
      "bankStatement": "Axis Bank - Transaction ID: 44556GHI"
    },
    {
      "employee": "6513f1a5c9d6c710cc229d19",
      "basicSalary": 75000,
      "totalAllowance": 18000,
      "totalDeduction": 10000,
      "totalSalary": 83000,
      "year": 2024,
      "month": "May",
      "bankStatement": "Kotak Bank - Transaction ID: 77889JKL"
    }
  ]
  )


  
  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/employees");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {

    }
  };
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
      fetchEmployees();
      fetchSalries();
  } , [])

  const validateForm = () => {
    const formErrors = {};
    if (!formData.employee || formData.employee === "select employee") formErrors.employee = "Select employee";
    if (!formData.basicSalary || formData.basicSalary <= 0) formErrors.basicSalary = "Basic salary required";
    if (!formData.totalAllowance || formData.totalAllowance <= 0) formErrors.totalAllowance = "Total allowance required";
    if (!formData.totalDeduction || formData.totalDeduction < 0) formErrors.totalDeduction = "Total deduction required";
    if (!formData.year || formData.year === "select year") formErrors.year = "Please select year";
    if (!formData.month || formData.month === "select month") formErrors.month = "Please select month";  
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };


   
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData)
    if(validateForm()) {
      const formDataToSend = new FormData();
     
      formDataToSend.append("employee" , formData["employee"])
      formDataToSend.append("basicSalary" , formData["basicSalary"])
      formDataToSend.append("totalAllowance" , formData["totalAllowance"])
      formDataToSend.append("totalDeduction" , formData["totalDeduction"])
      formDataToSend.append("year" , formData["year"])
      formDataToSend.append("month" , formData["month"])
      formDataToSend.append("bankStatement" , formData["bankStatement"]);

      
      try {
        const response = await axios.post(`http://localhost:3000/salaries/`,formDataToSend );
        if(response.status === 200) {
          toast.success("Salary added successfully")
          setShowForm(false);
        }

        fetchSalries();
        
      } catch (error) {
        console.error("Error adding salary statement:", error.message);
        toast.error("Error adding salary statement")
      }

    }
  }

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

  const handleChange = (e) => {
    setFormData({
      ...formData ,
      [e.target.name] : e.target.value
    })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData ,
      bankStatement : file
    })
  }

  const filterData = async (e) => {
    e.preventDefault();

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
  const currentRecords = employees.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(employees.length / recordsPerPage);

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


  const handleClear = () => {
    setFormData({
      ...formData ,
      bankStatement : null
    })
  }

  return (
    <div className='flex h-full w-full flex-col gap-5'>
      <div className="flex gap-5 p-5  items-center justify-center ">
        <form onSubmit={filterData} className='flex w-full p-5 gap-5 flex-wrap' >
          {/* Month Dropdown */}

          <div className='flex flex-col gap-2 xl:w-[25%] lg:w-[30%] md:w-[40%] w-full'>
            <label htmlFor="month">Select Month:</label>
            <select value={filteringMonth} onChange={(e) => setFilteringMonth(e.target.value)} id="month" name="month" className=" p-2 transition duration-200 border border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white focus:border-blue-400">
              <option value="select month">select month</option>
              {months.map((month, index) => (
                <option key={index} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          <div className='flex flex-col gap-2 xl:w-[25%] lg:w-[30%] md:w-[40%] w-full'>
            <label htmlFor="year">Select Year:</label>
            <select value={filteringYear} onChange={(e) => setFilteringYear(e.target.value)} id="year" name="year"  className="p-2 transition duration-200 border border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white focus:border-blue-400">
            <option value="select year">select year</option>
              {years.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className='flex  flex-col gap-2 items-end justify-end xl:w-[20%] lg:w-[25%] md:w-[40%] w-full'>
          <button type="submit" className="flex w-full uppercase items-center justify-center text-2xl px-5  py-1 text-white bg-green-500 hover:bg-green-600">
               {false ? <div className="w-[25px] h-[25px] rounded-full border-[2px] border-dotted border-gray-200 border-t-black animate-spin transition-all duration-200" /> : "submit"}
           </button>
          </div>
        </form>
          <button onClick={() => setShowForm(true)} type="submit" className="flex uppercase w-fit h-fit items-center justify-center text-xl whitespace-nowrap px-5  py-1 text-white bg-blue-500 hover:bg-blue-600">
               {false ? <div className="w-[25px] h-[25px] rounded-full border-[2px] border-dotted border-gray-200 border-t-black animate-spin transition-all duration-200" /> : "add salary"}
          </button>
        
      </div>

      <div className="flex flex-1">
        <div className="overflow-x-auto w-full">
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
                      {salaryStatements.map((statement, index) => (
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
                                <span>Basic Salary: {statement.basicSalary}</span>
                                <span>Allowance: {statement.totalAllowance}</span>
                                <span>Deduction: {statement.totalDeduction}</span>
                                <strong>Total: {statement.basicSalary + statement.totalAllowance - statement.totalDeduction}</strong>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm">{statement.year}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm">{statement.month}</span>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            {statement?.bankStatement ? (
                              <span className="text-sm px-2 py-1 bg-green-500 font-semibold tracking-wider   text-white rounded-md shadow-sm">{"PAID"}</span>
                              ) : (
                                <span className="text-sm px-2 py-1 bg-red-500 font-semibold tracking-wider   text-white rounded-md shadow-sm">{"PENDING"}</span>
                            )}
                          </td>

                          <td className="px-6 items-center justify-center py-4 flex gap-3 flex-wrap whitespace-nowrap text-sm font-medium">
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
                            <button
                              onClick={() => setImage(`http://localhost:3000/${statement.bankStatement}`)}
                              className={`mr-4 flex gap-3 items-center justify-center  transition-colors duration-300 ${
                                isDarkMode
                                  ? "text-green-400 hover:text-green-200"
                                  : "text-green-600 hover:text-green-900"
                              }`}
                            >
                              <Eye size={18} /> {"payslip"}
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>

                </table>
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
                    Showing {indexOfFirstRecord + 1} to {indexOfLastRecord} of {employees.length} results
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

      {showForm && (
        <div className='fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black/40 backdrop-blur-sm '>
          <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ duration: 0.5, ease: "backInOut" }}
                        className="relative z-50 flex flex-col flex-wrap items-center p-5 overflow-hidden bg-white  rounded-xl"
          >
            <form onSubmit={handleSubmit} className='flex flex-col gap-3 p-5 min-w-[400px] overflow-y-scroll'>

              <div className="flex  items-end w-full justify-end">
                <AiOutlineClose onClick={() => setShowForm(false)} className='cursor-pointer'/>
              </div>

            <div className='flex flex-col gap-2  w-full'>
              <label htmlFor="employee">Employee </label>
              <select name='employee' value={formData.employee} onChange={handleChange} className="w-full p-2 transition duration-200 border border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white focus:border-blue-400">
                <option value="select employee">select employee</option>
                {employees.map((employee, index) => (
                  <>
                    <option key={index} value={employee._id}>
                      {employee.firstName ||  employee?.name}
                    </option>
                  </>
                ))}
              </select>
              {errors.employee && (<span className='text-xs text-red-400'>{errors.employee}</span>)}
            </div>
              
            <label >Amount Paid </label>
              <TextField
                  label="Basic salary"
                  name="basicSalary"
                  type='number'
                  value={formData.basicSalary}
                  onChange={handleChange}
                  error={!!errors.basicSalary}
                  helperText={errors.basicSalary}
                  className="rounded-md shadow-sm bg-gray-50"
                  fullWidth
              />
              <TextField
                  label="Total Allowance"
                  name="totalAllowance"
                  type='number'
                  error={!!errors.totalAllowance}
                  helperText={errors.totalAllowance}
                  value={formData.totalAllowance}
                  onChange={handleChange}
                  className="rounded-md shadow-sm bg-gray-50"
                  fullWidth
              />
              <TextField
                  label="Total deduction"
                  name="totalDeduction"
                  type='number'
                  error={!!errors.totalDeduction}
                  helperText={errors.totalDeduction}
                  value={formData.totalDeduction}
                  onChange={handleChange}
                  className="rounded-md shadow-sm bg-gray-50"
                  fullWidth
              />

              <div className='flex flex-col gap-2  w-full'>
                <label htmlFor="month">Select Month:</label>
                <select value={formData.month} onChange={handleChange} id="month" name="month" className=" p-2 transition duration-200 border border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white focus:border-blue-400">
                  <option value="select month">select month</option>
                  {months.map((month, index) => (
                    <option key={index} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
                {errors.month && (<span className='text-xs text-red-400'>{errors.month}</span>)}

              </div>

              <div className='flex flex-col gap-2  w-full'>
                <label htmlFor="year">Select Year:</label>
                <select value={formData.year} onChange={handleChange} id="year" name="year"  className="p-2 transition duration-200 border border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white focus:border-blue-400">
                <option value="select year">select year</option>
                  {years.map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                {errors.year && (<span className='text-xs text-red-400'>{errors.year}</span>)}

              </div>

              {!formData.bankStatement ? (
                        <div className="flex flex-col">
                          <InputLabel className="text-gray-700">Bank Statement</InputLabel>
                          <div className="mt-2 p-4 border-dashed border-2 border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center cursor-pointer">
                              <label className="w-full h-full flex flex-col items-center justify-center">
                              <span className="text-gray-500 flex gap-2 items-center">
                                  <AiOutlineUpload /> Upload File
                              </span>
                              <input
                                  type="file"
                                  accept=".jpg,.png,.jpeg"
                                  // onChange={(e) => handleFileChange(e, 'idDocuments', 'aadharOrPan')}
                                  onChange={(e) => handleFileChange(e)}
                                  className="hidden"
                              />
                              </label>
                          </div>
                          {errors.bankStatement && (<span className='text-xs text-red-400'>{errors.bankStatement}</span>)}
                        </div>
                    ) : (
                        <div className="flex flex-col">
                        <InputLabel className="text-gray-700">bank statement</InputLabel>
                        <div className="mt-2 p-4  h-36 w-36 border-dashed border-2 border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center">
                            <img
                            src={URL.createObjectURL(formData.bankStatement)}
                            alt="Aadhar or Pan"
                            className="object-cover"
                            />
                        </div>
                        <button
                            onClick={() => handleClear()}
                            className="text-red-500 mt-2 flex items-center gap-2"
                        >
                            <AiOutlineDelete /> Clear Upload
                        </button>
                        </div>
                    )}

          <button type="submit" className="flex uppercase w-full  items-center justify-center text-xl whitespace-nowrap px-5  py-2 text-white bg-blue-500 hover:bg-blue-600">
               {false ? <div className="w-[25px] h-[25px] rounded-full border-[2px] border-dotted border-gray-200 border-t-black animate-spin transition-all duration-200" /> : "add salary"}
           </button>

            </form>

              
          </motion.div>
        </div>
      )}
      {showDeleteCard && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
          <motion.div
                              initial={{opacity : 0 , scale : 0}}
                              animate={{opacity : 1 , scale : 1}}
                              exit={{opacity : 0 , scale : 0}}
                              transition={{duration : 0.5 , ease : "backInOut"} }
          className='bg-white rounded-lg p-5 flex flex-col'
          >
            <div className='text-xl uppercase text-center'>ARE YOU SURE  </div>
            <div className='text-xs uppercase text-center'>you want to delete this resource ? </div>
            <div onSubmit={handleSubmit} className='flex justify-between gap-2 mt-4'>
              <button onClick={() => {setShowDeleteCard(false) , setSelectedEventId(null)}} className='rounded-lg border border-gray-200 uppercase   px-3 py-2'>cancel </button>
              <button onClick={() => handleDelete()} type="submit" className=" px-4 float- rounded-lg w-fit flex items-center justify-center bg-red-500 text-white py-2 hover:bg-red-600">
                                    {false ? <div className="w-[25px] h-[25px] rounded-full border-[2px] border-dotted border-gray-200 border-t-black animate-spin transition-all duration-200" /> : "delete"}
              </button>
            </div>
          </motion.div>
        </div>)}


        {
                image && (
                    <div className="fixed z-[1000] top-0 left-0 right-0 bottom-0 bg-black/80 backdrop-blur-md
                                    flex flex-col items-center justify-center overflow-scroll scrollbar-hide">
                        <div className='h-64 w-64'>
                          <img
                              className='object-cover rounded-lg shadow-lg border border-gray-200 mb-4'
                              src={image}
                              alt="Document Image"
                          />

                        </div>
                        <button
                            onClick={() => setImage(null)}
                            className='rounded-full text-white w-[50px] h-[50px] p-4 flex items-center justify-center bg-gray-700'
                        >
                            <span className='text-2xl'>x</span>
                        </button>
                    </div>
                )
            }
    </div>
  )
}

export default Salaries;