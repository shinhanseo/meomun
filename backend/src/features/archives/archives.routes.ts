import { Router } from 'express';

import { authenticate } from '../../common/middleware/authenticate.js';
import { ArchivesController } from './archives.controller.js';

const archivesRoutes = Router();
const archivesController = new ArchivesController();

archivesRoutes.use(authenticate);

archivesRoutes.get('/all', archivesController.getAllArchive);

export default archivesRoutes;
