import { Router } from 'express';
import { AuthController } from './auth.controller.js';

const authRoutes = Router();
const authController = new AuthController();

authRoutes.post('/kakao', authController.loginWithKakao);

export default authRoutes;
