import axiosInstance from '@/lib/axios';

export interface StockMovementDto {
  productId: string;
  storeId: string;
  supplierId?: string;
  quantity: number;
  type: 'IN' | 'OUT' | 'ADJUST' | 'SALE' | 'WASTE';
  reason?: string;
}

export const getOpnameProducts = async (query: string, storeId?: string) => {
    // Menambahkan storeId ke dalam query params agar backend bisa memfilter
    // api/inventory/stock-opname/products
    const response = await axiosInstance.get('/inventory/stock-opname/products', {
        params: { 
            search: query,
            storeId: storeId // Tambahkan ini
        }
    });
    return response.data;
};

export const getInventoryLogs = async (params: any) => {
  const res = await axiosInstance.get('/inventory/logs', { params });
  return res.data;
};

export const stockIn = async (data: StockMovementDto) => {
  const res = await axiosInstance.post('/inventory/stock-in', data);
  return res.data;
};

// DTO untuk Finalize Stock Opname (Jika sewaktu-waktu dibutuhkan untuk POST)
export interface FinalizeStockOpnameDto {
  storeId: string;
  auditorName: string;
  items: {
    variantId: number;
    actualQty: number;
    note?: string;
  }[];
}

/**
 * Mengambil riwayat sesi Stock Opname (Grouped by Reference ID)
 */
export const getStockOpnameHistory = async (params?: { storeId?: string; page?: number; limit?: number }) => {
  const res = await axiosInstance.get('/inventory/stock-opname/history', { params });
  return res.data;
};

/**
 * Mengambil detail barang dari satu sesi Stock Opname berdasarkan Reference ID
 */
export const getStockOpnameDetail = async (referenceId: string) => {
  const res = await axiosInstance.get(`/inventory/stock-opname/history/${referenceId}`);
  return res.data;
};

/**
 * Mengirim data hasil stock opname untuk difinalisasi
 */
export const finalizeStockOpname = async (data: FinalizeStockOpnameDto) => {
  const res = await axiosInstance.post('/inventory/stock-opname/finalize', data);
  return res.data;
};

export const getMyStores = async () => {
    // Sesuaikan dengan instance axios Anda
    const response = await axiosInstance.get('/stores/my-access');
    return response.data; // Mengembalikan { success, data, ... }
};