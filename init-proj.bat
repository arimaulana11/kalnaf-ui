@echo off
echo ======================================================
echo Menginisialisasi Arsitektur SaaS Kalnaf-UI (Offline-First)
echo ======================================================

:: 1. Membuat Folder Structure
mkdir src\app\(auth)
mkdir src\app\(dashboard)
mkdir src\components\ui
mkdir src\components\dynamic-form\fields
mkdir src\components\shared
mkdir src\constants\forms
mkdir src\hooks
mkdir src\lib
mkdir src\services
mkdir src\store
mkdir src\types
mkdir src\utils

:: 2. Membuat file Boilerplate Dasar

:: File Types (Kontrak Data)
echo export type FieldType = 'text' ^| 'number' ^| 'select' ^| 'date'; > src\types\meta-json.ts
echo. >> src\types\meta-json.ts
echo export interface FormField { name: string; label: string; type: FieldType; required?: boolean; placeholder?: string; options?: { label: string; value: any }[]; } >> src\types\meta-json.ts
echo. >> src\types\meta-json.ts
echo export interface FormMeta { moduleName: string; title: string; fields: FormField[]; } >> src\types\meta-json.ts

:: File Lib (Database Lokal)
echo import { openDB, DBSchema } from 'idb'; > src\lib\db.ts
echo. >> src\lib\db.ts
echo interface KalnafSchema extends DBSchema { products: { key: string; value: any; }; queue: { key: string; value: any; }; } >> src\lib\db.ts
echo. >> src\lib\db.ts
echo export const dbPromise = openDB('kalnaf-db', 1, { upgrade(db) { db.createObjectStore('products', { keyPath: 'id' }); db.createObjectStore('queue', { keyPath: 'id' }); } }); >> src\lib\db.ts

:: File Lib (Axios Instance)
echo import axios from 'axios'; > src\lib\axios.ts
echo. >> src\lib\axios.ts
echo const axiosInstance = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL, withCredentials: true }); >> src\lib\axios.ts
echo. >> src\lib\axios.ts
echo axiosInstance.interceptors.request.use((config) =^> { const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null; if (token) config.headers.Authorization = `Bearer ${token}`; return config; }); >> src\lib\axios.ts
echo. >> src\lib\axios.ts
echo export default axiosInstance; >> src\lib\axios.ts

:: File Constants Dummy Form
echo import { FormMeta } from "@/types/meta-json"; > src\constants\forms\product.ts
echo. >> src\constants\forms\product.ts
echo export const PRODUCT_FORM_META: FormMeta = { moduleName: 'product', title: 'Tambah Produk', fields: [{ name: 'name', label: 'Nama Barang', type: 'text', required: true }] }; >> src\constants\forms\product.ts

:: File Hooks (Status Online)
echo import { useState, useEffect } from 'react'; > src\hooks\useOffline.ts
echo. >> src\hooks\useOffline.ts
echo export const useOffline = () =^> { const [isOffline, setIsOffline] = useState(false); useEffect(() =^> { setIsOffline(!navigator.onLine); const handleOnline = () =^> setIsOffline(false); const handleOffline = () =^> setIsOffline(true); window.addEventListener('online', handleOnline); window.addEventListener('offline', handleOffline); return () =^> { window.removeEventListener('online', handleOnline); window.removeEventListener('offline', handleOffline); }; }, []); return isOffline; }; >> src\hooks\useOffline.ts

echo ======================================================
echo Berhasil! Struktur folder dan boilerplate siap digunakan.
echo Segera cek folder src/ untuk mulai koding.
echo ======================================================
pause