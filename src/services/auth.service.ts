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

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    window.location.href = '/login';
  }
};