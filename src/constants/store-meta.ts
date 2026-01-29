import { FormMeta } from "@/types/meta-json";

export const STORE_FORM_META: FormMeta = {
  moduleName: 'store',
  title: 'Informasi Toko',
  fields: [
    { name: 'name', label: 'Nama Toko', type: 'text', placeholder: 'Contoh: Kalnaf Kopi Pusat', required: true },
    { name: 'address', label: 'Alamat Lengkap', type: 'text', placeholder: 'Jl. Merdeka No. 123...', required: true },
    { name: 'phone', label: 'Nomor Telepon Toko', type: 'tel', placeholder: '08123456789', required: true },
    { name: 'logo_url', label: 'URL Logo Toko', type: 'text', placeholder: 'https://...', required: false },
    { name: 'receipt_header', label: 'Header Struk', type: 'text', placeholder: 'Teks atas struk', required: false },
    { name: 'receipt_footer', label: 'Footer Struk', type: 'text', placeholder: 'Teks bawah struk', required: false },
    {
      name: 'is_active',
      label: 'Status Toko Aktif',
      type: 'checkbox',
      required: false
    }
  ]
};

export const CREATE_STORE_META: FormMeta = {
  moduleName: 'create_store', // Tambahkan ini untuk memenuhi kontrak FormMeta
  title: 'Tambah Cabang Baru',
  fields: [
    {
      name: 'name',
      label: 'Nama Toko',
      type: 'text',
      placeholder: 'Contoh: Berkah Group - Cabang Pusat',
      required: true,
    },
    {
      name: 'address',
      label: 'Alamat Lengkap',
      type: 'text',
      placeholder: 'Jl. Jendral Sudirman No. 45...',
      required: true,
    },
    {
      name: 'phone',
      label: 'Nomor Telepon',
      type: 'text',
      placeholder: '08123456789',
      required: false,
    },
    {
      name: 'logo_url',
      label: 'URL Logo Toko',
      type: 'text',
      placeholder: 'https://...',
      required: false,
    },
    {
      name: 'receipt_header',
      label: 'Header Struk',
      type: 'text',
      placeholder: 'Nama bisnis di struk',
      required: false,
    },
    {
      name: 'receipt_footer',
      label: 'Footer Struk',
      type: 'text',
      placeholder: 'Pesan terima kasih...',
      required: false,
    },
  ],
};

export const STORE_DETAIL_META: FormMeta = {
  moduleName: 'store_detail',
  title: 'Edit Informasi Toko',
  fields: [
    { name: 'name', label: 'Nama Toko', type: 'text', placeholder: 'Nama Cabang', required: true },
    { name: 'address', label: 'Alamat', type: 'text', placeholder: 'Alamat Lengkap', required: true },
    { name: 'phone', label: 'Telepon', type: 'text', placeholder: '0812...', required: false },
    { name: 'logo_url', label: 'Link Logo', type: 'text', placeholder: 'https://...', required: false },
    { name: 'receipt_header', label: 'Header Struk', type: 'text', required: false },
    { name: 'receipt_footer', label: 'Footer Struk', type: 'text', required: false },
  ]
};