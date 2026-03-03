import axiosInstance from '@/lib/axios';

// --- INTERFACES ---

export interface CommonReportParams {
  storeId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface SalesReportParams extends CommonReportParams {}

// --- SERVICES ---

/**
 * 1. Laporan List Transaksi (Sales Records)
 * Endpoint: /reports/sales
 */
export const getSalesReport = async (params: SalesReportParams) => {
  const response = await axiosInstance.get('/reports/sales', {
    params: {
      startDate: params.startDate,
      endDate: params.endDate,
      page: params.page || 1,
      limit: params.limit || 10,
    },
  });
  return response.data;
};

/**
 * 2. Laporan Shift / Kasir
 * Endpoint: /reports/shifts
 */
export const getShiftReports = async (params: CommonReportParams) => {
  const response = await axiosInstance.get('/reports/shifts');
  return response.data;
};

/**
 * 3. Ringkasan Piutang (Debt Summary)
 * Endpoint: /reports/debt-summary
 */
export const getDebtSummary = async (storeId: string) => {
  const response = await axiosInstance.get('/reports/debt-summary', {
    params: { storeId }
  });
  return response.data;
};

/**
 * 4. Produk Terlaris (Top Products)
 * Endpoint: /reports/top-products
 */
export const getTopProducts = async (params: CommonReportParams) => {
  const response = await axiosInstance.get('/reports/top-products', {
    params: {
      storeId: params.storeId,
      page: params.page || 1,
      limit: params.limit || 5, // Default limit 5 sesuai kebutuhan dashboard
    }
  });
  return response.data?.data;
};

/**
 * 5. Performa Finansial (Sales Summary)
 * Digunakan untuk widget Gross Sales, Collected, dan Unpaid
 * Endpoint: /reports/sales-summary
 */
export const getSalesSummary = async (params: CommonReportParams) => {
  const response = await axiosInstance.get('/reports/sales-summary', {
    params: {
      storeId: params.storeId,
      startDate: params.startDate,
      endDate: params.endDate
    }
  });
  return response.data;
};

/**
 * 6. Ringkasan Penjualan Hari Ini (Daily Summary)
 * Endpoint: /reports/daily-summary
 */
export const getDailySummary = async (storeId: string) => {
  const response = await axiosInstance.get('/reports/daily-summary', {
    params: { storeId }
  });
  return response.data;
};