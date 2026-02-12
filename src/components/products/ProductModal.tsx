'use client';

import React, { useState, useEffect } from 'react';
import { Package, X, Store, Plus, Trash2, Box, Layers, Info } from 'lucide-react';
import { ProductBasicInfo } from './ProductBasicInfo';
import { StoreSelect } from '../store/StoreSelect';
import { ParcelComponentManager } from './ParcelComponentManager';

export const ProductModal = ({ isOpen, onClose, onSubmit, isLoading, initialData }: any) => {
  const [type, setType] = useState<'PHYSICAL' | 'PARCEL'>('PHYSICAL');

  // State 1: Basic Info
  const [basicData, setBasicData] = useState({
    name: '',
    categoryId: '',
    description: '',
    purchasePrice: 0,
    imageUrl: '',
  });

  // State 2: Variants (Termasuk komponen jika tipe PARCEL)
  const [variants, setVariants] = useState<any[]>([
    { name: 'Base Unit', unitName: '', multiplier: 1, price: 0, sku: '', isBaseUnit: true, components: [] }
  ]);

  // State 3: Initial Stocks (Hanya untuk produk baru PHYSICAL)
  const [initialStocks, setInitialStocks] = useState([
    { storeId: '', qty: 0, purchasePrice: 0 }
  ]);

  // --- LOGIKA SYNC DATA (EDIT/ADD MODE) ---
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // --- MODE EDIT ---
        setType(initialData.type || 'PHYSICAL');

        setBasicData({
          name: initialData.name || '',
          categoryId: initialData.categoryId || '',
          description: initialData.description || '',
          purchasePrice: initialData.purchasePrice || 0,
          imageUrl: initialData.imageUrl || '',
        });

        if (initialData.variants && initialData.variants.length > 0) {
          setVariants(initialData.variants.map((v: any) => ({
            id: v.id, // PENTING: ID varian untuk backend patch/update
            name: v.name,
            unitName: v.unitName,
            multiplier: v.multiplier,
            price: v.price,
            sku: v.sku,
            isBaseUnit: v.isBaseUnit,
            // Mapping komponen parcel dari relasi backend (biasanya parcelItems atau bundleComponents)
            components: v.bundleComponents?.map((bc: any) => ({
              componentVariantId: bc.componentVariantId,
              qty: bc.qty
            })) || v.components || []
          })));
        }
      } else {
        // --- MODE TAMBAH BARU ---
        resetForm();
      }
    }
  }, [isOpen, initialData]);

  const resetForm = () => {
    setType('PHYSICAL');
    setBasicData({ name: '', categoryId: '', description: '', purchasePrice: 0, imageUrl: '' });
    setVariants([{ name: 'Base Unit', unitName: '', multiplier: 1, price: 0, sku: '', isBaseUnit: true, components: [] }]);
    setInitialStocks([{ storeId: '', qty: 0, purchasePrice: 0 }]);
  };

  const handleTypeChange = (newType: 'PHYSICAL' | 'PARCEL') => {
    if (initialData) return; // Kunci tipe jika sedang edit
    setType(newType);
    if (newType === 'PARCEL') {
      setVariants([{ name: 'Paket A', unitName: 'Paket', multiplier: 1, price: 0, sku: '', components: [] }]);
    } else {
      setVariants([{ name: 'Base Unit', unitName: '', multiplier: 1, price: 0, sku: '', isBaseUnit: true, components: [] }]);
    }
  };

