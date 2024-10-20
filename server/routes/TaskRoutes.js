import express from 'express';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  addComment,
  getEmployeeTasks,
  updateTaskStatus,
  getEmployees,
  getNotifications,
  markAsRead
} from '../controllers/TaskManagement.js';
// import {
 
// } from '../controllers/EmployeeController.js';
// import {
//   getNotifications,
//   markAsRead,
// } from '../controllers/NotificationController.js';
import { auth } from '../middleware/auth.js';
const router = express.Router();

// Admin task routes
router.get('/tasks', getTasks);
router.post('/tasks', createTask);
router.put('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);
router.post('/employee/tasks/:id/comments',auth , addComment);

// Employee routes
router.get('/employee/tasks', auth, getEmployeeTasks);
router.put('/employee/tasks/:id/status', updateTaskStatus);
router.get('/employees', getEmployees);

// Notifications routes
router.get('/notifications/get', auth , getNotifications);
router.put('/notifications/:id/read', markAsRead);

export default router;
