import axiosInstance from '@/lib/axios';

export interface SupportData {
  name: string;
  email: string;
  whatsapp: string; // Sesuaikan dengan payload curl Anda
  description: string;
}

/**
 * [CREATE] Mengirim laporan pengaduan ke localhost:3001/api/support
 */
export const createSupportTicket = async (data: SupportData) => {
  // axiosInstance akan otomatis menggunakan base URL dan header Auth jika sudah dikonfigurasi
  const response = await axiosInstance.post('/support', data);
  return response.data;
};