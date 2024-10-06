import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress } from '@mui/material';

const CustomerDetails = () => {
    const { id } = useParams(); // Get the customer ID from the URL parameters
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch customer data from the backend
    useEffect(() => {
        const customerDetails = async () => {
            try {
                const response = await fetch(`http://localhost:3000/customers/customersDetails/${id}`); // Use template literals
                if (!response.ok) {
                    throw new Error(`Failed to fetch customer data: ${response.statusText}`); // Improved error message
                }
                const data = await response.json();
                console.log(data); // Log the fetched data
                setCustomer(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        customerDetails();
    }, [id]);

    // Handle back button click
    const handleBack = () => {
        navigate(-1); // Navigate back to the previous page
    };

    // Loading state
    if (loading) {
        return (
            <Box sx={{ padding: '20px', textAlign: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    // Error state
    if (error) {
        return (
            <Box sx={{ padding: '20px', textAlign: 'center' }}>
                <Typography variant="h6" color="red">{error}</Typography>
            </Box>
        );
    }

    // Ensure customer data is available
    if (!customer) {
        return (
            <Box sx={{ padding: '20px', textAlign: 'center' }}>
                <Typography variant="h6" color="red">Customer data not found.</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
            <Typography variant="h4" sx={{ marginBottom: '20px' }}>
                Customer Details
            </Typography>
            <Typography variant="h6">
                <strong>Name:</strong> {customer.username ? customer.username : 'N/A'}
            </Typography>
            <Typography variant="h6">
                <strong>WhatsApp Number:</strong> {customer.whatsappNumber ? customer.whatsappNumber : 'N/A'}
            </Typography>
            <Typography variant="h6">
                <strong>Baby's Gender:</strong> {customer.babyGender ? customer.babyGender : 'N/A'}
            </Typography>
            <Typography variant="h6">
                <strong>Status:</strong> {customer.paymentStatus ? 'Paid' : 'Pending'}
            </Typography>
            <Typography variant="h6">
                <strong>PDFs Generated:</strong> {customer.pdfGenerated ? 'Yes' : 'No'}
            </Typography>

            <Button
                variant="contained"
                color="primary"
                onClick={handleBack}
                sx={{ marginTop: '20px' }}
            >
                Back
            </Button>
        </Box>
    );
};

export default CustomerDetails;
