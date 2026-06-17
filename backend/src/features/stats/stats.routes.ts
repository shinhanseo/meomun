import { Router } from 'express';

import { authenticate } from '../../common/middleware/authenticate.js';
import { StatsController } from './stats.controller.js';

const statsRoutes = Router();
const statsController = new StatsController();

statsRoutes.use(authenticate);

statsRoutes.get('/monthly', statsController.getMonthlyStats);

export default statsRoutes;
