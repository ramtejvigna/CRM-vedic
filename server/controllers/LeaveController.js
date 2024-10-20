import { Leave } from "../models/Leave.js";

export const applyLeave = async (req, res) => {
    try {
      const { startDate, endDate, leaveType, reason } = req.body;
      const leave = new Leave({
        employee: req.user._id,
        startDate,
        endDate,
        leaveType,
        reason
      });
      await leave.save();
      res.status(201).json(leave);
    } catch (error) {
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
  
export const getLeaveHistory = async (req, res) => {
    try {
      const leaveHistory = await Leave.find({ employee: req.user._id }).sort({ createdAt: -1 });
      res.json(leaveHistory);
    } catch (error) {
      res.status(500).json({ message: error.message });
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