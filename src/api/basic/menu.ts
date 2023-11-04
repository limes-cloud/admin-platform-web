import axios from 'axios';
import { Menu } from './types/menu';

export function getMenuTree() {
  return axios.get<Menu[]>('/basic/v1/menu/tree');
}

export function addMenu(data: Menu) {
  return axios.post('/basic/v1/menu', data);
}

export function updateMenu(data: Menu) {
  return axios.put('/basic/v1/menu', data);
}

export function deleteMenu(id: number) {
  return axios.delete('/basic/v1/menu', { params: { id } });
}

export default null;
