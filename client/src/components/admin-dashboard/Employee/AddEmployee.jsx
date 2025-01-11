import { useState } from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {
  TextField,
  InputLabel,
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AiOutlineUpload, AiOutlineDelete } from "react-icons/ai";
import { ADD_EMPLOYEE_ROUTE } from "../../../utils/constants";
const steps = [
  "Personal Information",
  "Identification Documents",
  "Educational Qualifications",
  "Previous Employment Details",
  "Financial Information",
  "Password Generation",
];
const formKeys = [
  "personalInfo",
  "idDocuments",
  "education",
  "employment",
  "paymentDetails",
  "setPasswordSection",
];

const AddEmployee = () => {
  const [passwordError, setPasswordError] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: "",
      lastName: "",
      role: "",
      phone: "",
      email: "",
      city: "",
      address: "",
      state: "",
      country: "",
      pincode: "",
    },
    idDocuments: { aadharOrPan: "" },
    education: { degrees: null, transcripts: null },
    employment: {
      employerName: "",
      jobTitle: "",
      startDate: "",
      endDate: "",
      reasonForLeaving: "",
    },
    paymentDetails: {
      accountHolderName: "",
      bankName: "",
      branchName: "",
      bankAccountNumber: "",
      ifscCode: "",
    },
    setPasswordSection: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleNext = () => {
    if (true) {
      setActiveStep((prev) => prev + 1);
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
        [name]: value,
      },
    });

    const validatePasswordStrength = (password) => {
      const strengthRegex = {
        weak: /^(?=.*[a-zA-Z]).{6,}$/, // At least 6 characters with letters
        medium: /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/, // At least 6 characters with letters and numbers
        strong: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/, // At least 8 characters with letters, numbers, and special chars
      };

      if (strengthRegex.strong.test(password)) return "Strong";
      if (strengthRegex.medium.test(password)) return "Medium";
      if (strengthRegex.weak.test(password)) return "Weak";
      return "";
    };

    if (name === "password") {
      setPasswordStrength(validatePasswordStrength(value));
      setPasswordError(value && !validatePasswordStrength(value));
    }

    if (name === "confirmPassword") {
      setPasswordMatchError(value !== formData.setPasswordSection.password);
    }
  };
  const validateForm = () => {
    const form = formData[formKeys[activeStep]];
    const formErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6789]\d{9}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/; 

    if (activeStep === 0) {
      if (!form.firstName) formErrors.firstName = "First name is required";
      if (!form.email) {
        formErrors.email = "Email is required";
      } else if (!emailRegex.test(form.email)) {
        formErrors.email = "Invalid email format";
      }
      if (!form.lastName) formErrors.lastName = "Last name is required";
      if (!form.address) formErrors.address = "Address is required";
      if (!form.city) formErrors.city = "City is required";
      if (!form.phone) {
        formErrors.phone = "Phone number is required";
      } else if (!phoneRegex.test(form.phone)) {
        formErrors.phone = "Enter a valid 10-digit phone number";
      }
      if (!form.state) formErrors.state = "State is required";
      if (!form.pincode) formErrors.pincode = "Pincode is required";
      if (!form.country) formErrors.country = "Country is required";
      if (!form.role) formErrors.role = "Role of employee is required";
    }

    if (activeStep === 5) {
        if (!form.password) {
          formErrors.password = "Password is required";
        } else if (!passwordRegex.test(form.password)) {
          formErrors.password = "Password must be at least 8 characters, include a letter, a number, and a special character";
        }
    
        if (!form.confirmPassword) {
          formErrors.confirmPassword = "Please confirm the password";
        } else if (form.confirmPassword !== form.password) {
          formErrors.confirmPassword = "Passwords do not match";
        }
      }
      console.log(formErrors)

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleFileChange = (e, section, field) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: file,
      },
    });
  };

  const handleFileClear = (section, field) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: null,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      const formDataToSend = new FormData();

      // Personal Info
      const combinedFormData = {
        ...formData.personalInfo,
        aadharOrPan: formData.idDocuments.aadharOrPan,
        degrees: formData.education.degrees,
        transcripts: formData.education.transcripts,
        ...formData.employment,
        ...formData.paymentDetails,
        password : formData.setPasswordSection.password
      };

      Object.keys(combinedFormData).forEach((key) => {
        formDataToSend.append(key, combinedFormData[key]);
      });

      try {
        setIsLoading(true);

        const res = await fetch(`${ADD_EMPLOYEE_ROUTE}`, {
          method: "POST",
          body: formDataToSend,
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Network issue");
        }

        toast.success("Employee created");
        navigate("/admin-dashboard/employees");
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const renderForm = () => {
    switch (activeStep) {
      case 0:
        return (
          <div className="flex flex-col p-2 sm:p-5 h-full">
            {/* Role Selection */}
            <div className="flex flex-col gap-6">
              <h2 className="text-lg font-semibold text-gray-700">
                Employee Role
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="w-full ">
                  <select
                    id="role"
                    name="role"
                    value={formData.personalInfo.role}
                    onChange={handleChange}
                    className="block cursor-pointer w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="" disabled>
                      Select Employee Role
                    </option>
                    <option value="Employee">Employee</option>
                    <option value="Manager">Manager</option>
                  </select>
                  {errors.role && (
                    <span className="text-xs pl-3 text-red-500">
                      Please select an employee role
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1 mt-6    grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              {/* General Information */}
              <div className="flex flex-col col-span-2">
                <h2 className="text-lg mb-3 font-semibold text-gray-700">
                  General Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-grow">
                  <TextField
                    className="text-sm"
                    label="First Name"
                    name="firstName"
                    value={formData.personalInfo.firstName}
                    onChange={handleChange}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                    required
                  />
                  <TextField
                    className="text-sm"
                    label="Last Name"
                    name="lastName"
                    value={formData.personalInfo.lastName}
                    onChange={handleChange}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="flex-1 mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              {/* Contact Information */}
              <div className="flex flex-col col-span-2">
                <h3 className="text-lg mb-3 font-semibold text-gray-700">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-grow">
                  <TextField
                    label="Phone"
                    name="phone"
                    value={formData.personalInfo.phone}
                    onChange={handleChange}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    inputProps={{
                      maxLength: 10,
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                    }}
                    className="text-sm"
                    required
                  />
                  <TextField
                    label="Email"
                    name="email"
                    value={formData.personalInfo.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    className="text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="flex flex-1 justify-center gap-6  flex-col mt-6">
              <h3 className="text-lg font-semibold text-gray-700">Address</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <TextField
                  label="Address"
                  name="address"
                  value={formData.personalInfo.address}
                  onChange={handleChange}
                  error={!!errors.address}
                  helperText={errors.address}
                  className="text-sm"
                  fullWidth
                  required
                />
                <TextField
                  label="City"
                  name="city"
                  value={formData.personalInfo.city}
                  onChange={handleChange}
                  error={!!errors.city}
                  helperText={errors.city}
                  className="text-sm"
                  fullWidth
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
                <TextField
                  label="State"
                  name="state"
                  value={formData.personalInfo.state}
                  onChange={handleChange}
                  error={!!errors.state}
                  helperText={errors.state}
                  className="text-sm"
                  required
                />
                <TextField
                  label="Pincode"
                  name="pincode"
                  value={formData.personalInfo.pincode}
                  onChange={handleChange}
                  error={!!errors.pincode}
                  helperText={errors.pincode}
                  className="text-sm"
                  required
                />
                <TextField
                  label="Country"
                  name="country"
                  value={formData.personalInfo.country}
                  onChange={handleChange}
                  error={!!errors.country}
                  helperText={errors.country}
                  className="text-sm"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="p-2 sm:p-5  space-y-8">
            <h2 className="text-lg font-semibold text-gray-700">
              Identification Documents
            </h2>

            {/* Aadhar or PAN section */}
            {!formData.idDocuments.aadharOrPan ? (
              <div className="flex flex-col h-full">
                <InputLabel className="text-gray-700">Aadhar or Pan</InputLabel>
                <div className="mt-2 p-4 border-dashed border-2 border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center cursor-pointer h-full">
                  <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                    <span className="text-gray-500 flex gap-2 items-center">
                      <AiOutlineUpload /> Upload File
                    </span>
                    <input
                      type="file"
                      accept=".jpg,.png,.jpeg"
                      onChange={(e) =>
                        handleFileChange(e, "idDocuments", "aadharOrPan")
                      }
                      error={!!errors.aadharOrPan}
                      helperText={errors.aadharOrPan}
                      className="hidden"
                    />
                  </label>
                </div>
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
                  onClick={() => handleFileClear("idDocuments", "aadharOrPan")}
                  className="text-red-500 mt-2 flex items-center gap-2"
                >
                  <AiOutlineDelete /> Clear Upload
                </button>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="p-2 sm:p-5  space-y-8">
            <h2 className="text-lg font-semibold text-gray-700">
              Educational Qualifications
            </h2>

            {/* Degrees/Certificates Section */}
            {!formData.education.degrees ? (
              <div className="flex flex-col">
                <InputLabel className="text-gray-700">
                  Degrees Certificates
                </InputLabel>
                <div className="mt-2 p-4 border-dashed border-2 border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center cursor-pointer">
                  <label className="w-full h-full flex flex-col items-center justify-center">
                    <span className="text-gray-500 flex items-center gap-2">
                      <AiOutlineUpload /> Upload File
                    </span>
                    <input
                      type="file"
                      onChange={(e) =>
                        handleFileChange(e, "education", "degrees")
                      }
                      className="hidden"
                      accept=".jpg,.png,.jpeg"
                      error={!!errors.degrees}
                      helperText={errors.degrees}
                    />
                  </label>
                </div>
              </div>
            ) : (
              <div className="flex flex-col">
                <InputLabel className="text-gray-700">
                  Degrees Certificate
                </InputLabel>
                <div className="mt-2 p-4 border-dashed border-2 h-40 w-40 border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center">
                  <img
                    src={URL.createObjectURL(formData.education.degrees)}
                    alt="Degrees/Certificates"
                    className=" object-cover"
                  />
                </div>
                <button
                  onClick={() => handleFileClear("education", "degrees")}
                  className="text-red-500 mt-2 flex items-center gap-2"
                >
                  <AiOutlineDelete /> Clear Upload
                </button>
              </div>
            )}

            {/* Transcripts Section */}
            {!formData.education.transcripts ? (
              <div className="flex flex-col">
                <InputLabel className="text-gray-700">
                  Upload Transcripts
                </InputLabel>
                <div className="mt-2 p-4 border-dashed border-2 border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center cursor-pointer">
                  <label className="w-full h-full flex flex-col items-center justify-center">
                    <span className="text-gray-500 flex items-center gap-2">
                      <AiOutlineUpload /> Upload File
                    </span>
                    <input
                      type="file"
                      onChange={(e) =>
                        handleFileChange(e, "education", "transcripts")
                      }
                      className="hidden"
                      accept=".jpg,.png,.jpeg"
                      error={!!errors.transcripts}
                      helperText={errors.transcripts}
                    />
                  </label>
                </div>
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
                  onClick={() => handleFileClear("education", "transcripts")}
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
            <h2 className="text-lg font-semibold text-gray-700">
              Previous Employment Details
            </h2>
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
                type="date"
                value={formData.employment.startDate}
                onChange={handleChange}
                className="rounded-md shadow-sm bg-gray-50"
                fullWidth
                error={!!errors.startDate}
                helperText={errors.startDate}
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
                type="date"
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
            <h2 className="text-2xl font-semibold text-gray-700">
              Payment Details
            </h2>
            <p className="text-sm text-gray-500">
              Please provide your bank details for payment processing.
            </p>

            <TextField
              label="Account Holder Name"
              name="accountHolderName"
              value={formData.paymentDetails.accountHolderName}
              onChange={handleChange}
              className="rounded-md shadow-sm bg-gray-50"
              fullWidth
            />

            <TextField
              label="Bank Name"
              name="bankName"
              value={formData.paymentDetails.bankName}
              onChange={handleChange}
              className="rounded-md shadow-sm bg-gray-50"
              fullWidth
            />

            <TextField
              label="Branch Name"
              name="branchName"
              value={formData.paymentDetails.branchName}
              onChange={handleChange}
              className="rounded-md shadow-sm bg-gray-50"
              fullWidth
            />

            <TextField
              label="Bank Account Number"
              name="bankAccountNumber"
              value={formData.paymentDetails.bankAccountNumber}
              onChange={handleChange}
              className="rounded-md shadow-sm bg-gray-50"
              fullWidth
            />

            <TextField
              label="IFSC Code"
              name="ifscCode"
              value={formData.paymentDetails.ifscCode}
              onChange={handleChange}
              className="rounded-md shadow-sm bg-gray-50"
              fullWidth
            />
          </div>
        );

      case 5:
        return (
          <div className="space-y-6 p-2 sm:p-5">
            <h2 className="text-2xl font-semibold text-gray-700">
              Password Setup
            </h2>
            <p className="text-sm text-gray-500">
              Generate a password for the employee and confirm the setup.
            </p>

            {/* Password Input */}
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.setPasswordSection.password}
              onChange={handleChange}
              className="rounded-md shadow-sm bg-gray-50"
              fullWidth
              required
              error={passwordError}
              helperText={
                passwordError
                  ? "Password does not meet the requirements"
                  : ""
              }
            />

            {/* Password Strength Indicator */}
            {passwordStrength && (
              <div
                className={`text-sm ${
                  passwordStrength === "Strong"
                    ? "text-green-600"
                    : passwordStrength === "Medium"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {`Password Strength: ${passwordStrength}`}
              </div>
            )}

            {/* Confirm Password Input */}
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.setPasswordSection.confirmPassword}
              onChange={handleChange}
              className="rounded-md shadow-sm bg-gray-50"
              fullWidth
              required
              error={passwordMatchError}
              helperText={passwordMatchError ? "Passwords do not match" : ""}
            />

            {/* Optional: You can also add a little reminder about password strength here */}
            <FormHelperText className="text-sm text-gray-500">
              Password should be at least 8 characters long, include numbers and
              special characters for better security.
            </FormHelperText>
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
            <Step className="" key={label}>
              <StepLabel>
                <span className="hidden xl:block  text-center  tracking-wider">
                  {label}
                </span>
              </StepLabel>
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
              sx={{
                fontSize: "1.1rem",
                padding: "6px 15px",
                border: "1px solid black",
                borderRadius: 5,
              }}
              onClick={handleBack}
            >
              {"< "}Previous
            </Button>
            {activeStep === steps.length - 1 ? (
              isLoading ? (
                <div className="flex items-center mr-5 justify-center">
                  <CircularProgress size={40} />
                </div>
              ) : (
                <Button
                  sx={{
                    backgroundColor: "#11ff10",
                    color: "white",
                    padding: "6px 30px",
                    fontWeight: "700",
                    borderRadius: 5,
                    textTransform: "capitalize",
                  }}
                  onClick={handleSubmit}
                >
                  Finish
                </Button>
              )
            ) : (
              <div className="flex gap-10">
                <Button
                  sx={{
                    borderRadius: 10,
                    color: "black",
                    padding: "6px 15px",
                    fontWeight: "400",
                  }}
                  onClick={() => navigate("/admin-dashboard/employees")}
                >
                  cancel
                </Button>
                <Button
                  sx={{
                    backgroundColor: "#3B82F6",
                    color: "white",
                    padding: "6px 30px",
                    fontWeight: "700",
                    borderRadius: 5,
                  }}
                  onClick={handleNext}
                  className="capitalize"
                >
                  next {" >"}
                </Button>
              </div>
            )}
          </Box>
        </div>
      </Box>
    </div>
  );
};

export default AddEmployee;
