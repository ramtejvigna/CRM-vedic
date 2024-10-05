import Task from '../models/Task.js';
import { Employee } from '../models/User.js';
import Notification from '../models/Notification.js';

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

    // Create notifications for each assigned employee
    for (const empId of assignedTo) {
      const notification = new Notification({
        message: `New task assigned: ${title}`,
        employee: empId,
      });
      await notification.save();
    }

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
  const { id } = req.params;
  const { text, createdBy } = req.body;

  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    console.log(createdBy)
    task.comments.push({ text, createdBy });
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getEmployeeTasks = async (req, res) => {
  const  employeeId  = req.user;
  console.log(req.user)
  try {
    const tasks = await Task.find({ assignedTo: employeeId }).sort({ startTime: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const addEmployee = async (req, res) => {
  const { username, password, email, name } = req.body;
  const newEmployee = new Employee({ username, password, email, name });
  await newEmployee.save();
  res.status(201).json({ message: 'Employee added successfully', employee: newEmployee });
};


export const getAllEmployees = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const totalEmployees = await Employee.countDocuments({ isAdmin: false });
  const employees = await Employee.find({ isAdmin: false })
    .select('-password')
    .skip(skip)
    .limit(limit);

  res.json({
    employees,
    currentPage: page,
    totalPages: Math.ceil(totalEmployees / limit),
    totalEmployees
  });
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
