
import { Customer, Employee } from "../models/User.js"
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();
export const getNewCustomers = async (req, res) => {
    try {
      const newRequests = await Customer.find({ assignedEmployee: undefined, customerStatus: 'newRequests' })
        .sort({ createdAt: -1 });
  
      const inProgress = await Customer.find({ assignedEmployee: undefined, customerStatus: 'inProgress' })
        .sort({ createdAt: -1 });
  
      const completed = await Customer.find({ assignedEmployee: undefined, customerStatus: 'completed' })
        .sort({ createdAt: -1 });
  
      const rejected = await Customer.find({ assignedEmployee: undefined, customerStatus: 'rejected' })
        .sort({ createdAt: -1 });
  
      const workingCustomers = await Customer.find({ assignedEmployee: { $ne: undefined }, customerStatus: 'inWorking' })
        .sort({ createdAt: -1 })
        .populate('assignedEmployee', 'email firstName lastName');
        
      return res.status(200).json({
        newRequests,
        inProgress,
        completed,
        rejected,
        assignedTo: workingCustomers
      });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  

export const getEmployees = async (req ,res) => {
    try {
        const employees = await Employee.find({
            $or: [
              { role: "Senior Employee" },
              { role: "Junior Employee" }
            ]
          })
          .populate("customers", "fatherName motherName")
          .sort({ createdAt: -1 });
        return res.status(200).json({employees});

    } catch (error) {
        return res.status(500).send("Internal server error");
    }
}

export const assignCustomerToEmployee = async (req, res) => {
    try {
      const { customerId, employeeId } = req.params;
      const {deadline} = req.body
  
      const employee = await Employee.findById(employeeId);
      const customer = await Customer.findById(customerId);
      console.log(customer)
      if (!employee || !customer) {
        return res.status(400).json({ message: "Employee or Customer not found" });
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      employee.customers.push(customer._id);
      customer.assignedEmployee = employee._id;
      customer.deadline = deadline;
      customer.customerStatus = "inWorking";
      customer.assignedOn = today.getDate();
  
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
        const { email, phone } = req.body;

        // Find employee by username and phone
        const employee = await Employee.findOne({ email, phone });
        if (employee.role !== 'Manager') {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        employee.isOnline = true ;

        await employee.save();
        // Generate JWT token with employee ObjectId and isAdmin flag
        const token = jwt.sign(
            {
                id: employee._id,
                username: employee.username
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Return token in response
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
        const token = req.headers.authorization.split(' ')[1];
        console.log(token)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Update isOnline status to false
        await Employee.findOneAndUpdate({ _id: decoded.id }, { isOnline: false });

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Server error' });
    }
}