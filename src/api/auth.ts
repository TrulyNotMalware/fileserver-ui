import type {
  LoginRequest,
  PublicKeyResponse,
  TokenResponse,
} from '@/types/auth';

import { request } from './client';

export const authApi = {
  getPublicKey: () => request<PublicKeyResponse>('/auth/public-key'),

  login: (body: LoginRequest) =>
    request<TokenResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  refresh: () =>
    request<TokenResponse>('/auth/refresh', {
      method: 'POST',
    }),

  logout: () =>
    request<void>('/auth/logout', {
      method: 'POST',
    }),
};
