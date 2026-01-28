import axiosInstance from '@/lib/axios';
import axios from 'axios';

const API_BASE_URL = 'https://kalnaf-coresys.vercel.app/api';

// Konfigurasi default axios untuk kredensial (cookie)
const authApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const authService = {
  async login(credentials: any) {
    const { data } = await axiosInstance.post('/auth/login', credentials);
    // Simpan data user (non-sensitif) ke lokal
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('access_token', data.access_token);
    }
    return data;
  },

  async logout() {
    try {
      const response = await authApi.post('/auth/logout');
      return response.data;
    } catch (error: any) {
      // Lempar error agar bisa ditangani di komponen UI
      throw error.response?.data || new Error('Gagal logout');
    }
  },
};