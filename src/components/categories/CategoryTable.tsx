'use client';

import React from 'react';
import { Edit3, Trash2, MoreVertical, Tag, Hash } from 'lucide-react';
import { Category } from '@/types/category';

interface CategoryTableProps {
  data: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

export const CategoryTable = ({ data, onEdit, onDelete }: CategoryTableProps) => {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100 p-20 text-center">
        <div className="bg-slate-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 text-slate-300">
          <Tag size={40} />
        </div>
        <h3 className="text-lg font-bold text-slate-800 uppercase italic">Belum Ada Kategori</h3>
        <p className="text-slate-400 text-sm font-medium">Klik tombol "Tambah Kategori" untuk memulai.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Table Header (Desktop Only) */}
      <div className="hidden md:grid grid-cols-12 px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
        <div className="col-span-1">No</div>
        <div className="col-span-4">Informasi Kategori</div>
        <div className="col-span-5">Deskripsi</div>
        <div className="col-span-2 text-right">Aksi</div>
      </div>

      {/* Table Body / Cards */}
      {data.map((category, index) => (
        <div 
          key={category.id}
          className="group bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:border-blue-100 transition-all animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-4">
            
            {/* Index Number */}
            <div className="hidden md:block col-span-1 font-black text-slate-300 group-hover:text-blue-600 transition-colors">
              {String(index + 1).padStart(2, '0')}
            </div>

            {/* Category Name & Badge */}
            <div className="col-span-1 md:col-span-4 flex items-center gap-4">
              <div className="bg-slate-50 p-3 rounded-2xl text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Tag size={20} />
              </div>
              <div>
                <h4 className="font-black text-slate-800 uppercase italic tracking-tight group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                   <span className="text-[10px] font-bold px-2 py-0.5 bg-green-50 text-green-600 rounded-md uppercase tracking-tighter">Aktif</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="col-span-1 md:col-span-5">
              <p className="text-sm text-slate-500 font-medium line-clamp-1 md:line-clamp-2 italic">
                {category.description || "— Tidak ada deskripsi tambahan —"}
              </p>
            </div>

            {/* Actions */}
            <div className="col-span-1 md:col-span-2 flex justify-end gap-2">
              <button 
                onClick={() => onEdit(category)}
                className="p-3 bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all active:scale-90"
                title="Edit Kategori"
              >
                <Edit3 size={18} />
              </button>
              <button 
                onClick={() => onDelete(category.id)}
                className="p-3 bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all active:scale-90"
                title="Hapus Kategori"
              >
                <Trash2 size={18} />
              </button>
            </div>

          </div>
        </div>
      ))}
    </div>
  );
};