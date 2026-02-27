import axiosInstance from '@/lib/axios';

// Interface untuk data Supplier (sesuai skema Prisma)
export interface SupplierData {
  id?: string;
  name: string;
  contact?: string;
  phone?: string;
  email?: string;
  address?: string;
  isActive?: boolean;
}

// Interface untuk parameter query
export interface SupplierQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

/**
 * [READ] Mengambil data supplier dengan paginasi.
 */
export const getSuppliers = async (params: SupplierQueryParams) => {
  const response = await axiosInstance.get('/suppliers', {
    params: {
      page: params.page || 1,
      limit: params.limit || 10,
    },
  });
  return response.data;
};

/**
 * [READ] Mencari supplier berdasarkan query string.
 */
export const searchSuppliers = async (q: string) => {
  const response = await axiosInstance.get('/suppliers/search', {
    params: { 
      q: q || undefined 
    },
  });
  return response.data;
};

/**
 * [READ] Mengambil detail supplier berdasarkan ID.
 */
export const getSupplierById = async (id: string) => {
  const response = await axiosInstance.get(`/suppliers/${id}`);
  return response.data;
};

/**
 * [CREATE] Menambahkan supplier baru.
 */
export const createSupplier = async (data: SupplierData) => {
  const response = await axiosInstance.post('/suppliers', data);
  return response.data;
};

/**
 * [UPDATE] Memperbarui data supplier berdasarkan ID.
 */
export const updateSupplier = async (id: string, data: Partial<SupplierData>) => {
  const response = await axiosInstance.patch(`/suppliers/${id}`, data);
  return response.data;
};

/**
 * [DELETE] Menghapus data supplier.
 */
export const deleteSupplier = async (id: string) => {
  const response = await axiosInstance.delete(`/suppliers/${id}`);
  return response.data;
};