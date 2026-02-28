"use client";

import React from 'react';
import { Search, X, Box, Plus, Loader2, Package } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (product: any) => void;
  // Props baru dari hook
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  products: any[];
  isLoading: boolean;
}

export const ProductSearchModal = ({ 
  isOpen, onClose, onSelect, 
  searchQuery, setSearchQuery, 
  products, isLoading 
}: Props) => {
  if (!isOpen) return null;
  console.log("products ",products)
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md transition-all" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-black uppercase italic text-gray-800 tracking-tight flex items-center gap-3">
            <Box className="text-blue-600" size={22} /> Select Product
          </h3>
          <button onClick={onClose} className="p-3 hover:bg-white rounded-full transition-all">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="p-8">
          <div className="relative mb-8">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              autoFocus 
              type="text" 
              placeholder="Search by SKU or Product Name..." 
              className="w-full pl-16 pr-8 py-6 bg-gray-50 border-none rounded-[1.5rem] font-bold text-gray-700 outline-none focus:ring-4 focus:ring-blue-100 transition-all text-lg" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
            />
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {isLoading ? (
              <div className="py-16 text-center flex flex-col items-center gap-4">
                <Loader2 className="animate-spin text-blue-600" size={40} />
                <span className="text-[11px] font-black text-gray-300 uppercase italic tracking-[0.3em]">Searching...</span>
              </div>
            ) : products.length > 0 ? (
              products.map(product => (
                <div 
                  key={product.id} 
                  onClick={() => onSelect(product)} 
                  className="group flex items-center justify-between p-6 rounded-[1.5rem] border border-gray-50 hover:border-blue-200 hover:bg-blue-50/50 cursor-pointer transition-all active:scale-95 shadow-sm"
                >
                  <div className="flex-1">
                    <div className="font-black text-gray-700 uppercase group-hover:text-blue-600 transition-colors text-sm italic tracking-tight">
                      {product.name}
                    </div>
                    <div className="flex gap-3 items-center mt-1">
                      <span className="text-[10px] font-bold text-gray-400 tracking-widest">{product.sku}</span>
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-[9px] font-black text-gray-500 uppercase">{product.unitName}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-[9px] font-black text-gray-300 uppercase italic">On Hand</div>
                      <div className="font-mono font-black text-gray-700">
                        {product.systemStock} <span className="text-[10px] text-gray-400 font-bold">{product.unitName}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-white rounded-xl shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <Plus size={20} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-16 text-center">
                <Package className="mx-auto text-gray-100 mb-4" size={60} />
                <p className="text-gray-300 font-bold uppercase text-[10px] tracking-widest">No matches found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};