import express from 'express';
import { body } from 'express-validator';
import { login } from '../controllers/authController.js';

const router = express.Router();



router.post(
    '/login',
    [
        body('username').notEmpty().withMessage('Username is required'),
        body('phone').notEmpty().withMessage('Phone is required')
    ],
    login
);

export default router;