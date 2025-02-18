// controllers/authController.js
import { Employee, Admin } from '../models/User.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'; // For secure password handling
dotenv.config();

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user is an Employee
        let user = await Employee.findOne({ email });

        if (user) {
            
            user.isOnline = true;
            await user.save();

            const token = jwt.sign(
                {
                    id: user._id,
                    username: user.username,
                    role: 'employee' // Add role for clarity
                },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            // Set cookie on the server
            res.cookie('userId', user._id, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }); // 1 day expiry

            return res.status(200).json({
                token,
                userId: user._id,
                username: user.username,
                role: 'employee'
            });
        }

        // If not an Employee, check if the user is an Admin
        user = await Admin.findOne({ email });

        if (user) {
            // Compare hashed password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            user.isOnline = true;
            await user.save();

            const token = jwt.sign(
                {
                    id: user._id,
                    username: user.username,
                    role: 'admin' // Add role for clarity
                },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            // Set cookie on the server
            res.cookie('userId', user._id, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }); // 1 day expiry

            return res.status(200).json({
                token,
                userId: user._id,
                username: user.username,
                role: 'admin'
            });
        }

        // If no user is found
        return res.status(404).json({ message: 'User not found' });
    } catch (error) {
        console.error('Login error:', error.message);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const logout = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ message: 'Token is required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the user is an Employee or Admin
        let user = await Employee.findById(decoded.id);
        if (!user) {
            user = await Admin.findById(decoded.id);
        }

        if (user) {
            user.isOnline = false;
            await user.save();
        }

        // Clear the cookie
        res.clearCookie('userId');

        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error.message);
        return res.status(500).json({ message: 'Server error' });
    }
};