import axios from 'axios';
import { LoginReq, LoginRes } from '@/api/basic/types/auth';

export function captcha() {
  return axios.post('/basic/v1/login/captcha');
}

export function login(data: LoginReq) {
  return axios.post<LoginRes>('/basic/v1/login', data);
}

export function logout() {
  return axios.post<LoginRes>('/basic/v1/logout');
}

export function refreshToken() {
  return axios.post<LoginRes>('/basic/v1/token/refresh');
}
