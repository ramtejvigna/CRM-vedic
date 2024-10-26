import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { CircularProgress, Box } from "@mui/material";
import { useParams } from "react-router-dom";
import { generatePdf } from './pdfDisplayComponent';
import PDFViewer from './PDFviewer';
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

            <div className="max-w-7xl mx-auto mb-6">
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => navigate(-1)} // Navigate back
                        className="flex items-center text-gray-900 hover:text-blue-500"
                    >
                        <ArrowLeft size={20} className="mr-2" /> {/* Back arrow icon */}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Personal Information & Assigned Employee Card */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-300 flex flex-col">
                        {/* Personal Information */}
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Personal Information</h2>
                        <div className="grid grid-cols-1 gap-2">
                            <p className="text-gray-600"><strong>CustomerID:</strong> {customerDetails.customerID || "N/A"}</p>
                            <p className="text-gray-600"><strong>Father Name:</strong> {customerDetails.fatherName || "N/A"}</p>
                            <p className="text-gray-600"><strong>Mother Name:</strong> {customerDetails.motherName || "N/A"}</p>
                            <p className="text-gray-600"><strong>Email Id:</strong> {customerDetails.email || "N/A"}</p>
                            <p className="text-gray-600"><strong>WhatsApp Number:</strong> {customerDetails.whatsappNumber || "N/A"}</p>
                            <p className="text-gray-600"><strong>Baby Gender:</strong> {customerDetails.babyGender || "N/A"}</p>
                        </div>

                        {/* Divider */}
                        <hr className="my-3 border-gray-300" />
                        <p className="text-gray-600"><strong>Requested On:</strong> {customerDetails.createdDateTime || "N/A"}</p>
                        <hr className="my-3 border-gray-300" />

                        {/* Assigned Employee */}
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Assigned Employee</h2>
                        {customerDetails.assignedEmployee ? (
                            <div className="text-gray-600">
                                <p><strong>Name:</strong> {customerDetails.assignedEmployee.firstName}</p>
                                <p><strong>Email Id:</strong> {customerDetails.assignedEmployee.email}</p>
                                <p><strong>Contact:</strong> {customerDetails.assignedEmployee.phone}</p>
                            </div>
                        ) : (
                            <p className="text-gray-600">No employee assigned.</p>
                        )}
                    </div>
                    

                    {/* Payment Details & Astrological Details Card */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-300 flex flex-col">
                        {/* Payment Details */}
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Details</h2>
                        {customerDetails?.customerStatus === "newRequests" ? (
                            <div className="flex-grow flex items-center justify-center">
                                <p className="text-center">Payment details not verified yet.</p>
                            </div>
                        ) : customerDetails?.customerStatus === "rejected" ? (
                            <div className="flex-grow flex items-center justify-center">
                                <p className="text-red-600 text-center font-bold">Payment Status: Rejected</p>
                            </div>
                        ) : (
                            <div className="flex-grow">
                                <div className="grid grid-cols-1 gap-2">
                                    <p className="text-gray-600"><strong>Payment Date:</strong> {customerDetails?.paymentDate || "N/A"}</p>
                                    <p className="text-gray-600"><strong>Payment Time:</strong> {customerDetails?.paymentTime || "N/A"}</p>
                                    <p className="text-gray-600"><strong>Transaction ID:</strong> {customerDetails?.payTransactionID || "N/A"}</p>
                                    <p className="text-gray-600"><strong>Amount Paid:</strong> {customerDetails?.amountPaid || "N/A"}</p>
                                </div>
                            </div>
                        )}

                        {/* Divider */}
                        <hr className="my-6 border-gray-300" />

                        {/* Astrological Details */}
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Astrological Details</h2>
                        <div className="grid grid-cols-1 gap-2">
                            <p className="text-gray-600"><strong>Zodiac Sign:</strong> Leo</p>
                            <p className="text-gray-600"><strong>Nakshatra:</strong> Ashwini</p>
                            <p className="text-gray-600"><strong>Gemstone:</strong> Ruby</p>
                            <p className="text-gray-600"><strong>Lucky Metal:</strong> Gold</p>
                            <p className="text-gray-600"><strong>Numerology:</strong> 3</p>
                            <p className="text-gray-600"><strong>Preferred Starting Letter:</strong> A</p>
                        </div>
                    </div>
                </div>
            </div>



            <div className="w-full bg-white mt-10 dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex w-full items-center justify-between mb-6">
                    <h2 className="text-xl font-bold   text-gray-800 dark:text-white">Generated PDFs</h2>
                    <div className="flex items-center space-x-2">
                        <Eye className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{pdfs.length} PDFs Generated</span>
                    </div>
                </div>

                {pdfsLoading ? (
                    <div className="flex items-center justify-center h-[400px]">
                        <div className="relative w-16 h-16">
                            <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
                            <div className="absolute top-0 left-0 w-full h-full border-4 border-t-blue-500 rounded-full animate-spin"></div>
                        </div>
                    </div>
                ) : (
                    <div className="w-full rounded-lg border border-gray-200 dark:border-gray-700">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xm font-medium text-gray-500 dark:text-gray-400  tracking-wider">
                                        SNo.
                                    </th>
                                    <th className="px-6 py-4 text-left text-xm font-medium text-gray-500 dark:text-gray-400  tracking-wider">
                                        Generated On
                                    </th>
                                    <th className="px-6 py-4 text-center text-xm font-medium text-gray-500 dark:text-gray-400  tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-right text-xm font-medium text-gray-500 dark:text-gray-400  tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                {pdfs.map((pdf, index) => (
                                    <React.Fragment key={pdf._id}>
                                        <tr
                                            className={`group hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 cursor-pointer
                      ${expandedRow === pdf._id ? 'bg-gray-50 dark:bg-gray-800' : ''}`}
                                            onClick={() => setExpandedRow(expandedRow === pdf._id ? null : pdf._id)}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{index + 1}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {new Date(pdf.createdAt).toLocaleDateString('en-US', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        {new Date(pdf.createdAt).toLocaleTimeString('en-US', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center justify-center space-x-4">
                                                    <div className="flex items-center space-x-2">
                                                        <div className={`flex items-center justify-center h-8 w-8 rounded-full transition-colors duration-300 
                            ${pdf.whatsappStatus ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
                                                            {pdf.whatsappStatus ? (
                                                                <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                                                            ) : (
                                                                <X className="h-3 w-3 text-red-600 dark:text-red-400" />
                                                            )}
                                                        </div>
                                                        <span className="text-sm font-semibold text-gray-500">WhatsApp</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <div className={`flex items-center justify-center h-8 w-8 rounded-full transition-colors duration-300 
                            ${pdf.mailStatus ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
                                                            {pdf.mailStatus ? (
                                                                <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                                                            ) : (
                                                                <X className="h-3 w-3 text-red-600 dark:text-red-400" />
                                                            )}
                                                        </div>
                                                        <span className="text-sm font-semibold text-gray-500">Email</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <div className="relative">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setActiveDropdown(activeDropdown === pdf._id ? null : pdf._id);
                                                            }}
                                                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
                                                        >
                                                            <MoreHorizontal className="h-5 w-5" />
                                                        </button>

                                                        {activeDropdown === pdf._id && (
                                                            <>
                                                                <div
                                                                    className="fixed inset-0 z-10"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setActiveDropdown(null);
                                                                    }}
                                                                />
                                                                <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-20 animate-in slide-in-from-top-2 duration-200">
                                                                    {[
                                                                        { icon: FileText, label: 'View PDF', action: 'view' },
                                                                        { icon: MessageCircle, label: 'Send to WhatsApp', action: 'whatsapp' },
                                                                        { icon: Mail, label: 'Send to Mail', action: 'mail' },
                                                                        { icon: ThumbsUp, label: 'Give Feedback', action: 'feedback' }
                                                                    ].map((item, i) => (
                                                                        <button
                                                                            key={i}
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleActionClick(item.action, pdf);
                                                                            }}
                                                                            className="flex items-center w-full px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                                                                        >
                                                                            <item.icon className="h-4 w-4 mr-3" />
                                                                            <span>{item.label}</span>
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
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