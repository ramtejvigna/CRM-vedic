import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Button, Typography, tableCellClasses } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify"
import { GET_ALL_EMPLOYEES } from '../../../utils/constants';
import { AiOutlineUserAdd } from "react-icons/ai"
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));


export default function Employee() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false)
    const [employees, setEmployees] = useState([]);
    const recordsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const records = employees.slice(firstIndex, lastIndex);
    const npages = Math.ceil(employees.length / recordsPerPage);
    const numbers = [...Array(npages + 1).keys()].slice(1);

    useEffect(() => {
        const getEmployees = async () => {
            try {
                setIsLoading(true);
                const res = await fetch(`${GET_ALL_EMPLOYEES}`);

                if (!res.ok) {
                    toast.error("Error !");
                }

                const data = await res.json();
                setEmployees(data.employees);
                setIsLoading(false);
            } catch (error) {
                toast.error("Error !");
            }
        }

        getEmployees();
        return () => {

        }
    }, []);


    const handleAddEmployeeClick = () => {
        navigate("add-employee");
    };

    const handlePrev = () => {
        if (currentPage !== 1) {
            setCurrentPage(currentPage - 1);
        }
    }

    const handleNext = () => {
        if (currentPage !== npages) {
            setCurrentPage(currentPage + 1);
        }
    }

    const handleChangeCPage = (id) => {
        setCurrentPage(id);
    }


    


    return (
        <div className='py-10 h-full'>
            <div className='bg-white pt-20 flex flex-col  p-5 rounded-xl shadow-lg h-full relative'>
                <div className='absolute top-[-6%] left-[50%] translate-x-[-50%] xl:w-[95%] p-5  bg-blue-500 font-semibold text-white rounded-xl flex flex-row justify-between items-center shadow-lg'>
                    <h1 className='uppercase '>Employee Table</h1>
                    <ul>
                        <li onClick={handleAddEmployeeClick} className='p-2 flex items-center gap-2 tracking-wider uppercase bg-blue-900 cursor-pointer rounded-lg shadow-xl'> <AiOutlineUserAdd /> Add Employee</li>
                    </ul>
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
