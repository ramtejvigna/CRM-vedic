import mongoose from "mongoose";
const leaveSchema = new mongoose.Schema({
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    leaveType: {
      type: String,
      enum: ['Vacation', 'Sick', 'Personal', 'Other'],
      required: true
    },
    reason: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending'
    },
    adminComments: String
  }, { timestamps: true });
  
  export const Leave = mongoose.model('Leave', leaveSchema);
  
  
  