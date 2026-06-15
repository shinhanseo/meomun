import { createRemoteJWKSet, jwtVerify } from 'jose';

import { AppError } from '../../../common/errors/app-error.js';
import type { OAuthProfile } from '../auth.types.js';

const appleJwks = createRemoteJWKSet(
  new URL('https://appleid.apple.com/auth/keys'),
);

export class AppleProvider {
  async getProfile(
    identityToken: string,
    nonce: string,
    nickname?: string,
  ): Promise<OAuthProfile> {
    const appleClientId = process.env.APPLE_CLIENT_ID;

    if (!appleClientId) {
      throw new AppError(503, 'Apple 로그인이 설정되지 않았습니다.');
    }

    try {
      const { payload } = await jwtVerify(identityToken, appleJwks, {
        issuer: 'https://appleid.apple.com',
        audience: appleClientId,
      });

      if (!payload.sub) {
        throw new AppError(401, 'Apple 사용자 ID가 없습니다.');
      }

      if (payload.nonce !== nonce) {
        throw new AppError(401, 'Apple nonce가 일치하지 않습니다.');
      }

      return {
        providerUserId: payload.sub,
        email: typeof payload.email === 'string' ? payload.email : undefined,
        nickname,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(401, '유효하지 않은 Apple Identity Token입니다.');
    }
  }
}