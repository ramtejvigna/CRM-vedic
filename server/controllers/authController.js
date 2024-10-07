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

        // Generate JWT token with employee ObjectId and isAdmin flag
        const token = jwt.sign(
            {
                id: employee._id,
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Return token in response
        res.status(200).json({
            token,
            userId: employee._id,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};