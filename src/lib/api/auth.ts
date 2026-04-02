import { addSeconds } from '../date';
import type { AuthSession } from '../auth/types';
import { mapUser } from './mappers';
import { request } from './client';
import type { TransportUser } from './types';

interface LoginPayload {
  identifier: string;
  password: string;
}

interface RegisterPayload {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  password: string;
  dob: string;
}

interface TransportLoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: TransportUser;
}

interface TransportMessageResponse {
  message: string;
}

interface VerifyEmailPayload {
  token: string;
}

interface ResendVerificationPayload {
  email: string;
}

interface ForgotPasswordPayload {
  email: string;
}

interface SetPasswordPayload {
  token: string;
  password: string;
  confirm_password: string;
}

export async function login(payload: LoginPayload): Promise<AuthSession> {
  const response = await request<TransportLoginResponse>('/auth/login', {
    method: 'POST',
    auth: false,
    body: JSON.stringify(payload),
  });

  return {
    accessToken: response.access_token,
    expiresAt: addSeconds(new Date(), response.expires_in).toISOString(),
    user: mapUser(response.user),
  };
}

export function register(payload: RegisterPayload) {
  return request<TransportMessageResponse>('/auth/register', {
    method: 'POST',
    auth: false,
    body: JSON.stringify(payload),
  });
}

export function verifyEmail(payload: VerifyEmailPayload) {
  return request<TransportMessageResponse>('/auth/verify-email', {
    method: 'POST',
    auth: false,
    body: JSON.stringify(payload),
  });
}

export function resendVerification(payload: ResendVerificationPayload) {
  return request<TransportMessageResponse>('/auth/resend-verification', {
    method: 'POST',
    auth: false,
    body: JSON.stringify(payload),
  });
}

export function forgotPassword(payload: ForgotPasswordPayload) {
  return request<TransportMessageResponse>('/auth/forgot-password', {
    method: 'POST',
    auth: false,
    body: JSON.stringify(payload),
  });
}

export function resetPassword(payload: SetPasswordPayload) {
  return request<TransportMessageResponse>('/auth/reset-password', {
    method: 'POST',
    auth: false,
    body: JSON.stringify(payload),
  });
}

export function setPassword(payload: SetPasswordPayload) {
  return request<TransportMessageResponse>('/auth/set-password', {
    method: 'POST',
    auth: false,
    body: JSON.stringify(payload),
  });
}
