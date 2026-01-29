'use client';

import React from 'react';
import { Edit3, Trash2, Package, Tag, Archive, ExternalLink } from 'lucide-react';
import { Product } from '@/types/product';

interface ProductTableProps {
  data: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

export const ProductTable = ({ data, onEdit, onDelete }: ProductTableProps) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      {data.map((product) => {
        // Logika kalkulasi ringkasan varian
        const minPrice = Math.min(...product.productVariants.map(v => v.price));
        const totalStock = product.productVariants.reduce((acc, curr) => acc + curr.available_stock, 0);

        return (
          <div key={product.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-blue-100 transition-all p-2 group">
            <div className="flex flex-col lg:flex-row lg:items-center p-6 gap-6">
              
              {/* Image Placeholder / Actual Image */}
              <div className="w-full lg:w-32 h-32 bg-slate-100 rounded-[2rem] overflow-hidden flex-shrink-0 relative">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <Package className="absolute inset-0 m-auto text-slate-300" size={32} />
                )}
              </div>

              {/* Main Info */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                    {product.categories?.name || 'Uncategorized'}
                  </span>
                  {!product.isActive && (
                    <span className="px-3 py-1 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-full">Non-Aktif</span>
                  )}
                </div>
                
                <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">{product.name}</h3>
                <p className="text-slate-500 text-sm line-clamp-1 italic font-medium">{product.description}</p>
                
                {/* Varian Badges */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {product.productVariants.slice(0, 3).map(v => (
                    <span key={v.id} className="text-[9px] font-bold border border-slate-100 px-2 py-1 rounded-lg text-slate-400 group-hover:border-blue-200 group-hover:text-blue-500 transition-colors">
                      {v.unitName}: {v.available_stock}
                    </span>
                  ))}
                  {product.productVariants.length > 3 && <span className="text-[9px] font-bold text-slate-300">+{product.productVariants.length - 3} lainnya</span>}
                </div>
              </div>

              {/* Price & Stock Summary */}
              <div className="lg:text-right px-6 border-l border-slate-50">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Mulai Dari</p>
                <p className="text-2xl font-black text-slate-900 tracking-tighter">
                  Rp {minPrice.toLocaleString('id-ID')}
                </p>
                <p className="text-xs font-bold text-green-600 mt-1 flex lg:justify-end items-center gap-1">
                  <Archive size={12} /> Total Stok: {totalStock}
                </p>
              </div>

              {/* Actions */}
              <div className="flex lg:flex-col gap-2">
                <button 
                  onClick={() => onEdit(product)}
                  className="p-4 bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white rounded-2xl transition-all active:scale-90"
                >
                  <Edit3 size={20} />
                </button>
                <button 
                  onClick={() => onDelete(product.id)}
                  className="p-4 bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all active:scale-90"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};