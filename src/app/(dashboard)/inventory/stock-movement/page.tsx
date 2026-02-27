"use client";

import React, { useState } from 'react';
import { 
  ClipboardList, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Search, 
  Plus, 
  Package, 
  Truck, 
  AlertCircle,
  Save,
  Trash2,
  Box
} from 'lucide-react';

interface StockItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
}

export default function StockMovementPage() {
  const [movementType, setMovementType] = useState<'IN' | 'OUT'>('IN');
  const [items, setItems] = useState<StockItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fungsi Dummy untuk tambah baris (Nanti bisa diganti dengan Modal Search Produk)
  const addPlaceholderItem = () => {
    const newItem: StockItem = {
      id: Math.random().toString(),
      name: "Produk Contoh " + (items.length + 1),
      sku: "SKU-" + Math.floor(Math.random() * 1000),
      quantity: 1
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateQty = (id: string, qty: number) => {
    setItems(items.map(item => item.id === id ? { ...item, quantity: qty } : item));
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <div className={`p-2 rounded-lg ${movementType === 'IN' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {movementType === 'IN' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
             </div>
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Inventory Control</span>
          </div>
          <h1 className="text-3xl font-black text-gray-800 italic uppercase tracking-tighter flex items-center gap-3">
            Stock Movement
          </h1>
        </div>

        {/* SWITCHER TYPE */}
        <div className="flex bg-gray-200/50 p-1.5 rounded-[1.8rem] w-fit border border-gray-200/50 shadow-inner">
          <button 
            onClick={() => { setMovementType('IN'); setItems([]); }}
            className={`flex items-center gap-2 px-8 py-3.5 rounded-[1.4rem] text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
              movementType === 'IN' ? 'bg-white shadow-md text-green-600 scale-105' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <ArrowDownLeft size={16} /> Stock In
          </button>
          <button 
            onClick={() => { setMovementType('OUT'); setItems([]); }}
            className={`flex items-center gap-2 px-8 py-3.5 rounded-[1.4rem] text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
              movementType === 'OUT' ? 'bg-white shadow-md text-red-600 scale-105' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <ArrowUpRight size={16} /> Stock Out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* LEFT: FORM INPUT */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-2 italic tracking-widest">
                  {movementType === 'IN' ? 'Source (Supplier)' : 'Reason / Alasan'}
                </label>
                {movementType === 'IN' ? (
                  <select className="w-full p-5 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 uppercase outline-none focus:ring-4 focus:ring-green-100 transition-all appearance-none cursor-pointer">
                    <option>Select Supplier...</option>
                    <option>PT. INDOFOOD SUKSES MAKMUR</option>
                    <option>CV. SUMBER REJEKI</option>
                  </select>
                ) : (
                  <select className="w-full p-5 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 uppercase outline-none focus:ring-4 focus:ring-red-100 transition-all appearance-none cursor-pointer">
                    <option>Select Reason...</option>
                    <option>DAMAGED / RUSAK</option>
                    <option>EXPIRED / KADALUARSA</option>
                    <option>INTERNAL CONSUMPTION</option>
                    <option>LOST / HILANG</option>
                  </select>
                )}
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-2 italic tracking-widest">Reference Number</label>
                <input 
                  type="text" 
                  placeholder="E.G. INV-2024-001" 
                  className="w-full p-5 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 uppercase outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>

            {/* ITEM TABLE */}
            <div className="space-y-4">
              <div className="flex justify-between items-center px-2">
                <h3 className="text-xs font-black uppercase italic text-gray-800 flex items-center gap-2">
                  <Box size={16} className="text-blue-600"/> Selected Items
                </h3>
                <button 
                  onClick={addPlaceholderItem}
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-tighter hover:bg-blue-100 transition-all flex items-center gap-2"
                >
                  <Plus size={14}/> Add Product
                </button>
              </div>

              <div className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="p-5 text-[9px] font-black uppercase text-gray-400 tracking-widest">Product Info</th>
                      <th className="p-5 text-[9px] font-black uppercase text-gray-400 text-center tracking-widest w-32">Quantity</th>
                      <th className="p-5 text-[9px] font-black uppercase text-gray-400 text-right tracking-widest w-20">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {items.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="p-20 text-center">
                          <Package className="mx-auto text-gray-100 mb-4" size={64} />
                          <p className="text-[10px] font-bold text-gray-300 uppercase italic tracking-widest">Belum ada barang dipilih</p>
                        </td>
                      </tr>
                    ) : (
                      items.map((item) => (
                        <tr key={item.id} className="group hover:bg-gray-50/50 transition-all">
                          <td className="p-5">
                            <div className="font-bold text-gray-700 uppercase text-sm">{item.name}</div>
                            <div className="text-[10px] font-black text-blue-500 italic tracking-tighter">{item.sku}</div>
                          </td>
                          <td className="p-5">
                            <input 
                              type="number" 
                              value={item.quantity}
                              onChange={(e) => updateQty(item.id, parseInt(e.target.value))}
                              className="w-full p-3 bg-gray-100 border-none rounded-xl text-center font-black text-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                          <td className="p-5 text-right">
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="p-3 text-gray-300 hover:text-red-500 transition-colors"
                            >
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
          </div>
        </div>

        {/* RIGHT: SUMMARY */}
        <div className="space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 sticky top-8">
            <h3 className="text-sm font-black uppercase italic text-gray-800 mb-8 pb-4 border-b border-gray-50 flex items-center justify-between">
              Transaction Summary
              <span className={`px-3 py-1 rounded-full text-[9px] ${movementType === 'IN' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {movementType}
              </span>
            </h3>
            
            <div className="space-y-4 mb-10">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total SKU</span>
                <span className="font-mono font-black text-gray-700">{items.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Qty</span>
                <span className="font-mono font-black text-gray-700">
                  {items.reduce((acc, curr) => acc + curr.quantity, 0)}
                </span>
              </div>
            </div>

            <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 flex gap-4 mb-8">
              <AlertCircle className="text-blue-500 shrink-0" size={20} />
              <p className="text-[9px] font-bold text-blue-700 leading-relaxed uppercase tracking-tight">
                Data yang di-submit akan langsung mempengaruhi saldo stok di gudang.
              </p>
            </div>

            <button 
              disabled={items.length === 0}
              className={`w-full py-5 rounded-[1.8rem] font-black uppercase italic tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 disabled:opacity-50 disabled:grayscale ${
                movementType === 'IN' 
                ? 'bg-green-600 text-white shadow-green-100 hover:bg-green-700' 
                : 'bg-red-600 text-white shadow-red-100 hover:bg-red-700'
              }`}
            >
              <Save size={20} /> Process Movement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}