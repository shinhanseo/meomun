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
import type { LoginResponse, TokenResponse } from './auth.types.js';
import { AppError } from '../../common/errors/app-error.js';

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

  async refresh(refreshToken: string): Promise<TokenResponse> {
    const tokenHash = hashRefreshToken(refreshToken);
    const storedToken = await this.authRepository.findRefreshToken(tokenHash);

    if (!storedToken) {
      throw new AppError(401, '유효하지 않은 Refresh Token입니다.');
    }

    if (storedToken.revokedAt) {
      throw new AppError(401, '이미 사용되거나 폐기된 Refresh Token입니다.');
    }

    if (storedToken.expiresAt <= new Date()) {
      throw new AppError(401, '만료된 Refresh Token입니다.');
    }

    await this.authRepository.revokeRefreshToken(storedToken.id);

    const newAccessToken = await createAccessToken(storedToken.userId);
    const newRefreshToken = createRefreshToken();

    await this.authRepository.createRefreshToken(
      storedToken.userId,
      hashRefreshToken(newRefreshToken),
      createRefreshTokenExpiresAt(),
      storedToken.familyId,
    );

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(refreshToken: string): Promise<void> {
    const tokenHash = hashRefreshToken(refreshToken);
    const storedToken = await this.authRepository.findRefreshToken(tokenHash);

    if (!storedToken || storedToken.revokedAt) {
      return;
    }

    await this.authRepository.revokeRefreshToken(storedToken.id);
  }

  async deleteAccount(refreshToken: string): Promise<void> {
    const tokenHash = hashRefreshToken(refreshToken);
    const storedToken = await this.authRepository.findRefreshToken(tokenHash);

    if (!storedToken || storedToken.revokedAt) {
      throw new AppError(401, '유효하지 않은 Refresh Token입니다.');
    }

    if (storedToken.expiresAt <= new Date()) {
      throw new AppError(401, '만료된 Refresh Token입니다.');
    }

    await this.authRepository.deleteUser(storedToken.userId);
  }
}
