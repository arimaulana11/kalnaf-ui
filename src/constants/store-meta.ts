import { FormMeta } from "@/types/meta-json";

export const STORE_FORM_META: FormMeta = {
  moduleName: 'store',
  title: 'Informasi Toko',
  fields: [
    { name: 'name', label: 'Nama Toko', type: 'text', placeholder: 'Contoh: Kalnaf Kopi Pusat', required: true },
    { name: 'address', label: 'Alamat Lengkap', type: 'text', placeholder: 'Jl. Merdeka No. 123...', required: true },
    { name: 'phone', label: 'Nomor Telepon Toko', type: 'tel', placeholder: '08123456789', required: true },
  ]
};