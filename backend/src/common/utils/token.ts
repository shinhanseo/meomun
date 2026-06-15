import { createHash, randomBytes } from 'node:crypto';

import { jwtVerify, SignJWT } from 'jose';
import { AppError } from '../errors/app-error.js';

const accessTokenSecret = process.env.JWT_ACCESS_SECRET;

if (!accessTokenSecret) {
  throw new Error('JWT_ACCESS_SECRET is not set.');
}

const secretKey = new TextEncoder().encode(accessTokenSecret);

export async function createAccessToken(userId: string): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(secretKey);
}

export function createRefreshToken(): string {
  return randomBytes(64).toString('base64url');
}

export function hashRefreshToken(refreshToken: string): string {
  return createHash('sha256').update(refreshToken).digest('hex');
}

export function createRefreshTokenExpiresAt(): Date {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  return expiresAt;
}

export async function verityAccessToken(accessToken: string) {
  try {
    const { payload } = await jwtVerify(accessToken, secretKey);

    if (!payload) {
      throw new AppError(401, '사용자 정보가 없는 Access Token입니다.');
    }

    return payload.sub;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(401, '유효하지 않거나 만료된 Access Token입니다.');
  }
}