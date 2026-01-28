import axios from 'axios';

const axiosInstance = axios.create({ 
  baseURL: process.env.NEXT_PUBLIC_API_URL, 
  withCredentials: true 
});

// 1. REQUEST INTERCEPTOR
axiosInstance.interceptors.request.use(
  (config) => { 
    if (typeof window !== 'undefined') {
      const storageName = 'auth-storage'; // Harus sama dengan 'name' di Zustand persist
      const rawData = localStorage.getItem(storageName);
      
      console.log(`[Axios Debug] Mencari di ${storageName}:`, rawData ? 'Ketemu' : 'Kosong');

            console.log(`[Axios Debug] Token berhasil dipasang!`,rawData);
      if (rawData) {
        try {
          const parsed = JSON.parse(rawData);

          const token = parsed.state?.token; // Zustand menyimpan di dalam property 'state'

          if (token) {
            console.log(`[Axios Debug] Token berhasil dipasang!`);
            config.headers.Authorization = `Bearer ${token}`; 
          } else {
            console.warn(`[Axios Debug] Objek storage ada, tapi TOKEN tidak ditemukan di dalamnya.`);
          }
        } catch (e) {
          console.error(`[Axios Debug] Gagal parse JSON dari storage`, e);
        }
      }
    }
    return config; 
  },
  (error) => Promise.reject(error)
);


// 2. RESPONSE INTERCEPTOR
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Jika 401, bersihkan storage dan lempar ke login
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        // PERBAIKAN: Hapus key yang benar
        // localStorage.removeItem('auth-storage');
        
        // Pastikan path login sesuai dengan struktur folder Anda (/auth/login atau /login)
        // window.location.href = '/auth/login'; 
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;