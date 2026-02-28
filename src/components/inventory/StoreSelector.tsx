"use client";

import React from 'react';
import { Store, ChevronDown } from 'lucide-react';

interface StoreSelectorProps {
  stores: any[];
  selectedStoreId: string;
  onStoreChange: (id: string) => void;
  label?: string;
}

export const StoreSelector = ({ 
  stores, 
  selectedStoreId, 
  onStoreChange, 
  label = "Target Store (Tujuan)" 
}: StoreSelectorProps) => {
  return (
    <div className="space-y-3">
      <label className="text-[10px] font-black uppercase text-gray-400 italic tracking-widest flex items-center gap-2">
        <Store size={12} className="text-orange-500" />
        {label}
      </label>
      <div className="relative group">
        <select 
          value={selectedStoreId} 
          onChange={(e) => onStoreChange(e.target.value)}
          className="w-full p-5 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 uppercase outline-none focus:ring-4 focus:ring-orange-100 transition-all cursor-pointer appearance-none pr-12"
        >
          <option value="">Select Branch...</option>
          {stores?.map((store) => (
            <option key={store.id} value={store.id}>
              {store.name}
            </option>
          ))}
        </select>
        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-orange-500 transition-colors">
          <ChevronDown size={20} />
        </div>
      </div>
    </div>
  );
};