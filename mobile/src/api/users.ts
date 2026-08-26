import { api } from './client';
import type { User } from './types';

/** Admin: list all users. */
export function fetchUsers(): Promise<User[]> {
  return api<User[]>('/users');
}

/** Admin: create a new staff user with a role. */
export function createUser(input: {
  name: string;
  email: string;
  password: string;
  role: User['role'];
}): Promise<User> {
  return api<User>('/users', { method: 'POST', body: input });
}

/** Admin: change a user's role. */
export function updateUserRole(id: string, role: User['role']): Promise<User> {
  return api<User>(`/users/${id}/role`, { method: 'PATCH', body: { role } });
}