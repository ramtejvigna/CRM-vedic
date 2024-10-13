import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Divider,
  CircularProgress,
} from "@mui/material";
import { Edit, Delete, FileText, TypeOutline } from "lucide-react";

const Customer = () => {
  const { fatherName } = useParams();
  const [customerDetails, setCustomerDetails] = useState(null);
  const [pdfs, setPdfs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCustomerDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/customers/getCustomerDetails/${fatherName}`
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
          `http://localhost:3000/customers/getCustomerPdfs/${fatherName}`
        );
        setPdfs(response.data);
      } catch (err) {
        console.error("Error fetching PDF data", err);
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

  const viewPdf = (base64Pdf) => {
    const pdfWindow = window.open();
    pdfWindow.document.write(
      `<iframe width='100%' height='100%' src='data:application/pdf;base64,${base64Pdf}'></iframe>`
    );
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
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
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 gap-5 ">
          {/* Profile Card */}
          <div className="w-full  bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 relative overflow-hidden">
            <div className="absolute inset-0  opacity-30 rounded-lg"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Profile
                </h2>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="text-blue-500 hover:text-blue-700 transition duration-200"
                >
                  <Edit size={20} />
                </button>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <p className="text-gray-600 dark:text-gray-300 grid grid-cols-2 w-2/3">
                  <strong>Father's Name:</strong>{" "}
                  {customerDetails.fatherName || "N/A"}
                </p>
                <p className="text-gray-600 dark:text-gray-300 grid grid-cols-2 w-2/3">
                  <strong>Mother's Name:</strong>{" "}
                  {customerDetails.motherName || "N/A"}
                </p>
                <p className="text-gray-600 dark:text-gray-300 grid grid-cols-2 w-2/3">
                  <strong>Email:</strong> {customerDetails.email || "N/A"}
                </p>
                <p className="text-gray-600 dark:text-gray-300 grid grid-cols-2 w-2/3">
                  <strong>WhatsApp Number:</strong>{" "}
                  {customerDetails.whatsappNumber || "N/A"}
                </p>
                <p className="text-gray-600 dark:text-gray-300 grid grid-cols-2 w-2/3">
                  <strong>Baby's Gender:</strong>{" "}
                  {customerDetails.babyGender || "N/A"}
                </p>
                <hr className="my-2" />
                <p className="text-gray-600 dark:text-gray-300 grid grid-cols-2 w-2/3">
                  <strong>payment date:</strong>{" "}
                  {customerDetails?.paymentDate || "N/A"}
                </p>
                <p className="text-gray-600 dark:text-gray-300 grid grid-cols-2 w-2/3">
                  <strong>payment time:</strong>{" "}
                  {customerDetails.paymentTime || "N/A"}
                </p>
                <p className="text-gray-600 dark:text-gray-300 grid grid-cols-2 w-2/3">
                  <strong>payment transaction id:</strong>{" "}
                  {customerDetails?.payTransactionID || "N/A"}
                </p>
                <p className="text-gray-600 dark:text-gray-300 grid grid-cols-2 w-2/3">
                  <strong>Amount paid:</strong>{" "}
                  {customerDetails?.amountPaid || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Astrological Details Card */}
          <div className="w-full  bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 relative overflow-hidden">
            <div className="absolute inset-0  opacity-30 rounded-lg"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                Astrological Details
              </h2>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Zodiac Sign:</strong> Leo
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Nakshatra:</strong> Ashwini
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Destiny Number:</strong> 5
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Gemstone:</strong> Ruby
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Lucky Metal:</strong> Gold
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Numerology:</strong> 3
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Preferred Starting Letter:</strong> A
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Suggested Baby Names:</strong> Aryan, Aadhya
                </p>
              </div>
            </div>
          </div>

          {/* Generated PDFs Card */}
          <div className="w-full col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 relative overflow-hidden">
            <div className="absolute inset-0  opacity-30 rounded-lg"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                Generated PDFs
              </h2>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                {pdfs.length > 0 ? (
                  <table className="min-w-full border-collapse border border-gray-200 dark:border-gray-700">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-gray-700 ">
                        <th className="border  border-gray-200 dark:border-gray-700 p-2 text-center">
                          S.No
                        </th>
                        <th className="border  border-gray-200 dark:border-gray-700 p-2 text-center">
                          pdf
                        </th>
                        <th className="border border-gray-200 dark:border-gray-700 p-2 text-center">
                          Generated Time/Date
                        </th>
                        <th className="border border-gray-200 dark:border-gray-700 p-2 text-center">
                          Actions
                        </th>
                        <th className="border border-gray-200 dark:border-gray-700 p-2 text-center">
                          Rating
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pdfs.map((pdf, index) => (
                        <tr
                          key={pdf.uniqueId}
                          className="hover:bg-gray-50 dark:hover:bg-gray-600 transition duration-200"
                        >
                          <td className="border border-gray-200 dark:border-gray-700 p-2 text-center">
                            {index + 1}
                          </td>
                          <td className="border border-gray-200 dark:border-gray-700 p-2 text-center">
                            {"pdf1"}
                          </td>
                          <td className="border border-gray-200 dark:border-gray-700 p-2 text-center">
                            <span>{"12/12/2023 3:00 PM"}</span>
                          </td>
                          <td className="border border-gray-200 dark:border-gray-700 p-2 text-center">
                            <button className=" text-blue-700 rounded-lg px-4 py-1 transition duration-200">
                              {" "}
                              <FaDownload />{" "}
                            </button>
                            <button className=" text-green-700 rounded-lg px-4 py-1 transition duration-200">
                              {" "}
                              <FaWhatsapp />{" "}
                            </button>
                            <button className=" text-red-700 rounded-lg px-4 py-1 transition duration-200">
                              {" "}
                              <FaEnvelope />{" "}
                            </button>
                          </td>
                          <td className="border justify-center flex gap-2 border-gray-200 dark:border-gray-700 p-2 text-center">
                            <button className="flex items-center text-gray-700 rounded-lg px-4 py-1 bg-gray-200 hover:bg-gray-300 transition duration-200">
                              <FaEye className="mr-2" /> {/* Eye icon */}
                              view
                            </button>
                            <button className="flex items-center text-red-700 rounded-lg px-4 py-1 bg-red-200 hover:bg-red-300 transition duration-200">
                              <FaStar className="mr-2" /> {/* Star icon */}
                              edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-600 dark:text-gray-300">
                    No PDFs generated yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customer;
