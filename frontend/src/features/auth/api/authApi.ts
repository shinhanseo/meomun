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
  },

  loginWithApple: async (body: AppleLoginRequest): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>(`/api/auth/apple`, body);
    return data;
  },

  refreshToken: async (body: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
    const { data } = await apiClient.post<RefreshTokenResponse>(
      `/api/auth/refresh`,
      body
    );

    return data;
  },

  logout: async (body: LogoutRequest): Promise<void> => {
    await apiClient.post(`/api/auth/logout`, body);
  },

  deleteAccount: async (body: DeleteAccountRequest): Promise<void> => {
    await apiClient.delete(`/api/auth/delete_account`, {
      data: body,
    })
  }
}