import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    Divider,
    CircularProgress,
} from '@mui/material';
import { Edit, Delete, FileText } from 'lucide-react';

const Customer = () => {
    const { fatherName } = useParams();
    const [customerDetails, setCustomerDetails] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getCustomerDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/customers/getCustomerDetails/${fatherName}`);
                setCustomerDetails(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.response ? err.response.data.message : 'Error fetching customer details');
                setLoading(false);
            }
        };

        getCustomerDetails();
    }, [fatherName]);

    const handleDelete = () => {
        console.log("Delete customer");
    };

    const handleEdit = () => {
        console.log("Edit customer");
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!customerDetails) {
        return <div>No customer details found.</div>;
    }

    return (
        <Box display="flex" flexDirection="column" padding={2} bgcolor="#f4f6f8">
            <Box display="flex" justifyContent="space-between" marginBottom={2}>
                <Card variant="outlined" sx={{ width: '60%', height: '300px', boxShadow: 3, borderRadius: 2 }}>
                    <CardContent sx={{ padding: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="h5" component="div" gutterBottom sx={{ fontWeight: 'bold', color: "rgb(52, 71, 103)" }}>
                                Profile
                            </Typography>
                            <Box>
                                <Button onClick={handleEdit} sx={{ color: 'blue', fontWeight: 'bold', marginRight: 2 }}>
                                    <Edit size={16} style={{ marginRight: 4 }} /> Edit
                                </Button>
                                <Button onClick={handleDelete} sx={{ color: 'red', fontWeight: 'bold' }}>
                                    <Delete size={16} style={{ marginRight: 4 }} /> Delete
                                </Button>
                            </Box>
                        </Box>
                        <Divider sx={{ margin: '20px 0' }} />
                        <Typography variant="body2" sx={{ marginTop: 2, lineHeight: 1.6, color: '#555' }}>
                            <Box sx={{ marginBottom: 2 }}>
                                <Typography variant="h5" component="span" sx={{ color: '#333' }}>
                                    {customerDetails.fatherName || 'N/A'}
                                </Typography>
                            </Box>
                            <strong>Father's Name:</strong> <span style={{ color: '#333' }}>{customerDetails.fatherName || 'N/A'}</span><br />
                            <strong>Mother's Name:</strong> <span style={{ color: '#333' }}>{customerDetails.motherName || 'N/A'}</span><br />
                            <strong>Email:</strong> <span style={{ color: '#333' }}>{customerDetails.email || 'N/A'}</span><br />
                            <strong>WhatsApp Number:</strong> <span style={{ color: '#333' }}>{customerDetails.whatsappNumber || 'N/A'}</span><br />
                            <strong>Baby's Gender:</strong> <span style={{ color: '#333' }}>{customerDetails.babyGender || 'N/A'}</span><br />
                        </Typography>
                    </CardContent>
                </Card>

                {/* Employee Assigned Card */}
                <Card variant="outlined" sx={{ width: '40%', boxShadow: 3, borderRadius: 2, marginLeft: 2 }}>
                    <CardContent>
                        <Box sx={{ marginTop: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6" component="div" gutterBottom sx={{ fontWeight: 'bold', color: "rgb(52, 71, 103)" }}>
                                Generated
                            </Typography>
                            <Button
                                variant="outlined"
                                sx={{
                                    color: '#1E90FF',
                                    fontWeight: 'bold',
                                    borderColor: '#1E90FF',
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 255, 0.1)',
                                    },
                                }}
                            >
                                View All
                            </Button>
                        </Box>
                        <Divider sx={{ margin: '7px 0' }} />

                        {/* Invoices List */}
                        {[
                            { date: 'March, 01, 2020', number: '#MS-415646', amount: '$180' },
                            { date: 'February, 10, 2021', number: '#RV-126749', amount: '$250' },
                            { date: 'April, 05, 2020', number: '#QW-103578', amount: '$120' },
                            { date: 'June, 25, 2019', number: '#MS-415646', amount: '$180' },
                            { date: 'March, 01, 2019', number: '#AR-803481', amount: '$300' },
                        ].map((invoice, index) => (
                            <Box key={index} display="flex" justifyContent="space-between" alignItems="center" sx={{ margin: '10px 0' }}>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body2" sx={{ color: "rgb(52, 71, 103)", fontWeight: 'bold' }}>
                                        {invoice.date}<br />
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'black' }}>
                                        {invoice.number}
                                    </Typography>
                                </Box>
                                <Box display="flex" alignItems="center" sx={{ flexShrink: 0 }}>
                                    <Typography variant="body2" sx={{ color: '#333', marginRight: 2 }}>
                                        {invoice.amount}
                                    </Typography>
                                    <Button sx={{ color: "rgb(52, 71, 103)", display: 'flex', fontWeight: 'bold', alignItems: 'center' }}>
                                        <FileText size={16} style={{ marginRight: 4 }} /> PDF
                                    </Button>
                                </Box>
                            </Box>
                        ))}
                    </CardContent>
                </Card>
            </Box>

            {/* Additional Details Card */} 
            <Box display="flex" justifyContent="flex-end" padding={3}>
                <Card variant="outlined" sx={{ marginTop: -2, boxShadow: 3, borderRadius: 2, width: "40%", marginRight: -2 }}>
                    <CardContent>
                        <Typography variant="h6" component="div" gutterBottom sx={{ fontWeight: 'bold', color: "rgb(52, 71, 103)" }}>
                            Astrological Details
                        </Typography>
                        <Divider sx={{ margin: '10px 0' }} />
                        <Typography variant="body2" sx={{ color: '#555' }}>
                            <strong>Zodiac Sign:</strong> Leo<br />
                            <strong>Nakshatra:</strong> Ashwini<br />
                            <strong>Destiny Number:</strong> 5<br />
                            <strong>Gemstone:</strong> Ruby<br />
                            <strong>Lucky Metal:</strong> Gold<br />
                            <strong>Numerology:</strong> 3<br />
                            <strong>Preferred Starting Letter:</strong> A<br />
                            <strong>Suggested Baby Names:</strong> Aryan, Aadhya
                        </Typography>
                    </CardContent>
                </Card>
            </Box>

            <Box display="flex" padding={1}>
                <Card variant="outlined" sx={{ marginTop: -45, boxShadow: 3, borderRadius: 2, width: "60%", marginLeft: -1, height: '330px' }}>
                    <CardContent sx={{ padding: 2 }}>
                        <Typography variant="h6" component="div" gutterBottom sx={{ fontWeight: 'bold', color: "rgb(52, 71, 103)" }}>
                            Assigned Employee
                        </Typography>
                        <Divider sx={{ margin: '10px 0' }} />
                        {customerDetails.assignedEmployee ? (
                            <Typography variant="body2" sx={{ color: '#555' }}>
                                <Box sx={{ marginBottom: 2 }}>
                                    <Typography variant="h5" component="span" sx={{ color: '#333' }}>
                                        <strong>{customerDetails.assignedEmployee.name}</strong><br />
                                    </Typography>
                                </Box>
                                <strong>Email:</strong> {customerDetails.assignedEmployee.email}<br />
                                <strong>Contact:</strong> {customerDetails.assignedEmployee.phone}<br />
                                <strong>Created At:</strong> {new Date(customerDetails.createdDateTime).toLocaleString()}<br />

                            </Typography>
                        ) : (
                            <Typography variant="body2" sx={{ color: '#555' }}>
                                No employee assigned.
                            </Typography>
                        )}
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};

export default Customer;