import axiosInstance from '@/lib/axios';

// Interface untuk parameter query agar type-safe
export interface SalesReportParams {
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

/**
 * Mengambil data laporan penjualan berdasarkan filter tanggal dan paginasi.
 * Sesuai dengan response JSON yang kamu miliki sebelumnya.
 */
export const getSalesReport = async (params: SalesReportParams) => {
  const response = await axiosInstance.get('/reports/sales', {
    params: {
      // Membersihkan params agar tidak mengirim string kosong ke API
      startDate: params.startDate || undefined,
      endDate: params.endDate || undefined,
      page: params.page || 1,
      limit: params.limit || 10,
    },
  });

  // Mengembalikan response.data yang berisi { success, statusCode, data: { summary, records, etc } }
  return response.data;
};

export const getShiftReports = async (params: {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}) => {
  const response = await axiosInstance.get('/reports/shifts', { params });
  return response.data;
};