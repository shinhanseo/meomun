import { AuthProvider } from '../../generated/prisma/enums.js';
import { AuthRepository } from './auth.repository.js';
import { KakaoProvider } from './providers/kakao.provider.js';
import { AppleProvider } from './providers/apple.provider.js';

import {
  createAccessToken,
  createRefreshToken,
  createRefreshTokenExpiresAt,
  hashRefreshToken,
} from '../../common/utils/token.js';
import type { LoginResponse } from './auth.types.js';

export class AuthService {
  constructor(
    private readonly authRepository = new AuthRepository(),
    private readonly kakaoProvider = new KakaoProvider(),
    private readonly appleProvider = new AppleProvider(),
  ) { }

  async loginWithKakao(kakaoAccessToken: string): Promise<LoginResponse> {
    const kakaoProfile = await this.kakaoProvider.getProfile(kakaoAccessToken);

    const oauthAccount = await this.authRepository.findOauthAccount(
      AuthProvider.KAKAO,
      kakaoProfile.providerUserId,
    );

    const user =
      oauthAccount?.user ??
      (await this.authRepository.createUserWithOauthAccount(
        AuthProvider.KAKAO,
        kakaoProfile.providerUserId,
        kakaoProfile.email,
        kakaoProfile.nickname,
      ));

    const accessToken = await createAccessToken(user.id);
    const refreshToken = createRefreshToken();

    await this.authRepository.createRefreshToken(
      user.id,
      hashRefreshToken(refreshToken),
      createRefreshTokenExpiresAt(),
    );

    return {
      user: {
        id: user.id,
        nickname: user.nickname,
      },
      accessToken,
      refreshToken,
    };
  }

  async loginWithApple(
    identityToken: string,
    nonce: string,
    nickname?: string,
  ): Promise<LoginResponse> {
    const appleProfile = await this.appleProvider.getProfile(
      identityToken,
      nonce,
      nickname,
    );

    const oauthAccount = await this.authRepository.findOauthAccount(
      AuthProvider.APPLE,
      appleProfile.providerUserId,
    );

    const user =
      oauthAccount?.user ??
      (await this.authRepository.createUserWithOauthAccount(
        AuthProvider.APPLE,
        appleProfile.providerUserId,
        appleProfile.email,
        appleProfile.nickname,
      ));

    const accessToken = await createAccessToken(user.id);
    const refreshToken = createRefreshToken();

    await this.authRepository.createRefreshToken(
      user.id,
      hashRefreshToken(refreshToken),
      createRefreshTokenExpiresAt(),
    );

    return {
      user: {
        id: user.id,
        nickname: user.nickname,
      },
      accessToken,
      refreshToken,
    };
  }
}
