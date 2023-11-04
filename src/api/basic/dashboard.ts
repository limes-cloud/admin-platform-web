import axios from 'axios';
import type { TableData } from '@arco-design/web-vue/es/table/interface';
import { ContentDataRecord } from '@/api/basic/types/dashboard';

export function queryContentData() {
  return axios.get<ContentDataRecord[]>('/api/content-data');
}

export interface PopularRecord {
  key: number;
  clickNumber: string;
  title: string;
  increases: number;
}

export function queryPopularList(params: { type: string }) {
  return axios.get<TableData[]>('/api/popular/list', { params });
}
