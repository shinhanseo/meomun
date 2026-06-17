import { Router } from 'express';

import { authenticate } from '../../common/middleware/authenticate.js';
import { ArchivesController } from './archives.controller.js';

const archivesRoutes = Router();
const archivesController = new ArchivesController();

archivesRoutes.use(authenticate);

archivesRoutes.get('/all', archivesController.getAllArchive);
archivesRoutes.get('/monthly', archivesController.getMonthlyArchive);
archivesRoutes.get('/emotions', archivesController.getEmotionArchive);
archivesRoutes.get(
  '/emotions/:emotion/records',
  archivesController.getEmotionArchiveDetail,
);

export default archivesRoutes;
