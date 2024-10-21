import { useEffect, useState } from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {toast} from "react-toastify"
import { Input } from '@material-tailwind/react';
import {AiOutlineUpload , AiOutlineDelete} from "react-icons/ai"
import { TextField, InputLabel, Typography } from '@mui/material';
import {Link, Navigate} from 'react-router-dom';
import { useNavigate , useParams } from 'react-router-dom';
import { GET_EMPLOYEE_BY_ID, UPDATE_EMPLOYEE } from '../../../utils/constants';
const steps = ['Personal Information', 'Identification Documents', 'Educational Qualifications', 'Previous Employment Details', 'Financial Information'];
const formKeys = ['personalInfo', 'idDocuments', 'education', 'employment', 'paymentDetails']
const EditEmployee = () => {
    const [image , setImage] = useState(null);
    const navigate = useNavigate();
    const {id} = useParams();
    const [activeStep, setActiveStep] = useState(0);
    const [errors, setErrors] = useState({});
    const [isLoading , setIsLoading] = useState(false);
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
        idDocuments: { aadharOrPan : '', passport: '', ssn: '' },
        education: { degrees: null, transcripts: null },
        employment: { employerName: '', jobTitle: '', startDate: Date, endDate: Date, reasonForLeaving: '' },
        paymentDetails: { cardNumber: '', cardholderName: '', cvv: '', expiryDate: Date },
    });

    useEffect(() =>{ 
        const getEmployee = async () => {
            try {
                setIsLoading(true);
                const res = await fetch(`${GET_EMPLOYEE_BY_ID}?id=${id}`);

                if(!res.ok) {
                    toast.error("Error !");
                }

                const data = await res.json();
                setIsLoading(false);

                const formatDate = (isoDate) => {
                    const date = new Date(isoDate);
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based in JS
                    const day = String(date.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                };

                setFormData((prev) => ({
                    personalInfo: {
                        ...prev.personalInfo, 
                        firstName: data.employee.firstName, 
                        lastName: data.employee.lastName,
                        phone: data.employee.phone,
                        email: data.employee.email,
                        city: data.employee.city,
                        address: data.employee.address,
                        state: data.employee.state,
                        country: data.employee.country,
                        pincode: data.employee.pincode,
                    },
                    idDocuments: {
                        ...prev.idDocuments, 
                        aadharOrPan: data.employee.aadharOrPan,
                        passport: data.employee.passport,
                        ssn: data.employee.ssn,
                    },
                    education : {
                        ...prev.educacation ,
                        degrees : data.employee.degrees,
                        transcripts : data.employee.transcripts
                    },
                    employment: {
                        ...prev.employment,
                        employerName: data.employee.employerName,
                        jobTitle: data.employee.jobTitle,
                        startDate: formatDate(data.employee.startDate), // Convert date
                        endDate: formatDate(data.employee.endDate), // Convert date
                        reasonForLeaving: data.employee.reasonForLeaving,
                    },
                    paymentDetails: {
                        ...prev.paymentDetails,
                        cardNumber: data.employee.cardNumber,
                        cardholderName: data.employee.cardholderName,
                        cvv: data.employee.cvv,
                        expiryDate: formatDate(data.employee.expiryDate), // Convert date
                    },
                }));

                
            } catch (error) {
                toast.error(error.message);
            }
        }

        getEmployee();
    }, []);


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
            if (!form.firstName) formErrors.firstName = 'firstname  is required';
            if (!form.email) formErrors.email = 'Email is required';
            if (!form.lastName) formErrors.lastName = 'lastname is required';
            if (!form.address) formErrors.address = 'Address is required';
            if (!form.city) formErrors.city = 'city is required';
            if(!(/^(?:7|8|9)\d{9}$/.test(form.phone))) formErrors.phone = "invalid number"
            if (!form.state) formErrors.state = 'State is required';
            if (!(/^[1-9][0-9]{5}$/.test(form.pincode))) formErrors.pincode = 'invalid pincode';
            if (!form.country) formErrors.country = 'Country is required';
        }

        if (activeStep === 1) {
            if (!form.aadharOrPan) formErrors.aadharOrPan = 'Aadhar Card or Pan Card is required';
            if (!form.passport) formErrors.passport = 'Passport/Driving License is required';
            if (!form.ssn) formErrors.ssn = 'Social Security Number is required';
        }


        if (activeStep === 2) {
            if (!form.degrees) formErrors.degrees = 'Please upload your degrees/certificates';
            if (!form.transcripts) formErrors.transcripts = 'Please upload your transcripts';
        }
        if (activeStep === 3) {
            if (!form.employerName) formErrors.employerName = 'employer Name is required';
            if (!form.jobTitle) formErrors.jobTitle = 'job title is required';
            if (!form.startDate) formErrors.startDate = 'date is required';
            if (!form.endDate) formErrors.endDate = 'date is required';
            if (!form.reasonForLeaving) formErrors.reasonForLeaving = 'reason is required';
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

    const handleFileClear = (section , field) => {
        setFormData({
            ...formData ,
            [section]  : {
                ...formData[section] ,
                [field] : null
            }
        })
    } 


    const handleSubmit = async (e) => { 
        e.preventDefault();
        const formDataToSend = new FormData();

        formDataToSend.append("id" , id);
        // personale info
        Object.keys(formData.personalInfo).forEach((key) => {
            formDataToSend.append(key , formData.personalInfo[key])
        })

        // idDocuments
        formDataToSend.append("aadharOrPan" , formData.idDocuments.aadharOrPan);
        formDataToSend.append("passport" , formData.idDocuments.passport);
        formDataToSend.append("ssn" , formData.idDocuments.ssn);


        // degree and transcripts
        formDataToSend.append('degrees' , formData.education.degrees);
        formDataToSend.append('transcripts',formData.education.transcripts);
        
        // previous employements
        Object.keys(formData.employment).forEach((key) => {
            formDataToSend.append(key , formData.employment[key])
        })

        // payment details
        Object.keys(formData.paymentDetails).forEach((key) => {
            formDataToSend.append(key , formData.paymentDetails[key])
        })

        
        try {   
            setIsLoading(true);
            const res = await fetch(`${UPDATE_EMPLOYEE}`, {
                method: "PUT",
                body: formDataToSend
            });

            if (!res.ok) {
                throw new Error("NetWork issue");
            }
            
            const data = await res.json();
            setIsLoading(false);
            
            toast.success("employee details updated");
            navigate('/admin-dashboard/employees')
        } catch (error) {
            toast.error(error.message);
            navigate('/admin-dashboard/employees')
        }

    }
    
    


    const renderForm = () => {
        switch (activeStep) {
            case 0:
                return (
                    <div className="space-y-8 p-4 sm:p-10 bg-white shadow-lg rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-700">General Information</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <TextField
                                className="flex-1"
                                label="firstname"
                                name="firstName"
                                value={formData.personalInfo.firstName}
                                onChange={handleChange}
                                error={!!errors.firstName}
                                helperText={errors.firstName}

                            />
                            <TextField
                                className="flex-1"
                                label="lastname"
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

                        {!formData.idDocuments.aadharOrPan  ? (
                            <div className="flex flex-col">
                                <InputLabel className="text-gray-700">Aadhar or Pan</InputLabel>
                                <div className="mt-2 p-4 border-dashed border-2 border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center cursor-pointer">
                                    <label  className="w-full h-full flex flex-col items-center justify-center">
                                        <span className="text-gray-500 flex gap-2 items-center"> <AiOutlineUpload/> Upload File</span>
                                        <input
                                            type="file"
                                            onChange={(e) => handleFileChange(e, 'idDocuments', 'aadharOrPan')}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </div>
                        ) : (
                            <div onClick={() => handleFileClear('idDocuments' , 'aadhar')} className='flex cursor-pointer flex-col'>
                                <InputLabel className="text-gray-700">Aadhar or pan</InputLabel>
                                <div className="mt-2 p-4 border-dashed border-2 border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center cursor-pointer">
                                    <label  className="w-full h-full flex flex-col items-center justify-center">
                                        <span className="text-gray-500 cursor-pointer flex items-center gap-2" > <AiOutlineDelete/> Clear upload</span>
                                    </label>
                                </div>
                            </div>
                        )}

                        {!formData.idDocuments.passport ? (
                            <div className="flex flex-col">
                                <InputLabel className="text-gray-700">Passport or Driving License</InputLabel>
                                <div className="mt-2 p-4 border-dashed border-2 border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center cursor-pointer">
                                    <label className="w-full h-full flex flex-col items-center justify-center">
                                    <span className="text-gray-500 flex gap-2 items-center"> <AiOutlineUpload/> Upload File</span>
                                        <input
                                            type="file"
                                            onChange={(e) => handleFileChange(e, 'idDocuments', 'passport')}
                                            className="hidden"
                                            accept='.jpg, .png, .jpeg'
                                        />
                                    </label>
                                </div>
                            </div>

                        ) : (
                            <div onClick={() => handleFileClear('idDocuments' , 'passport')} className='flex cursor-pointer flex-col'>
                                <InputLabel className="text-gray-700">passport or Driving License</InputLabel>
                                <div className="mt-2 p-4 border-dashed border-2 border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center cursor-pointer">
                                    <label  className="w-full h-full flex flex-col items-center justify-center">
                                        <span className="text-gray-500 cursor-pointer flex items-center gap-2" > <AiOutlineDelete/> Clear upload</span>
                                    </label>
                                </div>
                            </div>
                        )}


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
                        {!formData.education.degrees ? (
                            <div className="flex flex-col">
                                <InputLabel className="text-gray-700">Upload Degrees/Certificates</InputLabel>
                                <div className="mt-2 p-4 border-dashed border-2 border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center cursor-pointer">
                                    <label className="w-full h-full flex flex-col items-center justify-center">
                                        <span className="text-gray-500 flex items-center gap-2"> <AiOutlineUpload/> Upload File</span>
                                        <input
                                            type="file"
                                            onChange={(e) => handleFileChange(e, 'education', 'degrees')}
                                            className="hidden"
                                            accept='.jpg, .png, .jpeg'
                                        />
                                    </label>
                                </div>
                            </div>

                        ) : (
                            <div onClick={() => handleFileClear('education' , 'degrees')} className='flex cursor-pointer flex-col'>
                                <InputLabel className="text-gray-700">Upload Degrees/Certificates</InputLabel>
                                <div className="mt-2 p-4 border-dashed border-2 border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center cursor-pointer">
                                    <label  className="w-full h-full flex flex-col items-center justify-center">
                                        <span className="text-gray-500 cursor-pointer flex items-center gap-2" > <AiOutlineDelete/> Clear upload</span>
                                    </label>
                                </div>
                            </div>
                        )}

                        {!formData.education.transcripts ? (

                            <div className="flex flex-col">
                                <InputLabel className="text-gray-700">Upload Transcripts</InputLabel>
                                <div className="mt-2 p-4 border-dashed border-2 border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center cursor-pointer">
                                    <label className="w-full h-full flex flex-col items-center justify-center">
                                        <span className="text-gray-500 flex items-center gap-2"> <AiOutlineUpload/>Upload File</span>
                                        <input
                                            type="file"
                                            onChange={(e) => handleFileChange(e, 'education', 'transcripts')}
                                            className="hidden"
                                            accept='.jpg, .png, .jpeg'
                                        />
                                    </label>
                                </div>
                            </div>

                        ) : (
                            <div onClick={() => handleFileClear('education' , 'transcripts')} className='flex cursor-pointer flex-col'>
                                <InputLabel className="text-gray-700">Upload Transcripts</InputLabel>
                                <div className="mt-2 p-4 border-dashed border-2 border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center cursor-pointer">
                                    <label  className="w-full h-full flex flex-col items-center justify-center">
                                        <span className="text-gray-500 cursor-pointer flex items-center gap-2" > <AiOutlineDelete/> Clear upload</span>
                                    </label>
                                </div>
                            </div>
                        )}
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
                        <div className="grid gap-2">
                             <label 
                                htmlFor="startDate" 
                                 className="block text-sm font-medium "
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
                                 className="block text-sm font-medium "
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
                                    value={formData.paymentDetails?.cvv || ''}
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
    ) :  (
        <div className="h-full p-5 ">
            <Box className="flex flex-col gap-5   h-full p-5 ">
                <Stepper activeStep={activeStep} className="p-7 w-full">
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