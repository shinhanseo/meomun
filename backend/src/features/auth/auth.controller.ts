import type { Request, Response } from 'express';

import { AuthService } from './auth.service.js';
import type {
  AppleLoginRequest,
  KakaoLoginRequest,
  RefreshRequest,
  LogoutRequest,
  DeleteAccountRequest,
} from './auth.types.js';

import { AppError } from '../../common/errors/app-error.js';

export class AuthController {
  constructor(private readonly authService = new AuthService()) { }

  loginWithKakao = async (
    request: Request<object, object, KakaoLoginRequest>,
    response: Response
  ) => {
    const { kakaoAccessToken } = request.body

    if (!kakaoAccessToken) {
      throw new AppError(400, 'kakaoAccessToken이 필요합니다.');

      return;
    }

    const result = await this.authService.loginWithKakao(kakaoAccessToken);

    response.status(200).json(result);
  }

  loginWithApple = async (
    request: Request<object, object, AppleLoginRequest>,
    response: Response,
  ) => {
    const { identityToken, nonce, nickname } = request.body;

    if (!identityToken) {
      throw new AppError(400, 'identityToken이 필요합니다.');
    }

    if (!nonce) {
      throw new AppError(400, 'nonce가 필요합니다.');
    }

    const result = await this.authService.loginWithApple(
      identityToken,
      nonce,
      nickname,
    );

    response.status(200).json(result);
  };

  refresh = async (
    request: Request<object, object, RefreshRequest>,
    response: Response,
  ) => {
    const { refreshToken } = request.body;

    if (!refreshToken) {
      throw new AppError(400, 'refreshToken이 필요합니다.');
    }

    const result = await this.authService.refresh(refreshToken);

    response.status(200).json(result);
  }

  logout = async (
    request: Request<object, object, LogoutRequest>,
    response: Response,
  ) => {
    const { refreshToken } = request.body;

    if (!refreshToken) {
      throw new AppError(400, 'refreshToken이 필요합니다.');
    }

    await this.authService.logout(refreshToken);

    response.status(204).send();
  };

  deleteAccount = async (
    request: Request<object, object, DeleteAccountRequest>,
    response: Response,
  ) => {
    const { refreshToken } = request.body;

    if (!refreshToken) {
      throw new AppError(400, 'refreshToken이 필요합니다.');
    }

    await this.authService.deleteAccount(refreshToken);

    response.status(204).send();
  };
}
