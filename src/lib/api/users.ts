import { mapUser } from './mappers';
import { request } from './client';
import type { TransportUser } from './types';

interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
  confirm_new_password: string;
}

interface TransportMessageResponse {
  message: string;
}

interface UpdateProfilePayload {
  username?: string;
  first_name?: string;
  last_name?: string;
  dob?: string;
}

export async function getMyProfile() {
  const response = await request<TransportUser>('/users/me');
  return mapUser(response);
}

export async function updateMyProfile(payload: UpdateProfilePayload) {
  const response = await request<TransportUser>('/users/me', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return mapUser(response);
}

export function changeMyPassword(payload: ChangePasswordPayload) {
  return request<TransportMessageResponse>('/users/me/change-password', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}
