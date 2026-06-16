import { Router } from 'express';

import { authenticate } from '../../common/middleware/authenticate.js';
import { UsersController } from './users.controller.js';

const usersRoutes = Router();
const usersController = new UsersController();

usersRoutes.use(authenticate);

usersRoutes.get('/me', usersController.getMe);
usersRoutes.patch('/me', usersController.updateMe);

export default usersRoutes;