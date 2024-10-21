// controllers/adminController.js
import { Leave } from "../models/Leave.js";
import { Employee } from "../models/User.js";

export const getPendingLeaves = async (req, res) => {
  try {
    const pendingLeaves = await Leave.find({ status: 'Pending' }).populate('employee');
    console.log(pendingLeaves, ' pending')
    res.json(pendingLeaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCompletedLeaves = async (req, res) => {
  try {
    const completedLeaves = await Leave.find({ status: { $in: ['Approved', 'Rejected'] } }).populate('employee');
    res.json(completedLeaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateLeaveStatus = async (req, res) => {
 
  try {
    const { status, adminComments } = req.body;
    console.log(status)
    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }

    if (status === 'Approved') {
      const employee = await Employee.findById(leave.employee);
      console.log(employee)
      const leaveDays = (new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24) + 1;
      employee.leaveBalance -= leaveDays;
      await employee.save();
    }

    leave.status = status;
    leave.adminComments = adminComments;
    await leave.save();

    res.json(leave);
  } catch (error) {
    console.log(error.message)
    res.status(400).json({ message: error.message });
  }
};
