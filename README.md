# ⚡ KALNAF UI — Intelligent Inventory System

**KALNAF** adalah platform manajemen stok modern berbasis **Offline-First** yang dirancang khusus untuk kondisi lapangan dengan koneksi internet tidak stabil. Dibangun dengan standar visual 2026, aplikasi ini memastikan operasional bisnis tetap berjalan tanpa hambatan sinyal.

## ✨ Fitur Utama

-   **Offline-First Engine**: Menggunakan `Dexie.js` (IndexedDB) untuk penyimpanan data lokal yang persisten.
-   **Adaptive Sync Turbo**: Logika sinkronisasi cerdas yang menyesuaikan ukuran batch (50, 30, 20 data) berdasarkan latensi jaringan secara real-time.
-   **Stylish UI 2026**: Desain Bento Grid, Glassmorphism, dan navigasi melayang (Floating Nav) untuk pengalaman pengguna premium.
-   **PWA Ready**: Dapat diinstal di HP (`next-pwa`) dan berjalan seperti aplikasi native.
-   **Type-Safe Architecture**: Validasi data ujung-ke-ujung menggunakan `TypeScript` dan `Zod`.

## 🛠️ Tech Stack

* **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
* **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) & [TanStack Query v5](https://tanstack.com/query/latest)
* **Database Lokal**: [Dexie.js](https://dexie.org/)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **Icons**: [Lucide React](https://lucide.dev/)
* **Form Handling**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
* **API Client**: [Axios](https://axios-http.com/)

## 🚀 Persiapan & Instalasi

Pastikan Anda sudah menginstal **Node.js (versi 18.x atau terbaru)**.

1.  **Clone Repositori**
    ```bash
    git clone [https://github.com/username/kalnaf-ui.git](https://github.com/username/kalnaf-ui.git)
    cd kalnaf-ui
    ```

2.  **Instal Dependensi**
    ```bash
    npm install
    ```

3.  **Konfigurasi Environment**
    Buat file `.env.local` di root folder:
    ```env
    NEXT_PUBLIC_API_URL=[https://api.kalnaf.id/v1](https://api.kalnaf.id/v1)
    ```

4.  **Jalankan Mode Pengembangan**
    ```bash
    npm run dev
    ```
    Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## 📦 Struktur Folder Penting

* `/src/app`: Routing dan UI halaman utama.
* `/src/lib`: Konfigurasi Core (Database `db.ts`, Axios, Sync Manager).
* `/src/hooks`: Custom hooks untuk logika bisnis (e.g., `useSync`).
* `/src/components`: Komponen UI modular dan reusable.

## 📡 Mekanisme Sinkronisasi

Aplikasi ini menggunakan algoritma adaptif:
1.  **Check Connection**: Memantau status `window.onLine`.
2.  **Queue Management**: Data disimpan di IndexedDB dengan status `sync_status: 'pending'`.
3.  **Adaptive Batching**: Mengirim data secara bertahap. Jika respon server < 1 detik, jumlah batch akan ditambah otomatis.

## 📝 Script Tersedia

-   `npm run dev`: Menjalankan server lokal.
-   `npm run build`: Membuat build produksi yang dioptimalkan.
-   `npm run start`: Menjalankan hasil build produksi.
-   `npm run lint`: Mengecek standar penulisan kode (ESLint).

---
Built with 💙 for Efficiency by **KALNAF Core System**