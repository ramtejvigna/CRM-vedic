import { Employee } from "../models/User.js";

// @desc ADDING  employee
// @route POST /api/employee/add-employee
// @access public
export const addEmployee = async (req, res) => {
    try {
      const { username, name, phone, email, city, address, state, country, pincode } = req.body;
  
      if (!username || !email) {
        return res.status(400).json({ message: 'Username and email are required' });
      }
  
      const isExist = await Employee.findOne({ email });
  
      if (isExist) {
        return res.status(400).json({ message: 'Employee already exists' });
      }
  
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
      });
  
      return res.status(200).json({ message: 'Employee added', employee: newEmployee });
    } catch (err) {
      console.error('Error adding employee:', err.message); // Log the error
      res.status(500).json({ message: 'Internal server error', error: err.message });
    }
  };
  

// @desc Getting all employees
// @route GET /api/employee/get-employees
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