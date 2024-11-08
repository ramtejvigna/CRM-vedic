import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { CircularProgress, Box } from "@mui/material";
import { useParams } from "react-router-dom";
import { generatePdf } from './pdfDisplayComponent';
import PDFViewer from './PDFviewer';
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {  Star } from 'lucide-react';

import {
    Edit,
    FileText,
    MessageCircle,
    Mail,
    ThumbsUp,
    MoreHorizontal,
    Check,
    X,
    ChevronDown,
    Eye,
    AlertCircle
} from 'lucide-react';

const Customer = () => {
    const { id } = useParams();
    const [customerDetails, setCustomerDetails] = useState(null);
    const [pdfs, setPdfs] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pdfsLoading, setPdfsLoading] = useState(false);
    const [feedback, setFeedback] = useState('');
    const navigate = useNavigate();
    const customerId = customerDetails?._id;
    const iframeRef = useRef(null);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [enabledRow, setEnabledRow] = useState(null); // State to track which row's buttons are enabled
    const [showViewer, setShowViewer] = useState(false); // State to control PDF viewer visibility
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [expandedRow, setExpandedRow] = useState(null);

    const handleActionClick = (action, pdf) => {
        setActiveDropdown(null);
        if (action === 'view') {
            handleShowPdf(pdf.babyNames, pdf._id)
        } else if (action === 'mail') {
            handleSetPdfUrl(pdf.babyNames);
            handleSendMail(pdfUrl, pdf._id, customerDetails.email);
        } else if (action === 'whatsapp') {

        } else if (action === 'feedback') {

        }
    };

    useEffect(() => {
        const getCustomerDetails = async (id) => {
            try {
                const response = await axios.get(
                    `https://vedic-backend-neon.vercel.app/customers/getCustomerDetails/${id}`
                );
                setCustomerDetails(response.data);
                setLoading(false);
            } catch (err) {
                setError(
                    err.response
                        ? err.response.data.message
                        : "Error fetching customer details"
                );
                setLoading(false);
            }
        };

        getCustomerDetails(id);

    }, [id]);

    const fetchPdfs = async () => {
        try {
            setPdfsLoading(true);
            const response = await axios.get(`https://vedic-backend-neon.vercel.app/api/generatedpdf?customerId=${customerId}`);
            if (response.data.length > 0) {
                setPdfs(response.data);
                console.log(response.data);
            }
            setPdfsLoading(false);
        } catch (error) {
            console.error('Error fetching PDFs:', error);
        }
    };

    useEffect(() => {
        if (customerId) {
            fetchPdfs();
        }
    }, [customerId]);
    const handleSetPdfUrl = async (babyNames) => {
        const generatedPdfUrl = await generatePdf(babyNames);
        setPdfUrl(generatedPdfUrl);
    }
    const handleShowPdf = async (babyNames, _id) => {
        const generatedPdfUrl = await generatePdf(babyNames); // Call the generatePdf function
        setPdfUrl(generatedPdfUrl); // Set the URL state
        setEnabledRow(_id);
        setShowViewer(true);
    };

    const handleClose = () => {
        setShowViewer(false); // Hide the PDF viewer
        setPdfUrl(''); // Reset PDF URL
        setEnabledRow(null); // Reset enabled row
    };

    const handleDownload = (pdfUrl, uniqueId) => {
        if (!pdfUrl) {
            alert('No PDF URL found. Please generate the PDF first.');
            return;
        }
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.download = `${uniqueId}.pdf`;
        link.click();
    };

    const handleSendMail = async (pdfUrl, uniqueId, email) => {
        if (!email || !pdfUrl) {
            alert("Provide a valid email and ensure the PDF is generated.");
            return;
        }

        try {
            await axios.post("https://vedic-backend-neon.vercel.app/api/send-pdf-email", {
                email,
                pdfUrl,
                uniqueId,
            });
            alert("PDF sent to email");
        } catch (error) {
            console.error("Error sending PDF to email", error);
            alert("Error sending email");
        }
    };

    const handleSendWhatsApp = async (pdfUrl, uniqueId, phoneNumber) => {
        if (!phoneNumber || !pdfUrl || !uniqueId) {
            alert("Provide a valid phone number and ensure the PDF is generated.");
            return;
        }

        try {
            await axios.post("https://vedic-backend-neon.vercel.app/api/send-pdf-whatsapp", {
                phoneNumber,
                pdfUrl,
                uniqueId,
            });
            alert("PDF sent to WhatsApp");
        } catch (error) {
            console.error("Error sending PDF via WhatsApp", error);
            alert("Error sending WhatsApp message");
        }
    };

    const viewPdf = (base64Pdf) => {
        const pdfWindow = window.open();
        pdfWindow.document.write(
            `<iframe width='100%' height='100%' src='data:application/pdf;base64,${base64Pdf}'></iframe>`
        );
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
        <div className="min-h-screen p-4 sm:p-8">

<div className="bg-white rounded-xl shadow-lg p-6 border border-gray-300 flex flex-col">
    
    {/* Back Button and Header */}
    <div className="flex items-center mb-6">
        <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-900 hover:text-blue-500"
        >
            <ArrowLeft size={20} className="mr-2" /> {/* Back arrow icon */}
        </button>
        <h2 className="text-lg font-semibold">Customer Details</h2>
    </div>

    {/* Customer Name in Large Font */}
    <p className="text-2xl font-medium ml-4 mb-4">{customerDetails.fatherName}</p>
{/* Bordered Box around Customer Info */}
<div className="border border-gray-900 rounded-lg p-4 mb-4">
<h2 className="text-lg font-semibold mb-4">Customer Summary</h2>

    {/* Grid Layout for Customer Info */}
    <div className="grid grid-cols-2 md:grid-cols-4 ">
        {[
            { label: "customer Id", value: customerDetails.customerID },
            { label: "date Joined", value: new Date(customerDetails.createdDateTime).toLocaleDateString() },
            { label: "Contact No", value: customerDetails.whatsappNumber },
            { label: "Email", value: customerDetails.email }
        ].map((item, index) => (
            <div key={index} className="flex flex-col">
                
                {/* Label with Full-width HR Line */}
                <p className="text-sm font-bold text-gray-500 capitalize">{item.label}</p>
                <hr className="my-3 border-gray-300 w-full" />

                {/* Value with Full-width HR Line */}
                <p className=" text-gray-900">{item.value}</p>
            </div>
        ))}
    </div>
</div>
    
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Baby Details Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-900 p-6">
                    <h2 className="text-lg font-semibold mb-4">Baby Details</h2>
                    <hr className="my-3 border-gray-300 w-full" />

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Gender:</p>
                            <p className="mt-1 text-gray-900">{customerDetails.babyGender || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Place of Birth:</p>
                            <p className="mt-1 text-gray-900">{customerDetails.birthplace || "N/A"}</p>
                        </div>
                        <div>
    <p className="text-sm font-medium text-gray-500">Date of Birth:</p>
    <p className="mt-1 text-gray-900">
        {customerDetails.babyBirthDate
            ? new Date(customerDetails.babyBirthDate).toLocaleDateString()
            : "N/A"}
    </p>
</div>

                        <div>
                            <p className="text-sm font-medium text-gray-500">Time of Birth:</p>
                            <p className="mt-1 text-gray-900">{customerDetails.babyBirthTime || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Mother's Name:</p>
                            <p className="mt-1 text-gray-900">{customerDetails.motherName || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Father's Name:</p>
                            <p className="mt-1 text-gray-900">{customerDetails.fatherName || "N/A"}</p>
                        </div>
                        <div>
    <p className="text-sm font-medium text-gray-500">Preferred Starting Letter:</p>
    <p className="mt-1 text-gray-900">{customerDetails.preferredStartingLetter || "N/A"}</p>
</div>

{/* Horizontal Line */}
<div className="col-span-2 my-4">
                <hr className="border-t border-gray-200" />
            </div>
<div>
    <p className="text-sm font-medium text-gray-500">Zodiac Sign:</p>
    <p className="mt-1 text-gray-900">{customerDetails.zodiacSign || "Leo"}</p>
</div>

                        <div>
                            <p className="text-sm font-medium text-gray-500">Nakshatra:</p>
                            <p className="mt-1 text-gray-900">{customerDetails.nakshatra || "Ashwini"}</p>
                        </div>
                       
                        <div>
                            <p className="text-sm font-medium text-gray-500">Numerology No :</p>
                            <p className="mt-1 text-gray-900">{customerDetails.nakshatra || "3"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Lucky Colour:</p>
                            <p className="mt-1 text-gray-900">{customerDetails.zodiacSign || "blue"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Gemstone:</p>
                            <p className="mt-1 text-gray-900">{customerDetails.nakshatra || "Ruby"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Destiny Number:</p>
                            <p className="mt-1 text-gray-900">{customerDetails.zodiacSign || "7"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Lucky Day:</p>
                            <p className="mt-1 text-gray-900">{customerDetails.nakshatra || "friday"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Lucky God:</p>
                            <p className="mt-1 text-gray-900">{customerDetails.zodiacSign || "Lord Shiva"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Lucky Metal:</p>
                            <p className="mt-1 text-gray-900">{customerDetails.nakshatra || "Gold"}</p>
                        </div>
                    </div>
                </div>
              {/* Right Column */}
              <div className="space-y-6">
                {/* Payment Data Card */}
                <div className="border border-gray-900 rounded-lg p-6">
                  <h2 className="text-lg font-medium text-gray-500 mb-4">Payment Data</h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Payment Date</p>
                      <p className="mt-1">{customerDetails?.paymentDate ? new Date(customerDetails.paymentDate).toLocaleDateString() : "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Payment Time</p>
                      <p className="mt-1">{customerDetails?.paymentTime || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Astro Offer</p>
                      <p className="mt-1">{customerDetails?.offer || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Source (Instagram Lead)</p>
                      <p className="mt-1">{customerDetails?.otherSource || "N/A"}</p>
                    </div>
                  </div>
                </div>
    
                {/* PDFs Generated Card */}
                <div className="border border-gray-900 rounded-lg p-6">
                  <h2 className="text-lg font-semibold mb-4">PDF's Generated</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-2 text-left">PDF</th>
                          <th className="px-4 py-2 text-left">Generated</th>
                          <th className="px-4 py-2 text-center"><MessageCircle className="inline h-4 w-4" /></th>
                          <th className="px-4 py-2 text-center"><Mail className="inline h-4 w-4" /></th>
                          <th className="px-4 py-2 text-center">Feedback</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pdfs.map((pdf) => (
                          <tr key={pdf._id} className="border-b">
                            <td className="px-4 py-2">
                              <button onClick={() => handleShowPdf(pdf.babyNames, pdf._id)}>
                                <FileText className="h-4 w-4 text-blue-600" />
                              </button>
                            </td>
                            <td className="px-4 py-2">
                              <div className="flex flex-col">
                                <span className="text-sm">{new Date(pdf.createdAt).toLocaleDateString()}</span>
                                <span className="text-xs text-gray-500">{new Date(pdf.createdAt).toLocaleTimeString()}</span>
                              </div>
                            </td>
                            <td className="px-4 py-2 text-center">
                              <div className={`h-3 w-3 rounded-full ${pdf.whatsappStatus ? 'bg-green-500' : 'bg-red-500'} mx-auto`} />
                            </td>
                            <td className="px-4 py-2 text-center">
                              <div className={`h-3 w-3 rounded-full ${pdf.mailStatus ? 'bg-green-500' : 'bg-red-500'} mx-auto`} />
                            </td>
                            <td className="px-4 py-2">
                              <div className="flex justify-center space-x-1">
                                {[...Array(3)].map((_, i) => (
                                  <Star key={i} className={`h-4 w-4 ${i < 3 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
 
</div>
           
            <div className="w-full bg-white mt-10 dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex w-full items-center justify-between mb-6">
                    <h2 className="text-xl font-bold   text-gray-800 dark:text-white">PDF's Generated </h2>
                    <div className="flex items-center space-x-2">
                    </div>
                </div>
                </div>
          
                <div className="mt-8">
                {showViewer && (
                    <PDFViewer
                        pdfUrl={pdfUrl}
                        handleDownload={handleDownload}
                        handleSendMail={handleSendMail}
                        email={customerDetails.email}
                        enabledRow={enabledRow}
                        pdfId={enabledRow}
                        onClose={handleClose} // Pass the close handler
                    />
                )}
            </div>
        
        </div>
    );
};

export default Customer;
