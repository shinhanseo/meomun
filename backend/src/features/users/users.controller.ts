import type { Request, Response } from 'express';

import { AppError } from '../../common/errors/app-error.js';
import { UsersService } from './users.service.js';

import type { UpdateMeRequest } from './users.types.js';

export class UsersController {
  constructor(
    private readonly usersService = new UsersService(),
  ) { }

  getMe = async (
    request: Request,
    response: Response,
  ) => {
    const userId = this.getUserId(request);

    const user = this.usersService.getMe(userId);

    response.status(200).json(user);
  }

  updateMe = async (
    request: Request<object, object, UpdateMeRequest>,
    response: Response,
  ) => {
    const userId = this.getUserId(request);

    const user = this.usersService.updateMe(userId, request.body);

    response.status(200).json(user);
  }

  private getUserId(request: { userId?: string }): string {
    if (!request.userId) {
      throw new AppError(401, '인증된 사용자 정보가 없습니다.');
    }

    return request.userId;
  }
}
