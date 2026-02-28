import axiosInstance from '@/lib/axios';

export interface StockInDto {
  variantId: number;
  qty: number;
  purchasePrice: number;
  storeId: string;
  supplierId?: string;
  referenceId?: string;
  notes?: string;
  receivedFrom: string; // Properti yang tadi menyebabkan error
}

export interface StockOutDto {
  variantId: number;
  storeId: string;
  qty: number;
  type: 'WASTE' | 'EXPIRED' | 'DAMAGE';
  referenceId?: string;
  notes?: string;
}

export interface StockTransferDto {
  variantId: number;
  fromStoreId: string;
  toStoreId: string;
  qty: number;
  referenceId?: string;
  notes?: string;
}

export const getOpnameProducts = async (query: string, storeId?: string) => {
  const response = await axiosInstance.get('/inventory/stock-opname/products', {
    params: {
      search: query,
      storeId: storeId // Tambahkan ini
    }
  });
  console.log("res.data ", storeId, response.data)

  return response.data;
};

export const getInventoryLogs = async (params: any) => {
  const res = await axiosInstance.get('/inventory/logs', { params });
  return res.data;
};

// --- STOCK IN ---
export const stockIn = async (data: StockInDto) => {
  const { storeId, ...body } = data;
  const res = await axiosInstance.post('/inventory/stock-in', body, {
    headers: { 'store-id': storeId }
  });
  return res.data;
};

// --- STOCK OUT (Waste / Expired) ---
export const stockOut = async (data: StockOutDto) => {
  // Kita ambil storeId untuk ditaruh di header sesuai pola Anda
  const { storeId, ...body } = data;
  console.log("Sending Body:", body);
  console.log("Sending Header Store-Id:", storeId);
  const res = await axiosInstance.post('/inventory/stock-out', body, {
    headers: { 'store-id': storeId }
  });
  return res.data;
};

// --- STOCK TRANSFER ---
export const transferStock = async (data: StockTransferDto) => {
  // Untuk transfer, kita biasanya menggunakan 'fromStoreId' sebagai scope utama (asal barang)
  const { fromStoreId, ...body } = data;
  const res = await axiosInstance.post('/inventory/transfer', body, {
    headers: { 'store-id': fromStoreId }
  });
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