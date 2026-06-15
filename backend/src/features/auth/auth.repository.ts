import { AuthProvider } from '../../generated/prisma/enums.js';
import { database } from '../../db.js';

export class AuthRepository {
  /* 
    기존에 가입한 유저인지 확인하는 메서드 
    True : user 반환, False : null 반환
  */
  findOauthAccount(provider: AuthProvider, providerUserId: string) {
    return database.oAuthAccount.findUnique({
      where: {
        provider_providerUserId: {
          provider,
          providerUserId,
        },
      },
      include: {
        user: true,
      }
    });
  }

  /* 신규 유저 생성 메서드 */
  createUserWithOauthAccount(
    provider: AuthProvider,
    providerUserId: string,
    email?: string,
    nickname?: string,
  ) {
    return database.user.create({
      data: {
        nickname,
        oauthAccounts: {
          create: {
            provider,
            providerUserId,
            email,
          },
        },
      },
      include: {
        oauthAccounts: true,
      }
    });
  }
}
