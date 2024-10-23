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

        // Check if employee already exists
        const isExist = await Employee.findOne({ email });
        if (isExist) {
            return res.status(400).json({ message: "Employee already exists with this email" });
        }

        // File handling
        const passportFile = req.files.passport ? req.files.passport[0] : null;
        const aadharOrPanFile = req.files.aadharOrPan ? req.files.aadharOrPan[0] : null;
        const degreesFile = req.files.degrees ? req.files.degrees[0] : null;
        const transcriptsFile = req.files.transcripts ? req.files.transcripts[0] : null;

        // Check if all required files are uploaded
        if (!passportFile || !aadharOrPanFile  || !degreesFile || !transcriptsFile) {
            return res.status(400).json({ message: "Missing required document files" });
        }

        // Replace backslashes for file paths (Windows to UNIX-style paths)
        const passportFilePath = passportFile.path.replace(/\\/g, '/');
        const aadharOrPanFilePath = aadharOrPanFile.path.replace(/\\/g, '/');
        const degreesFilePath = degreesFile.path.replace(/\\/g, '/');
        const transcriptsFilePath = transcriptsFile.path.replace(/\\/g, '/');

        // Create new employee
        const newEmployee = await Employee.create({
            firstName,
            lastName,
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
            aadharOrPan: aadharOrPanFilePath,
            passport: passportFilePath,
            degrees: degreesFilePath,
            transcripts: transcriptsFilePath,
        });

        return res.status(200).json({ message: "Employee added successfully" });
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
        const employees = await Employee.find();
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
        const { id, firstName, lastName, phone, email, city, address, state, country, pincode, ssn,
            employerName, jobTitle, startDate, endDate, reasonForLeaving,
            cardNumber, cardholderName, cvv, expiryDate } = req.body;

        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({ message: "Employee with provided ID does not exist" });
        }

        // Logging received files for debugging
        console.log('Received files:', req.files);

        // Handling file uploads and existing file paths
        const passportFile = req.files && req.files.passport ? req.files.passport[0] : null;
        const aadharOrPanFile = req.files && req.files.aadharOrPan ? req.files.aadharOrPan[0] : null;
        const degreesFile = req.files && req.files.degrees ? req.files.degrees[0] : null;
        const transcriptsFile = req.files && req.files.transcripts ? req.files.transcripts[0] : null;

        // Function to delete old files if new files are uploaded
        const deleteFile = (filePath) => {
            if (filePath && fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`Deleted file: ${filePath}`);
            }
        };

        // Set file paths or keep existing paths if no new file uploaded
        const passportFilePath = passportFile ? passportFile.path.replace(/\\/g, '/') : employee.passport;
        const aadharOrPanFilePath = aadharOrPanFile ? aadharOrPanFile.path.replace(/\\/g, '/') : employee.aadharOrPan;
        const degreesFilePath = degreesFile ? degreesFile.path.replace(/\\/g, '/') : employee.degrees;
        const transcriptsFilePath = transcriptsFile ? transcriptsFile.path.replace(/\\/g, '/') : employee.transcripts;

        // Delete old files if new files have been uploaded
        if (passportFile) deleteFile(path.join(__dirname, '..', employee.passport));
        if (aadharOrPanFile) deleteFile(path.join(__dirname, '..', employee.aadharOrPan));
        if (degreesFile) deleteFile(path.join(__dirname, '..', employee.degrees));
        if (transcriptsFile) deleteFile(path.join(__dirname, '..', employee.transcripts));

        // Update employee data
        const updatedEmployee = await Employee.findByIdAndUpdate(
            id,
            {
                firstName,
                lastName,
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
                passport: passportFilePath,
                aadharOrPan: aadharOrPanFilePath,
                degrees: degreesFilePath,
                transcripts: transcriptsFilePath,
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
        const {status} = req.query;
        const searchQuery = {}
        if(status && status !== "select status"){
            searchQuery.isOnline = (status === 'online')
        }

        const isOnline = status === "online";

        const employees = await Employee.find(searchQuery);

        return res.status(200).json(employees);
    } catch (error) {
        console.error('Error filtering employee:', error.message);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}