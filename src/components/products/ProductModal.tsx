'use client';

import React, { useState, useEffect } from 'react';
import { Package, X, Store, Plus, Trash2, Box, Layers, Info } from 'lucide-react';
import { ProductBasicInfo } from './ProductBasicInfo';
import { StoreSelect } from '../store/StoreSelect';
import { ParcelComponentManager } from './ParcelComponentManager';

export const ProductModal = ({ isOpen, onClose, onSubmit, isLoading }: any) => {
  const [type, setType] = useState<'PHYSICAL' | 'PARCEL'>('PHYSICAL');
  
  // State 1: Basic Info
  const [basicData, setBasicData] = useState({
    name: '',
    categoryId: 1,
    description: '',
    purchasePrice: 0,
    imageUrl: '',
  });

  // State 2: Variants (Dinamis untuk Physical & Parcel)
  const [variants, setVariants] = useState<any[]>([
    { name: '', unitName: '', multiplier: 1, price: 0, sku: '', isBaseUnit: true, components: [] }
  ]);

  // State 3: Initial Stocks (Hanya untuk Physical)
  const [initialStocks, setInitialStocks] = useState([
    { storeId: '', qty: 0, purchasePrice: 0 }
  ]);

  // Reset state saat tipe berubah agar JSON bersih
  useEffect(() => {
    if (type === 'PARCEL') {
      setVariants([{ name: 'Paket A', unitName: 'Paket', multiplier: 1, price: 0, sku: '', components: [] }]);
    } else {
      setVariants([{ name: 'Base Unit', unitName: '', multiplier: 1, price: 0, sku: '', isBaseUnit: true }]);
    }
  }, [type]);

  const handleAddVariant = () => {
    const newVariant = type === 'PHYSICAL' 
      ? { name: '', unitName: '', multiplier: 1, price: 0, sku: '', isBaseUnit: false, parentSku: variants[0].sku }
      : { name: '', unitName: 'Paket', multiplier: 1, price: 0, sku: '', components: [] };
    setVariants([...variants, newVariant]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Konstruksi Payload Dinamis
    const payload: any = {
      ...basicData,
      type,
      variants: variants.map(v => {
        const { components, ...rest } = v;
        return type === 'PARCEL' ? { ...rest, components } : rest;
      })
    };

    if (type === 'PHYSICAL') {
      payload.initialStocks = initialStocks.map(s => ({ ...s, purchasePrice: basicData.purchasePrice }));
    }

    console.log("Final Payload:", payload);
    onSubmit(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Header & Toggle Type */}
        <div className="p-8 border-b border-slate-100 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg">
              {type === 'PHYSICAL' ? <Package size={24} /> : <Layers size={24} />}
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">
                Tambah {type === 'PHYSICAL' ? 'Produk Fisik' : 'Paket Parcel'}
              </h2>
            </div>
          </div>

          {/* Toggle Switch */}
          <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1 self-start">
            <button 
              onClick={() => setType('PHYSICAL')}
              className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${type === 'PHYSICAL' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              PHYSICAL
            </button>
            <button 
              onClick={() => setType('PARCEL')}
              className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${type === 'PARCEL' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              PARCEL
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Basic Info Component */}
          <ProductBasicInfo 
            data={basicData} 
            onChange={(field, val) => setBasicData(prev => ({...prev, [field]: val}))}
            isParcel={type === 'PARCEL'}
          />

          <hr className="border-slate-100 border-dashed" />

          {/* Variants Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-black uppercase italic tracking-widest text-slate-800 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" /> 
                {type === 'PHYSICAL' ? 'Konfigurasi Multi-UOM' : 'Pilihan Paket Parcel'}
              </h3>
              <button type="button" onClick={handleAddVariant} className="text-[10px] font-bold bg-blue-50 text-blue-600 px-4 py-2 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                + TAMBAH VARIANT
              </button>
            </div>

            <div className="space-y-4">
              {variants.map((v, i) => (
                <div key={i} className="p-6 rounded-[2rem] border-2 border-slate-50 bg-slate-50/30">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="col-span-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Nama Varian</label>
                      <input className="w-full p-3 bg-white rounded-xl text-sm font-bold outline-none border border-transparent focus:border-blue-500" value={v.name} onChange={(e) => {
                        const newVars = [...variants]; newVars[i].name = e.target.value; setVariants(newVars);
                      }} />
                    </div>
                    <div className="col-span-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Unit</label>
                      <input className="w-full p-3 bg-white rounded-xl text-sm font-bold outline-none border border-transparent focus:border-blue-500" value={v.unitName} placeholder="pcs/pkt" onChange={(e) => {
                        const newVars = [...variants]; newVars[i].unitName = e.target.value; setVariants(newVars);
                      }} />
                    </div>
                    <div className="col-span-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">SKU</label>
                      <input className="w-full p-3 bg-white rounded-xl text-sm font-bold outline-none border border-transparent focus:border-blue-500" value={v.sku} onChange={(e) => {
                        const newVars = [...variants]; newVars[i].sku = e.target.value; setVariants(newVars);
                      }} />
                    </div>
                    <div className="col-span-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Harga Jual</label>
                      <input type="number" className="w-full p-3 bg-white rounded-xl text-sm font-bold text-blue-600 outline-none border border-transparent focus:border-blue-500" value={v.price} onChange={(e) => {
                        const newVars = [...variants]; newVars[i].price = Number(e.target.value); setVariants(newVars);
                      }} />
                    </div>
                    <div className="flex items-end justify-between">
                       <div className="flex-1 mr-2">
                        {type === 'PHYSICAL' && (
                          <>
                            <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Multiplier</label>
                            <input type="number" disabled={v.isBaseUnit} className="w-full p-3 bg-white rounded-xl text-sm font-bold disabled:opacity-50" value={v.multiplier} onChange={(e) => {
                              const newVars = [...variants]; newVars[i].multiplier = Number(e.target.value); setVariants(newVars);
                            }} />
                          </>
                        )}
                       </div>
                       {i > 0 && (
                         <button type="button" onClick={() => setVariants(variants.filter((_, idx) => idx !== i))} className="mb-3 text-red-400 hover:text-red-600 transition-colors">
                           <Trash2 size={20} />
                         </button>
                       )}
                    </div>
                  </div>

                  {/* PARCEL COMPONENTS AREA */}
                  {type === 'PARCEL' && (
                    <ParcelComponentManager 
                      components={v.components} 
                      onUpdate={(newComp: any) => {
                        const newVars = [...variants]; newVars[i].components = newComp; setVariants(newVars);
                      }} 
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Stock Section (Only for Physical) */}
          {type === 'PHYSICAL' && (
            <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-blue-400 flex items-center gap-2">
                <Store size={18} /> Inventaris & Stok Awal
              </h3>
              {initialStocks.map((stock, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                  <StoreSelect 
                    selectedStoreId={stock.storeId} 
                    onChange={(id) => {
                      const ns = [...initialStocks]; ns[i].storeId = id; setInitialStocks(ns);
                    }} 
                  />
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Jumlah Stok ({variants[0].unitName || 'Base'})</label>
                    <input type="number" className="w-full p-3 bg-white/10 rounded-xl text-sm font-bold text-green-400 outline-none border border-white/10 focus:border-green-400" value={stock.qty} onChange={(e) => {
                      const ns = [...initialStocks]; ns[i].qty = Number(e.target.value); setInitialStocks(ns);
                    }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="p-8 border-t border-slate-100 bg-white flex gap-4 shrink-0">
          <button onClick={onClose} className="flex-1 p-5 bg-slate-50 text-slate-400 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-100 transition-all">Batal</button>
          <button onClick={handleSubmit} disabled={isLoading} className="flex-[2] p-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-900 shadow-xl transition-all disabled:opacity-50">
            {isLoading ? "Menyimpan..." : `Simpan ${type}`}
          </button>
        </div>
      </div>
    </div>
  );
};