import { Employee } from "../models/User.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// @desc adding new employee
// @route POST api/employees/add-employee
// @access public
export const addEmployee = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      role,
      phone,
      email,
      city,
      address,
      state,
      country,
      pincode,
      employerName,
      jobTitle,
      startDate,
      endDate,
      reasonForLeaving,
      accountHolderName,
      bankName,
      branchName,
      bankAccountNumber,
      ifscCode,
      password,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !role ||
      !phone ||
      !email ||
      !city ||
      !address ||
      !state ||
      !country ||
      !pincode ||
      !password
    ) {
      return res.status(400).json({
        message: "Mandetory fields are required.",
      });
    }

    // Check if employee already exists
    const isExist = await Employee.findOne({ email });
    if (isExist) {
      return res
        .status(409)
        .json({ message: "Employee already exists with this email" });
    }

    // Convert files to Base64
    const aadharOrPanBase64 =
      req.files?.aadharOrPan?.data?.toString("base64") || "";
    const degreesBase64 = req.files?.degrees?.data?.toString("base64") || "";
    const transcriptsBase64 =
      req.files?.transcripts?.data?.toString("base64") || "";

    //const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = await Employee.create({
      firstName,
      lastName,
      role,
      phone,
      email,
      city,
      address,
      state,
      country,
      pincode,
      employerName,
      jobTitle,
      startDate,
      endDate,
      reasonForLeaving,
      accountHolderName,
      bankName,
      branchName,
      bankAccountNumber,
      ifscCode,
      aadharOrPan: aadharOrPanBase64,
      degrees: degreesBase64,
      transcripts: transcriptsBase64,
      password
    });

    return res
      .status(201)
      .json({ message: "Employee added successfully", newEmployee });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// @desc updating employee
// @route PUT api/employees/update-employee
// @access public
export const updateEmployee = async (req, res) => {
  try {
    const {
      id,
      firstName,
      lastName,
      role,
      phone,
      email,
      city,
      address,
      state,
      country,
      pincode,
      employerName,
      jobTitle,
      startDate,
      endDate,
      reasonForLeaving,
      accountHolderName,
      bankName,
      branchName,
      bankAccountNumber,
      ifscCode,
    } = req.body;

    // Find employee by ID
    const employee = await Employee.findById(id);
    if (!employee) {
      return res
        .status(404)
        .json({ message: "Employee with provided ID does not exist" });
    }

    const aadharOrPanFileBase64 =
      req.files?.aadharOrPan?.data?.toString("base64") || employee.aadharOrPan;
    const degreesFileBase64 =
      req.files?.degrees?.data?.toString("base64") || employee.degrees;
    const transcriptsFileBase64 =
      req.files?.transcripts?.data?.toString("base64") || employee.transcripts;

    // Update employee data
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      {
        firstName,
        lastName,
        role,
        phone,
        email,
        city,
        address,
        state,
        country,
        pincode,
        employerName,
        jobTitle,
        startDate,
        endDate,
        reasonForLeaving,
        accountHolderName,
        bankName,
        branchName,
        bankAccountNumber,
        ifscCode,
        aadharOrPan: aadharOrPanFileBase64,
        degrees: degreesFileBase64,
        transcripts: transcriptsFileBase64,
      },
      { new: true, runValidators: true }
    );

    // Handle update result
    if (!updatedEmployee) {
      return res
        .status(400)
        .json({ message: "Failed to update employee details" });
    }

    return res
      .status(200)
      .json({ message: "Employee details updated", employee: updatedEmployee });
  } catch (error) {
    console.error("Error updating employee:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// @desc Filtering employees by status and role
// @route GET /api/employees/filter
// @access public
export const filterEmployeesByStatus = async (req, res) => {
  try {
    const { status, role } = req.query;
    const searchQuery = {};
    if (status && status !== "all") {
      searchQuery.isOnline = status === "online";
    }

    if (role && role !== "all") {
      searchQuery.role = role[0].toUpperCase() + role.substring(1);
    }

    console.log(searchQuery);
    const employees = await Employee.find(searchQuery)
      .populate("customers", "fatherName motherName")
      .sort({ createdAt: -1 });

    return res.status(200).json(employees);
  } catch (error) {
    console.error("Error filtering employee:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// @desc Getting all employees
// @route GET /api/employee/get-employee
// @access public
export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate("customers", "fatherName motherName")
      .sort({ createdAt: -1 });
    return res.status(200).json({ employees });
  } catch (error) {
    return res.status(500).send("Internal server error");
  }
};

// @desc Get Employee By id
// @route GET /api/employee/get-employee
// @access public
export const getEmployee = async (req, res) => {
  try {
    const { id } = req.query;

    const employee = await Employee.findById({ _id: id });

    if (!employee) {
      return res.status(400).send(`Employee not found with id : ${id}`);
    }

    return res.status(200).json({ employee });
  } catch (error) {
    return res.status(400).send("Internal server error");
  }
};

export const requestBabyNames = async (req, res) => {
  try {
    const { employeeId } = req.body;

    // Find employee and update requestedBabyNames field
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Check if already requested
    if (employee.requestedBabyNames) {
      return res.status(400).json({ message: "Access already requested" });
    }

    // Update employee document
    employee.requestedBabyNames = true;
    await employee.save();

    return res.status(200).json({
      success: true,
      message: "Baby names access requested successfully",
    });
  } catch (error) {
    console.error("Error in requestBabyNames:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const didAdminAccept = async (req, res) => {
  try {
    const { employeeId } = req.query; // Extract query parameter

    // Find employee and update requestedBabyNames field
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (employee.adminAcceptedRequest) {
      return res
        .status(200)
        .json({ accepted: true, message: "Admin accepted the request" });
    }

    return res.status(200).json({
      accepted: false,
      message: "Admin didn't accept your request",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const didRequested = async (req, res) => {
  try {
    const { employeeId } = req.query; // Extract query parameter

    // Find employee and update requestedBabyNames field
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (employee.requestedBabyNames) {
      return res
        .status(200)
        .json({ requested: true, message: "Admin accepted the request" });
    }

    return res.status(200).json({
      requested: false,
      message: "Admin didn't accept your request",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const confirmRequest = async (req, res) => {
  try {
    const { employeeId } = req.body;

    // Validate employeeId
    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({ message: "Invalid employeeId format" });
    }

    // Find the employee
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Update fields
    employee.adminAcceptedRequest = true;
    employee.requestedBabyNames = false;

    // Save employee with error handling
    await employee.save().catch((err) => {
      console.error("Error during save:", err.message);
      throw new Error("Failed to update employee data");
    });

    console.log("Employee updated successfully:", employee);

    return res.status(200).json({
      accepted: true,
      message: "Admin accepted successfully",
    });
  } catch (error) {
    console.error("Error in confirmRequest:", error.message);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
