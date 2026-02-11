export interface Class {
  id: string;
  name: string;
  code: string;
  description?: string;
  credits?: number;
  workload?: number;
  semester?: number;
  department?: string;
  createdAt?: string;
  updatedAt?: string;
}