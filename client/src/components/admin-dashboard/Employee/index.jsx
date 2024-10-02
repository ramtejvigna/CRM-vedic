import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Button, Typography, tableCellClasses } from '@mui/material';
import { useNavigate } from 'react-router-dom';

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

// Example employee data
const rows = [
    createData('John Michael', 'john@creative-tim.com', 'Manager', 'Organization', 'Online', '23/04/18', '/path-to-avatar/john.png'),
    createData('Alexa Liras', 'alexa@creative-tim.com', 'Programator', 'Developer', 'Offline', '11/01/19', '/path-to-avatar/alexa.png'),
    createData('Laurent Perrier', 'laurent@creative-tim.com', 'Executive', 'Projects', 'Online', '19/09/17', '/path-to-avatar/laurent.png'),
    createData('Michael Levi', 'michael@creative-tim.com', 'Programator', 'Developer', 'Online', '24/12/08', '/path-to-avatar/michael.png'),
    createData('Richard Gran', 'richard@creative-tim.com', 'Manager', 'Executive', 'Offline', '04/10/21', '/path-to-avatar/richard.png'),
    createData('Miriam Eric', 'miriam@creative-tim.com', 'Programator', 'Developer', 'Offline', '14/09/20', '/path-to-avatar/miriam.png'),
];

export default function Employee() {
    const navigate = useNavigate();

    const handleAddEmployeeClick = () => {
        navigate("add-employee");
    };

    return (
        <div className='py-10'>
            <div className='bg-white p-5 rounded-xl shadow-lg'>
                <div className='absolute p-5 top-24 bg-blue-500 font-semibold text-white rounded-xl flex flex-row justify-between shadow-lg w-[160vh]'>
                    <h1>Employee Table</h1>
                    <ul>
                        <li onClick={handleAddEmployeeClick} className='underline cursor-pointer'>Add Employees</li>
                    </ul>
                </div>
                <TableContainer sx={{ marginTop: '30px' }}>
                    <Table sx={{ minWidth: 700 }} aria-label="employee table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Employee Name</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Employed</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row.name}>
                                    {/* Avatar and Name */}
                                    <TableCell component="th" scope="row">
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <Avatar alt={row.name} src={row.avatar} />
                                            <div style={{ marginLeft: 10 }}>
                                                <Typography variant="body1" fontWeight="bold">{row.name}</Typography>
                                                <Typography variant="body2" color="textSecondary">{row.email}</Typography>
                                            </div>
                                        </div>
                                    </TableCell>

                                    {/* Status */}
                                    <TableCell>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '12px',
                                            color: '#fff',
                                            backgroundColor: row.status === 'Online' ? '#4caf50' : '#757575'
                                        }}>
                                            {row.status.toUpperCase()}
                                        </span>
                                    </TableCell>

                                    {/* Employed Date */}
                                    <TableCell>{row.employedDate}</TableCell>

                                    {/* Edit Action */}
                                    <TableCell>
                                        <Button variant="outlined" size="small" color="primary">
                                            Edit
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
}
