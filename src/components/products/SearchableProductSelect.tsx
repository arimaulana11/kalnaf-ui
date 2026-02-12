'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ShoppingBag, ChevronDown, Loader2, Search, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

interface ProductVariant {
  id: number;
  name: string;
  sku: string;
  price: number;
  products: {
    name: string;
  };
}

interface ProductVariantSelectProps {
  // Gunakan number | string jika data dari database/form belum konsisten, 
  // tapi kita pastikan dikonversi ke number saat digunakan.
  value: number; 
  onChange: (id: number) => void;
  storeId?: string;
}

export const ProductVariantSelect = ({ value, onChange, storeId }: ProductVariantSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const { data: variants, isLoading } = useQuery({
    queryKey: ['product-variants', storeId, debouncedSearch],
    queryFn: async () => {
      const res = await api.get('/product-variants', {
        params: {
          type: 'PHYSICAL',
          ...(storeId && { storeId }), 
          search: debouncedSearch,
          limit: 10
        }
      });
      return res.data.data.data as ProductVariant[];
    },
    enabled: isOpen || !!value, 
  });

  // Pastikan perbandingan ID menggunakan tipe yang sama (number)
  const selectedVariant = variants?.find(v => Number(v.id) === Number(value));

  return (
    <div className="relative w-full" ref={containerRef}>
      <div 
        onClick={() => !isLoading && setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full pl-9 pr-4 py-2 bg-slate-50 border rounded-xl text-xs font-bold cursor-pointer transition-all ${
          isOpen ? 'border-indigo-500 ring-2 ring-indigo-500/10 bg-white' : 'border-slate-200'
        } ${isLoading && !variants ? 'opacity-50' : ''}`}
      >
        <div className="absolute left-3 text-slate-400">
          {isLoading ? <Loader2 size={14} className="animate-spin" /> : <ShoppingBag size={14} />}
        </div>

        <span className={!selectedVariant ? "text-slate-400" : "text-slate-700"}>
          {selectedVariant 
            ? `${selectedVariant.products.name} - ${selectedVariant.name}` 
            : 'Cari & Pilih Produk...'}
        </span>

        <ChevronDown size={14} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-150">
          <div className="p-2 border-b border-slate-100 flex items-center gap-2">
            <Search size={12} className="text-slate-400 ml-2" />
            <input 
              autoFocus
              placeholder="Ketik nama produk..."
              className="w-full p-1 text-xs outline-none font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="max-h-60 overflow-y-auto">
            {variants?.map((v) => (
              <div 
                key={v.id}
                onClick={() => {
                  onChange(Number(v.id)); // Konversi eksplisit ke number
                  setIsOpen(false);
                  setSearchTerm('');
                }}
                className={`p-3 text-xs cursor-pointer hover:bg-indigo-50 transition-colors border-b border-slate-50 last:border-none ${
                  Number(value) === Number(v.id) ? 'bg-indigo-50/50 text-indigo-700' : 'text-slate-700'
                }`}
              >
                <div className="flex justify-between items-start mb-0.5">
                  <span className="font-black uppercase text-[9px] text-slate-400 bg-slate-100 px-1 rounded">{v.sku}</span>
                  <span className="text-indigo-600 font-black text-[10px]">Rp{v.price.toLocaleString()}</span>
                </div>
                <div className="font-bold">{v.products.name} - {v.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};