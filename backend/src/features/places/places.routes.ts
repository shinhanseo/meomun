import { Router } from 'express';

import { PlacesController } from './places.controller.js';

const placesRoutes = Router();
const placesController = new PlacesController();

placesRoutes.get('/search', placesController.searchByKeyword);

export default placesRoutes;