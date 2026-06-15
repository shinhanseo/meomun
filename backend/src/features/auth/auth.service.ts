import { AuthProvider } from '../../generated/prisma/enums.js';
import { AuthRepository } from './auth.repository.js';
import { KakaoProvider } from './providers/kakao.provider.js';

export class AuthService {
  constructor(
    private readonly authRepository = new AuthRepository(),
    private readonly kakaoProvider = new KakaoProvider(),
  ) { }

  async loginWithKakao(kakaoAccessToken: string) {
    const kakaoProfile = await this.kakaoProvider.getProfile(kakaoAccessToken);

    const oauthAccount = await this.authRepository.findOauthAccount(
      AuthProvider.KAKAO,
      kakaoProfile.providerUserId,
    );

    if (oauthAccount) {
      return oauthAccount.user;
    }

    return this.authRepository.createUserWithOauthAccount(
      AuthProvider.KAKAO,
      kakaoProfile.providerUserId,
      kakaoProfile.email,
      kakaoProfile.nickname,
    );

  }
}
