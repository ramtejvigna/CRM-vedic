import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';

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
  const [customerData, setCustomerData] = useState([]);
  const [filteredGender, setFilteredGender] = useState('All');
  const [filteredStatus, setFilteredStatus] = useState('All');
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(6);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch data from the backend
  useEffect(() => {
    axios.get('http://localhost:3000/customers/getCustomers')
      .then((response) => {
        setCustomerData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching customer data:', error);
      });
  }, []);

  const handleGenderChange = (event) => {
    setFilteredGender(event.target.value);
  };

  const handleStatusChange = (event) => {
    setFilteredStatus(event.target.value);
  };

  
  const filteredData = customerData.filter((row) => {
    const genderMatch = filteredGender === 'All' || row.gender === filteredGender;
    const statusMatch = filteredStatus === 'All' || row.status === filteredStatus;
    return genderMatch && statusMatch;
  });

  const paginatedData = filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <Box sx={{ position: 'relative', padding: '20px' }}>
      <Box sx={{ marginTop: '30px', margin: '0 auto', position: 'relative' }}>
        <Box
          sx={{
            backgroundColor: '#1E90FF',
            color: '#fff',
            padding: '15px',
            borderRadius: '8px',
            width: '1080px',
            height: '75px',
            position: 'absolute',
            top: '-20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            Customer Details
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FilterListIcon />}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filter
          </Button>
        </Box>

        <TableContainer
          component={Paper}
          sx={{
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            marginTop: '30px',
            height: '600px',
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell colSpan={7} style={{ padding: 0, height: '70px', backgroundColor: 'transparent', border: 'none' }} />
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
                  <TableCell align="center">{index+1}</TableCell>
                  <TableCell align="center">{row.username}</TableCell>
                  <TableCell align="center">{row.whatsappNumber}</TableCell>
                  <TableCell align="center">{row.babyGender}</TableCell>
                  <TableCell align="center">{row.employee}</TableCell>
                  <TableCell align="center">{getStatusContainer(row.paymentStatus)}</TableCell>
                  <TableCell align="center">{row.pdfGenerated}</TableCell>
                  <TableCell align="center">
                  <Button variant="contained" color="primary" size="small">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 'auto',
              marginLeft: '520px',
              marginBottom: '40px',
            }}
          >
            <Button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              sx={{ minWidth: 'auto', p: 0, mr: 1 }}
            >
              PREV
            </Button>
            {[...Array(totalPages)].map((_, index) => (
              <Button
                key={index}
                onClick={() => setPage(index + 1)}
                sx={{
                  minWidth: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: page === index + 1 ? 'blue' : 'transparent',
                  color: page === index + 1 ? 'white' : 'black',
                  mx: 0.5,
                }}
              >
                {index + 1}
              </Button>
            ))}
            <Button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              sx={{ minWidth: 'auto', p: 0, ml: 1 }}
            >
              NEXT
            </Button>
          </Box>
        </TableContainer>
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
                border: 'none',
                '& fieldset': {
                  border: 'none',
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
                border: 'none',
                '& fieldset': {
                  border: 'none',
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
    </Box>
  );
};

export default CustomerDetails;
