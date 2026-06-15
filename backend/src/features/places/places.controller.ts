import type { Request, Response } from 'express';

import { PlacesService } from './places.service.js';

interface SearchPlacesQuery {
  query?: string;
  page?: string;
  size?: string;
}

export class PlacesController {
  constructor(
    private readonly placesService = new PlacesService(),
  ) { }

  searchByKeyword = async (
    request: Request<object, object, object, SearchPlacesQuery>,
    response: Response,
  ) => {
    const { query, page, size } = request.query;

    const result = await this.placesService.searchByKeyword({
      query: query ?? '',
      page: page === undefined ? undefined : Number(page),
      size: size === undefined ? undefined : Number(size),
    });

    response.status(200).json(result);
  };
}