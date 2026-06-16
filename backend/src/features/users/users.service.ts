import { AppError } from '../../common/errors/app-error.js';
import { UsersRepository } from './users.repository.js';

import type {
  UpdateMeRequest,
  UserMeResponse,
} from './users.types.js';
const MAX_NICKNAME_LENGTH = 20;

export class UsersService {
  constructor(
    private readonly usersRepository = new UsersRepository(),
  ) { }

  async getMe(userId: string): Promise<UserMeResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new AppError(404, '사용자를 찾을 수 없습니다.');
    }

    return this.toUserMeResponse(user);
  }

  async updateMe(userId: string, request: UpdateMeRequest): Promise<UserMeResponse> {
    if (!Object.prototype.hasOwnProperty.call(request, 'nickname')) {
      throw new AppError(400, '수정할 닉네임이 필요합니다.');
    }

    const nickname = this.normalizeNickname(request.nickname);

    const user = await this.usersRepository.updateById(userId, nickname);

    return this.toUserMeResponse(user);
  }

  private normalizeNickname(nickname: string | null | undefined): string | null {
    if (nickname === undefined || nickname === null) {
      return null;
    }

    const trimmedNickname = nickname.trim();

    if (!trimmedNickname) {
      return null;
    }

    if (trimmedNickname.length > MAX_NICKNAME_LENGTH) {
      throw new AppError(400, '닉네임은 최대 20자까지 입력할 수 있습니다.');
    }

    return trimmedNickname;
  }

  private toUserMeResponse(user: {
    id: string;
    nickname: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): UserMeResponse {
    return {
      id: user.id,
      nickname: user.nickname,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}
