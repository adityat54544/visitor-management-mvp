import { api, setToken } from './client';
import type { User } from './types';

export async function login(
  email: string,
  password: string
): Promise<{ user: User; token: string }> {
  const data = await api<{ user: User; token: string }>('/auth/login', {
    method: 'POST',
    body: { email, password },
    auth: false,
  });
  await setToken(data.token);
  return data;
}

export async function register(
  name: string,
  email: string,
  password: string
): Promise<{ user: User; token: string }> {
  const data = await api<{ user: User; token: string }>('/auth/register', {
    method: 'POST',
    body: { name, email, password },
    auth: false,
  });
  await setToken(data.token);
  return data;
}

export async function fetchMe(): Promise<User> {
  return api<User>('/auth/me');
}

export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<void> {
  return api<void>('/auth/change-password', {
    method: 'POST',
    body: { currentPassword, newPassword },
  });
}