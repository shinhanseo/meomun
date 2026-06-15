import cors from 'cors';
import express from 'express';

import archivesRoutes from './features/archives/archives.routes.js';
import authRoutes from './features/auth/auth.routes.js';
import placesRoutes from './features/places/places.routes.js';
import recordsRoutes from './features/records/records.routes.js';
import statsRoutes from './features/stats/stats.routes.js';
import uploadsRoutes from './features/uploads/uploads.routes.js';
import usersRoutes from './features/users/users.routes.js';

import { errorHandler } from './common/middleware/error-handler.js';

export const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/health', (_request, response) => {
    response.status(200).json({ status: 'ok' });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/users', usersRoutes);
  app.use('/api/records', recordsRoutes);
  app.use('/api/places', placesRoutes);
  app.use('/api/archives', archivesRoutes);
  app.use('/api/stats', statsRoutes);
  app.use('/api/uploads', uploadsRoutes);

  app.use(errorHandler);

  return app;
};
