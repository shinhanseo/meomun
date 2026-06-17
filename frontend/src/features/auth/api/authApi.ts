import { apiClient } from "../../../shared/api/client";
import type {
  AppleLoginRequest,
  AuthResponse,
  DeleteAccountRequest,
  KakaoLoginRequest,
  LogoutRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from '../types/auth.types';

export const authApi = {
  loginWithKakao: async (body: KakaoLoginRequest): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>(`/api/auth/kakao`, body);
    return data;
  }
}