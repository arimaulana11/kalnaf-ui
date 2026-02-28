"use client";

import { MovementType, StockItem } from '@/types/inventory';
import { Trash2, Package, Plus } from 'lucide-react';

interface Props {
  items: StockItem[];
  movementType: MovementType;
  onUpdateQty: (id: string, qty: number) => void;
  onUpdatePrice: (id: string, price: number) => void;
  onRemove: (id: string) => void;
  onAddClick: () => void; // <--- TAMBAHKAN INI
}

export const StockMovementTable = ({ 
  items, 
  movementType, 
  onUpdateQty, 
  onUpdatePrice, 
  onRemove,
  onAddClick // <--- TAMBAHKAN INI
}: Props) => {
  return (
    <div className="space-y-4">
      {/* Tombol Add Product di dalam tabel */}
      <div className="flex justify-between items-center px-2">
        <h3 className="text-xs font-black uppercase italic text-gray-800 flex items-center gap-2">
           Selected Items
        </h3>
        <button
          onClick={onAddClick} // <--- GUNAKAN DI SINI
          className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-tighter hover:bg-blue-100 transition-all flex items-center gap-2"
        >
          <Plus size={14} /> Add Product
        </button>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="p-5 text-[9px] font-black uppercase text-gray-400 tracking-widest">Product Info</th>
              {movementType === 'IN' && (
                <th className="p-5 text-[9px] font-black uppercase text-gray-400 tracking-widest w-40">Purchase Price</th>
              )}
              <th className="p-5 text-[9px] font-black uppercase text-gray-400 text-center tracking-widest w-32">Quantity</th>
              <th className="p-5 text-[9px] font-black uppercase text-gray-400 text-right tracking-widest w-20">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {items.length === 0 ? (
              <tr>
                <td colSpan={movementType === 'IN' ? 4 : 3} className="p-20 text-center">
                  <Package className="mx-auto text-gray-100 mb-4" size={64} />
                  <p className="text-[10px] font-bold text-gray-300 uppercase italic tracking-widest">No products selected</p>
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="group hover:bg-gray-50/50 transition-all">
                  <td className="p-5">
                    <div className="font-black text-gray-700 uppercase text-sm">{item.name}</div>
                    <div className="text-[10px] font-black text-blue-500 italic tracking-tighter">{item.sku}</div>
                  </td>
                  
                  {movementType === 'IN' && (
                    <td className="p-5">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400">Rp</span>
                        <input 
                          type="number" 
                          value={item.purchasePrice} 
                          onChange={(e) => onUpdatePrice(item.id, parseInt(e.target.value) || 0)}
                          className="w-full pl-10 pr-3 py-3 bg-gray-100 border-none rounded-xl font-black text-gray-700 outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm"
                        />
                      </div>
                    </td>
                  )}

                  <td className="p-5">
                    <input 
                      type="number" 
                      min="1" 
                      value={item.quantity} 
                      onChange={(e) => onUpdateQty(item.id, parseInt(e.target.value) || 0)} 
                      className="w-full p-3 bg-gray-100 border-none rounded-xl text-center font-black text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                    />
                  </td>
                  <td className="p-5 text-right">
                    <button onClick={() => onRemove(item.id)} className="p-3 text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};