import React, { useEffect, useState } from "react";
import axios from "axios";
import { CircularProgress, Box } from "@mui/material";
import { useParams } from "react-router-dom";

const CustomerDetails = () => {
  const { fatherName } = useParams();
  const [customerDetails, setCustomerDetails] = useState(null);
  const [pdfs, setPdfs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCustomerDetails = async () => {
      try {
        const response = await axios.get(
          `https://vedic-backend-neon.vercel.app/customers/getCustomerDetails/${fatherName}`
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

    const getCustomerPdfs = async () => {
      try {
        const response = await axios.get(
          `https://vedic-backend-neon.vercel.app/customers/getCustomerPdfs/${fatherName}`
        );
        setPdfs(response.data);
      } catch (err) {
        console.error("Error fetching PDF data", err);
      }
    };

    getCustomerDetails();
    getCustomerPdfs();
  }, [fatherName]);

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
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information Card */}
        <div className="bg-gray-100 rounded-xl shadow-lg p-6 border border-gray-300 flex flex-col justify-between">
          <h2 className="text-xl uppercase font-bold text-gray-800 mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-gray-600">Father's Name</span>
              <span className="text-lg font-medium text-gray-900">{customerDetails.fatherName || "N/A"}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-gray-600">Mother's Name</span>
              <span className="text-lg font-medium text-gray-900">{customerDetails.motherName || "N/A"}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-gray-600">Email</span>
              <span className="text-lg font-medium text-gray-900">{customerDetails.email || "N/A"}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-gray-600">WhatsApp Number</span>
              <span className="text-lg font-medium text-gray-900">{customerDetails.whatsappNumber || "N/A"}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-gray-600">Baby's Gender</span>
              <span className="text-lg font-medium text-gray-900">{customerDetails.babyGender || "N/A"}</span>
            </div>
          </div>
        </div>

        {/* Payment Details Card */}
        <div className="bg-gray-100 rounded-xl shadow-lg p-6 border border-gray-300 flex flex-col">
          <h2 className="text-xl uppercase font-bold text-gray-800 mb-4">Payment Details</h2>
          <div className="flex-grow">
            <div className="grid grid-cols-1 gap-2">
              <p className="text-gray-600"><strong>Payment Date:</strong> {customerDetails?.paymentDate || "N/A"}</p>
              <p className="text-gray-600"><strong>Payment Time:</strong> {customerDetails?.paymentTime || "N/A"}</p>
              <p className="text-gray-600"><strong>Transaction ID:</strong> {customerDetails?.payTransactionID || "N/A"}</p>
              <p className="text-gray-600"><strong>Amount Paid:</strong> {customerDetails?.amountPaid || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Employee Assigned Card */}
        <div className="bg-gray-100 rounded-xl shadow-lg p-6 border border-gray-300 flex flex-col">
          <h2 className="text-xl uppercase font-bold text-gray-800 mb-4">Assigned Employee</h2>
          {customerDetails.assignedEmployee ? (
            <div className="text-gray-600">
              <p><strong>Name:</strong> {customerDetails.assignedEmployee.name}</p>
              <p><strong>Email:</strong> {customerDetails.assignedEmployee.email}</p>
              <p><strong>Contact:</strong> {customerDetails.assignedEmployee.phone}</p>
            </div>
          ) : (
            <p className="text-gray-600">No employee assigned.</p>
          )}
        </div>

        {/* Astrological Details Card */}
        <div className="bg-gray-100 rounded-xl shadow-lg p-6 border border-gray-300 flex flex-col">
          <h2 className="text-xl uppercase font-bold text-gray-800 mb-4">Astrological Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-gray-600">Zodiac Sign</span>
              <span className="text-lg font-medium text-gray-900">Leo</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-gray-600">Nakshatra</span>
              <span className="text-lg font-medium text-gray-900">Ashwini</span>
            </div>
           
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-gray-600">Gemstone</span>
              <span className="text-lg font-medium text-gray-900">Ruby</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-gray-600">Lucky Metal</span>
              <span className="text-lg font-medium text-gray-900">Gold</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-gray-600">Numerology</span>
              <span className="text-lg font-medium text-gray-900">3</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-gray-600">Preferred Starting Letter</span>
              <span className="text-lg font-medium text-gray-900">A</span>
            </div>
          </div>
          
        </div>

        {/* PDF Details Card */}
        <div className="bg-gray-100 rounded-xl shadow-lg p-6 border border-gray-300 flex flex-col lg:col-span-2">
          <h2 className="text-xl uppercase font-bold text-gray-800 mb-4">Generated PDFs</h2>
          <div className="overflow-auto flex-grow">
            {pdfs.length > 0 ? (
              <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-center">S.No</th>
                    <th className="border p-2 text-center">Generated Date</th>
                    <th className="border p-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pdfs.map((pdf, index) => (
                    <tr key={pdf.uniqueId} className="hover:bg-gray-50">
                      <td className="border p-2 text-center">{index + 1}</td>
                      <td className="border p-2 text-center">{new Date(pdf.createdAt).toLocaleDateString()}</td>
                      <td className="border p-2 text-center">
                        <button className="text-blue-500 hover:text-blue-700" onClick={() => viewPdf(pdf.base64Pdf)}>
                          View PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-600">No PDFs generated yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;