import { FormMeta } from "@/types/meta-json";

export const LOGIN_FORM_META: FormMeta = {
  moduleName: 'auth',
  title: 'Masuk ke Kalnaf',
  fields: [
    { name: 'email', label: 'Email', type: 'text', placeholder: 'admin@kalnaf.id', required: true },
    { name: 'password', label: 'Password', type: 'text', placeholder: '******', required: true }
  ]
};

export const REGISTER_FORM_META: FormMeta = {
  moduleName: 'auth',
  title: 'Daftar Akun Baru',
  fields: [
    { name: 'name', label: 'Nama Lengkap', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'text', required: true },
    { name: 'password', label: 'Password', type: 'text', required: true },
    { name: 'tenantName', label: 'Nama Toko/Bisnis', type: 'text', required: true }
  ]
};