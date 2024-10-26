import React, { useEffect, useState } from 'react'
import { HOST , GET_EMPLOYEE_BY_ID } from '../../../utils/constants'
import { toast } from "react-toastify"
import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, Card, Button, Box } from '@mui/material';
import { GiCrossMark, GiMailbox } from "react-icons/gi"
import {format} from "date-fns"
import {AnimatePresence, motion} from "framer-motion"
import { AiOutlineMessage } from 'react-icons/ai';
import { Calendar, ClipboardList, ClipboardListIcon, Clock, MailIcon, Phone, User, Workflow, WorkflowIcon } from 'lucide-react';
import { AiOutlineClose , AiOutlineDownload , AiOutlinePrinter } from 'react-icons/ai';
import { useStore } from '../../../store';
const ViewEmployee = () => {
    const navigate = useNavigate();
    const {isDarkMode} = useStore()
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [employee, setEmployee] = useState({});
    const { id } = useParams();

    useEffect(() => {
        const getEmployee = async () => {
            try {
                setIsLoading(true);
                const res = await fetch(`${GET_EMPLOYEE_BY_ID}?id=${id}`);

                if (!res.ok) {
                    toast.error("Error fetching employee!");
                }

                const data = await res.json();
                setIsLoading(false);
                setEmployee(data.employee)
                console.log(data.employee)
            } catch (error) {
                toast.error(error.message);
            }
        }

        getEmployee();
    }, [id]);

    const downloadImage = (base64String) => {
        const link = document.createElement('a');
        link.href = `data:image/jpeg;base64,${base64String}`;
        link.download = 'document.jpg'; // Name of the downloaded file
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

    return isLoading ? (
        <div className='h-full flex items-center justify-center'>
            <div className="w-10 h-10 border-gray-500 border-t-black border-[3px] animate-spin rounded-full" />
        </div>
    ) : (
        <div className='w-full h-full'>
            <Card className="flex items-center justify-between p-5 rounded-xl shadow-md border">
                <div className="flex gap-4">
                    <Button onClick={() => navigate('/admin-dashboard/employees')} className="border border-black text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
                        <span className="text-lg">{"<"}</span> Back
                    </Button>
                    <Button onClick={() => navigate(`/admin-dashboard/employees/edit-employee/${employee._id}`)} className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                        Edit Employee
                    </Button>
                </div>
            </Card>

            <div className="flex flex-wrap justify-center  h-full w-full">
                <div className="flex p-5 gap-5 basis-auto  flex-1 flex-col border ">
                    <Card className='flex relative flex-wrap p-6 gap-5 bg-white rounded-xl shadow-lg'>
                        {employee?.isOnline ? (
                                    <span className="absolute top-2 right-2 bg-opacity-10 py-1 rounded-lg px-4 bg-green-100 text-green-800">
                                        online
                                    </span>
                                ) : (
                                    <span className="absolute top-2 right-2 bg-opacity-10 py-1 rounded-lg px-4 bg-red-500 text-red-500">
                                        offline
                                    </span>
                        )}
                        <div className='flex flex-col gap-3 items-center'>
                            <div className="flex-shrink-0 h-36 w-36">
                              {employee?.avatar ? (
                                <img
                                  className="h-36 w-36 object-cover rounded-full"
                                  src={employee.avatar}
                                  alt={employee.firstName}
                                />
                              ) : (
                                <div className="h-36 w-36 rounded-full bg-blue-500 flex items-center justify-center">
                                  <span className="text-white text-7xl font-bold">
                                    {employee?.firstName?.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className='flex flex-col gap-3'>
                                <span className='text-blue-500 text-3xl font-bold'>{employee?.firstName + " " + employee?.lastName}</span>
                            </div>
                        </div>
                        <div className="flex-1 flex p-6 flex-col gap-3">
                            <span className=' text-gray-500 flex gap-2 items-center flex-wrap' ><MailIcon className='h-4 w-4'/>{employee?.email}</span>
                            <span className=' text-gray-500 flex gap-2 items-center flex-wrap' ><Phone className='h-4 w-4'/>{employee?.phone}</span>
                            <span className=' text-gray-500 flex gap-2 items-center flex-wrap' ><User className='h-4 w-4'/> customers assigned : {employee?.customers?.length}</span>
                            <span className=' text-gray-500 flex gap-2 items-center flex-wrap' ><ClipboardListIcon className='h-4 w-4'/> tasks assigned : {employee?.assignedTasks ? employee?.assignedTasks?.length : "0"}</span>
                            <span className=' text-gray-500 flex gap-2 items-center flex-wrap' ><Calendar  className='h-4 w-4'/>remaining leave days : {employee.leaveBalance}</span>
                        </div>
                    </Card>

                    <Card className="flex flex-col flex-wrap p-6 gap-5 bg-white rounded-xl shadow-lg">
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                             Document Wallet
                        </h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2  gap-6">
                            <div className="relative p-4 border rounded-lg bg-white shadow hover:shadow-lg transition-shadow">
                                {employee?.aadharOrPan ? (
                                    <span className="absolute top-2 right-2 text-xs px-2 py-1 rounded bg-green-500 text-white">
                                        uploaded
                                    </span>
                                ) : (
                                    <span className="absolute top-2 right-2 text-xs px-2 py-1 rounded bg-yellow-500 text-white">
                                        Pending
                                    </span>
                                )}
                                <div className="text-4xl">🆔</div>
                                <h4 className="mt-2 font-semibold text-gray-800">Id Proof</h4>
                                <p className="text-gray-500 text-sm">Last updated: {employee?.lastUpdated ?  format(employee?.lastUpdated, "mm , d yyyy" ) : "Not yet updated"} </p>
                                
                                <div className="mt-4 flex space-x-2">
                                    <button onClick={() => setImage(employee?.aadharOrPan)} className="text-blue-600 hover:underline">View</button>
                                    <button onClick={() => downloadImage(employee?.aadharOrPan)} className="text-blue-600 hover:underline">Download</button>
                                </div>
                            </div>

                            <div className="relative p-4 border rounded-lg bg-white shadow hover:shadow-lg transition-shadow">
                                {employee?.passport ? (
                                    <span className="absolute top-2 right-2 text-xs px-2 py-1 rounded bg-green-500 text-white">
                                        uploaded
                                    </span>
                                ) : (
                                    <span className="absolute top-2 right-2 text-xs px-2 py-1 rounded bg-yellow-500 text-white">
                                        Pending
                                    </span>
                                )}
                                <div className="text-4xl">🌐</div>
                                <h4 className="mt-2 font-semibold text-gray-800">Passport</h4>
                                <p className="text-gray-500 text-sm">Lat updated: {employee?.lastUpdated ?  format(employee?.lastUpdated, "mm , d yyyy" ) : "Not yet updated"} </p>
                                
                                <div className="mt-4 flex space-x-2">
                                    <button onClick={() => setImage(employee?.passport)} className="text-blue-600 hover:underline">View</button>
                                    <button onClick={() => downloadImage(employee?.aadharOrPan)} className="text-blue-600 hover:underline">Download</button>
                                </div>
                            </div>
                            <div className="relative p-4 border rounded-lg bg-white shadow hover:shadow-lg transition-shadow">
                                {employee?.degrees ? (
                                    <span className="absolute top-2 right-2 text-xs px-2 py-1 rounded bg-green-500 text-white">
                                        uploaded
                                    </span>
                                ) : (
                                    <span className="absolute top-2 right-2 text-xs px-2 py-1 rounded bg-yellow-500 text-white">
                                        Pending
                                    </span>
                                )}
                                <div className="text-4xl">🎓</div>
                                <h4 className="mt-2 font-semibold text-gray-800">Degree</h4>
                                <p className="text-gray-500 text-sm">Uploaded: { isNaN(new Date(employee?.updatedAt)) ? "Invalid Date" :  format( new Date(employee?.expiryDate) , "MM/dd/yyyy") }</p>
                                
                                <div className="mt-4 flex space-x-2">
                                    <button onClick={() => setImage(employee?.degrees)} className="text-blue-600 hover:underline">View</button>
                                    <button onClick={() => downloadImage(employee?.degrees)} className="text-blue-600 hover:underline">Download</button>
                                </div>
                            </div>
                            <div className="relative p-4 border rounded-lg bg-white shadow hover:shadow-lg transition-shadow">
                                {employee?.transcripts ? (
                                    <span className="absolute top-2 right-2 text-xs px-2 py-1 rounded bg-green-500 text-white">
                                        uploaded
                                    </span>
                                ) : (
                                    <span className="absolute top-2 right-2 text-xs px-2 py-1 rounded bg-yellow-500 text-white">
                                        Pending
                                    </span>
                                )}
                                <div className="text-4xl">📄</div>
                                <h4 className="mt-2 font-semibold text-gray-800">Transcripts</h4>
                                <p className="text-gray-500 text-sm">Uploaded: Dec 20, 2023</p>
                                
                                <div className="mt-4 flex space-x-2">
                                    <button onClick={() => setImage(employee?.transcripts)} className="text-blue-600 hover:underline">View</button>
                                    <button onClick={() => downloadImage(employee?.transcripts)}  className="text-blue-600 hover:underline">Download</button>
                                </div>
                            </div>

                        </div>
                    </Card>


                </div>


                <div className="flex sm:p-5  gap-5 flex-col border b">
                    <Card className='flex flex-col flex-wrap p-6 gap-5 bg-white rounded-xl shadow-lg'>
                        <h1 className='text-xl font-semibold text-gray-800 mb-4'>Personal Details</h1>
                        <table border="1" className=' '>
                            <tr>
                                <th className='border border-black text-xl p-2'>Firstname</th>
                                <td className='border border-black text-xl p-2'>{employee?.firstName }</td>
                            </tr>
                            <tr>
                                <th className='border border-black text-xl p-2'>Lastname</th>
                                <td className='border border-black text-xl p-2'>{employee?.lastName}</td>
                            </tr>
                            <tr>
                                <th className='border border-black  p-2'>Address</th>
                                <td className='border border-black  p-2'>{employee?.address + " , " + employee?.city }</td>
                            </tr>
                            <tr>
                                <th className='border border-black  p-3'>Location</th>
                                <td className='border border-black  p-3'>{employee?.state + " , " + employee?.country}</td>
                            </tr>
                            <tr>
                                <th className='border border-black  p-2'>Pincode</th>
                                <td className='border border-black  p-2'>{employee?.pincode}</td>
                            </tr>
                        </table>
                    </Card>




                        <Card class=" bg-white shadow-md rounded-lg overflow-hidden p-6 mt-6">
                            <h2 class="text-xl font-semibold text-gray-800 mb-4">Fianancial Details</h2>

                            <div class="border-t border-gray-200">
                                <dl class="divide-y divide-gray-200">
                                    <div class="py-2 flex justify-between">
                                        <dt class="text-gray-500">Card Holder Name</dt>
                                        <dd class="text-gray-900 font-medium">{employee?.cardholderName || "Not mentioned"}</dd>
                                    </div>
                                    <div class="py-2 flex justify-between">
                                        <dt class="text-gray-500">Card Number</dt>
                                        <dd class="text-gray-900 font-medium">{employee?.cardNumber}</dd>
                                    </div>


                                    <div class="py-2 flex justify-between">
                                        <dt class="text-gray-500">Exipry Date</dt>
                                        <dd class="text-gray-900 font-medium">{ isNaN(new Date(employee?.expiryDate)) ? "Invalid Date" :  format( new Date(employee?.expiryDate) , "MM/dd/yyyy") }</dd>
                                    </div>


                                    <div class="py-2 flex justify-between">
                                        <dt class="text-gray-500">cvv</dt>
                                        <dd class="text-gray-900 font-medium">{employee?.cvv}</dd>
                                    </div>
                                </dl>
                            </div>
                        </Card>

                        <Card class=" bg-white shadow-md rounded-lg overflow-hidden p-6 mt-6">
                            <h2 class="text-xl font-semibold text-gray-800 mb-4">Employment Details</h2>

                            <div class="border-t border-gray-200">
                                <dl class="divide-y divide-gray-200">
                                    <div class="py-2 flex justify-between">
                                        <dt class="text-gray-500">Employer Name</dt>
                                        <dd class="text-gray-900 font-medium">{employee?.employerName}</dd>
                                    </div>

                                    <div class="py-2 flex justify-between">
                                        <dt class="text-gray-500">Job Title</dt>
                                        <dd class="text-gray-900 font-medium">{employee?.jobTitle}</dd>
                                    </div>

                                    <div class="py-2 flex justify-between">
                                        <dt class="text-gray-500">Start Date</dt>
                                        <dd class="text-gray-900 font-medium">{ isNaN(new Date(employee?.startDate)) ? "Invalid Date" :  format( new Date(employee?.startDate) , "MM/dd/yyyy") }</dd>
                                    </div>

                                    <div class="py-2 flex justify-between">
                                        <dt class="text-gray-500">End Date</dt>
                                        <dd class="text-gray-900 font-medium">{ isNaN(new Date(employee?.endDate)) ? "Invalid Date" :  format( new Date(employee?.endDate) , "MM/dd/yyyy") }</dd>
                                    </div>

                                    <div class="py-2 flex justify-between">
                                        <dt class="text-gray-500">Reason for Leaving</dt>
                                        <dd class="text-gray-900 font-medium">{employee?.reasonForLeaving}</dd>
                                    </div>
                                </dl>
                            </div>
                        </Card>




                </div>


            </div>


            {/* Image Box */}
            {
                image && (
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
                        <div className='flex items-center overflow-scroll justify-center w-full h-[90%]'>
                            <img
                                src={`data:image/jpeg;base64,${image}`}  
                                height={"100%"}
                                className='object-cover'
                            // Ensures image scales within the iframe
                            />
                            {/* <img src={image} className='w-full h-full object-cover' alt="displayed" /> */}
                        </div>
                        </motion.div>
                </div>
                )
            }
        </div>
    )
}

export default ViewEmployee;
