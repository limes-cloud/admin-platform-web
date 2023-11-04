export interface Role {
  id: number;
  parent_id: number;
  name: string;
  keyword: string;
  status: boolean;
  description: string;
  department_ids: string;
  data_scope: string;
  keys: number[];
  created_at: number;
  updated_at: number;
}
