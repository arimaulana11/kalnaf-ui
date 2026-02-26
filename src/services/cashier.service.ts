import axiosInstance from '@/lib/axios';

// 1. Tambahkan parameter 'search' agar bisa menerima input dari debouncedSearch
export const getProducts = async (search?: string) => {
  const response = await axiosInstance.get('/product-variants', {
    params: {
      // Jika search ada isinya, kirim sebagai query string (?search=...)
      // Jika kosong, kirim undefined agar tidak mengganggu query default
      search: search || undefined,
    },
  });
  
  // Berdasarkan struktur response API Anda yang baru:
  // API mengembalikan { success: true, data: { data: [...], meta: {...} } }
  return response.data; 
};

export const createTransaction = async (payload: any) => {
  const response = await axiosInstance.post('/transactions', payload);
  return response.data;
};

export const getReceiptData = async (id: string | number) => {
  const response = await axiosInstance.get(`/transactions/receipt/${id}`);
  return response.data;
};

export const getTransactionHistory = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  storeId?: string;
}) => {
  const response = await axiosInstance.get('/transactions/history', { params });
  return response.data;
};

export const getTransactionDetail = async (id: number | string) => {
  const response = await axiosInstance.get(`/transactions/${id}`);
  return response.data;
};

export const voidTransaction = async (id: number | string, reason: string) => {
  const response = await axiosInstance.post(`/transactions/${id}/void`, { reason });
  return response.data;
};