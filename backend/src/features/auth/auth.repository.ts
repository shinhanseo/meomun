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

  createRefreshToken(
    userId: string,
    tokenHash: string,
    expiresAt: Date,
    familyId?: string,
    userAgent?: string,
    ipAddress?: string,
  ) {
    return database.refreshToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
        familyId,
        userAgent,
        ipAddress,
      },
    });
  }

  findRefreshToken(tokenHash: string) {
    return database.refreshToken.findUnique({
      where: {
        tokenHash,
      }
    });
  }

  revokeRefreshToken(id: string) {
    return database.refreshToken.update({
      where: {
        id,
      },
      data: {
        revokedAt: new Date(),
        lastUsedAt: new Date(),
      }
    });
  }
}
