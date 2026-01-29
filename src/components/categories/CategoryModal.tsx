'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Tag, AlignLeft, Loader2, Send } from 'lucide-react';
import { Category, CategoryPayload } from '@/types/category';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryPayload) => void;
  initialData: Category | null;
  isLoading: boolean;
}

export const CategoryModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData, 
  isLoading 
}: CategoryModalProps) => {
  const { register, handleSubmit, reset, setValue } = useForm<CategoryPayload>();

  // Reset form saat modal buka/tutup atau data awal berubah
  useEffect(() => {
    if (initialData) {
      setValue('name', initialData.name);
      setValue('description', initialData.description || '');
    } else {
      reset();
    }
  }, [initialData, reset, setValue, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="bg-slate-900 p-3 rounded-2xl text-white shadow-lg shadow-slate-200">
              <Tag size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">
                {initialData ? 'Edit Kategori' : 'Kategori Baru'}
              </h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Informasi Klasifikasi Produk</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-all text-slate-400 hover:rotate-90">
            <X size={24} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          <div className="space-y-4">
            {/* Input Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                <Tag size={12} /> Nama Kategori
              </label>
              <input
                {...register('name', { required: true })}
                placeholder="Contoh: Makanan Berat"
                className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-slate-700 focus:bg-white focus:border-slate-900 transition-all outline-none"
              />
            </div>

            {/* Input Description */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                <AlignLeft size={12} /> Deskripsi (Opsional)
              </label>
              <textarea
                {...register('description')}
                placeholder="Berikan keterangan singkat kategori ini..."
                rows={4}
                className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl font-medium text-slate-600 focus:bg-white focus:border-slate-900 transition-all outline-none resize-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 p-4 rounded-2xl font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-[2] bg-slate-900 hover:bg-blue-600 text-white p-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-xl shadow-slate-200 disabled:bg-slate-200 disabled:shadow-none"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  {initialData ? 'Simpan Perubahan' : 'Buat Kategori'}
                  <Send size={18} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};