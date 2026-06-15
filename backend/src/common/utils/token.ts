import { createHash, randomBytes } from 'node:crypto';

import { SignJWT } from 'jose';

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