import axios from 'axios';
import {
  AddDirectoryReq,
  DeleteDirectoryReq,
  Directory,
  GetDirectoryReq,
  UpdateDirectoryReq,
} from './types/directory';

export function getDirectory(req: GetDirectoryReq) {
  return axios.get<Directory[]>(`/resource/v1/${req.app}/directory`, {
    params: req,
  });
}

export function addDirectory(req: AddDirectoryReq) {
  return axios.post(`/resource/v1/${req.app}/directory`, req);
}

export function updateDirectory(req: UpdateDirectoryReq) {
  return axios.put(`/resource/v1/${req.app}/directory`, req);
}

export function deleteDirectory(req: DeleteDirectoryReq) {
  return axios.delete(`/resource/v1/${req.app}/directory`, { params: req });
}

export default null;
