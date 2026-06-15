import axios from 'axios';

import { AppError } from '../../../common/errors/app-error.js';
import type { OAuthProfile } from '../auth.types.js';

interface KakaoUserResponse {
  id: number;
  kakao_account?: {
    email?: string;
    profile?: {
      nickname?: string;
    };
  };
}

interface KakaoTokenInfoResponse {
  id: number;
  app_id: number;
  expires_in: number;
}

export class KakaoProvider {
  async getProfile(kakaoAccessToken: string): Promise<OAuthProfile> {
    await this.validateAccessToken(kakaoAccessToken);

    try {
      const response = await axios.get<KakaoUserResponse>(
        'https://kapi.kakao.com/v2/user/me',
        {
          headers: {
            Authorization: `Bearer ${kakaoAccessToken}`,
          },
          timeout: 5000,
        },
      );

      return {
        providerUserId: String(response.data.id),
        email: response.data.kakao_account?.email,
        nickname: response.data.kakao_account?.profile?.nickname,
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        throw new AppError(401, '유효하지 않은 카카오 토큰입니다.');
      }

      throw new AppError(502, '카카오 사용자 정보 조회에 실패했습니다.');
    }
  }

  private async validateAccessToken(kakaoAccessToken: string): Promise<void> {
    const kakaoAppId = process.env.KAKAO_APP_ID;

    if (!kakaoAppId) {
      throw new AppError(500, 'KAKAO_APP_ID가 설정되지 않았습니다.');
    }

    try {
      const response = await axios.get<KakaoTokenInfoResponse>(
        'https://kapi.kakao.com/v1/user/access_token_info',
        {
          headers: {
            Authorization: `Bearer ${kakaoAccessToken}`,
          },
          timeout: 5000,
        },
      );

      if (String(response.data.app_id) !== kakaoAppId) {
        throw new AppError(
          401,
          '다른 카카오 애플리케이션에서 발급된 토큰입니다.',
        );
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      if (axios.isAxiosError(error) && error.response?.status === 401) {
        throw new AppError(401, '유효하지 않은 카카오 토큰입니다.');
      }

      throw new AppError(502, '카카오 토큰 검증에 실패했습니다.');
    }
  }
}