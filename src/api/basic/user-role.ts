import axios from 'axios';
import { UserRole } from './types/user-role';

export function currentUserRoles() {
  return axios.get<UserRole[]>('/basic/v1/user/current/roles');
}

export function getUserRoles(id: number) {
  return axios.get<UserRole[]>('/basic/v1/user/roles', {
    params: { user_id: id },
  });
}

export default null;
