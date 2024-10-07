import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Button, Typography, tableCellClasses } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify"
import { AiOutlineUserAdd } from "react-icons/ai"
import { GET_ALL_EMPLOYEES } from '../../../utils/constants';
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

function createData(name, email, functionTitle, functionSub, status, employedDate, avatar) {
    return { name, email, functionTitle, functionSub, status, employedDate, avatar };
}

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
        if(currentPage !== 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNext = () => { currentPage !== npages ? setCurrentPage(currentPage  + 1)  : ''}

    const handleChangeCPage = (id) => setCurrentPage(id);
    return (
        <div className='py-10 h-full w-full '>
            <div className='bg-white pt-20 flex flex-col  p-5 rounded-xl  shadow-2xl h-full relative'>   
                <div className='absolute top-[-5%] left-[50%] translate-x-[-50%] w-full  xl:w-[70%] p-5  bg-blue-500 font-semibold text-white rounded-xl flex flex-row justify-between items-center shadow-lg'>
                    <h1 className='uppercase font-semibold sm:text-2xl tracking-wider '>Employee Table</h1>
                    <ul>
                        <li onClick={handleAddEmployeeClick} className='p-2 flex items-center gap-2 tracking-wider uppercase bg-blue-900 cursor-pointer rounded-lg shadow-xl'> <AiOutlineUserAdd/> Add Employee</li>
                    </ul>
                </div>

                {   isLoading ? (
                        <div className='h-full flex items-center justify-center'>
                            <div className="w-10 h-10 border-gray-500 border-t-black border-[3px] animate-spin rounded-full" />
                        </div>
                ) : (
                    <TableContainer className='overflow-scroll flex-1' sx={{ marginTop: '30px' }}>
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
                                            <span style={{
                                                padding: '4px 8px',
                                                borderRadius: '12px',
                                                color: '#fff',
                                                backgroundColor: '#4caf50'
                                            }}>
                                                {"Online"}
                                            </span>
                                        </TableCell>

                                        {/* Employed Phone */}
                                        <TableCell>{employee.phone}</TableCell>

                                        {/* Edit Action */}
                                        <TableCell className='space-x-1'>
                                            <Button onClick={() => navigate(`edit-employee/${employee._id}`)} variant="outlined" size="small" color="primary">
                                                Edit
                                            </Button>
                                            <Button variant="outlined" size="small" color="primary">
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
                <ul className='flex p-5'>
                    <li onClick={handlePrev}  className={`${currentPage == 1 ? "border border-blue-500 text-blue-500 disabled cursor-default" : " bg-blue-500 text-white"} link cursor-pointer p-2 text-[1.2em] px-5 tracking-wider `}>
                        <a href="#"> Prev </a>
                    </li>
                    <li className='flex-1 flex overflow-x-scroll scrollbar-hide px-3 gap-1'>
                        {
                            numbers.map((n , i) => (
                                <a onClick={() => handleChangeCPage(n)} className={`${currentPage == n ? "bg-blue-500 text-white scale-y-105" : "border-blue-500 border text-blue-500"}   p-3 px-5`}  href="#">{n}</a>
                            ))
                        }
                    </li>
                    <li onClick={handleNext} className={`${currentPage == npages ? "border border-blue-500 text-blue-500 disabled cursor-default" : " bg-blue-500 text-white"} link cursor-pointer p-2 text-[1.2em] px-5 tracking-wider `}>
                        <a href="#"> Next </a>
                    </li>
                </ul>
            </div>
        </div>
    );
}
