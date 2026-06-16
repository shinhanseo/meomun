import { database } from '../../db.js';

export class UsersRepository {
  findById(userId: string) {
    return database.user.findUnique({
      where: {
        id: userId,
      }
    });
  }

  updateById(userId: string, nickname: string | null) {
    return database.user.update({
      where: {
        id: userId,
      },
      data: {
        nickname,
      }
    });
  }
}
