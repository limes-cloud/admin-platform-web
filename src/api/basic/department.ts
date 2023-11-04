import axios from 'axios';
import { Department } from './types/department';

export function getDepartmentTree() {
  return axios.get<Department>('/basic/v1/department/tree');
}

export function addDepartment(data: Department) {
  return axios.post('/basic/v1/department', data);
}

export function updateDepartment(data: Department) {
  return axios.put('/basic/v1/department', data);
}

export function deleteDepartment(id: number) {
  return axios.delete('/basic/v1/department', { params: { id } });
}

export default null;
