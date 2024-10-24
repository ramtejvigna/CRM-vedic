import Task from '../models/Task.js';
import { Employee } from '../models/User.js';
import {Notification} from '../models/Notification.js';
import mongoose from 'mongoose';
export const getTasks = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;
    console.log(page)
    const tasks = await Task.find()
      .populate('assignedTo', 'firstName')
      .sort({ startTime: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    const totalTasks = await Task.countDocuments();
    console.log(tasks)
    res.json({ tasks, totalPages: Math.ceil(totalTasks / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

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
    const { text } = req.body.newComment;
    console.log('in add comment');
    console.log(req.body);
    console.log(req.user);

    // Find the employee by id
    const employee = await Employee.findById(req.user);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }


    const createdBy = employee.firstName
    console.log(createdBy)
    // Find the task by id
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
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

export const addCommentAdmin = async (req,res)=> {
  try {
    const { id } = req.params;
    const { text } = req.body;
    console.log('in admin add comment ');
   

    

    const createdBy = "Admin"
    console.log(createdBy)
    // Find the task by id
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Push the new comment
    task.comments.push({ text, createdBy });
    await task.save();

    res.json(task);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
}

export const getEmployeeTasks = async (req, res) => {
  const employeeId  = req.user;

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
  const employeeId = req.user;
  console.log(employeeId)
  try {
    const notifications = await Notification.find({ employee: employeeId }).sort({ createdAt: -1 });
    res.json(notifications);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const markNotificationAsRead = async (req, res, next) => {
  try {
    const userId = req.user;
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // if (!notification.recipients.includes(userId)) {
    //   return res.status(403).json({ message: 'Not authorized' });
    // }

    notification.read = true;
    await notification.save();

    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    console.log(err.message)
    next(err);
  }
};

export const createNotification = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { message, recipients } = req.body;
    const sender = '66f8324f7e51f0aebd0a81c3'; // Replace with actual sender ID

    const notification = new Notification({
      message,
      sender,
      recipients
    });

    await notification.save();

    res.status(201).json({ message: 'Notification sent successfully', notification });
  } catch (err) {
    next(err);
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