const handleAddVariant = () => {
  const newVariant = { 
    name: '', 
    unitName: type === 'PARCEL' ? 'Paket' : '', 
    multiplier: 1, 
    price: 0, 
    sku: '', 
    isBaseUnit: false,
    // WAJIB ADA: Inisialisasi sebagai array kosong agar tidak undefined
    components: [] 
  };
  setVariants([...variants, newVariant]);
};

  const updateVariantField = (index: number, field: string, value: any) => {
    setVariants(prev => {
      const newVars = [...prev];
      newVars[index] = {
        ...newVars[index], // Pertahankan data lama (termasuk components)
        [field]: value
      };
      return newVars;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validasi sederhana
    if (type === 'PARCEL') {
      const hasEmptyComponent = variants.some(v => !v.components || v.components.length === 0);
      if (hasEmptyComponent) {
        alert("Setiap varian paket harus memiliki minimal satu produk isi (komponen).");
        return;
      }
    }

    // 2. Rakit Payload
    const payload = {
      ...basicData,
      categoryId: Number(basicData.categoryId),
      type,
      // Kita petakan ulang variants untuk memastikan tipe data benar (Number)
      variants: variants.map(v => {
        const variantData: any = {
          name: v.name,
          unitName: v.unitName,
          sku: v.sku,
          price: Number(v.price),
          multiplier: Number(v.multiplier),
          isBaseUnit: !!v.isBaseUnit,
        };

        // Jika ada ID (mode edit), sertakan ID-nya
        if (v.id) variantData.id = v.id;

        // KHUSUS PARCEL: Masukkan components ke dalam objek varian
        if (type === 'PARCEL') {
          console.log("variantData.components ",variantData.components);
          
          variantData.components = v.components.map((c: any) => ({
            componentVariantId: Number(c.componentVariantId),
            qty: Number(c.qty)
          }));
        }

        return variantData;
      }),
      // Initial stocks hanya untuk fisik & produk baru
      initialStocks: (!initialData && type === 'PHYSICAL')
        ? initialStocks.filter(s => s.storeId).map(s => ({
          storeId: s.storeId,
          qty: Number(s.qty),
          purchasePrice: Number(basicData.purchasePrice)
        }))
        : undefined
    };

    console.log("Payload Final ke Backend:", JSON.stringify(payload, null, 2));
    onSubmit(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in duration-200">

        {/* Header */}
        <div className="p-8 border-b border-slate-100 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white z-10">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl text-white shadow-lg transition-colors ${type === 'PHYSICAL' ? 'bg-blue-600' : 'bg-indigo-600'}`}>
              {type === 'PHYSICAL' ? <Package size={24} /> : <Layers size={24} />}
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">
                {initialData ? 'Edit' : 'Tambah'} {type === 'PHYSICAL' ? 'Produk' : 'Paket'}
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Product Management System</p>
            </div>
          </div>

          <div className={`bg-slate-100 p-1.5 rounded-2xl flex gap-1 self-start ${initialData ? 'opacity-50 pointer-events-none' : ''}`}>
            <button type="button" onClick={() => handleTypeChange('PHYSICAL')} className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${type === 'PHYSICAL' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>PHYSICAL</button>
            <button type="button" onClick={() => handleTypeChange('PARCEL')} className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${type === 'PARCEL' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>PARCEL</button>
          </div>

          <button onClick={onClose} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900 transition-colors">
            <X size={32} />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          <ProductBasicInfo
            data={basicData}
            onChange={(field, val) => setBasicData(prev => ({ ...prev, [field]: val }))}
            isParcel={type === 'PARCEL'}
          />

          <hr className="border-slate-100 border-dashed" />

          {/* Variants Area */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">Konfigurasi Varian & Harga</h3>
              </div>
              <button type="button" onClick={handleAddVariant} className="text-[10px] font-black bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-blue-600 transition-all uppercase tracking-widest shadow-lg shadow-slate-200">
                + Tambah Varian
              </button>
            </div>

            <div className="space-y-4">
              {variants.map((v, i) => (
                <div key={i} className={`p-1 rounded-[2.5rem] border-2 transition-all ${type === 'PARCEL' ? 'border-indigo-50 bg-indigo-50/20' : 'border-slate-50 bg-slate-50/30'}`}>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div className="md:col-span-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase ml-1 mb-1 block">Nama Varian</label>
                        <input className="w-full p-3 bg-white border border-slate-100 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/10" value={v.name} placeholder="e.g. Merah / Paket A" onChange={(e) => updateVariantField(i, 'name', e.target.value)} />
                      </div>
                      <div>
                        <label className="text-[9px] font-black text-slate-400 uppercase ml-1 mb-1 block">Satuan (Unit)</label>
                        <input className="w-full p-3 bg-white border border-slate-100 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/10" value={v.unitName} placeholder="Pcs / Box" onChange={(e) => updateVariantField(i, 'unitName', e.target.value)} />
                      </div>
                      <div>
                        <label className="text-[9px] font-black text-slate-400 uppercase ml-1 mb-1 block">SKU</label>
                        <input className="w-full p-3 bg-white border border-slate-100 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/10" value={v.sku} placeholder="Auto-gen if empty" onChange={(e) => updateVariantField(i, 'sku', e.target.value)} />
                      </div>
                      <div>
                        <label className="text-[9px] font-black text-slate-400 uppercase ml-1 mb-1 block">Harga Jual</label>
                        <input type="number" className="w-full p-3 bg-white border border-slate-100 rounded-xl text-sm font-bold text-blue-600 outline-none focus:ring-2 focus:ring-blue-500/10" value={v.price} onChange={(e) => updateVariantField(i, 'price', e.target.value)} />
                      </div>
                      <div className="flex items-end gap-2">
                        <div className="flex-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase ml-1 mb-1 block">Multiplier</label>
                          <input type="number" disabled={v.isBaseUnit} className="w-full p-3 bg-white border border-slate-100 rounded-xl text-sm font-bold disabled:opacity-30 disabled:bg-slate-50" value={v.multiplier} onChange={(e) => updateVariantField(i, 'multiplier', e.target.value)} />
                        </div>
                        {i > 0 && (
                          <button type="button" onClick={() => setVariants(variants.filter((_, idx) => idx !== i))} className="mb-2 p-3 text-red-400 hover:text-red-600 transition-colors"><Trash2 size={20} /></button>
                        )}
                      </div>
                    </div>

                    {/* Component Manager Hanya Tampil Jika PARCEL */}
                    {type === 'PARCEL' && (
                      <ParcelComponentManager
                        // Pastikan mengirim array, jangan undefined
                        components={v.components || []}
                        onUpdate={(newComp: any) => {
                          setVariants(prev => {
                            const next = [...prev];
                            // Timpa HANYA bagian components untuk varian index ke-i
                            next[i] = { ...next[i], components: newComp };
                            return next;
                          });
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stock Area (Hanya untuk produk fisik baru) */}
          {type === 'PHYSICAL' && !initialData && (
            <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl shadow-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-black uppercase text-blue-400 flex items-center gap-3 italic tracking-tighter">
                  <Store size={20} /> Atur Persediaan Awal (Stock)
                </h3>
                <button type="button" onClick={() => setInitialStocks([...initialStocks, { storeId: '', qty: 0, purchasePrice: 0 }])} className="text-[10px] font-black bg-white/10 px-4 py-2 rounded-xl hover:bg-white/20 transition-all uppercase tracking-widest">
                  + Tambah Cabang
                </button>
              </div>

              <div className="space-y-4">
                {initialStocks.map((stock, i) => (
                  <div key={i} className="flex flex-col md:flex-row gap-4 animate-in slide-in-from-left-4">
                    <div className="flex-[2]">
                      <StoreSelect selectedStoreId={stock.storeId} onChange={(id) => {
                        const ns = [...initialStocks]; ns[i].storeId = id; setInitialStocks(ns);
                      }} />
                    </div>
                    <div className="flex-1">
                      <input type="number" placeholder="Jumlah Stok" className="w-full p-3.5 bg-white/5 border border-white/10 rounded-xl outline-none focus:bg-white/10 transition-all font-bold" value={stock.qty} onChange={(e) => {
                        const ns = [...initialStocks]; ns[i].qty = Number(e.target.value); setInitialStocks(ns);
                      }} />
                    </div>
                    {i > 0 && (
                      <button type="button" onClick={() => setInitialStocks(initialStocks.filter((_, idx) => idx !== i))} className="p-3 text-white/30 hover:text-red-400"><Trash2 size={20} /></button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </form>

        {/* Footer Actions */}
        <div className="p-8 border-t border-slate-100 flex gap-4 bg-white shrink-0 z-10">
          <button type="button" onClick={onClose} className="flex-1 p-5 bg-slate-50 text-slate-400 rounded-[1.5rem] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">Batal</button>
          <button type="button" onClick={handleSubmit} disabled={isLoading} className={`flex-[2] p-5 text-white rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl transition-all disabled:opacity-50 active:scale-[0.98] ${type === 'PARCEL' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-blue-600 hover:bg-slate-900'}`}>
            {isLoading ? "Memproses Data..." : (initialData ? 'Simpan Perubahan' : 'Buat Produk Sekarang')}
          </button>
        </div>
      </div>
    </div>
  );
};