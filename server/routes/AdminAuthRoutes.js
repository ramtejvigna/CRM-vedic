import express from 'express';
import { checkAuth, forgotPassword, login, logout, resetPassword, signup , verifyOTP , changePassword } from '../controllers/AdminAuthControllers.js';
import { verifyToken } from '../middleware/AdminAuth.js';

const router = express.Router();

router.post('/register' , signup )
router.post('/login' , login)
router.get('/check-auth' , verifyToken , checkAuth)
router.post('/forgot-password' , forgotPassword);
router.post('/verify-otp' , verifyOTP)
router.post('/change-password/:token' , resetPassword)
router.post('/change-current-password' , verifyToken , changePassword)
router.post('/logout' , logout)
export default router;
