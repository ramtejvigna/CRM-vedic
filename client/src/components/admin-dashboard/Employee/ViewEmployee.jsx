import React, { useEffect, useState } from "react";
import { HOST, GET_EMPLOYEE_BY_ID } from "../../../utils/constants";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { Avatar, Card, Button, Box, CircularProgress } from "@mui/material";
import { GiCrossMark } from "react-icons/gi";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  AiOutlineUpload,
  AiOutlineDelete,
  AiOutlineClose,
  AiOutlineDownload,
  AiOutlinePrinter,
} from "react-icons/ai";

import {
  ArrowBigLeft,
  ArrowLeftFromLineIcon,
  AlignLeft,
  ArrowLeftToLine,
  ArrowLeft,
} from "lucide-react";
import { TbArrowBigLeftLineFilled } from "react-icons/tb";
import { FaArrowLeft } from "react-icons/fa";
const ViewEmployee = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [employee, setEmployee] = useState({});
  const { id } = useParams();

  useEffect(() => {
    const getEmployee = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${GET_EMPLOYEE_BY_ID}?id=${id}`);

        if (!res.ok) {
          toast.error("Error fetching employee!");
        }

        const data = await res.json();
        setIsLoading(false);
        setEmployee(data.employee);
      } catch (error) {
        toast.error(error.message);
      }
    };

    getEmployee();
  }, [id]);

  const downloadImage = (base64String) => {
    const link = document.createElement("a");
    link.href = `data:image/jpeg;base64,${base64String}`;
    link.download = "document.jpg"; // Name of the downloaded file
    link.click();
  };

  const printImage = (base64String) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
        <html>
            <head>
                <title>Print Image</title>
            </head>
            <body>
                <img src="data:image/jpeg;base64,${base64String}" style="max-width:100%;"/>
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return isLoading ? (
    <div className="h-full flex items-center justify-center">
      <CircularProgress size={50}/>
    </div>
  ) : (
    <div className="flex flex-col w-full  h-full">
      <div className="flex items-center mb-6  p-2 gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-900 hover:text-blue-500"
        >
          <ArrowLeft size={20} className="mr-2" /> {/* Back arrow icon */}
        </button>
        <h2 className="text-lg font-semibold">Employee Details</h2>
      </div>
      <div className="flex flex-wrap   p-2 gap-3 rounded-xl">
        <Card className="bg-white flex-1 basis-auto shadow-md rounded-lg overflow-hidden p-6 ">
          <h2 className="text-xl font-semibold flex items-center justify-between text-gray-800 mb-4">
            <span>Personal Details</span>
            {employee?.role && (
              <span className="px-4 py-2 text-xs rounded-full border border-blue-500 ">
                {employee?.role}
              </span>
            )}
          </h2>

          <div className="border-t border-gray-200">
            <dl>
              <div className="py-2 flex">
                <dt className="text-gray-500 w-1/3">First Name</dt>
                <dd className="text-gray-900 font-medium flex-1">
                  {employee?.firstName}
                </dd>
              </div>

              <div className="py-2 flex">
                <dt className="text-gray-500 w-1/3">Last Name</dt>
                <dd className="text-gray-900 font-medium flex-1">
                  {employee?.lastName}
                </dd>
              </div>

              <div className="py-2 flex">
                <dt className="text-gray-500 w-1/3">Email</dt>
                <dd className="text-gray-900 font-medium flex-1">
                  {employee?.email}
                </dd>
              </div>

              <div className="py-2 flex">
                <dt className="text-gray-500 w-1/3">Phone</dt>
                <dd className="text-gray-900 font-medium flex-1">
                  {employee?.phone}
                </dd>
              </div>

              <div className="py-2 flex">
                <dt className="text-gray-500 w-1/3">Address</dt>
                <dd className="text-gray-900 font-medium flex-1">
                  {employee?.address +
                    " , " +
                    employee?.city +
                    " , " +
                    employee?.pincode}
                </dd>
              </div>

              <div className="py-2 flex">
                <dt className="text-gray-500 w-1/3">Location</dt>
                <dd className="text-gray-900 font-medium flex-1">
                  {employee?.state + " , " + employee?.country}
                </dd>
              </div>
            </dl>
          </div>
        </Card>

        <Card className="bg-white flex-1 basis-auto shadow-md rounded-lg overflow-hidden p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Employment Details
          </h2>

          <div className="border-t border-gray-200">
            <dl>
              <div className="py-2 flex">
                <dt className="text-gray-500 w-1/3">Employer Name</dt>
                <dd className="text-gray-900 font-medium flex-1">
                  {employee?.employerName || "Information Not Provided"}
                </dd>
              </div>

              <div className="py-2 flex">
                <dt className="text-gray-500 w-1/3">Job Title</dt>
                <dd className="text-gray-900 font-medium flex-1">
                  {employee?.jobTitle || "Information Not Provided"}
                </dd>
              </div>

              <div className="py-2 flex">
                <dt className="text-gray-500 w-1/3">Start Date</dt>
                <dd className="text-gray-900 font-medium flex-1">
                  {isNaN(new Date(employee?.startDate))
                    ? "Invalid Date"
                    : format(new Date(employee?.startDate), "MM/dd/yyyy") ||
                      "Information Not Provided"}
                </dd>
              </div>

              <div className="py-2 flex">
                <dt className="text-gray-500 w-1/3">End Date</dt>
                <dd className="text-gray-900 font-medium flex-1">
                  {isNaN(new Date(employee?.endDate))
                    ? "Invalid Date"
                    : format(new Date(employee?.endDate), "MM/dd/yyyy") ||
                      "Information Not Provided"}
                </dd>
              </div>

              <div className="py-2 flex">
                <dt className="text-gray-500 w-1/3">Reason for Leaving</dt>
                <dd className="text-gray-900 font-medium flex-1">
                  {employee?.reasonForLeaving || "Information Not Provided"}
                </dd>
              </div>
            </dl>
          </div>
        </Card>
      </div>
      <div className="flex flex-wrap p-2 gap-3 ">
        <Card className="flex-1 basis-auto  flex flex-col gap-6 p-6 bg-white rounded-xl  border border-gray-200">
          <h1 className="text-xl  font-semibold text-gray-700 ">Document</h1>

          <div className="flex flex-col h-full border-t p-2">
            {!employee?.aadharOrPan &&
            !employee?.degrees &&
            !employee?.transcripts ? (
              <div className="h-full w-full flex items-center justify-center">
                <span className="text-xl text-wrap font-semibold">
                  No documents found.
                </span>
              </div>
            ) : (
              [
                { name: "Aadhar", url: employee?.aadharOrPan },
                employee?.degrees  && { name: "Degree", url: employee?.degrees } ,
                employee?.transcripts && { name: "Transcripts", url: employee?.transcripts },
              ].filter(a => a).map((document, index) => (
                <div className="py-2 flex justify-between items-center">
                  <span className='text-gray-500 w-1/3"'>{document.name}</span>
                  <button
                    onClick={() =>
                      setImage({ doc: document.url, name: document.name })
                    }
                    className="bg-blue-500 px-3  text-white rounded-lg"
                  >
                    View
                  </button>
                </div>
              ))
            )}
          </div>
        </Card>
        <Card className="bg-white flex-1 basis-auto shadow-md rounded-lg overflow-hidden p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Financial Details
          </h2>

          <div className="border-t border-gray-200">
            <dl>
              <div className="py-2 flex">
                <dt className="text-gray-500 w-1/3">Account Holder Name</dt>
                <dd className="text-gray-900 font-medium flex-1">
                  {employee?.accountHolderName || "Information Not Provided"}
                </dd>
              </div>

              <div className="py-2 flex">
                <dt className="text-gray-500 w-1/3">Bank Name</dt>
                <dd className="text-gray-900 font-medium flex-1">
                  {employee?.bankName || "Information Not Provided"}
                </dd>
              </div>

              <div className="py-2 flex">
                <dt className="text-gray-500 w-1/3">Branch Name</dt>
                <dd className="text-gray-900 font-medium flex-1">
                  {employee?.branchName || "Information Not Provided"}
                </dd>
              </div>

              <div className="py-2 flex">
                <dt className="text-gray-500 w-1/3">Bank Account Number</dt>
                <dd className="text-gray-900 font-medium flex-1">
                  {employee?.bankAccountNumber || "Information Not Provided"}
                </dd>
              </div>

              <div className="py-2 flex">
                <dt className="text-gray-500 w-1/3">IFSC Code</dt>
                <dd className="text-gray-900 font-medium flex-1">
                  {employee?.ifscCode || "Information Not Provided"}
                </dd>
              </div>
            </dl>
          </div>
        </Card>
      </div>
      {image && (
        <div className="fixed z-[1000] top-0 left-0 right-0 bottom-0 bg-black/20 backdrop-blur-md flex items-center justify-center overflow-scroll scrollbar-hide">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.5, ease: "backInOut" }}
            className="bg-white w-full overflow-scroll scrollbar-hide p-7 mx-auto max-w-[800px] shadow-xl h-full my-auto max-h-[600px] relative"
          >
            {/* Close button */}
            <div className="flex absolute top-1 right-1 justify-end items-end ">
              <AiOutlineClose
                className="text-xl cursor-pointer"
                onClick={() => setImage(null)}
              />
            </div>

            {/* Download and Print Buttons */}
            <div className="w-full p-5 flex items-center justify-between bg-black">
              <div className="p-2">
                <span className="text-xl text-white tracking-wider capitalize">
                  {image.name}
                </span>
              </div>
              <div>
                <button
                  onClick={() => downloadImage(image?.doc)}
                  className="px-4 py-2 text-white font-semibold rounded-md transition-all"
                >
                  <AiOutlineDownload className="text-xl" />
                </button>

                {/* Print Button */}
                <button
                  onClick={() => printImage()}
                  className="px-4 py-2 text-white font-semibold rounded-md transition-all"
                >
                  <AiOutlinePrinter className="text-xl" />
                </button>
              </div>
            </div>

            {/* Iframe Container */}
            <div className="flex items-center overflow-scroll justify-center w-full h-[90%]">
              <img
                src={`data:image/jpeg;base64,${image?.doc}`}
                height={"100%"}
                className="object-cover"
                // Ensures image scales within the iframe
              />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ViewEmployee;
