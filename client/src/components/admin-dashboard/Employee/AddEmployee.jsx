import { useState } from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { TextField, InputLabel, Typography } from '@mui/material';
import { toast } from "react-toastify"
import { useNavigate } from 'react-router-dom';
import { AiOutlineUpload, AiOutlineDelete } from "react-icons/ai"

import { ADD_EMPLOYEE_ROUTE } from '../../../utils/constants';

const steps = ['Personal Information', 'Identification Documents', 'Educational Qualifications', 'Previous Employment Details', 'Financial Information'];
const formKeys = ['personalInfo', 'idDocuments', 'education', 'employment', 'paymentDetails']

const AddEmployee = () => {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        personalInfo: {
            firstName: '',
            lastName: '',
            phone: '',
            email: '',
            city: '',
            address: '',
            state: '',
            country: '',
            pincode: '',
        },
        idDocuments: { aadharOrPan: '', passport: '', ssn: '' },
        education: { degrees: null, transcripts: null },
        employment: { employerName: '', jobTitle: '', startDate: '', endDate: '', reasonForLeaving: '' },
        paymentDetails: { cardNumber: '', cardholderName: '', cvv: '', expiryDate: '' },
    });

    const handleNext = () => {
        if (validateForm()) {
            setActiveStep((prev) => prev + 1);
        } else {
            console.log("form errors")
        }
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [formKeys[activeStep]]: {
                ...formData[formKeys[activeStep]],
                [name]: value
            }
        });
    };

    const validateForm = () => {
        const form = formData[formKeys[activeStep]];
        const formErrors = {};

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[679]\d{9}$/;
        const ssnRegex = /^\d{3}\d{2}\d{4}$/;
        const cvvRegex = /^\d{3}$/;
        const cardNumberRegex = /^\d{16}$/;

        if (activeStep === 0) {
            if (!form.firstName) formErrors.firstName = 'First name is required';
            if (!form.email) {
                formErrors.email = 'Email is required';
            } else if (!emailRegex.test(form.email)) {
                formErrors.email = 'Invalid email format';
            }
            if (!form.lastName) formErrors.lastName = 'Last name is required';
            if (!form.address) formErrors.address = 'Address is required';
            if (!form.city) formErrors.city = 'City is required';
            if (!form.phone) {
                formErrors.phone = 'Phone number is required';
            } else if (!phoneRegex.test(form.phone)) {
                formErrors.phone = 'Enter a valid 10-digit phone number';
            }
            if (!form.state) formErrors.state = 'State is required';
            if (!form.pincode) formErrors.pincode = 'Pincode is required';
            if (!form.country) formErrors.country = 'Country is required';
        }

        if (activeStep === 1) {
            if (!form.aadharOrPan) {
                formErrors.aadharOrPan = 'Aadhar Card or PAN Card is required';
            }
            if (!form.passport) formErrors.passport = 'Passport/Driving License is required';
            if (!form.ssn) {
                formErrors.ssn = 'Social Security Number is required';
            } else if (!ssnRegex.test(form.ssn)) {
                formErrors.ssn = 'Invalid SSN format. Use XXX XX XXXX';
            }
        }

        if (activeStep === 2) {
            if (!form.degrees) formErrors.degrees = 'Please upload your degrees/certificates';
            if (!form.transcripts) formErrors.transcripts = 'Please upload your transcripts';
        }

        if (activeStep === 3) {
            if (!form.employerName) formErrors.employerName = 'Employer Name is required';
            if (!form.jobTitle) formErrors.jobTitle = 'Job title is required';
            if (!form.startDate) {
                formErrors.startDate = 'Start date is required';
            }
            if (!form.endDate) {
                formErrors.endDate = 'End date is required';
            }
            if (!form.reasonForLeaving) formErrors.reasonForLeaving = 'Reason for leaving is required';
        }

        if (activeStep === 4) {
            if (!form.cardholderName) formErrors.cardholderName = 'Cardholder Name is required';
            if (!form.cardNumber) {
                formErrors.cardNumber = 'Card Number is required';
            }
            if (!cardNumberRegex.test(form.cardNumber)) {
                formErrors.cardNumber = 'Invalid Card Number. Use 16 digits ';
            }
            if (!form.expiryDate) {
                formErrors.expiryDate = 'Expiry Date is required';
            }
            if (!form.cvv) {
                formErrors.cvv = 'CVV is required';
            } else if (!cvvRegex.test(form.cvv)) {
                formErrors.cvv = 'Invalid CVV format. Use 3 digits';
            }
        }

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleFileChange = (e, section, field) => {
        const file = e.target.files[0];
        setFormData({
            ...formData,
            [section]: {
                ...formData[section],
                [field]: file
            }
        })
    }

    const handleFileClear = (section, field) => {
        setFormData({
            ...formData,
            [section]: {
                ...formData[section],
                [field]: null
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            const formDataToSend = new FormData();

            // personale info
            Object.keys(formData.personalInfo).forEach((key) => {
                formDataToSend.append(key, formData.personalInfo[key])
            })

            // idDocuments
            formDataToSend.append("aadharOrPan", formData.idDocuments.aadharOrPan);
            formDataToSend.append("passport", formData.idDocuments.passport);
            formDataToSend.append("ssn", formData.idDocuments.ssn);

            // degree and transcripts
            formDataToSend.append('degrees', formData.education.degrees);
            formDataToSend.append('transcripts', formData.education.transcripts);

            // previous employements
            Object.keys(formData.employment).forEach((key) => {
                formDataToSend.append(key, formData.employment[key])
            })

            // payment details
            Object.keys(formData.paymentDetails).forEach((key) => {
                formDataToSend.append(key, formData.paymentDetails[key])
            })

            try {
                setIsLoading(true);
                const res = await fetch(`${ADD_EMPLOYEE_ROUTE}`, {
                    method: "POST",
                    body: formDataToSend
                });

                if (!res.ok) {
                    throw new Error("NetWork issue");
                }

                const data = await res.json();
                setIsLoading(false);

                toast.success("employee created");
                navigate('/admin-dashboard/employees')
            } catch (error) {
                toast.error(error.message);
            }
        }
    }

    const renderForm = () => {
        switch (activeStep) {
            case 0:
                return (
                    <div className="space-y-8 p-2 sm:p-5 ">
                        <h2 className="text-lg font-semibold text-gray-700">General Information</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <TextField
                                className="flex-1"
                                label='First Name'
                                name="firstName"
                                value={formData.personalInfo.firstName}
                                onChange={handleChange}
                                error={!!errors.firstName}
                                helperText={errors.firstName}
                                required
                            />
                            <TextField
                                className="flex-1"
                                label={
                                    <Typography>
                                        Last Name<span style={{ color: 'red', marginLeft: '4px' }}>*</span>
                                    </Typography>
                                }
                                name="lastName"
                                value={formData.personalInfo.lastName}
                                onChange={handleChange}
                                error={!!errors.lastName}
                                helperText={errors.lastName}
                            />
                        </div>

                        <h3 className="text-lg font-semibold text-gray-700">Contact Information</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <TextField
                                label={
                                    <>
                                        Phone<span style={{ color: 'red', marginLeft: '4px' }}>*</span>
                                    </>
                                }
                                name="phone"
                                value={formData.personalInfo.phone}
                                onChange={handleChange}
                                error={!!errors.phone}
                                helperText={errors.phone}
                                inputProps={{
                                    maxLength: 10,
                                    inputMode: 'numeric',
                                    pattern: '[0-9]*'
                                }}
                                className="rounded-md shadow-sm bg-gray-50"
                            />
                            <TextField
                                label="Email"
                                name="email"
                                value={formData.personalInfo.email}
                                onChange={handleChange}
                                error={!!errors.email}
                                helperText={errors.email}
                                className="rounded-md shadow-sm bg-gray-50"
                            />
                        </div>

                        <h3 className="text-lg font-semibold text-gray-700">Address</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <TextField
                                label="Address"
                                name="address"
                                value={formData.personalInfo.address}
                                onChange={handleChange}
                                error={!!errors.address}
                                helperText={errors.address}
                                className="rounded-md shadow-sm bg-gray-50"
                                fullWidth
                            />
                            <TextField
                                label="City"
                                name="city"
                                value={formData.personalInfo.city}
                                onChange={handleChange}
                                error={!!errors.city}
                                helperText={errors.city}
                                className="rounded-md shadow-sm bg-gray-50"
                                fullWidth
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <TextField
                                label="State"
                                name="state"
                                value={formData.personalInfo.state}
                                onChange={handleChange}
                                error={!!errors.state}
                                helperText={errors.state}
                                className="rounded-md shadow-sm bg-gray-50"
                                required
                            />
                            <TextField
                                label="Pincode"
                                name="pincode"
                                value={formData.personalInfo.pincode}
                                onChange={handleChange}
                                error={!!errors.pincode}
                                helperText={errors.pincode}
                                className="rounded-md shadow-sm bg-gray-50"
                            />
                            <TextField
                                label="Country"
                                name="country"
                                value={formData.personalInfo.country}
                                onChange={handleChange}
                                error={!!errors.country}
                                helperText={errors.country}
                                className="rounded-md shadow-sm bg-gray-50"
                            />
                        </div>
                    </div>
                );

            case 1:
                return (
                    <div className="p-2 sm:p-5  space-y-8">
                        <h2 className="text-lg font-semibold text-gray-700">Identification Documents</h2>

                        {/* Aadhar or PAN section */}
                        {!formData.idDocuments.aadharOrPan ? (
                            <div className="flex flex-col">
                                <InputLabel className="text-gray-700">Aadhar or Pan</InputLabel>
                                <div className="mt-2 p-4 border-dashed border-2 border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center cursor-pointer">
                                    <label className="w-full h-full flex flex-col items-center justify-center">
                                        <span className="text-gray-500 flex gap-2 items-center">
                                            <AiOutlineUpload /> Upload File
                                        </span>
                                        <input
                                            type="file"
                                            accept=".jpg,.png,.jpeg"
                                            onChange={(e) => handleFileChange(e, 'idDocuments', 'aadharOrPan')}
                                            error={!!errors.aadharOrPan}
                                            helperText={errors.aadharOrPan}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                                {errors.aadharOrPan ? <span className='text-xs text-red-500'>aadhar or Pan is required</span> : ""}
                            </div>
                        ) : (
                            <div className="flex flex-col">
                                <InputLabel className="text-gray-700">Aadhar or Pan</InputLabel>
                                <div className="mt-2 p-4 border-dashed border-2 border-gray-300 rounded-lg w-40 h-40 bg-gray-50 flex items-center justify-center">
                                    <img
                                        src={URL.createObjectURL(formData.idDocuments.aadharOrPan)}
                                        alt="Aadhar or Pan"
                                        className=" object-cover"
                                    />
                                </div>
                                <button
                                    onClick={() => handleFileClear('idDocuments', 'aadharOrPan')}
                                    className="text-red-500 mt-2 flex items-center gap-2"
                                >
                                    <AiOutlineDelete /> Clear Upload
                                </button>
                            </div>
                        )}

                        {/* Passport or Driving License section */}
                        {!formData.idDocuments.passport ? (
                            <div className="flex flex-col">
                                <InputLabel className="text-gray-700">Passport </InputLabel>
                                <div className="mt-2 p-4 border-dashed border-2 border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center cursor-pointer">
                                    <label className="w-full h-full flex flex-col items-center justify-center">
                                        <span className="text-gray-500 flex gap-2 items-center">
                                            <AiOutlineUpload /> Upload File
                                        </span>
                                        <input
                                            type="file"
                                            accept=".jpg,.png,.jpeg"
                                            onChange={(e) => handleFileChange(e, 'idDocuments', 'passport')}
                                            error={!!errors.passport}
                                            helperText={errors.passport}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                                {errors.passport ? <span className='text-xs text-red-500'>passport or driving liscense is required</span> : ""}
                            </div>
                        ) : (
                            <div className="flex flex-col">
                                <InputLabel className="text-gray-700">Passport or Driving License</InputLabel>
                                <div className="mt-2 p-4 border-dashed border-2 border-gray-300 h-40 w-40 rounded-lg bg-gray-50 flex items-center justify-center">
                                    <img
                                        src={URL.createObjectURL(formData.idDocuments.passport)}
                                        alt="Passport or Driving License"
                                        className=" object-cover"
                                    />
                                </div>
                                <button
                                    onClick={() => handleFileClear('idDocuments', 'passport')}
                                    className="text-red-500 mt-2 flex items-center gap-2"
                                >
                                    <AiOutlineDelete /> Clear Upload
                                </button>
                            </div>
                        )}

                        {/* Social Security Number input */}
                        <TextField
                            label="Social Security Number"
                            name="ssn"
                            value={formData.idDocuments.ssn}
                            onChange={handleChange}
                            className="rounded-md shadow-sm bg-gray-50"
                            fullWidth
                            error={!!errors.ssn}
                            helperText={errors.snn}
                        />
                    </div>
                );

            case 2:
                return (
                    <div className="p-2 sm:p-5  space-y-8">
                        <h2 className="text-lg font-semibold text-gray-700">Educational Qualifications</h2>

                        {/* Degrees/Certificates Section */}
                        {!formData.education.degrees ? (
                            <div className="flex flex-col">
                                <InputLabel className="text-gray-700">Upload Degrees/Certificates</InputLabel>
                                <div className="mt-2 p-4 border-dashed border-2 border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center cursor-pointer">
                                    <label className="w-full h-full flex flex-col items-center justify-center">
                                        <span className="text-gray-500 flex items-center gap-2">
                                            <AiOutlineUpload /> Upload File
                                        </span>
                                        <input
                                            type="file"
                                            onChange={(e) => handleFileChange(e, 'education', 'degrees')}
                                            className="hidden"
                                            accept=".jpg,.png,.jpeg"
                                            error={!!errors.degrees}
                                            helperText={errors.degrees}
                                        />
                                    </label>
                                </div>
                                {errors.degrees ? <span className='text-xs text-red-500'>degree certificate is required</span> : ""}
                            </div>
                        ) : (
                            <div className="flex flex-col">
                                <InputLabel className="text-gray-700">Degrees/Certificates</InputLabel>
                                <div className="mt-2 p-4 border-dashed border-2 h-40 w-40 border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center">
                                    <img
                                        src={URL.createObjectURL(formData.education.degrees)}
                                        alt="Degrees/Certificates"
                                        className=" object-cover"
                                    />
                                </div>
                                <button
                                    onClick={() => handleFileClear('education', 'degrees')}
                                    className="text-red-500 mt-2 flex items-center gap-2"
                                >
                                    <AiOutlineDelete /> Clear Upload
                                </button>
                            </div>
                        )}

                        {/* Transcripts Section */}
                        {!formData.education.transcripts ? (
                            <div className="flex flex-col">
                                <InputLabel className="text-gray-700">Upload Transcripts</InputLabel>
                                <div className="mt-2 p-4 border-dashed border-2 border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center cursor-pointer">
                                    <label className="w-full h-full flex flex-col items-center justify-center">
                                        <span className="text-gray-500 flex items-center gap-2">
                                            <AiOutlineUpload /> Upload File
                                        </span>
                                        <input
                                            type="file"
                                            onChange={(e) => handleFileChange(e, 'education', 'transcripts')}
                                            className="hidden"
                                            accept=".jpg,.png,.jpeg"
                                            error={!!errors.transcripts}
                                            helperText={errors.transcripts}
                                        />
                                    </label>
                                </div>
                                {errors.transcripts ? <span className='text-xs text-red-500'>transcript is required</span> : ""}
                            </div>
                        ) : (
                            <div className="flex flex-col">
                                <InputLabel className="text-gray-700">Transcripts</InputLabel>
                                <div className="mt-2 h-40 w-40 p-4 border-dashed border-2  border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center">
                                    <img
                                        src={URL.createObjectURL(formData.education.transcripts)}
                                        alt="Transcripts"
                                        className=" object-cover"
                                    />
                                </div>
                                <button
                                    onClick={() => handleFileClear('education', 'transcripts')}
                                    className="text-red-500 mt-2 flex items-center gap-2"
                                >
                                    <AiOutlineDelete /> Clear Upload
                                </button>
                            </div>
                        )}
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6 p-2 sm:p-5">
                        <h2 className="text-lg font-semibold text-gray-700">Previous Employment Details</h2>
                        <TextField
                            label="Previous Employer Name"
                            name="employerName"
                            value={formData.employment.employerName}
                            onChange={handleChange}
                            className="rounded-md shadow-sm bg-gray-50"
                            fullWidth
                        />
                        <TextField
                            label="Job Title"
                            name="jobTitle"
                            value={formData.employment.jobTitle}
                            onChange={handleChange}
                            className="rounded-md shadow-sm bg-gray-50"
                            fullWidth
                        />
                        <div className="grid gap-2">
                            <label
                                htmlFor="startDate"
                                className="block text-sm capitalize font-medium "
                            >
                                start date
                            </label>
                            <TextField
                                name="startDate"
                                type='date'
                                value={formData.employment.startDate}
                                onChange={handleChange}
                                className="rounded-md shadow-sm bg-gray-50"
                                fullWidth
                            />
                        </div>
                        <div className="grid gap-2">
                            <label
                                htmlFor="endDate"
                                className="block capitalize text-sm font-medium "
                            >
                                end date
                            </label>
                            <TextField
                                type='date'
                                name="endDate"
                                value={formData.employment.endDate}
                                onChange={handleChange}
                                className="rounded-md shadow-sm bg-gray-50"
                                fullWidth
                            />
                        </div>
                        <TextField
                            label="Reason for Leaving"
                            name="reasonForLeaving"
                            value={formData.employment.reasonForLeaving}
                            onChange={handleChange}
                            className="rounded-md shadow-sm bg-gray-50"
                            fullWidth
                        />
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-6 p-2 sm:p-5">
                        <h2 className="text-2xl font-semibold text-gray-700">Payment Details</h2>
                        <p className="text-sm text-gray-500">Please provide your payment details for billing.</p>

                        <TextField
                            label="Cardholder Name"
                            name="cardholderName"
                            value={formData.paymentDetails.cardholderName}
                            onChange={handleChange}
                            className="rounded-md shadow-sm bg-gray-50"
                            fullWidth
                        />
                        <TextField
                            label="Card Number"
                            name="cardNumber"
                            value={formData.paymentDetails.cardNumber}
                            onChange={handleChange}
                            className="rounded-md shadow-sm bg-gray-50"
                            fullWidth
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="grid gap-2">
                                <label
                                    htmlFor="expiryDate"
                                    className="block text-sm font-medium text-gray-500"
                                >
                                    expiry date
                                </label>
                                <TextField
                                    id="expiryDate"
                                    name="expiryDate"
                                    type='date'
                                    value={formData.paymentDetails.expiryDate}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md shadow-sm bg-gray-50"
                                />
                            </div>
                            <div className="grid gap-2">
                                <label
                                    htmlFor="cvv"
                                    className="block text-sm font-medium opacity-0"
                                >
                                    cvv
                                </label>
                                <TextField
                                    label="CVV"
                                    name="cvv"
                                    value={formData.paymentDetails.cvv}
                                    onChange={handleChange}
                                    className="rounded-md shadow-sm bg-gray-50"
                                />
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return isLoading ? (
        <div className='h-full flex items-center justify-center'>
            <div className="w-10 h-10 border-gray-500 border-t-black border-[3px] animate-spin rounded-full" />
        </div>
    ) : (
        <div className="h-full p-5 ">
            <Box className="flex flex-col  h-full p-5 ">
                <Stepper activeStep={activeStep} className="p-10 w-full">
                    {steps.map((label, index) => (
                        <Step className='' key={label}>
                            <StepLabel><span className="hidden xl:block  text-center  tracking-wider">{label}</span></StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <div className="flex-1 mx-auto w-full p-5 flex flex-col justify-between   bg-white shadow-lg rounded-lg">
                    {renderForm()}
                    <Box className="flex p-2 justify-between">
                        <Button
                            disabled={activeStep === 0}
                            color="inherit"
                            className="mr-1"
                            sx={{ fontSize: "1.1rem", padding: "6px 15px", border: "1px solid black" }}
                            onClick={handleBack}
                        >
                            Previous
                        </Button>
                        {activeStep === steps.length - 1 ? (
                            <Button
                                sx={{ border: "1px solid blue", backgroundColor: "green", color: "white", padding: "6px 15px", fontWeight: "700" }}
                                onClick={handleSubmit}
                            >
                                Finish
                            </Button>
                        ) : (
                            <div className='flex gap-10'>
                                <Button
                                    sx={{ border: "1px solid red", color: "red", padding: "6px 15px", fontWeight: "400" }}
                                    onClick={() => navigate("/admin-dashboard/employees")}
                                    className='hover:bg-red-600 hover:text-white'
                                >
                                    cancel
                                </Button>
                                <Button
                                    sx={{ border: "1px solid blue", backgroundColor: "#3B82F6", color: "white", padding: "6px 15px", fontWeight: "700" }}
                                    onClick={handleNext}
                                >
                                    next
                                </Button>
                            </div>
                        )
                        }
                    </Box>
                </div>
            </Box>
        </div>
    );
};

export default AddEmployee;
