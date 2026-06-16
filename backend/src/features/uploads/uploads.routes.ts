import { Router } from 'express';

import { authenticate } from '../../common/middleware/authenticate.js';
import { UploadsController } from './uploads.controller.js';

const uploadsRoutes = Router();
const uploadsController = new UploadsController();

uploadsRoutes.use(authenticate);

uploadsRoutes.post('/presigned-urls', uploadsController.createPresignedUrls);

export default uploadsRoutes;
