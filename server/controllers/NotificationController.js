// import Notification from '../models/Notification.js';

// export const getNotifications = async (req, res) => {
//   const employeeId  = req.user;
//   console.log(employeeId,'emp id')

//   try {
//     const notifications = await Notification.find({ employee: employeeId }).sort({ createdAt: -1 });
//     res.json(notifications);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const markAsRead = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const notification = await Notification.findById(id);
//     if (!notification) {
//       return res.status(404).json({ message: 'Notification not found' });
//     }

//     notification.isRead = true;
//     await notification.save();

//     res.json(notification);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


// export const createNotification = async (req, res, next) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { message, recipients } = req.body;
//     const sender = '66f8324f7e51f0aebd0a81c3'; // Replace with actual sender ID

//     const notification = new Notification({
//       message,
//       sender,
//       recipients
//     });

//     await notification.save();

//     res.status(201).json({ message: 'Notification sent successfully', notification });
//   } catch (err) {
//     next(err);
//   }
// };

// // export const getNotifications = async (req, res, next) => {
// //   try {
// //     const userId = req.user;
// //     console.log(userId)
// //     const notifications = await Notification.find({ recipients: userId })
// //       .sort({ createdAt: -1 })
// //       .populate('sender', 'name');

// //     res.json(notifications);
// //   } catch (err) {
// //     console.log(err.message)
// //     next(err);
// //   }
// // };

// export const markNotificationAsRead = async (req, res, next) => {
//   try {
//     const userId = req.user;
//     const notification = await Notification.findById(req.params.id);

//     if (!notification) {
//       return res.status(404).json({ message: 'Notification not found' });
//     }

//     // if (!notification.recipients.includes(userId)) {
//     //   return res.status(403).json({ message: 'Not authorized' });
//     // }

//     notification.read = true;
//     await notification.save();

//     res.json({ message: 'Notification marked as read' });
//   } catch (err) {
//     console.log(err.message)
//     next(err);
//   }
// };
