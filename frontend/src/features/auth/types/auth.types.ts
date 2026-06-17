// frontend/src/features/auth/types/auth.types.ts

export interface AuthUser {
  id: string;
  nickname: string;
}

export interface KakaoLoginRequest {
  kakaoAccessToken: string;
}

export interface AppleLoginRequest {
  identityToken: string;
  nonce: string;
  nickname?: string;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface DeleteAccountRequest {
  refreshToken: string;
}