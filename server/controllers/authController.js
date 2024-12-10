// controllers/authController.js
import { Employee } from '../models/User.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

export const login = async (req, res) => {
    try {
      const { email, phone } = req.body;  
      const employee = await Employee.findOne({ email, phone });
      employee.isOnline = true;
      await employee.save();
      const token = jwt.sign(
        {
          id: employee._id,
          username: employee.username
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
      res.status(200).json({
        token,
        userId: employee._id,
        username: employee.username
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Server error' });
    }
  };
  
  export const logout = async (req, res) => {
    try {

    const { token } = req.body;
        
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
    const employee = await Employee.findById(decoded.id);
    employee.isOnline = false;
    await employee.save();
    res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: 'Server error' });
    }
  };