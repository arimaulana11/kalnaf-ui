'use client';

import React from 'react';
import { Tag, DollarSign, AlignLeft, Package, Image as ImageIcon, Loader2, RefreshCw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

interface Category {
  id: number;
  name: string;
}

interface ProductBasicInfoProps {
  data: {
    name: string;
    categoryId: number | string; // Mendukung string saat proses input
    purchasePrice: number;
    description: string;
    imageUrl: string;
  };
  onChange: (field: string, value: any) => void;
  isParcel: boolean;
}

export const ProductBasicInfo = ({ 
  data, 
  onChange, 
  isParcel 
}: ProductBasicInfoProps) => {

  const { data: categories, isLoading, isRefetching } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      // Pastikan akses path data sesuai dengan response backend Anda
      return res.data.data.data as Category[];
    },
    staleTime: 5 * 60 * 1000, // Cache kategori selama 5 menit
  });

  return (
    <div className="space-y-6">
      {/* Baris 1: Nama dan Harga Beli */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={isParcel ? "md:col-span-3 space-y-2" : "md:col-span-2 space-y-2"}>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
            <Package size={12} className="text-blue-500" /> Nama {isParcel ? 'Paket / Parcel' : 'Produk'}
          </label>
          <input 
            className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all text-slate-800 placeholder:text-slate-300 shadow-sm" 
            placeholder={isParcel ? "Contoh: Paket Lebaran Hemat B" : "Contoh: Minyak Goreng Bimoli"}
            value={data.name} 
            onChange={(e) => onChange('name', e.target.value)} 
          />
        </div>

        {!isParcel && (
          <div className="space-y-2 animate-in fade-in slide-in-from-right-4 duration-300">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <DollarSign size={12} className="text-green-500" /> Harga Beli (HPP)
            </label>
            <div className="relative">
              <input 
                type="number" 
                className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all text-blue-600 pl-12 shadow-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                value={data.purchasePrice} 
                onChange={(e) => onChange('purchasePrice', Number(e.target.value))} 
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-300 text-sm italic">Rp</span>
            </div>
          </div>
        )}
      </div>

      {/* Baris 2: Kategori dan Image URL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
            <Tag size={12} className="text-orange-500" /> Kategori
            {isRefetching && <RefreshCw size={10} className="animate-spin text-slate-400" />}
          </label>
          
          <div className="relative group">
            <select 
              className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all appearance-none cursor-pointer text-slate-700 disabled:opacity-50 shadow-sm"
              // Gunakan toString() untuk memastikan value select selalu sinkron dengan state
              value={data.categoryId?.toString()}
              onChange={(e) => onChange('categoryId', Number(e.target.value))}
              disabled={isLoading}
            >
              <option value="" disabled>Pilih Kategori</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </option>
              ))}
            </select>
            
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Tag size={16} />}
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
            <ImageIcon size={12} className="text-purple-500" /> URL Gambar Produk
          </label>
          <input 
            className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all text-slate-600 placeholder:text-slate-300 text-sm shadow-sm" 
            placeholder="https://storage.com/foto-produk.jpg"
            value={data.imageUrl} 
            onChange={(e) => onChange('imageUrl', e.target.value)} 
          />
        </div>
      </div>

      {/* Baris 3: Deskripsi */}
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
          <AlignLeft size={12} className="text-slate-400" /> Deskripsi Singkat
        </label>
        <textarea 
          rows={2}
          className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all text-slate-600 placeholder:text-slate-300 resize-none shadow-sm" 
          placeholder="Jelaskan detail produk di sini..."
          value={data.description} 
          onChange={(e) => onChange('description', e.target.value)} 
        />
      </div>
    </div>
  );
};