import React, { useEffect, useState } from 'react'
import { HOST , GET_EMPLOYEE_BY_ID } from '../../../utils/constants'
import { useStepContext } from '@mui/material';
import {toast} from "react-toastify"
import { useNavigate, useParams } from 'react-router-dom';
import {Avatar , Card , Button , Box} from '@mui/material';
import {GiCrossMark} from "react-icons/gi"
const ViewEmployee = () => {
    const navigate = useNavigate();
    const [image , setImage] = useState(null);
    const [isLoading , setIsLoading] = useState(false);
    const [employee , setEmployee] = useState({});
    const {id} = useParams();
    useEffect(() =>{ 
        const getEmployee = async () => {
            try {
                setIsLoading(true);
                const res = await fetch(`${GET_EMPLOYEE_BY_ID}?id=${id}`);

                if(!res.ok) {
                    toast.error("Error !");
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
    }, []);

  return isLoading ? (
    <div className='h-full flex items-center justify-center'>
        <div className="w-10 h-10 border-gray-500 border-t-black border-[3px] animate-spin rounded-full" />
    </div>
  ) :  (
    <div className='flex flex-col w-full gap-5 h-full'>
        <Card className="flex items-center justify-between p-5 rounded-xl shadow-md border">
                <div className='flex gap-5 items-center justify-between '>
                    <Avatar>

                    </Avatar>
                    <span className=' text-3xl font-bold tracking-wide'>{employee?.username ? employee.username : "xxxxxxx"}</span>
                </div>
                <div className="flex gap-4">
                    <butto onClick={() => {navigate(`/admin-dashboard/employees/edit-employee/${employee._id}`)}} className="bg-black cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                        Edit Employee
                    </butto>
                    <button onClick={() => navigate('/admin-dashboard/employees')} className="border border-black cursor-pointer text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
                        Back <span className="text-lg">{">"}</span>
                    </button>
                </div>

        </Card>

        <Card className='flex flex-wrap p-6 gap-5 bg-white rounded-xl shadow-lg'>
            <Box className="flex-1 basis-[400px] flex flex-col gap-6 p-6 bg-gray-100 rounded-xl shadow-lg border border-gray-300">
                <h1 className="text-xl uppercase font-bold text-gray-800">Personal Information</h1>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                {/* first */}
                <div className="flex flex-col gap-2">
                    <span className='text-sm font-semibold text-gray-600'>first name</span>
                    <span className='text-lg font-medium text-gray-900'>{employee?.firstName || 'N/A'}</span>
                </div>
                {/* Name */}
                <div className="flex flex-col gap-2">
                    <span className='text-sm font-semibold text-gray-600'>last name</span>
                    <span className='text-lg font-medium text-gray-900'>{employee?.lastName || 'N/A'}</span>
                </div>
                {/* Email */}
                <div className="flex flex-col gap-2">
                    <span className='text-sm font-semibold text-gray-600'>Email</span>
                    <span className='text-lg font-medium text-gray-900'>{employee?.email || 'N/A'}</span>
                </div>
                {/* Phone */}
                <div className="flex flex-col gap-2">
                    <span className='text-sm font-semibold text-gray-600'>Phone</span>
                    <span className='text-lg font-medium text-gray-900'>{employee?.phone || 'N/A'}</span>
                </div>
                </div>
            </Box>
            <Box className="flex-1 basis-[400px] flex flex-col gap-6 p-6 bg-gray-100 rounded-xl shadow-lg border border-gray-300">
                <h1 className="text-xl uppercase font-bold text-gray-800">Address</h1>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                {/* State */}
                <div className="flex flex-col gap-2">
                    <span className='text-sm font-semibold text-gray-600'>State</span>
                    <span className='text-lg font-medium text-gray-900'>{employee?.state || 'N/A'}</span>
                </div>
                {/* City */}
                <div className="flex flex-col gap-2">
                    <span className='text-sm font-semibold text-gray-600'>City</span>
                    <span className='text-lg font-medium text-gray-900'>{employee?.city || 'N/A'}</span>
                </div>
                {/* Country */}
                <div className="flex flex-col gap-2">
                    <span className='text-sm font-semibold text-gray-600'>Country</span>
                    <span className='text-lg font-medium text-gray-900'>{employee?.country || 'N/A'}</span>
                </div>
                {/* Pincode */}
                <div className="flex flex-col gap-2">
                    <span className='text-sm font-semibold text-gray-600'>Pincode</span>
                    <span className='text-lg font-medium text-gray-900'>{employee?.pincode || 'N/A'}</span>
                </div>
                </div>
            </Box>
            <Box className="flex-1 basis-[400px] flex flex-col gap-6 p-6 bg-gray-100 rounded-xl shadow-lg border border-gray-300">
                <h1 className="text2xl uppercase font-bold text-gray-700 mb-4">previous employement details</h1>
                
                <div className='grid grid-cols-1 sm:grid-cols-2  gap-4'>
                    <div className="flex flex-col gap-1">
                        <span className='text-sm font-semibold text-gray-500'>employeer name</span>
                        <span className='text-xl font-medium text-gray-800'>{employee?.employerName || 'N/A'}</span>
                    </div>
                    {/* city */}
                    <div className="flex flex-col gap-1">
                        <span className='text-sm font-semibold text-gray-500'>job title</span>
                        <span className='text-xl font-medium text-gray-800'>{employee?.jobTitle || 'N/A'}</span>
                    </div>
                    {/* country */}
                    <div className="flex flex-col gap-1">
                        <span className='text-sm font-semibold text-gray-500'>start date</span>
                        <span className='text-xl font-medium text-gray-800'>
                            {employee?.startDate ? `${new Date(employee?.startDate).getDate()}/${new Date(employee?.startDate).getMonth()}/${new Date(employee?.startDate).getFullYear()} ` :  'N/A'}
                            </span>
                    </div>
                    {/* pincode */}
                    <div className="flex flex-col gap-1">
                        <span className='text-sm font-semibold text-gray-500'>end date</span>
                        <span className='text-xl font-medium text-gray-800'>
                            {employee?.endDate ? `${new Date(employee?.endDate).getDate()}/${new Date(employee?.endDate).getMonth()}/${new Date(employee?.endDate).getFullYear()} ` :  'N/A'}    
                        </span>
                    </div>
                    {/* reason for leaving */}
                    <div className="flex flex-col gap-1">
                        <span className='text-sm font-semibold text-gray-500'>reason for leaving</span>
                        <span className='text-xl font-medium text-gray-800'>
                            {employee?.reasonForLeaving} 
                        </span>
                    </div>
                </div>
            </Box>
        </Card>

        <Card className='flex flex-wrap p-6 gap-5 bg-white rounded-xl shadow-lg border'>
            <Box className="flex-1 basis-[400px] flex flex-col gap-6 p-6 bg-gray-50 rounded-xl shadow-md border border-gray-200">
                <h1 className="text-xl uppercase font-bold text-gray-700 mb-4">Employee details</h1>

                <div className='flex flex-col p-2'>
                    <div className="rounded-md border flex p-3 items-center justify-between">
                        <span className=''>Aadhar or pan card</span>
                        <button onClick={() => setImage(`http://localhost:3000/${employee?.aadharOrPan}`)} className='bg-blue-400 px-3 p-1 text-white rounded-lg'>
                            view
                        </button>
                    </div>
                    <div className="rounded-md border flex p-3 items-center justify-between">
                        <span>passport</span>
                        <button onClick={() => setImage(`http://localhost:3000/${employee?.passport}`)} className='bg-blue-400 px-3 p-1 text-white rounded-lg'>
                            view
                        </button>
                    </div>
                    <div className="rounded-md border flex p-3 items-center justify-between">
                        <span>degrees</span>
                        <button onClick={() => setImage((prev) => prev = `http://localhost:3000/${employee?.degrees}`)} className='bg-blue-400 px-3 p-1 text-white rounded-lg'>
                            view
                        </button>
                    </div>
                    <div className="rounded-md border flex p-3 items-center justify-between">
                        <span>transcripts</span>
                        <button onClick={() => setImage(`http://localhost:3000/${employee?.transcripts}`)} className='bg-blue-400 px-3 p-1 text-white rounded-lg'>
                            view
                        </button>
                    </div>
                </div>
                
            </Box>
            <Box className="flex-1 basis-[400px] item-center flex flex-col gap-6 p-6 bg-gray-50 rounded-xl shadow-md border border-gray-200">
                <h1 className="text-xl uppercase font-bold text-gray-700 mb-4">Financial details</h1>
                <div className='flex items-center justify-center h-full'>
                    <div className="w-[80%] basis-[350px] sm:basis-[500px] h-[90%] p-10 justify-center bg-black text-white rounded-lg  shadow-xl relative">
                        {/* Cardholder and Card Number */}
                        <div className="flex flex-col gap-4">
                        <div>
                            <span className="block text-sm font-light text-gray-300">Cardholder</span>
                            <span className="block text-lg font-semibold">{employee?.cardholderName ? employee?.cardholderName  : "xxxxx"}</span>
                        </div>
                        <div>
                            <span className="block text-sm font-light text-gray-300">Card Number</span>
                            <span className="block text-xl font-semibold tracking-widest">{employee?.cardNumber ? employee?.cardNumber  : "xxx xxx xxx"} </span>
                        </div>
                        </div>

                        {/* CVV and Expiry Date */}
                        <div className="flex justify-between mt-8">
                        <div>
                            <span className="block text-sm font-light text-gray-300">Expiry Date</span>
                            <span className="block text-lg font-semibold">{employee?.expiryDate ? `${new Date(employee?.expiryDate).getDate()} / ${new Date(employee?.expiryDate).getMonth()}` : "--/--"}</span>
                        </div>
                        <div>
                            <span className="block text-sm font-light text-gray-300">CVV</span>
                            <span className="block text-lg font-semibold">{employee?.cvv ? employee?.cvv : 'xxx'}</span>
                        </div>
                        </div>

                        {/* Card Logo */}
                        <div className="absolute top-4 right-6">
                        <img
                            className="w-16"
                            src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                            alt="Card Logo"
                        />
                        </div>
                    </div>
                </div>
            </Box>
        </Card>
        {/* image box */}
        {
            image && (
                <div className="fixed z-[1000] top-0 left-0 right-0 bottom-0 bg-black/80 backdrop-blur-md
                                flex flex-col items-center justify-center overflow-scroll scrollbar-hide">
                        <img 
                            className=' object-cover rounded-lg shadow-lg border border-gray-200 mb-4' 
                            src={image} 
                            alt="Passport Image" 
                        />
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

export default ViewEmployee