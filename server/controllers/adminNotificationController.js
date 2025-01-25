
import { NotificationAdmin } from "../models/Notification.js";
import { Employee } from "../models/User.js";
export const createNotification = async (employeeId, message) => {
    try {
      console.log(employeeId,message)
      const notification = new NotificationAdmin({
        employee: employeeId,
        message,
      });
      await notification.save();
  
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };
  
  // Get notifications for an admin
  export const getNotifications = async (req, res) => {
    try {
      const notifications = await NotificationAdmin.find().sort({ createdAt: -1 });
      res.status(200).json(notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ message: 'Error fetching notifications' });
    }
  };
  
  // Mark a notification as read
  export const markAsRead = async (req, res) => {
    try {
      const notification = await NotificationAdmin.findById(req.params.id);
      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }
      notification.isRead = true;
      await notification.save();
      res.status(200).json(notification);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      res.status(500).json({ message: 'Error marking notification as read' });
    }
  };

  export const deleteAllNotifications = async (req, res) => {
    try {
      await NotificationAdmin.deleteMany({});
      res.status(200).json({ message: 'All notifications cleared successfully' });
    } catch (error) {
      console.error('Error deleting notifications:', error);
      res.status(500).json({ message: 'Error deleting notifications' });
    }
  };
  