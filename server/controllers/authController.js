// controllers/authController.js
import { Employee } from '../models/User.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

export const login = async (req, res) => {
    try {
        // Find user by username
        const { username, phone } = req.body;

        // Find employee by username and phone
        const employee = await Employee.findOne({ username, phone });

        if (!employee) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Update isOnline status
        await Employee.findOneAndUpdate({ _id: employee._id }, { isOnline: true });

        // Generate JWT token with employee ObjectId and isAdmin flag
        const token = jwt.sign(
            {
                id: employee._id,
                username: employee.username
            },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        // Return token in response
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
        const token = req.headers.authorization.split(' ')[1];
        console.log(token)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Update isOnline status to false
        await Employee.findOneAndUpdate({ _id: decoded.id }, { isOnline: false });

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.log(error.message);
        
        res.status(500).json({ message: 'Server error' });
    }
}