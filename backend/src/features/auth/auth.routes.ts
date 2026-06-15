import { Router } from 'express';
import { AuthController } from './auth.controller.js';

const authRoutes = Router();
const authController = new AuthController();

authRoutes.post('/kakao', authController.loginWithKakao);
authRoutes.post('/apple', authController.loginWithApple);
authRoutes.post('/refresh', authController.refresh);
authRoutes.post('/logout', authController.logout);

export default authRoutes;
