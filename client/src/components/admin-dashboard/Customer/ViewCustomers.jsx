import React, { useState, useEffect, useRef } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CardActions,
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import FilterListIcon from '@mui/icons-material/FilterList';

const customerData = [
  { sino: 1, name: 'Manoj', whatsapp: '7799101777', gender: 'Male', employee: 'Employee1 Ram', status: 'In progress', pdfs: '1' },
  { sino: 2, name: 'Srikar', whatsapp: '7556575877', gender: 'Male', employee: 'Employee2 Mounika', status: 'Pending', pdfs: '0' },
  { sino: 3, name: 'Priya', whatsapp: '7799201788', gender: 'Female', employee: 'Employee3 Riya', status: 'In progress', pdfs: '2' },
  { sino: 4, name: 'Nisha', whatsapp: '7799101788', gender: 'Female', employee: 'Employee4 Riya', status: 'Pending', pdfs: '1' },
  { sino: 5, name: 'Ajay', whatsapp: '7799101778', gender: 'Male', employee: 'Employee5 Ram', status: 'In progress', pdfs: '1' },
  { sino: 6, name: 'Ravi', whatsapp: '7799101779', gender: 'Male', employee: 'Employee6 Mounika', status: 'In progress', pdfs: '2' },
  { sino: 7, name: 'Sita', whatsapp: '7799101780', gender: 'Female', employee: 'Employee7 Riya', status: 'Pending', pdfs: '0' },
  { sino: 8, name: 'Gita', whatsapp: '7799101781', gender: 'Female', employee: 'Employee8 Riya', status: 'In progress', pdfs: '1' },
  { sino: 9, name: 'Sunil', whatsapp: '7799101782', gender: 'Male', employee: 'Employee9 Ram', status: 'Pending', pdfs: '2' },
  { sino: 10, name: 'Neha', whatsapp: '7799101783', gender: 'Female', employee: 'Employee10 Mounika', status: 'In progress', pdfs: '0' },
];

const getStatusContainer = (status) => (
  <Box
    sx={{
      width: '100px',
      height: '30px',
      borderRadius: '15px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      padding: '4px',
      margin: 'auto',
      backgroundColor: status === 'In progress' ? 'green' : 'black',
    }}
  >
    {status}
  </Box>
);

const CustomerDetails = () => {
  const [filteredGender, setFilteredGender] = useState('All');
  const [filteredStatus, setFilteredStatus] = useState('All');
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(6);
  const [showFilters, setShowFilters] = useState(false);

  const handleGenderChange = (event) => {
    setFilteredGender(event.target.value);
  };

  const handleStatusChange = (event) => {
    setFilteredStatus(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const filteredData = customerData.filter((row) => {
    const genderMatch = filteredGender === 'All' || row.gender === filteredGender;
    const statusMatch = filteredStatus === 'All' || row.status === filteredStatus;
    return genderMatch && statusMatch;
  });

  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <Box sx={{ position: 'relative', padding: '20px', paddingBottom: '80px'}}>
      <Box
        sx={{
          backgroundColor: '#1E90FF',
          color: '#fff',
          padding: '1.25rem',
          borderRadius: '20px',
          width: '1100px',
          height: '75px',
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography className='text-xl' component="div" sx={{ fontWeight: 'bold' }}>
          Customer Details
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<FilterListIcon />}
          onClick={() => setShowFilters(!showFilters)}
          sx={{
            backgroundColor: '#000',
            borderRadius: '10px',
            
          }}
        >
          Filter
        </Button>
      </Box>

      {showFilters && (
        <Box
          sx={{
            position: 'absolute',
            right: '20px',
            top: '120px',
            zIndex: 3,
            backgroundColor: 'white',
            padding: '16px',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="gender-label">Gender</InputLabel>
            <Select
              labelId="gender-label"
              value={filteredGender}
              onChange={handleGenderChange}
              sx={{
                border: 'none', // Remove the border
                '& fieldset': {
                  border: 'none', // Remove the outline around the Select
                },
              }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              value={filteredStatus}
              onChange={handleStatusChange}
              sx={{
                border: 'none', // Remove the border
                '& fieldset': {
                  border: 'none', // Remove the outline around the Select
                },
              }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="In progress">In progress</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
            </Select>
          </FormControl>
        </Box>
      )}



      <Box sx={{ marginTop: '30px', paddingBottom: '80px' }}>
        <TableContainer component={Paper} sx={{ boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)', maxHeight: '600px', padding: '10px', borderRadius: '20px'  }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell colSpan={7} style={{ padding: 0, height: '75px', backgroundColor: 'transparent', border: 'none' }} />
              </TableRow>
              <TableRow>
                <TableCell align="center" style={{ fontWeight: 'bold', color: 'gray' }}>S:no</TableCell>
                <TableCell align="center" style={{ fontWeight: 'bold', color: 'gray' }}>Customer Name</TableCell>
                <TableCell align="center" style={{ fontWeight: 'bold', color: 'gray' }}>WhatsApp Number</TableCell>
                <TableCell align="center" style={{ fontWeight: 'bold', color: 'gray' }}>Baby's Gender</TableCell>
                <TableCell align="center" style={{ fontWeight: 'bold', color: 'gray' }}>Employee Assigned</TableCell>
                <TableCell align="center" style={{ fontWeight: 'bold', color: 'gray' }}>Status</TableCell>
                <TableCell align="center" style={{ fontWeight: 'bold', color: 'gray' }}>PDFs Generated</TableCell>
                <TableCell align="center" style={{ fontWeight: 'bold', color: 'gray' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{row.sino}</TableCell>
                  <TableCell align="center">{row.name}</TableCell>
                  <TableCell align="center">{row.whatsapp}</TableCell>
                  <TableCell align="center">{row.gender}</TableCell>
                  <TableCell align="center">{row.employee}</TableCell>
                  <TableCell align="center">{getStatusContainer(row.status)}</TableCell>
                  <TableCell align="center">{row.pdfs}</TableCell>
                  <TableCell align="center">
                    <Button variant="contained" color="primary" size="small">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <CardActions
        sx={{
          justifyContent: 'center',
          padding: '16px',
          position: 'fixed',
          backgroundColor: 'white',
          width: '100%',
          maxWidth: '1130px',
          margin: '0 auto',
          bottom: 0,
        }}
      >
        <Button
          variant="contained"
          onClick={(event) => handleChangePage(event, page - 1)}
          disabled={page === 0}
          startIcon={<ArrowBackIosIcon />}
          sx={{
            marginRight: '16px',
            backgroundColor: '#007bff',
          }}
        >
          Previous
        </Button>
        <Typography variant="body1" sx={{ alignSelf: 'center' }}>
          Page {page + 1} of {totalPages}
        </Typography>
        <Button
          variant="contained"
          onClick={(event) => handleChangePage(event, page + 1)}
          disabled={page >= totalPages - 1}
          endIcon={<ArrowForwardIosIcon />}
          sx={{
            marginLeft: '16px',
            backgroundColor: '#007bff',
          }}
        >
          Next
        </Button>
      </CardActions>
    </Box>
  );
};

export default CustomerDetails;