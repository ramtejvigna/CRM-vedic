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
export const updateEmployee  = async (req , res) => {
    try {
        const { id ,  username, name, phone, email, city, address, state, country, pincode } = req.body;
  
        if (!username || !email) {
          return res.status(400).json({ message: 'Username and email are required' });
        }
        
    
        const updatedEmployee = await Employee.findByIdAndUpdate(id ,{username, name, phone, email, city, address, state, country, pincode } , {new : true , runValidators :true} );

        if(!updateEmployee) {
            return res.status(400).json({message : "Employee with provided id not exits"});
        }

        return res.status(200).json({messsage : "Employee details updated" , employee : updateEmployee});
    } catch (error) {
        console.error('Error updating employee:', error.message);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}