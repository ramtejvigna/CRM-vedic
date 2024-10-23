import { Leave } from "../models/Leave.js";
import { Employee } from "../models/User.js";

export const getPendingLeaves = async (req, res) => {
  try {
    const { startDate, endDate, leaveType, employee, status, page, rowsPerPage } = req.query;
    const query = { status: 'Pending' };

    if (startDate) query.startDate = { $gte: new Date(startDate) };
    if (endDate) query.endDate = { $lte: new Date(endDate) };
    if (leaveType) query.leaveType = leaveType;
    if (employee) query.employee = { $regex: employee, $options: 'i' };
    if (status) query.status = status;

    const pendingLeaves = await Leave.find(query)
      .populate('employee')
      .skip(page * rowsPerPage)
      .limit(rowsPerPage)
      .sort({createdAt : -1});
    const totalLeaves = await Leave.countDocuments(query);

    res.json({ leaves: pendingLeaves, totalLeaves });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCompletedLeaves = async (req, res) => {
  try {
    const { startDate, endDate, leaveType, employee, status, page, rowsPerPage } = req.query;
    const query = { status: { $in: ['Approved', 'Rejected'] } };

    if (startDate) query.startDate = { $gte: new Date(startDate) };
    if (endDate) query.endDate = { $lte: new Date(endDate) };
    if (leaveType) query.leaveType = leaveType;
    if (employee) query.employee = { $regex: employee, $options: 'i' };
    if (status) query.status = status;

    const completedLeaves = await Leave.find(query)
      .populate('employee')
      .skip(page * rowsPerPage)
      .sort({createdAt : -1})
      .limit(rowsPerPage);

    const totalLeaves = await Leave.countDocuments(query);

    res.json({ leaves: completedLeaves, totalLeaves });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateLeaveStatus = async (req, res) => {
  try {
    const { status, adminComments } = req.body;
    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }

    if (status === 'Approved') {
      const employee = await Employee.findById(leave.employee);
      const leaveDays = (new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24) + 1;
      employee.leaveBalance -= leaveDays;
      await employee.save();
    }

    leave.status = status;
    leave.adminComments = adminComments;
    await leave.save();

    res.json(leave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getPendingLeaveCount = async (req, res) => {
  try {
    const count = await Leave.countDocuments({ status: 'Pending' });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
