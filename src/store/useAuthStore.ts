import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// 1. Definisikan Interface User (Field dibuat opsional agar tidak error saat data belum lengkap)
interface User {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
}

// 2. Definisikan Struktur State & Action
interface AuthState {
  user: User | null;
  token: string | null;
  activeStoreId: string | null;
  // Perbaikan: Definisi fungsi di interface harus diakhiri dengan tipe return (void)
  setAuth: (token: string, user?: User | null) => void; 
  setStoreId: (id: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      activeStoreId: null,

      // Fungsi untuk menyimpan data login
      // Kita beri default user null jika tidak dikirim dari API
      setAuth: (token, user = null) => {
        set({ token, user });
      },

      // Fungsi untuk memilih toko aktif
      setStoreId: (id) => {
        set({ activeStoreId: id });
      },

      // Fungsi logout
      logout: () => {
        set({ 
          user: null, 
          token: null, 
          activeStoreId: null 
        });
        // Tidak perlu removeItem manual karena persist akan mengosongkan state di storage otomatis
      },
    }),
    {
      name: 'auth-storage', // Key di LocalStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);