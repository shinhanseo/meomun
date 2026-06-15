import type { NextFunction, Request, Response } from 'express';

import { AppError } from '../errors/app-error.js';
import { verifyAccessToken } from '../utils/token.js';

export async function authenticate(
  request: Request,
  _response: Response,
  next: NextFunction,
) {
  try {
    const authorization = request.headers.authorization;

    if (!authorization?.startsWith('Bearer ')) {
      throw new AppError(401, 'Access Token이 필요합니다.');
    }

    const accessToken = authorization.slice('Bearer '.length).trim();

    if (!accessToken) {
      throw new AppError(401, 'Access Token이 필요합니다.');
    }

    request.userId = await verifyAccessToken(accessToken);

    next();
  } catch (error) {
    next(error);
  }
}