import Task from '../models/Task.js';
import { Employee } from '../models/User.js';
import Notification from '../models/Notification.js';
import mongoose from 'mongoose';
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedTo', 'name');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTask = async (req, res) => {
  const { title, description, assignedTo, endTime } = req.body;

  try {
    const newTask = new Task({
      title,
      description,
      assignedTo,
      endTime: new Date(endTime),
    });

    const savedTask = await newTask.save();

    // Create notification for the assigned employee
    const notification = new Notification({
      message: `New task assigned: ${title}`,
      employee: assignedTo,
    });
    await notification.save();

    res.status(201).json(savedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, assignedTo, endTime, status } = req.body;

  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.title = title;
    task.description = description;
    task.assignedTo = assignedTo;
    task.endTime = endTime;
    task.status = status;

    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTaskStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.status = status;
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, createdBy } = req.body;

    // Find the task by id
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Validate if createdBy is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(createdBy)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Push the new comment
    task.comments.push({ text, createdBy });
    await task.save();

    res.json(task);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
};



export const getEmployeeTasks = async (req, res) => {
  const { employeeId } = req.params;

  try {
    const tasks = await Task.find({ assignedTo: employeeId }).sort({ startTime: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Server error. Failed to fetch employees.' });
  }
};

export const getNotifications = async (req, res) => {
  const { employeeId } = req.params;

  try {
    const notifications = await Notification.find({ employee: employeeId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markAsRead = async (req, res) => {
  const { id } = req.params;

  try {
    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.isRead = true;
    await notification.save();

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};