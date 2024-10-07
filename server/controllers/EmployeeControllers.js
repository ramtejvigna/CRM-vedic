import { Employee } from "../models/User.js";
// @desc adding new emplyee
// @route POST api/employees/add-employee
// @access public
export const addEmployee = async (req, res) => {
    try {

        const {
            username,
            name,
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
        const aadharFile = req.files.aadhar ? req.files.aadhar[0] : null;
        const panFile = req.files.pan ? req.files.pan[0] : null;
        const degreesFile = req.files.degrees ? req.files.degrees[0] : null;
        const transcriptsFile = req.files.transcripts ? req.files.transcripts[0] : null;

        // Check if all required files are uploaded
        if (!passportFile || !aadharFile || !panFile || !degreesFile || !transcriptsFile) {
            return res.status(400).json({ message: "Missing required document files" });
        }

        // Replace backslashes for file paths (Windows to UNIX-style paths)
        const passportFilePath = passportFile.path.replace(/\\/g, '/');
        const aadharFilePath = aadharFile.path.replace(/\\/g, '/');
        const panFilePath = panFile.path.replace(/\\/g, '/');
        const degreesFilePath = degreesFile.path.replace(/\\/g, '/');
        const transcriptsFilePath = transcriptsFile.path.replace(/\\/g, '/');

        // Create new employee
        const newEmployee = await Employee.create({
            username,
            name,
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
            aadhar: aadharFilePath,
            pan: panFilePath,
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

