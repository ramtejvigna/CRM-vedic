import { Leave } from "../models/Leave.js";
import { NotificationAdmin } from "../models/Notification.js";
import { Employee } from "../models/User.js";

export const applyLeave = async (req, res) => {
    try {
      const { startDate, endDate, leaveType, reason } = req.body;
      const leave = new Leave({
        employee: req.user,
        startDate,
        endDate,
        leaveType,
        reason
      });
      await leave.save();
      const employee = await Employee.findById(req.user)
        const message = `New leave application from ${employee.firstName} ${employee.lastName}`;
        await NotificationAdmin.create({
          employee: req.user,
          message,
        });
      
  
      res.status(201).json(leave);
    } catch (error) {
      console.log(error.message)
      res.status(400).json({ message: error.message });
    }
  };
  
export const getPendingLeaves = async (req, res) => {
   
    try {
      const pendingLeaves = await Leave.find({ status: 'Pending' }).populate('employee');
      res.json(pendingLeaves);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  export const getLeaveBalance = async (req,res)=> {
    const empId = req.user
    const employee = await Employee.findById(empId)
    const leaveBalance = employee.leaveBalance
    res.json({leaveBalance})
  }
export const getLeaveHistory = async (req, res) => {
    try {
      const leaveHistory = await Leave.find({ employee: req.user }).sort({ createdAt: -1 });
      res.json(leaveHistory);
    } catch (error) {
      console.log(error.message)
      res.status(500).json({ message: error.message });
    }
  };
  
  export const deleteLeave = async (req, res) => {
    try {
      const leave = await Leave.findByIdAndDelete(req.params.id);
      // if (!leave) {
      //   return res.status(404).json({ message: 'Leave request not found' });
      // }
      // await leave.remove();
      res.status(200).json({ message: 'Leave request deleted successfully' });
    } catch (error) {
      console.error('Error deleting leave request:', error);
      res.status(500).json({ message: 'Error deleting leave request' });
    }
  };
//  export const updateLeaveStatus = async (req, res) => {
//     if (!req.user.isAdmin) {
//       return res.status(403).json({ message: 'Access denied' });
//     }
//     try {
//       const { status, adminComments } = req.body;
//       const leave = await Leave.findByIdAndUpdate(req.params.id, 
//         { status, adminComments }, 
//         { new: true }
//       );
//       if (!leave) {
//         return res.status(404).json({ message: 'Leave not found' });
//       }
//       res.json(leave);
//     } catch (error) {
//       res.status(400).json({ message: error.message });
//     }
//   };