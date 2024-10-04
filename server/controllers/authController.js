// controllers/authController.js
<<<<<<< HEAD
import {Employee} from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const login = async (req, res) => {
  const { username, password } = req.body;
  console.log(password)
  try {
    const user = await Employee.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // const isMatch = await bcrypt.compare(password, user.password);
    const isMatch =  true
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin, username: user.username }, // Include username here
     'crm',
      { expiresIn: '1d' }
    );
    return res.status(200).json({
      token,
      user: {
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Server error' });
  }
=======
import { Employee } from '../models/User.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();


export const login = async (req, res) => {
    const { username, phone } = req.body;

    try {
        // Find user by username
        const user = await Employee.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Check if phone matches
        if (user.phone !== phone) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        
        // Send response
        return res.status(200).json({
            token,
            user: {
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
>>>>>>> abf57aa7a344784689bd4fb223785a56cfcb61f7
};
