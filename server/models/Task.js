import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  text: String,
  createdBy: {
  type: String,
  default : 'Admin'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date, required: true },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
  comments: [commentSchema],
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
