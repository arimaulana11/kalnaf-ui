'use client';

import React from 'react';
import { Plus, Trash2, Box, Hash, ShoppingBag, Info } from 'lucide-react';

interface ComponentItem {
  componentVariantId: number;
  qty: number;
}

interface ParcelComponentManagerProps {
  // Gunakan optional chaining pada type atau pastikan default value di destructuring
  components?: ComponentItem[]; 
  onUpdate: (newComponents: ComponentItem[]) => void;
  availableProducts?: { id: number; name: string; price: number }[];
}

export const ParcelComponentManager = ({ 
  // 1. SOLUSI UTAMA: Berikan default value [] agar .length tidak error
  components = [], 
  onUpdate,
  availableProducts = [
    { id: 1, name: 'Minyak Goreng Bimoli 1L', price: 18000 },
    { id: 2, name: 'Beras Pandan Wangi 5kg', price: 85000 },
    { id: 3, name: 'Gula Pasir 1kg', price: 14500 }
  ]
}: ParcelComponentManagerProps) => {

  // 2. Gunakan safety check saat melakukan spread
  const handleAddComponent = () => {
    const currentComponents = Array.isArray(components) ? components : [];
    onUpdate([...currentComponents, { componentVariantId: 0, qty: 1 }]);
  };

  const handleRemoveComponent = (index: number) => {
    const updated = components.filter((_, i) => i !== index);
    onUpdate(updated);
  };

  const handleUpdateField = (index: number, field: keyof ComponentItem, value: number) => {
    const updated = [...components];
    updated[index] = { ...updated[index], [field]: value };
    onUpdate(updated);
  };

  // 3. Menghitung total estimasi harga paket (Fitur Tambahan)
  const totalEstimation = components.reduce((acc, curr) => {
    const product = availableProducts.find(p => p.id === curr.componentVariantId);
    return acc + (product ? product.price * curr.qty : 0);
  }, 0);

  return (
    <div className="mt-6 p-6 bg-white/60 rounded-[2rem] border-2 border-dashed border-slate-200 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex justify-between items-center mb-4 px-2">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <Box size={16} />
          </div>
          <div>
            <h4 className="text-[10px] font-black text-slate-700 uppercase tracking-widest">
              Daftar Isi Paket (Komponen)
            </h4>
            {components.length > 0 && (
               <p className="text-[9px] text-blue-500 font-bold mt-0.5">
                 Estimasi Modal: Rp{totalEstimation.toLocaleString()}
               </p>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={handleAddComponent}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase rounded-xl hover:bg-blue-600 transition-all shadow-md active:scale-95"
        >
          <Plus size={14} /> Tambah Barang
        </button>
      </div>

      {/* Gunakan optional chaining ?. sebagai pengaman tambahan */}
      {components?.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-2xl bg-white/40">
          <p className="text-xs font-bold text-slate-400 italic">Belum ada komponen produk dalam paket ini.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {components.map((comp, idx) => (
            <div 
              key={idx} 
              className="group flex flex-col md:flex-row gap-3 items-center bg-white p-3 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-200 transition-all"
            >
              {/* Dropdown Pilih Produk */}
              <div className="flex-[3] w-full relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <ShoppingBag size={14} />
                </div>
                <select
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer"
                  value={comp.componentVariantId}
                  onChange={(e) => handleUpdateField(idx, 'componentVariantId', Number(e.target.value))}
                >
                  <option value={0}>Pilih Produk Fisik...</option>
                  {availableProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Rp{p.price.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              {/* Input Quantity */}
              <div className="flex-1 w-full relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Hash size={14} />
                </div>
                <input
                  type="number"
                  min="1"
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Qty"
                  value={comp.qty}
                  onChange={(e) => {
                    const val = Math.max(1, Number(e.target.value)); // Minimal 1
                    handleUpdateField(idx, 'qty', val);
                  }}
                />
              </div>

              {/* Tombol Hapus */}
              <button
                type="button"
                onClick={() => handleRemoveComponent(idx)}
                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                title="Hapus Komponen"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      {components.length > 0 && (
        <div className="mt-4 px-2 flex items-center gap-2 text-[9px] font-bold text-slate-400 italic">
          <Info size={12} className="text-blue-400" />
          <span>Harga jual paket disarankan lebih tinggi dari Rp{totalEstimation.toLocaleString()}</span>
        </div>
      )}
    </div>
  );
};