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
    Grid
} from '@mui/material';
import { Edit, Delete, FileText } from 'lucide-react';
import { FaDownload, FaWhatsapp, FaEnvelope } from 'react-icons/fa';
import { AiOutlineArrowLeft, AiOutlineDelete, AiOutlineUpload } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
// PDF Viewer Component
const PDFViewer = ({ pdfUrl, handleDownload, handleSendMail, email, enabledRow, pdfId, onClose }) => {
    return (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-75">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 text-3xl p-2">
                    &times;
                </button>
                
                <h2 className="mb-4 text-xl font-semibold">Generated PDF:</h2>
                
                <div className="flex justify-end mb-4 space-x-2">
                    <button
                        onClick={() => handleDownload(pdfUrl, pdfId)}
                        disabled={enabledRow !== pdfId}
                        className={`rounded-lg px-4 py-2 transition duration-200 ${
                            enabledRow !== pdfId ? 'bg-blue-100 text-blue-600 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                    >
                        <FaDownload />
                    </button>
                    <button
                        onClick={() => { /* Add your WhatsApp functionality here */ }}
                        disabled={enabledRow !== pdfId}
                        className={`rounded-lg px-4 py-2 transition duration-200 ${
                            enabledRow !== pdfId ? 'bg-green-100 text-green-600 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                    >
                        <FaWhatsapp />
                    </button>
                    <button
                        onClick={() => handleSendMail(pdfUrl, pdfId, email)}
                        disabled={enabledRow !== pdfId}
                        className={`rounded-lg px-4 py-2 transition duration-200 ${
                            enabledRow !== pdfId ? 'bg-red-100 text-red-600 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700'
                        }`}
                    >
                        <FaEnvelope />
                    </button>
                </div>
                
                <iframe
                    src={pdfUrl}
                    width="100%"
                    height="600px"
                    className="border rounded-lg"
                    title="PDF Viewer"
                />
            </div>
        </div>
    );
};

const Customer = () => {
    const { fatherName } = useParams();
    const [customerDetails, setCustomerDetails] = useState(null);
    const [pdfs, setPdfs] = useState([]);
        const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [pdfLoading, setPdfLoading] = useState(false);
    const [pdfError, setPdfError] = useState(null);
    const [enabledRow, setEnabledRow] = useState(null);
      const navigate = useNavigate();

    useEffect(() => {
        const getCustomerDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/customers/getCustomerDetails/${fatherName}`);
                setCustomerDetails(response.data);
                setLoading(false);
                if (response.data._id) {
                    fetchPdfs(response.data._id);
                }
            } catch (err) {
                setError(err.response ? err.response.data.message : 'Error fetching customer details');
                setLoading(false);
            }
        };

        getCustomerDetails();
    }, [fatherName]);

    const fetchPdfs = async (customerObjectId) => {
      setPdfLoading(true);
      try {
          const customerId = customerObjectId.toString ? customerObjectId.toString() : customerObjectId;
          const response = await axios.get(`http://localhost:3000/api/generatedpdf`, {
              params: {
                  customerId: customerId
              }
          });
          
          const pdfData = Array.isArray(response.data) ? response.data : [];  // Ensure it's an array
          setPdfs(pdfData);
          setPdfLoading(false);
      } catch (err) {
          console.error('Error details:', err);
          setPdfError(err.response ? err.response.data.error : 'Error fetching PDFs');
          setPdfLoading(false);
      }
  };
  

    const handleDownload = async (pdfUrl, pdfId) => {
        try {
            const response = await axios.get(pdfUrl, { responseType: 'blob' });
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `generated-pdf-${pdfId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading PDF:', error);
        }
    };

    const handleSendMail = async (pdfUrl, pdfId, email) => {
        try {
            await axios.post('http://localhost:3000/api/send-pdf', {
                pdfUrl,
                pdfId,
                email
            });
            alert('Email sent successfully!');
        } catch (error) {
            console.error('Error sending email:', error);
            alert('Failed to send email');
        }
    };

    const viewPdf = (pdf) => {
        setSelectedPdf(pdf);
        setIsPdfModalOpen(true);
        setEnabledRow(pdf._id);
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
            {/* Profile Cards Section */}
            <div className='w-full flex mb-4 justify-start'>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 text-blue font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition duration-200 transform hover:scale-105 active:scale-95"
          >
            <AiOutlineArrowLeft className="text-xl" />
          </button>
        </div>
            <Box display="flex" flexDirection="column" marginBottom={2}>
                <Grid container spacing={2}>
                    {/* Customer Profile Card */}
                    <Grid item xs={12} md={6}>
                        <Card variant="outlined" sx={{ height: 'auto', borderRadius: 2, padding: 2 }}>
                            <CardContent>
                                <Typography variant="h6" component="div" gutterBottom sx={{ fontWeight: 'bold', color: "rgb(52, 71, 103)" }}>
                                    Customer Profile
                                </Typography>
                                <Divider sx={{ margin: '10px 0' }} />
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                    <p className="text-gray-600 dark:text-gray-300 grid grid-cols-2 w-2/3"><strong>Father's Name:</strong> {customerDetails.fatherName || 'N/A'}</p>
                                    <p className="text-gray-600 dark:text-gray-300 grid grid-cols-2 w-2/3"><strong>Mother's Name:</strong> {customerDetails.motherName || 'N/A'}</p>
                                    <p className="text-gray-600 dark:text-gray-300 grid grid-cols-2 w-2/3"><strong>Email:</strong> {customerDetails.email || 'N/A'}</p>
                                    <p className="text-gray-600 dark:text-gray-300 grid grid-cols-2 w-2/3"><strong>WhatsApp Number:</strong> {customerDetails.whatsappNumber || 'N/A'}</p>
                                    <p className="text-gray-600 dark:text-gray-300 grid grid-cols-2 w-2/3"><strong>Baby's Gender:</strong> {customerDetails.babyGender || 'N/A'}</p>
                                    <hr className='my-2' />
                                    <p className="text-gray-600 dark:text-gray-300 grid grid-cols-2 w-2/3"><strong>Payment Date:</strong> {customerDetails?.paymentDate || 'N/A'}</p>
                                    <p className="text-gray-600 dark:text-gray-300 grid grid-cols-2 w-2/3"><strong>Payment Time:</strong> {customerDetails.paymentTime || 'N/A'}</p>
                                    <p className="text-gray-600 dark:text-gray-300 grid grid-cols-2 w-2/3"><strong>Payment Transaction ID:</strong> {customerDetails?.payTransactionID || 'N/A'}</p>
                                    <p className="text-gray-600 dark:text-gray-300 grid grid-cols-2 w-2/3"><strong>Amount Paid:</strong> {customerDetails?.amountPaid || 'N/A'}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Astrological Details Card */}
                    <Grid item xs={12} md={6}>
                        <div className="w-full bg-white dark:bg-gray-800 rounded-lg hover:shadow-xl transition-shadow duration-300 p-6 relative overflow-hidden" style={{ height: '422px' }}>
                            <div className="absolute inset-0 opacity-30 rounded-lg"></div>
                            <div className="relative z-10">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Astrological Details</h2>
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                    <p className="text-gray-600 dark:text-gray-300"><strong>Zodiac Sign:</strong> Leo</p>
                                    <p className="text-gray-600 dark:text-gray-300"><strong>Nakshatra:</strong> Ashwini</p>
                                    <p className="text-gray-600 dark:text-gray-300"><strong>Destiny Number:</strong> 5</p>
                                    <p className="text-gray-600 dark:text-gray-300"><strong>Gemstone:</strong> Ruby</p>
                                    <p className="text-gray-600 dark:text-gray-300"><strong>Lucky Metal:</strong> Gold</p>
                                    <p className="text-gray-600 dark:text-gray-300"><strong>Numerology:</strong> 3</p>
                                    <p className="text-gray-600 dark:text-gray-300"><strong>Preferred Starting Letter:</strong> A</p>
                                </div>
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </Box>

            {/* Generated PDFs Section */}
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Card variant="outlined" sx={{ borderRadius: 2 }}>
                        <CardContent>
                            <Typography variant="h6" component="div" gutterBottom sx={{ fontWeight: 'bold', color: "rgb(52, 71, 103)" }}>
                                Generated PDFs
                            </Typography>
                            <Divider sx={{ margin: '10px 0' }} />
                            
                            {pdfLoading ? (
                                <Box display="flex" justifyContent="center" alignItems="center" p={4}>
                                    <CircularProgress />
                                </Box>
                            ) : pdfError ? (
                                <Typography color="error">{pdfError}</Typography>
                            ) : pdfs.length === 0 ? (
                                <Typography color="text.secondary">No PDFs generated yet.</Typography>
                            ) : (
                                <Grid container spacing={2}>
                                    {pdfs.map((pdf, index) => (
                                        <Grid item xs={12} sm={6} md={4} key={pdf._id || index}>
                                            <Card 
                                                variant="outlined" 
                                                sx={{ 
                                                    cursor: 'pointer',
                                                    '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
                                                }}
                                                onClick={() => viewPdf(pdf)}
                                            >
                                                <CardContent>
                                                    <Box display="flex" alignItems="center" gap={1}>
                                                        <FileText size={24} />
                                                        <Typography variant="subtitle1">
                                                            Generated PDF #{index + 1}
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                        Generated: {new Date(pdf.createdAt).toLocaleDateString()}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* PDF Viewer Modal */}
            {isPdfModalOpen && selectedPdf && (
                <PDFViewer
                    pdfUrl={selectedPdf.pdfUrl}
                    handleDownload={handleDownload}
                    handleSendMail={handleSendMail}
                    email={customerDetails.email}
                    enabledRow={enabledRow}
                    pdfId={selectedPdf._id}
                    onClose={() => {
                        setIsPdfModalOpen(false);
                        setSelectedPdf(null);
                        setEnabledRow(null);
                    }}
                />
            )}
        </Box>
    );
};

export default Customer;