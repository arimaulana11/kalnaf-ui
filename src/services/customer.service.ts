import axiosInstance from '@/lib/axios';

// 1. Ambil Semua Customer dengan Pagination
export const getCustomers = async (params: {
  page?: number;
  limit?: number;
}) => {
  const response = await axiosInstance.get('/customers', { params });
  return response.data;
};

// 2. Search Customer (Sesuai cURL: /customers/search?q=...)
export const searchCustomers = async (query: string) => {
  const response = await axiosInstance.get('/customers/search', {
    params: {
      q: query || undefined,
    },
  });
  return response.data;
};

// 3. Create Customer
export const createCustomer = async (payload: any) => {
  const response = await axiosInstance.post('/customers', payload);
  return response.data;
};

// 4. Update Customer (Sesuai cURL: PATCH /customers/:id)
export const updateCustomer = async (id: string, payload: any) => {
  const response = await axiosInstance.patch(`/customers/${id}`, payload);
  return response.data;
};

// 5. Delete Customer
export const deleteCustomer = async (id: string) => {
  const response = await axiosInstance.delete(`/customers/${id}`);
  return response.data;
};

// 6. Get Detail Customer
export const getCustomerDetail = async (id: string) => {
  const response = await axiosInstance.get(`/customers/${id}`);
  return response.data;
};