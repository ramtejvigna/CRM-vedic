import { useState } from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Input } from '@material-tailwind/react';
import { TextField, InputLabel, Typography } from '@mui/material';

const steps = ['Personal Information', 'Identification Documents', 'Educational Qualifications', 'Previous Employment Details', 'Financial Information'];
const formKeys = ['personalInfo', 'idDocuments', 'education', 'employment', 'financial']
const AddEmployee = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        personalInfo: {
            fullName: '',
            dob: '',
            phone: '',
            email: '',
            city: '',
            state: '',
            country: '',
            pincode: '',
        },
        idDocuments: { aadhar: '', pan: '', passport: '', ssn: '' },
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
                    <div className='space-y-3  p-2 sm:p-10'>
                        <span className='text-sm text-back/40'>GENERAL</span>
                        <div className='flex gap-5 flex-wrap'>
                            <TextField className='flex-1 basis-[300px]' label="Full Name" name="fullName" value={formData.personalInfo.fullName} onChange={handleChange} error={!!errors.fullName} helperText={errors.fullName} />
                            <TextField className='flex-1 basis-[300px]' type='date' name="dob" value={formData.personalInfo.dob} onChange={handleChange} error={!!errors.dob} helperText={errors.dob} />
                        </div>
                        <span className='text-sm text-back/40'>CONTACT</span>
                        <div className="flex gap-5 flex-wrap">
                            <TextField className='flex-1 basis-[300px]' label="Phone Number" name="phone" value={formData.personalInfo.phone} onChange={handleChange} error={!!errors.phone} helperText={errors.phone} fullWidth />
                            <TextField className='flex-1 basis-[300px]' label="Email" name="email" value={formData.personalInfo.email} onChange={handleChange} fullWidth error={!!errors.email} helperText={errors.email} />
                        </div>
                        <span className='text-sm text-back/40'>CONTACT</span>
                        <TextField label="Address" name="address" value={formData.personalInfo.address} onChange={handleChange} error={!!errors.address} helperText={errors.address} fullWidth />
                        <TextField label="state" name="state" value={formData.personalInfo.state} onChange={handleChange} fullWidth error={!!errors.state} helperText={errors.state} />
                        <TextField label="pincode" name="pincode" value={formData.personalInfo.pincode} onChange={handleChange} fullWidth error={!!errors.pincode} helperText={errors.pincode} />
                        <TextField label="country" name="country" value={formData.personalInfo.country} onChange={handleChange} fullWidth error={!!errors.country} helperText={errors.country} />
                    </div>
                );
            case 1:
                return (
                    <div className='flex flex-col w-full h-full gap-5 p-5'>
                        <TextField label="Aadhar Card" name="aadhar" value={formData.idDocuments.aadhar} onChange={handleChange} fullWidth error={!!errors.aadhar} helperText={errors.aadhar} />
                        <TextField label="PAN Card" name="pan" value={formData.idDocuments.pan} onChange={handleChange} fullWidth />
                        <div className="flex-1 flex flex-col">
                            <InputLabel className="text-gray-700">Passport or Driving License</InputLabel>
                            <div className="mt-2  h-full border  rounded-lg bg-gray-50 flex items-center justify-center cursor-pointer">
                                <label className="w-full border flex-col  h-full flex items-center justify-center cursor-pointer">
                                    <span className="text-gray-500">Upload File</span>
                                    <input
                                        type="file"
                                        onChange={(e) => handleFileChange(e, 'idDocuments', 'passport')}
                                        className="hiden"
                                    />
                                </label>
                            </div>
                        </div>


                        <TextField label="Social Security Number" name="ssn" value={formData.idDocuments.ssn} onChange={handleChange} fullWidth />
                    </div>
                );
            case 2:
                return (
                    <div className='flex flex-col w-full h-full gap-5 p-5'>
                        <div className="flex-1 flex flex-col">
                            <InputLabel className="text-gray-700">Upload Degrees/Certificates</InputLabel>
                            <div className="mt-2  h-full border  rounded-lg bg-gray-50 flex items-center justify-center cursor-pointer">
                                <label className="w-full border flex-col  h-full flex items-center justify-center cursor-pointer">
                                    <span className="text-gray-500">Upload File</span>
                                    <input
                                        type="file"
                                        onChange={(e) => handleFileChange(e, 'education', 'degrees')}

                                    />
                                </label>
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col">
                            <InputLabel className="text-gray-700">Upload Transcripts</InputLabel>
                            <div className="mt-2  h-full border  rounded-lg bg-gray-50 flex items-center justify-center cursor-pointer">
                                <label className="w-full border flex-col  h-full flex items-center justify-center cursor-pointer">
                                    <span className="text-gray-500">Upload File</span>
                                    <input
                                        type="file"
                                        onChange={(e) => handleFileChange(e, 'education', 'transcripts')}

                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className='space-y-10 w-full h-full sm:p-10'>
                        <TextField label="Previous Employer Name" name="employerName" value={formData.employment.employerName} onChange={handleChange} fullWidth />
                        <TextField label="Job Title" name="jobTitle" value={formData.employment.jobTitle} onChange={handleChange} fullWidth />
                        <TextField label="Start Date" name="startDate" value={formData.employment.startDate} onChange={handleChange} fullWidth />
                        <TextField label="End Date" name="endDate" value={formData.employment.endDate} onChange={handleChange} fullWidth />
                        <TextField label="Reason for Leaving" name="reasonForLeaving" value={formData.employment.reasonForLeaving} onChange={handleChange} fullWidth />
                    </div>
                );
            case 4:
                return (
                    <div className='space-y-7 p-5 sm:p-10'>
                        {/* Payment Details */}
                        <h2 className="text-2xl font-bold text-gray-700 mb-5">Payment Details</h2>
                        <p className="text-sm text-gray-500">Please provide your payment details for billing.</p>

                        <TextField
                            label="Cardholder Name"
                            name="cardholderName"
                            value={formData.paymentDetails.cardholderName}
                            onChange={handleChange}
                            fullWidth
                            InputProps={{
                                className: 'rounded-lg bg-gray-50'
                            }}
                        />
                        <TextField
                            label="Card Number"
                            name="cardNumber"
                            value={formData.paymentDetails.cardNumber}
                            onChange={handleChange}
                            fullWidth
                            InputProps={{
                                className: 'rounded-lg bg-gray-50'
                            }}
                        />
                        <label className='pt-11 text-black/80'>Expiry Date</label>
                        <TextField
                            name="expiryDate"
                            type="date"
                            value={formData.paymentDetails.expiryDate}
                            onChange={handleChange}
                            fullWidth
                            InputProps={{
                                className: 'rounded-lg bg-gray-50'
                            }}
                        />
                        <TextField
                            label="CVV"
                            name="cvv"
                            value={formData.paymentDetails.cvv}
                            onChange={handleChange}
                            fullWidth
                            InputProps={{
                                className: 'rounded-lg bg-gray-50'
                            }}
                        />
                    </div>
                );
            default:
                return <Typography>Unknown Step</Typography>;
        }
    };

    return (
        <div className="h-full p-5">
            <Box className="flex flex-col  h-full p-5">
                <Stepper activeStep={activeStep} className="p-10 w-full">
                    {steps.map((label, index) => (
                        <Step className='' key={label}>
                            <StepLabel><span className="hidden xl:block  text-center  tracking-wider">{label}</span></StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <div className="flex-1 flex justify-center items-center ">
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
                        Back
                    </Button>
                    {activeStep === steps.length - 1 ? (
                        <Button
                            sx={{ border: "1px solid blue", backgroundColor: "green", color: "white", padding: "6px 15px", fontWeight: "700" }}
                            onClick={handleSubmit}
                        >
                            Finish
                        </Button>
                    ) : (
                        <Button
                            sx={{ border: "1px solid blue", backgroundColor: "blue", color: "white", padding: "6px 15px", fontWeight: "700" }}
                            onClick={handleNext}
                        >
                            next
                        </Button>
                    )

                    }
                </Box>
            </Box>
        </div>
    );
};




export default AddEmployee;