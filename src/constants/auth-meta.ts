// src/constants/auth-meta.ts
import { FormMeta } from "@/types/meta-json";

export const LOGIN_FORM_META: FormMeta = {
  moduleName: 'auth',
  title: 'Selamat Datang Kembali',
  fields: [
    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'contoh@kalnaf.id', required: true },
    { name: 'password', label: 'Password', type: 'password', placeholder: 'Masukkan password', required: true }
  ]
};

export const REGISTER_FORM_META: FormMeta = {
  moduleName: 'auth',
  title: 'Daftar Akun Owner',
  fields: [
    { name: 'name', label: 'Nama Lengkap', type: 'text', placeholder: 'Nama Anda', required: true },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'email@bisnis.com', required: true },
    { name: 'password', label: 'Password', type: 'password', placeholder: 'Min. 6 karakter', required: true },
    { name: 'tenant_name', label: 'Nama Bisnis (Tenant)', type: 'text', placeholder: 'Contoh: Kalnaf Group', required: true },
    { name: 'store_name', label: 'Nama Toko Pertama', type: 'text', placeholder: 'Contoh: Cabang Pusat', required: true }
  ]
};
