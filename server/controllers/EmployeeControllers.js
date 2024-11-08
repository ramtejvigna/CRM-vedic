import { Employee } from "../models/User.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// @desc adding new emplyee
// @route POST api/employees/add-employee
// @access public
export const addEmployee = async (req, res) => {
    try {

        const {
            firstName,
            lastName,
            role ,
            phone,
            email,
            city,
            address,
            state,
            country,
            pincode,
            ssn,
            employerName,
            jobTitle,
            startDate,
            endDate,
            reasonForLeaving,
            cardNumber,
            cardholderName,
            cvv,
            expiryDate,
        } = req.body;

        if(!req.files) {
            return res.status(400).json({message : "files are missing"})
        }
        // Check if employee already exists
        const isExist = await Employee.findOne({ email });
        if (isExist) {
            return res.status(400).json({ message: "Employee already exists with this email" });
        }

        const aadharOrPanBase64 = req.files ? req.files.aadharOrPan[0].buffer.toString("base64") : "";
        const passportBase64 = req.files ? req.files.passport[0].buffer.toString('base64') : '';
        const degreesBase64 = req.files ? req.files.degrees[0].buffer.toString('base64') : "";
        const transcriptsBase64 = req.files ? req.files.transcripts[0].buffer.toString('base64') : "";



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
            ssn,
            employerName,
            jobTitle,
            startDate,
            endDate,
            reasonForLeaving,
            cardNumber,
            cardholderName,
            cvv,
            expiryDate,
            aadharOrPan: aadharOrPanBase64,
            passport: passportBase64,
            degrees: degreesBase64,
            transcripts: transcriptsBase64,
        });

        return res.status(200).json({ message: "Employee added successfully" , newEmployee });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};


// @desc Getting all employees
// @route GET /api/employee/get-employee
// @access public
export const getEmployees = async (req ,res) => {
    try {
        const employees = await Employee.find().populate("customers" , "fatherName motherName").sort({createdAt : -1});
        return res.status(200).json({employees});
    } catch (error) {
        return res.status(500).send("Internal server error");
    }
}


// @desc Get Employee By id
// @route GET /api/employee/get-employee
// @access public
export const getEmployee = async (req , res) => {
    try {
        const { id } = req.query;

        const employee = await Employee.findById({_id : id});

        if(!employee)  {
            return res.status(400).send(`Employee not found with id : ${id}`)
        }

        return res.status(200).json({employee});
    } catch (error) {
        return res.status(400).send("Internal server error");
    }
}

// @desc updating employee
// @route PUT api/employees/update-employee
// @access public
export const updateEmployee = async (req, res) => {
    try {
        const { id, firstName, lastName , role , phone, email, city, address, state, country, pincode, ssn,
            employerName, jobTitle, startDate, endDate, reasonForLeaving,
            cardNumber, cardholderName, cvv, expiryDate } = req.body;

        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({ message: "Employee with provided ID does not exist" });
        }


        // Handling file uploads and existing file paths
        const passportFile = req.files && req.files.passport ? req.files.passport[0] : null;
        const aadharOrPanFile = req.files && req.files.aadharOrPan ? req.files.aadharOrPan[0] : null;
        const degreesFile = req.files && req.files.degrees ? req.files.degrees[0] : null;
        const transcriptsFile = req.files && req.files.transcripts ? req.files.transcripts[0] : null;

        

        // Set file paths or keep existing paths if no new file uploaded
        const passportFileBase64 = passportFile ? passportFile.buffer.toString("base64") : employee.passport;
        const aadharOrPanFileBase64 = aadharOrPanFile ? aadharOrPanFile.buffer.toString("base64") : employee.aadharOrPan;
        const degreesFileBase64 = degreesFile ? degreesFile.buffer.toString("base64") : employee.degrees;
        const transcriptsFileBase64= transcriptsFile ? transcriptsFile.buffer.toString("base64") : employee.transcripts;

        // Update employee data
        const updatedEmployee = await Employee.findByIdAndUpdate(
            id,
            {
                firstName,
                lastName,
                role ,
                phone,
                email,
                city,
                address,
                state,
                country,
                pincode,
                ssn,
                employerName,
                jobTitle,
                startDate,
                endDate,
                reasonForLeaving,
                cardNumber,
                cardholderName,
                cvv,
                expiryDate,
                passport: passportFileBase64,
                aadharOrPan: aadharOrPanFileBase64,
                degrees: degreesFileBase64,
                transcripts: transcriptsFileBase64,
            },
            { new: true, runValidators: true }
        );

        if (!updatedEmployee) {
            return res.status(400).json({ message: "Failed to update employee details" });
        }

        return res.status(200).json({ message: "Employee details updated", employee: updatedEmployee });
        
    } catch (error) {
        console.error('Error updating employee:', error.message);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};


export const filterEmployeesByStatus = async (req ,res) => {
    try {
        const {status , role } = req.query;
        const searchQuery = {}
        if(status && status !== "select status"){
            searchQuery.isOnline = (status === 'online')
        }

        if(role && role !== "select role") {
            searchQuery.role = role;
        }



        const employees = await Employee.find(searchQuery);

        return res.status(200).json(employees);
    } catch (error) {
        console.error('Error filtering employee:', error.message);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}