'use client';

import React from 'react';
import { Plus, Trash2, Layers, Hash } from 'lucide-react';
import { ProductVariantSelect } from './SearchableProductSelect';

export const ParcelComponentManager = ({ components = [], onUpdate }: any) => {
  
  const handleAdd = () => {
    onUpdate([...components, { componentVariantId: 0, qty: 1 }]);
  };

  const handleUpdate = (index: number, field: string, value: any) => {
    const next = [...components];
    next[index] = { ...next[index], [field]: Number(value) };
    onUpdate(next);
  };

  const handleRemove = (index: number) => {
    onUpdate(components.filter((_: any, i: number) => i !== index));
  };

  return (
    <div className="mt-4 bg-white rounded-3xl border border-slate-200 overflow-visible shadow-sm">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <Layers size={16} />
          </div>
          <span className="font-black text-slate-700 uppercase text-[10px] tracking-widest">
            Isi Komponen Paket
          </span>
        </div>
        <button 
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all text-[10px] font-black uppercase shadow-md shadow-indigo-100"
        >
          <Plus size={14} /> Tambah Barang
        </button>
      </div>

      {/* List - Gunakan overflow-visible agar dropdown select tidak terpotong */}
      <div className="p-5 space-y-3 overflow-visible">
        {components.map((item: any, idx: number) => (
          <div 
            key={idx} 
            className="flex flex-col md:flex-row gap-3 items-start md:items-center p-3 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all overflow-visible"
          >
            {/* Index */}
            <div className="hidden md:flex w-6 h-6 shrink-0 items-center justify-center bg-white border border-slate-200 rounded-full text-[9px] font-black text-slate-400">
              {idx + 1}
            </div>

            {/* Product Select - Pastikan z-index tinggi saat dropdown terbuka */}
            <div className="flex-[4] w-full relative z-[60]"> 
              <ProductVariantSelect 
                value={item.componentVariantId}
                onChange={(val:any) => handleUpdate(idx, 'componentVariantId', val)}
              />
            </div>

            {/* Qty Input */}
            <div className="w-full md:w-32 relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300">
                <Hash size={12} />
              </div>
              <input 
                type="number"
                min="1"
                placeholder="Qty"
                value={item.qty || ""}
                onChange={(e) => handleUpdate(idx, 'qty', e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-xs outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all"
              />
            </div>

            {/* Action */}
            <button 
              type="button"
              onClick={() => handleRemove(idx)} 
              className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all self-end md:self-auto"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}

        {components.length === 0 && (
          <div className="py-8 text-center flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
              <Layers size={20} />
            </div>
            <p className="text-[11px] font-bold text-slate-400 italic">Belum ada barang isi paket.</p>
          </div>
        )}
      </div>
    </div>
  );
};