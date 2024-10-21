import express from 'express';
import { body } from 'express-validator';
import { login, logout } from '../controllers/authController.js';

const router = express.Router();



router.post(
        '/login',
        [
                body('phone').notEmpty().withMessage('Phone is required')
        ],
        login
);

router.post('/logout' , logout)

export default router;
