import axios from 'axios';
import {
  DeleteFileReq,
  PageFileReq,
  PageFileRes,
  PrepareUploadReq,
  PrepareUploadRes,
  UpdateFileReq,
  UploadReq,
} from './types/file';

export function prepareUpload(req: PrepareUploadReq) {
  return axios.post<PrepareUploadRes>(
    `/resource/v1/${req.app}/upload/prepare`,
    req
  );
}

export function upload(req: UploadReq) {
  return axios.post(`/resource/v1/upload`, req);
}

export function pageFile(req: PageFileReq) {
  return axios.get<PageFileRes>(`/resource/v1/${req.app}/files`, {
    params: req,
  });
}

export function updateFile(req: UpdateFileReq) {
  return axios.put(`/resource/v1/${req.app}/file`, { params: req });
}

export function deleteFile(req: DeleteFileReq) {
  return axios.post<PageFileRes>(`/resource/v1/${req.app}/file`, {
    params: req,
  });
}

export default null;
