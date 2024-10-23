import React, { useEffect, useState } from 'react'
import { useStore } from '../../../store';
import { AnimatePresence , motion } from 'framer-motion';
import { Delete, Edit , Eye, Trash } from 'lucide-react';
import { TextField , InputLabel } from '@mui/material';
import axios from 'axios';
import {AiOutlineUpload , AiOutlineDelete , AiOutlineClose, AiOutlineArrowLeft} from "react-icons/ai"
import { ADD_SALARY_STATEMENT, HOST } from '../../../utils/constants';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'
import uploadImage from "../../../assets/upload3.jpg"
function AddSalariesStatements() {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June', 
        'July', 'August', 'September', 'October', 'November', 'December'
      ];

  const [showFilters , setShowFilters] = useState(false)
  const currentYear = new Date().getFullYear();
  const startYear = 2000;
  const endYear = currentYear;
  const years = [];
  
  for (let year = endYear; year >= startYear; year--) {
    years.push(year);
  }
    const [employees , setEmployees] = useState([]);
    const [errors , setErrors] = useState({})
    const [formData , setFormData] = useState({
      employee : "" ,
      amountPaid  : "" ,
      year : "" ,
      month : '' ,
      bankStatement : null
    })

    const navigate = useNavigate();

    const fetchEmployees = async () => {
        try {
          const response = await axios.get("http://localhost:3000/api/employees");
          setEmployees(response.data);
        } catch (error) {
          console.error("Error fetching employees:", error);
        } finally {
    
        }
      };


      useEffect(() => {
        fetchEmployees();
      } , [])

    const validateForm = () => {
        const formErrors = {};
        if (!formData.employee || formData.employee === "select employee") formErrors.employee = "Select employee";
        if (!formData.amountPaid || formData.amountPaid <= 0) formErrors.amountPaid = "amount paid is required ";
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
          formDataToSend.append("amountPaid" , formData["amountPaid"])
          formDataToSend.append("year" , formData["year"])
          formDataToSend.append("month" , formData["month"])
          formDataToSend.append("bankStatement" , formData["bankStatement"]);
    
          
          try {
            const response = await axios.post(`http://localhost:3000/salaries/`,formDataToSend );
            if(response.status === 200) {
              toast.success("Salary added successfully")
                navigate("/admin-dashboard/salaries")
            }
          } catch (error) {
            console.error("Error adding salary statement:", error.message);
            toast.error("Error adding salary statement")
          }
    
        }
      }
    

    const handleClear = () => {
        setFormData({
          ...formData ,
          bankStatement : null
        })
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
  return (
    <div className='flex   items-center justify-center flex-col  h-full w-full p-5 md:p-10'>

            <form onSubmit={handleSubmit} className='grid  lg:grid-cols-2 grid-col-1 grid-rows-5 gap-5 p-5 lg:p-10 bg-white rounded-xl shadow-2xl  w-full h-full  '>
                <div className='flex flex-col gap-3  w-full'>
                  <label htmlFor="employee" className='uppercase text-xs tracking-wider font-semibold'>Employee </label>
                  <select name='employee' value={formData.employee} onChange={handleChange} className="w-full  p-4 rounded-sm transition duration-200 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white ">
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

                <div className='flex flex-col gap-3 w-full'>
                  <label className='uppercase text-xs tracking-wider font-semibold'> Amount Paid </label>
                  <TextField
                      placeholder='amount'
                      name="amountPaid"
                      type='number'
                      value={formData.amountPaid}
                      onChange={handleChange}
                      error={!!errors.amountPaid}
                      helperText={errors.amountPaid}
                      className="rounded-md shadow-sm bg-gray-50"
                      fullWidth
                  />
                </div>


                <div className='flex flex-col gap-3  w-full'>
                  <label htmlFor="month" className='uppercase text-xs tracking-wider font-semibold'>Select Month</label>
                  <select value={formData.month} onChange={handleChange} id="month" name="month" className="w-full  p-4 rounded-sm transition duration-200 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white ">
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
                <label htmlFor="year" className='uppercase text-xs tracking-wider font-semibold'>Select Year</label>
                <select value={formData.year} onChange={handleChange} id="year" name="year"  className="w-full p-4 rounded-sm transition duration-200 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white ">
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
                        <div className="flex flex-col row-span-2 lg:col-span-2">
                            <label className='uppercase text-xs tracking-wider font-semibold' >Bank Statement</label>
                            <div className="mt-2 h-full  p-4 border-dashed border-2 border-blue-500 rounded-lg bg-gray-50 flex items-center justify-center cursor-pointer">
                                <label className="w-full cursor-pointer h-full flex flex-col items-center justify-center">
                                  <span className="text-gray-500 flex-col flex gap-2 items-center">
                                    <div className='h-28 w-28  object-cover'>
                                      <img src={uploadImage} className='h-28 w-28' alt="upload"  />
                                    </div>
                                    <span className='font-bold text-xl '> upload file</span>
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
                        <div className="flex flex-col row-span-2 lg:col-span-2">
                          <label className='uppercase text-xs tracking-wider font-semibold' >bank statement</label>
                          <div className="mt-2 p-4  h-36 w-36 border-dashed border-2 border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center">
                              <img
                              src={URL.createObjectURL(formData.bankStatement)}
                              alt="Aadhar or Pan"
                              className="object-cover"
                              />
                          </div>
                          <button
                              onClick={() => handleClear()}
                              className="text-red-500 mt-2  flex items-center gap-2"
                          >
                              <AiOutlineDelete /> Clear Upload
                          </button>
                        </div>
                    )}

                <div className="flex items-center  justify-end gap-5 col-span-2">
                  <Link to="/admin-dashboard/salaries" className="flex uppercase   items-center justify-center  whitespace-nowrap px-5 border tracking-wider border-red-500  py-2 text-red-500  hover:bg-gray-100">
                    {false ? <div className="w-[25px] h-[25px] rounded-full border-[2px] border-dotted border-gray-200 border-t-black animate-spin transition-all duration-200" /> : "cancel"}
                  </Link>
                  <button type="submit" className="flex uppercase items-center justify-center  whitespace-nowrap px-5  py-2 text-white bg-blue-500 hover:bg-blue-600">
                  {false ? <div className="w-[25px] h-[25px] rounded-full border-[2px] border-dotted border-gray-200 border-t-black animate-spin transition-all duration-200" /> : "add salary"}
                  </button>
                </div>

            </form>
    </div>
  )
}

export default AddSalariesStatements