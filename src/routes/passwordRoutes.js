import express from 'express';
import { forgotPassword } from '../controllers/passwordController.js';
import { validateForgotPassword, validate } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.post('/forgot', validateForgotPassword, validate, forgotPassword);

export default router;