export interface KakaoLoginRequest {
  kakaoAccessToken: string;
}

export interface OAuthProfile {
  providerUserId: string;
  email?: string;
  nickname?: string;
}

export interface LoginResponse {
  user: {
    id: string;
    nickname: string | null;
  };
  accessToken: string;
  refreshToken: string;
}

export interface AppleLoginRequest {
  identityToken: string;
  nonce: string;
  nickname?: string;
}