import axios from 'axios';

const axiosInstance = axios.create({ 
  baseURL: process.env.NEXT_PUBLIC_API_URL, 
  withCredentials: true 
});

// 1. REQUEST INTERCEPTOR (Sebelum data dikirim)
axiosInstance.interceptors.request.use(
  (config) => { 
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null; 
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`; 
    }
    return config; 
  },
  (error) => Promise.reject(error)
);

// 2. RESPONSE INTERCEPTOR (Setelah data diterima dari server)
// Letakkan kodenya DI SINI
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Jika server kirim 401 (token tidak valid/expired)
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login'; 
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;