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
    Modal,
    Grid
} from '@mui/material';
import { Edit, Delete, FileText, X } from 'lucide-react';

const Customer = () => {
    const { fatherName } = useParams();
    const [customerDetails, setCustomerDetails] = useState(null);
    const [pdfs, setPdfs] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
    const [selectedPdf, setSelectedPdf] = useState(null);

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

        const getCustomerPdfs = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/customers/getCustomerPdfs/${fatherName}`);
                setPdfs(response.data);
            } catch (err) {
                console.error('Error fetching PDF data', err);
            }
        };

        getCustomerDetails();
        getCustomerPdfs();
    }, [fatherName]);

    const handleDelete = () => {
        console.log("Delete customer");
    };

    const handleEdit = () => {
        console.log("Edit customer");
    };

    const viewPdf = (pdf) => {
        setSelectedPdf(pdf);
        setIsPdfModalOpen(true);
    };

    const closePdfModal = () => {
        setIsPdfModalOpen(false);
        setSelectedPdf(null);
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
            {/* Profile Card */}
            <Box display="flex" justifyContent="space-between" marginBottom={2}>
                <Box sx={{ width: '150%' }}>
                <Card variant="outlined" sx={{ height: 'auto', borderRadius: 2, padding: 2 }}>
    <CardContent>
        {/* Header */}
        <Typography variant="h6" component="div" gutterBottom sx={{ fontWeight: 'bold', color: "rgb(52, 71, 103)" }}>
            Profile 
        </Typography>
        <Divider sx={{ margin: '10px 0' }} />

        {/* 3x3 Grid Layout */}
        <Grid container spacing={2}>
            <Grid item xs={4}>
                <Typography variant="body2" sx={{ color: '#555' }}>
                    <strong style={{ color: "rgb(52, 71, 103)" }}>Father's Name:</strong> {customerDetails.fatherName || 'N/A'}
                </Typography>
            </Grid>
            <Grid item xs={4}>
                <Typography variant="body2" sx={{ color: '#555' }}>
                    <strong style={{ color: "rgb(52, 71, 103)" }}>Mother's Name:</strong> {customerDetails.motherName || 'N/A'}
                </Typography>
            </Grid>
            <Grid item xs={4}>
                <Typography variant="body2" sx={{ color: '#555' }}>
                    <strong style={{ color: "rgb(52, 71, 103)" }}>WhatsApp Number:</strong> {customerDetails.whatsappNumber || 'N/A'}
                </Typography>
            </Grid>
            <Grid item xs={4}>
                <Typography variant="body2" sx={{ color: '#555' }}>
                    <strong style={{ color: "rgb(52, 71, 103)" }}>Email:</strong> {customerDetails.email || 'N/A'}
                </Typography>
            </Grid>
            <Grid item xs={4}>
                <Typography variant="body2" sx={{ color: '#555' }}>
                    <strong style={{ color: "rgb(52, 71, 103)" }}>Baby's Gender:</strong> {customerDetails.babyGender || 'N/A'}
                </Typography>
            </Grid>
            <Grid item xs={4}>
                <Typography variant="body2" sx={{ color: '#555' }}>
                    <strong style={{ color: "rgb(52, 71, 103)" }}>Baby's Birth Date:</strong> {customerDetails.babyBirthDate ? new Date(customerDetails.babyBirthDate).toLocaleDateString() : 'N/A'}
                </Typography>
            </Grid>
            <Grid item xs={4}>
                <Typography variant="body2" sx={{ color: '#555' }}>
                    <strong style={{ color: "rgb(52, 71, 103)" }}>Baby's Birth Time:</strong> {customerDetails.babyBirthTime || 'N/A'}
                </Typography>
            </Grid>
            <Grid item xs={4}>
                <Typography variant="body2" sx={{ color: '#555' }}>
                    <strong style={{ color: "rgb(52, 71, 103)" }}>Birthplace:</strong> {customerDetails.birthplace || 'N/A'}
                </Typography>
            </Grid>
            <Grid item xs={4}>
                <Typography variant="body2" sx={{ color: '#555' }}>
                    <strong style={{ color: "rgb(52, 71, 103)" }}>Preferred Starting Letter:</strong> {customerDetails.preferredStartingLetter || 'N/A'}
                </Typography>
            </Grid>
        </Grid>

        {/* Requested Date */}
        <Box sx={{ mt: 3 }}>
            <Typography variant="caption" sx={{ color: '#777' }}>
                Requested on: {customerDetails.createdDateTime ? new Date(customerDetails.createdDateTime).toLocaleString() : 'N/A'}
            </Typography>
        </Box>
    </CardContent>
</Card>




                </Box>

                {/* Generated PDFs Card */}
                <Box sx={{ width: '45%', marginLeft: 2 }}>
                <Card variant="outlined" sx={{ height: '280px', boxShadow: 1, borderRadius: 2 }}>
    <CardContent sx={{ padding: 2 }}>
        <Typography variant="h6" component="div" gutterBottom sx={{ fontWeight: 'bold', color: "rgb(52, 71, 103)" }}>
            Assigned Employee
        </Typography>
        <Divider sx={{ margin: '10px 0' }} />
        
        {customerDetails.assignedEmployee ? (
            <Box sx={{ lineHeight: 1.5, color: '#555' }}>
                <Typography variant="h5z" component="span" sx={{ color: '#333', fontWeight: 'bold' }}>
                    {customerDetails.assignedEmployee.name}
                </Typography>
                <Box sx={{ marginTop: 1 }}>
                    <strong style={{ color: "rgb(52, 71, 103)" }}>Email:</strong> {customerDetails.assignedEmployee.email}<br />
                    <strong style={{ color: "rgb(52, 71, 103)" }}>Contact:</strong> {customerDetails.assignedEmployee.phone}<br />
                </Box>
            </Box>
        ) : (
            <Typography variant="body2" sx={{ color: '#555' }}>
                No employee assigned.
            </Typography>
        )}
    </CardContent>
</Card>

                </Box>
            </Box>

            {/* Assigned Employee Card */}
            <Box display="flex" justifyContent="flex-end" padding={3}>
    <Box sx={{ width: "46%", marginRight: -3, marginTop: -3 }}>
    <Card variant="outlined" sx={{ height: '350px', boxShadow: 1, borderRadius: 2 }}>
  <CardContent>
    <Box sx={{ marginTop: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h6" component="div" gutterBottom sx={{ fontWeight: 'bold', color: "rgb(52, 71, 103)" }}>
        Generated PDFs
      </Typography>
    </Box>
    <Divider sx={{ margin: '0px 0' }} />

    {/* Table-like header */}
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, mb: 1, fontWeight: 'bold' }}>
      <Typography variant="body2" sx={{ flex: 0.1, color: "rgb(52, 71, 103)", fontWeight: 'bold' }}>S.No</Typography>
      <Typography variant="body2" sx={{ flex: 0.4, color: "rgb(52, 71, 103)", fontWeight: 'bold' }}>Generated Date</Typography>
      <Typography variant="body2" sx={{ flex: 0.2, color: "rgb(52, 71, 103)", fontWeight: 'bold', textAlign: 'center' }}>Action</Typography>
    </Box>

    {/* Scrollable list */}
    <Box sx={{ maxHeight: '250px', overflowY: 'auto' }}>
      {pdfs.length > 0 ? (
        pdfs.map((pdf, index) => (
          <Box key={index} display="flex" justifyContent="space-between" alignItems="center" sx={{ margin: '10px 0' }}>
            {/* Serial number */}
            <Typography variant="body2" sx={{ flex: 0.1, color: "rgb(52, 71, 103)" }}>
              {index + 1}
            </Typography>

            {/* Generated Time */}
            <Typography variant="body2" sx={{ flex: 0.4, color: "rgb(52, 71, 103)" }}>
              {new Date(pdf.createdAt).toLocaleDateString()}
            </Typography>

            {/* PDF button */}
            <Box sx={{ flex: 0.2, textAlign: 'center' }}>
              <Button
                onClick={() => viewPdf(pdf)}
                sx={{ color: "rgb(52, 71, 103)", display: 'flex', fontWeight: 'bold', alignItems: 'center' }}
              >
                <FileText size={16} style={{ marginRight: 4 }} /> PDF
              </Button>
            </Box>
          </Box>
        ))
      ) : (
        <Typography variant="body2" sx={{ color: "rgb(52, 71, 103)", textAlign: 'center', marginTop: 2 }}>
          No PDFs Generated
        </Typography>
      )}
    </Box>
  </CardContent>
</Card>

    </Box>
</Box>


            {/* Astrological Details Card */}
            <Box display="flex" padding={1}>
                <Box sx={{ width: "55%", marginLeft: -1 ,marginTop: -48}}>
                <Card variant="outlined" sx={{ boxShadow: 1, borderRadius: 2 ,height: '350px',}}>
            <CardContent>
                <Typography variant="h5" component="div" gutterBottom sx={{ fontWeight: 'bold', color: "rgb(52, 71, 103)", textAlign: 'left' }}>
                    Astrological Details
                </Typography>
                <Divider sx={{ margin: '10px 0' }} />

                <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} sx={{ marginTop: 2 }}>
                    <Typography variant="body2" sx={{ color: '#555' }}>
                        <strong>Zodiac Sign:</strong>
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#555' }}>
                        Leo
                    </Typography>

                    <Typography variant="body2" sx={{ color: '#555' }}>
                        <strong>Nakshatra:</strong>
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#555' }}>
                        Ashwini
                    </Typography>

                    <Typography variant="body2" sx={{ color: '#555' }}>
                        <strong>Destiny Number:</strong>
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#555' }}>
                        5
                    </Typography>

                    <Typography variant="body2" sx={{ color: '#555' }}>
                        <strong>Gemstone:</strong>
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#555' }}>
                        Ruby
                    </Typography>

                    <Typography variant="body2" sx={{ color: '#555' }}>
                        <strong>Lucky Metal:</strong>
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#555' }}>
                        Gold
                    </Typography>

                    <Typography variant="body2" sx={{ color: '#555' }}>
                        <strong>Numerology:</strong>
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#555' }}>
                        3
                    </Typography>

                    <Typography variant="body2" sx={{ color: '#555' }}>
                        <strong>Preferred Starting Letter:</strong>
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#555' }}>
                        A
                    </Typography>
                </Box>

                <Divider sx={{ margin: '10px 0', marginTop: 3 }} />
                <Typography variant="body2" sx={{ color: '#555', textAlign: 'center' }}>
                    <strong>Suggested Baby Names:</strong> <span style={{ color: "rgb(52, 71, 103)" }}>Aryan, Aadhya</span>
                </Typography>
            </CardContent>
        </Card>
                </Box>
            </Box>

            {/* PDF Modal */}
            <Modal
                open={isPdfModalOpen}
                onClose={closePdfModal}
                aria-labelledby="pdf-modal"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '50%',
                    height: '80%',
                    bgcolor: 'white',
                    boxShadow: 24,
                    p: 2,
                    borderRadius: 2,
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    <Button 
                        onClick={closePdfModal} 
                        sx={{ 
                            alignSelf: 'flex-end', 
                            minWidth: 'unset', 
                            p: 0.5
                        }}
                    >
                        <X size={24} />
                    </Button>
                    {selectedPdf && (
                        <iframe
                            src={`data:application/pdf;base64,${selectedPdf.base64Pdf}`}
                            width="100%"
                            height="100%"
                            style={{ border: 'none' }}
                            title="PDF Viewer"
                        />
                    )}
                </Box>
            </Modal>
        </Box>
    );
};

export default Customer;