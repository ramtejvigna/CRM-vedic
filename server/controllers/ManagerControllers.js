
import { Customer, Employee } from "../models/User.js"
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();


export const getNewCustomers = async (req, res) => {
  try {
    const [
      newRequests,
      inProgress,
      completed,
      rejected,
      workingCustomers
    ] = await Promise.all([
      Customer.find({ customerStatus: 'newRequests' })
        .sort({ createdDateTime: -1 })
        .populate('assignedEmployee', 'firstName lastName email'),
        
      Customer.find({ customerStatus: 'inProgress' })
        .sort({ createdDateTime: -1 })
        .populate('assignedEmployee', 'firstName lastName email'),
        
      Customer.find({ customerStatus: 'completed' })
        .sort({ createdDateTime: -1 })
        .populate('assignedEmployee', 'firstName lastName email'),
        
      Customer.find({ customerStatus: 'rejected' })
        .sort({ createdDateTime: -1 })
        .populate('assignedEmployee', 'firstName lastName email'),
        
      Customer.find({ 
        assignedEmployee: { $ne: null }, 
        customerStatus: 'inWorking' 
      })
        .sort({ createdAt: -1 })
        .populate('assignedEmployee', 'firstName lastName email')
    ]);

    // Transform the data to include formatted employee names
    const formatCustomerList = (customers) => {
      return customers.map(customer => {
        const formatted = customer.toObject();
        if (formatted.assignedEmployee) {
          const { firstName, lastName } = formatted.assignedEmployee;
          formatted.assignedEmployeeName = `${firstName} ${lastName}`.trim();
        } else {
          formatted.assignedEmployeeName = 'Unassigned';
        }
        return formatted;
      });
    };

    return res.status(200).json({
      newRequests: formatCustomerList(newRequests),
      inProgress: formatCustomerList(inProgress),
      completed: formatCustomerList(completed),
      rejected: formatCustomerList(rejected),
      assignedTo: formatCustomerList(workingCustomers)
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
  


export const getCompletedReq = async (req, res) => {
  try {

    const completed = await Customer.find({ assignedEmployee: undefined, customerStatus: 'completed' })
      .sort({ createdAt: -1 });


    return res.status(200).json({

      completed
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({ role: "Employee" })
      .populate("customers", "fatherName motherName")
      .sort({ createdAt: -1 });

    return res.status(200).json({ employees });
  } catch (error) {
    return res.status(500).send("Internal server error");
  }
};


export const assignCustomerToEmployee = async (req, res) => {
  try {
    const { customerId, employeeId } = req.params;
    console.log(customerId, employeeId, "Ids");
    const employee = await Employee.findById(employeeId);
    const customer = await Customer.findById(customerId);
    console.log(customer);

    if (!employee || !customer) {
      return res.status(404).json({ message: "Employee or Customer not found" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    employee.customers.push(customer._id);
    customer.assignedEmployee = employee._id;
    customer.customerStatus = "inWorking";
    customer.assignedOn = today; // Assign the full date object

    await employee.save();
    await customer.save();

    return res.status(200).json({
      message: "Customer successfully assigned to employee",
    });
  } catch (error) {
    console.error("Error occurred in Assigning:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    // Find user by username
    const { email, password } = req.body;
    
    const employee = await Employee.findOne({ email, password });
    console.log(employee.role)
    if (employee.role !== 'Manager') {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    employee.isOnline = true;

    await employee.save();
    const token = jwt.sign(
      {
        id: employee._id,
        username: employee.username
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      token,
      userId: employee._id,
      username: employee.username
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const logout = async (req, res) => {
  try {
    const { token } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    await Employee.findOneAndUpdate({ _id: decoded.id }, { isOnline: false });

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

