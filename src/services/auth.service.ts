import axiosInstance from '@/lib/axios';

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
      const response = await axiosInstance.post('/auth/logout');
      return response.data;
    } catch (error: any) {
      // Lempar error agar bisa ditangani di komponen UI
      throw error.response?.data || new Error('Gagal logout');
    }
  },

  async verifyOtp(payload: { email: string; otp: string }) {
    try {
      const { data } = await axiosInstance.post('/auth/verify-otp', payload);
      return data;
    } catch (error: any) {
      throw error.response?.data || new Error('Verifikasi gagal');
    }
  },

  async resendOtp(email: string) {
    try {
      const { data } = await axiosInstance.post('/auth/resend-otp', { email });
      return data;
    } catch (error: any) {
      throw error.response?.data || new Error('Gagal mengirim ulang OTP');
    }
  },
};