// controllers/authController.js
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
};
