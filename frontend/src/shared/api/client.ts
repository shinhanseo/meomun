import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

import { env } from '../config/env';
import { tokenStorage } from './tokenStorage';

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface AuthEventHandlers {
  onAccessTokenRefreshed?: (accessToken: string) => void;
  onSessionExpired?: () => void;
}

let refreshRequest: Promise<string | null> | null = null;
let authEventHandlers: AuthEventHandlers = {};

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function setApiAccessToken(accessToken: string | null) {
  if (accessToken) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    return;
  }

  delete apiClient.defaults.headers.common.Authorization;
}

export function setAuthEventHandlers(handlers: AuthEventHandlers) {
  authEventHandlers = handlers;
}

function isRefreshRequest(url?: string) {
  return url?.includes('/api/auth/refresh') ?? false;
}

function setRequestAccessToken(
  request: RetriableRequestConfig,
  accessToken: string
) {
  request.headers.Authorization = `Bearer ${accessToken}`;
}

async function refreshAccessToken() {
  if (!refreshRequest) {
    refreshRequest = (async () => {
      const refreshToken = await tokenStorage.getRefreshToken();

      if (!refreshToken) {
        return null;
      }

      const { data } = await axios.post<RefreshTokenResponse>(
        `${env.apiBaseUrl}/api/auth/refresh`,
        { refreshToken },
        {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      await tokenStorage.setRefreshToken(data.refreshToken);
      setApiAccessToken(data.accessToken);
      authEventHandlers.onAccessTokenRefreshed?.(data.accessToken);

      return data.accessToken;
    })().finally(() => {
      refreshRequest = null;
    });
  }

  return refreshRequest;
}

async function expireSession() {
  await tokenStorage.removeRefreshToken();
  setApiAccessToken(null);
  authEventHandlers.onSessionExpired?.();
}

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      isRefreshRequest(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const accessToken = await refreshAccessToken();

      if (!accessToken) {
        await expireSession();
        return Promise.reject(error);
      }

      setRequestAccessToken(originalRequest, accessToken);
      return apiClient(originalRequest);
    } catch (refreshError) {
      await expireSession();
      return Promise.reject(refreshError);
    }
  }
);
