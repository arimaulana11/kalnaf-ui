import axiosInstance from '@/lib/axios';
import { Staff } from '../types/staff';
import { StaffFormValues } from '../lib/validations/staff';

// 1. Interface Wrapper Global API
interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

// 2. Interface khusus untuk Data Staff dengan Pagination
interface StaffListData {
  data: Staff[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
    limit: number;
  };
}

// GET ALL: Mengembalikan keseluruhan ApiResponse agar meta bisa dibaca di UI
export const getStaffs = async (page: number = 1) => {
  const response = await axiosInstance.get<ApiResponse<StaffListData>>(`/staff?page=${page}&limit=10`);
  return response.data;
};

// CREATE: Biasanya mengembalikan ApiResponse<Staff>
export const createStaff = async (payload: StaffFormValues): Promise<ApiResponse<Staff>> => {
  const response = await axiosInstance.post<ApiResponse<Staff>>('/staff', payload);
  return response.data;
};

// UPDATE
export const updateStaff = async (id: string, payload: Partial<StaffFormValues>): Promise<ApiResponse<Staff>> => {
  const response = await axiosInstance.patch<ApiResponse<Staff>>(`/staff/${id}`, payload);
  return response.data;
};

// DELETE
export const deleteStaff = async (id: string): Promise<ApiResponse<any>> => {
  const response = await axiosInstance.delete<ApiResponse<any>>(`/staff/${id}`);
  return response.data;
};