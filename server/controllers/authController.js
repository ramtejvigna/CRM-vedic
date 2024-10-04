// controllers/authController.js
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
};
