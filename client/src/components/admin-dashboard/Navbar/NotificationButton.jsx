import React, { useState, useEffect } from 'react';
import {
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Typography,
  Badge,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter
} from "@material-tailwind/react";
import { FaBell, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import moment from 'moment';
import Cookies from 'js-cookie';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../../utils/constants';

const NotificationButton = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isClearing, setIsClearing] = useState(false);
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const token = Cookies.get('token');

  useEffect(() => {
    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${api}/admin/notifications/get`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(response.data);
      setUnreadCount(response.data.filter(n => !n.isRead).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`${api}/admin/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleClearAll = async () => {
    setIsClearing(true);
    try {
      await axios.delete(`${api}/admin/notifications/clear-all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications([]);
      setUnreadCount(0);
      setShowClearConfirmation(false);
      setShowSuccessMessage(true);

      // Hide success message after 2 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
        setIsClearing(false);
      }, 2000);
    } catch (error) {
      console.error('Error clearing notifications:', error);
      setIsClearing(false);
    }
  };

  return (
    <div className="relative">
      <Menu>
        <MenuHandler>
          <Button variant="text" className="relative p-2">
            <Badge
              content={unreadCount}
              visible={unreadCount > 0}
              className="h-4 w-4 text-xs flex items-center justify-center"
            >
              <FaBell size={20} />
            </Badge>
          </Button>
        </MenuHandler>
        <MenuList className="max-h-[300px] overflow-y-auto relative">
          {notifications?.length > 0 ? (
            <>
              <div className="flex justify-end p-2">
                <Button
                  size="sm"
                  color="red"
                  variant="text"
                  onClick={() => setShowClearConfirmation(true)}
                  className="flex items-center space-x-2"
                >
                  <FaTrash /> <span>Clear All</span>
                </Button>
              </div>
              <AnimatePresence>
                {notifications?.map((notification) => (
                  <motion.div
                    key={notification._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <MenuItem
                      onClick={() => markAsRead(notification._id)}
                      className="flex items-center p-2 hover:bg-gray-100"
                    >
                      <div className="flex-grow">
                        <Typography variant="small" color="blue-gray" className="font-semibold">
                          {notification.message}
                        </Typography>
                        <Typography variant="small" color="gray" className="text-xs">
                          {moment(notification.createdAt).fromNow()}
                        </Typography>
                      </div>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
                      )}
                    </MenuItem>
                  </motion.div>
                ))}
              </AnimatePresence>
            </>
          ) : (
            <MenuItem disabled>
              <div className="text-center py-4">
                <Typography variant="h6" color="gray">
                  No Notifications
                </Typography>
                <Typography variant="small" color="gray">
                  You're all caught up!
                </Typography>
              </div>
            </MenuItem>
          )}
        </MenuList>
      </Menu>

      {/* Clear Confirmation Dialog */}
      {showClearConfirmation && (
        <div className="fixed top-16 right-12 z-50 bg-white rounded-lg shadow-lg p-4 w-[300px]">
          <DialogHeader className="text-center">Clear All Notifications?</DialogHeader>
          <DialogBody className="text-center">
            Are you sure you want to clear all notifications? This action cannot be undone.
          </DialogBody>
          <DialogFooter className="flex justify-center space-x-2">
            <Button
              variant="text"
              color="gray"
              onClick={() => setShowClearConfirmation(false)}
            >
              Cancel
            </Button>
            <Button
              color="red"
              onClick={handleClearAll}
              disabled={isClearing}
            >
              {isClearing ? 'Clearing...' : 'Clear All'}
            </Button>
          </DialogFooter>
        </div>
      )}

      {/* Success Message */}
      {showSuccessMessage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg"
        >
          Notifications cleared successfully!
        </motion.div>
      )}
    </div>
  );
};

export default NotificationButton;
