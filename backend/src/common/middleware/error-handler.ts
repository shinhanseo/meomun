import axios from 'axios';
import type { ErrorRequestHandler } from 'express';

import { AppError } from '../errors/app-error.js';

export const errorHandler: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next,
) => {
  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      message: error.message,
    });
    return;
  }

  if (axios.isAxiosError(error)) {
    response.status(401).json({
      message: '카카오 인증에 실패했습니다.',
    });
    return;
  }

  console.error(error);

  response.status(500).json({
    message: '서버 오류가 발생했습니다.',
  });
};