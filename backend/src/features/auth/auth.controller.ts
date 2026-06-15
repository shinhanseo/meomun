import type { Request, Response } from 'express';

import { AuthService } from './auth.service.js';
import type { KakaoLoginRequest } from './auth.types.js';

export class AuthController {
  constructor(private readonly authService = new AuthService()) { }

  loginWithKakao = async (
    request: Request<object, object, KakaoLoginRequest>,
    response: Response
  ) => {
    const { kakaoAccessToken } = request.body

    if (!kakaoAccessToken) {
      response.status(400).json({
        message: 'kakaoAccessToken이 필요합니다.',
      });

      return;
    }

    const result = await this.authService.loginWithKakao(kakaoAccessToken);

    response.status(200).json(result);
  }
}