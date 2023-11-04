import axios from 'axios';
import { Menu } from './types/menu';
import { UpdateRoleMenuReq } from './types/role-menu';

export function getRoleMenuTree() {
  return axios.get<Menu[]>('/basic/v1/role/menu/tree');
}

export function getRoleMenuIds(id: number) {
  return axios.get('/basic/v1/role/menu/ids', { params: { role_id: id } });
}

export function updateRoleMenu(data: UpdateRoleMenuReq) {
  return axios.put('/basic/v1/role/menu', data);
}

export default null;
