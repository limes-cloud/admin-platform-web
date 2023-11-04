import axios from 'axios';
import { PageUserReq, PageUserRes, User } from './types/user';

export function pageUser(req: PageUserReq) {
  return axios.get<PageUserRes>('/basic/v1/users', { params: { ...req } });
}

export function currentUser() {
  return axios.get<User>('/basic/v1/user/current');
}

export function addUser(data: User) {
  return axios.post('/basic/v1/user', data);
}

export function updateUser(data: User) {
  return axios.put('/basic/v1/user', data);
}

export function deleteUser(id: number) {
  return axios.delete('/basic/v1/user', { params: { id } });
}

export function disableUser(id: number, desc: string) {
  return axios.post('/basic/v1/user/disable', { id, desc });
}

export function enableUser(id: number) {
  return axios.post('/basic/v1/user/enable', { id });
}

export function offlineUser(id: number) {
  return axios.post('/basic/v1/user/offline', { id });
}

export function resetPassword(id: number) {
  return axios.post('/basic/v1/user/password/reset', { id });
}

export default null;
