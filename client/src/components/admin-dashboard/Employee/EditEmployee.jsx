import { useEffect, useState } from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Input } from '@material-tailwind/react';
import { TextField, InputLabel, Typography } from '@mui/material';
import {Link, Navigate} from 'react-router-dom';
import { useNavigate , useParams } from 'react-router-dom';
const steps = ['Personal Information', 'Identification Documents', 'Educational Qualifications', 'Previous Employment Details', 'Financial Information'];
const formKeys = ['personalInfo', 'idDocuments', 'education', 'employment', 'financial']
const EditEmployee = () => {
    const navigate = useNavigate();
    const {user} = useParams();
    const [activeStep, setActiveStep] = useState(0);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        personalInfo: {
            fullName: '',
            dob: '',
            phone: '',
            email: '',
            city: '',
            address : '' ,
            state: '',
            country: '',
            pincode: '',
        },
        idDocuments: { aadhar: '', pan: '', passport: '', ssn: '' },
        education: { degrees: null, transcripts: null },
        employment: { employerName: '', jobTitle: '', startDate: '', endDate: '', reasonForLeaving: '' },
        paymentDetails: { cardNumber: '', cardholderName: '', cvv: '', expiryDate: '' },
    });

    // useEffect(() => setFormData(user)  , []);

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
        // validateForm();
    };

    const validateForm = () => {
        const form = formData[formKeys[activeStep]];
        const formErrors = {};


        if (activeStep === 0) {
            if (!form.fullName) formErrors.fullName = 'Full Name is required';
            if (!form.email) formErrors.email = 'Email is required';
            if (!form.dob) formErrors.dob = 'Date of Birth is required';
            if (!form.address) formErrors.address = 'Address is required';
            if (!form.phone) formErrors.phone = 'Phone number is required';
            if (!form.state) formErrors.state = 'State is required';
            if (!form.pincode) formErrors.pincode = 'Pincode is required';
            if (!form.country) formErrors.country = 'Country is required';
        }

        if (activeStep === 1) {
            if (!form.aadhar) formErrors.aadhar = 'Aadhar Card is required';
            if (!form.pan) formErrors.pan = 'PAN Card is required';
            if (!form.passport) formErrors.passport = 'Passport/Driving License is required';
            if (!form.ssn) formErrors.ssn = 'Social Security Number is required';
        }


        if (activeStep === 2) {
            if (!form.degrees) formErrors.degrees = 'Please upload your degrees/certificates';
            if (!form.transcripts) formErrors.transcripts = 'Please upload your transcripts';
        }

        if (activeStep === 3) {
            if (!form.company) formErrors.company = 'Company Name is required';
            if (!form.position) formErrors.position = 'Position is required';
            if (!form.experience) formErrors.experience = 'Years of Experience is required';
        }

        if (activeStep === 4) {
            if (!form.cardholderName) formErrors.cardholderName = 'Cardholder Name is required';
            if (!form.cardNumber) formErrors.cardNumber = 'Card Number is required';
            if (!form.expiryDate) formErrors.expiryDate = 'Expiry Date is required';
            if (!form.cvv) formErrors.cvv = 'CVV is required';
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



    const handleSubmit = () => {

        console.log('Form submitted successfully:', formData);
        alert('Employee added successfully!');
    };


    const renderForm = () => {
        switch (activeStep) {
            case 0:
                return (
                    <div className="space-y-8 p-4 sm:p-10 bg-white shadow-lg rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-700">General Information</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <TextField
                                className="flex-1"
                                label="Full Name"
                                name="fullName"
                                value={formData.personalInfo.fullName}
                                onChange={handleChange}
                                error={!!errors.fullName}
                                helperText={errors.fullName}
                                InputProps={{ className: 'rounded-md shadow-sm bg-gray-50' }}
                            />
                            <TextField
                                className="flex-1"
                                type="date"
                                name="dob"
                                value={formData.personalInfo.dob}
                                onChange={handleChange}
                                error={!!errors.dob}
                                helperText={errors.dob}
                                InputProps={{ className: 'rounded-md shadow-sm bg-gray-50' }}
                            />
                        </div>
    
                        <h3 className="text-lg font-semibold text-gray-700">Contact Information</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <TextField
                                label="Phone Number"
                                name="phone"
                                value={formData.personalInfo.phone}
                                onChange={handleChange}
                                error={!!errors.phone}
                                helperText={errors.phone}
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
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <TextField
                                label="State"
                                name="state"
                                value={formData.personalInfo.state}
                                onChange={handleChange}
                                error={!!errors.state}
                                helperText={errors.state}
                                className="rounded-md shadow-sm bg-gray-50"
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
                    <div className="p-6 sm:p-10 bg-white shadow-lg rounded-lg space-y-8">
                        <h2 className="text-lg font-semibold text-gray-700">Identification Documents</h2>
                        <TextField
                            label="Aadhar Card"
                            name="aadhar"
                            value={formData.idDocuments.aadhar}
                            onChange={handleChange}
                            error={!!errors.aadhar}
                            helperText={errors.aadhar}
                            className="rounded-md shadow-sm bg-gray-50"
                            fullWidth
                        />
                        <TextField
                            label="PAN Card"
                            name="pan"
                            value={formData.idDocuments.pan}
                            onChange={handleChange}
                            className="rounded-md shadow-sm bg-gray-50"
                            fullWidth
                        />
    
                        <div className="flex flex-col">
                            <InputLabel className="text-gray-700">Passport or Driving License</InputLabel>
                            <div className="mt-2 p-4 border-dashed border-2 border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center cursor-pointer">
                                <label className="w-full h-full flex flex-col items-center justify-center">
                                    <span className="text-gray-500">Upload File</span>
                                    <input
                                        type="file"
                                        onChange={(e) => handleFileChange(e, 'idDocuments', 'passport')}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>
    
                        <TextField
                            label="Social Security Number"
                            name="ssn"
                            value={formData.idDocuments.ssn}
                            onChange={handleChange}
                            className="rounded-md shadow-sm bg-gray-50"
                            fullWidth
                        />
                    </div>
                );
    
            case 2:
                return (
                    <div className="p-6 sm:p-10 bg-white shadow-lg rounded-lg space-y-8">
                        <h2 className="text-lg font-semibold text-gray-700">Educational Qualifications</h2>
                        <div className="flex flex-col">
                            <InputLabel className="text-gray-700">Upload Degrees/Certificates</InputLabel>
                            <div className="mt-2 p-4 border-dashed border-2 border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center cursor-pointer">
                                <label className="w-full h-full flex flex-col items-center justify-center">
                                    <span className="text-gray-500">Upload File</span>
                                    <input
                                        type="file"
                                        onChange={(e) => handleFileChange(e, 'education', 'degrees')}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>
    
                        <div className="flex flex-col">
                            <InputLabel className="text-gray-700">Upload Transcripts</InputLabel>
                            <div className="mt-2 p-4 border-dashed border-2 border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center cursor-pointer">
                                <label className="w-full h-full flex flex-col items-center justify-center">
                                    <span className="text-gray-500">Upload File</span>
                                    <input
                                        type="file"
                                        onChange={(e) => handleFileChange(e, 'education', 'transcripts')}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                );
    
            case 3:
                return (
                    <div className="space-y-6 p-6 sm:p-10 bg-white shadow-lg rounded-lg">
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
                        <TextField
                            label="Start Date"
                            name="startDate"
                            value={formData.employment.startDate}
                            onChange={handleChange}
                            className="rounded-md shadow-sm bg-gray-50"
                            fullWidth
                        />
                        <TextField
                            label="End Date"
                            name="endDate"
                            value={formData.employment.endDate}
                            onChange={handleChange}
                            className="rounded-md shadow-sm bg-gray-50"
                            fullWidth
                        />
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
                    <div className="space-y-6 p-6 sm:p-10 bg-white shadow-lg rounded-lg">
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
                            <TextField
                                label="Expiry Date"
                                name="expiryDate"
                                value={formData.paymentDetails.expiryDate}
                                onChange={handleChange}
                                className="rounded-md shadow-sm bg-gray-50"
                            />
                            <TextField
                                label="CVV"
                                name="cvv"
                                value={formData.paymentDetails.cvv}
                                onChange={handleChange}
                                className="rounded-md shadow-sm bg-gray-50"
                            />
                        </div>
                    </div>
                );
    
            default:
                return null;
        }
    };
    
    return (
        <div className="h-full p-5 ">
            <Box className="flex flex-col  h-full p-5 ">
                <Stepper activeStep={activeStep} className="p-10 w-full">
                    {steps.map((label, index) => (
                        <Step className='' key={label}>
                            <StepLabel><span className="hidden xl:block  text-center  tracking-wider">{label}</span></StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <div className="flex-1 xl:px-32">
                    {renderForm()}
                </div>
                <Box className="flex p-2 justify-between">
                    <Button
                        disabled={activeStep === 0}
                        color="inherit"
                        className="mr-1"
                        sx={{ fontSize: "1.1rem", padding: "6px 15px", border: "1px solid black" }}
                        onClick={handleBack}
                    >
                        {"< "}Previous
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
                                CANCEL EDIT
                            </Button>
                            <Button
                                sx={{ border: "1px solid blue", backgroundColor: "blue", color: "white", padding: "6px 15px", fontWeight: "700" }}
                                onClick={handleNext}
                            >
                                next {" >"}
                            </Button>
                        </div>
                    )

                    }
                </Box>
            </Box>
        </div>
    );
};




export default EditEmployee;