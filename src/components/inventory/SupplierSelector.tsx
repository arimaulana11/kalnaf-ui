"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, Plus, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { searchSuppliers } from '@/services/supplier.service';

interface Supplier {
  id: string;
  name: string;
}

interface Props {
  movementType: 'IN' | 'OUT';
  selectedSupplier: Supplier | null;
  setSelectedSupplier: (s: Supplier | null) => void;
  reason: string;
  setReason: (r: string) => void;
}

export const SupplierSelector = ({ movementType, selectedSupplier, setSelectedSupplier, reason, setReason }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSupplierOpen, setIsSupplierOpen] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const supplierRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (supplierRef.current && !supplierRef.current.contains(e.target as Node)) {
        setIsSupplierOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Fetch Suppliers
  useEffect(() => {
    if (movementType !== 'IN' || searchTerm === selectedSupplier?.name) return;
    
    const fetchS = async () => {
      setIsSearching(true);
      try {
        const res = await searchSuppliers(searchTerm);
        if (res.success) setSuppliers(res.data.data);
      } finally {
        setIsSearching(false);
      }
    };

    const delay = setTimeout(fetchS, 400);
    return () => clearTimeout(delay);
  }, [searchTerm, movementType]);

  if (movementType === 'OUT') {
    return (
      <div className="space-y-3">
        <label className="text-[10px] font-black uppercase text-gray-400 ml-2 italic tracking-widest">Reason / Alasan Keluar</label>
        <select 
          value={reason} 
          onChange={(e) => setReason(e.target.value)} 
          className="w-full p-5 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 uppercase outline-none focus:ring-4 focus:ring-red-100 transition-all appearance-none cursor-pointer"
        >
          <option value="">Select Reason...</option>
          <option value="DAMAGE">DAMAGE / RUSAK</option>
          <option value="EXPIRED">EXPIRED / KADALUARSA</option>
          <option value="LOST">LOST / HILANG</option>
        </select>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <label className="text-[10px] font-black uppercase text-gray-400 ml-2 italic tracking-widest">Source (Supplier)</label>
      <div className="flex gap-2">
        <div className="relative flex-1" ref={supplierRef}>
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search supplier..."
              value={selectedSupplier ? selectedSupplier.name : searchTerm}
              onFocus={() => { setIsSupplierOpen(true); if(selectedSupplier) {setSearchTerm(""); setSelectedSupplier(null);} }}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-12 py-5 bg-gray-50 rounded-2xl font-bold text-gray-700 uppercase outline-none focus:ring-4 focus:ring-green-100 transition-all text-sm"
            />
            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>

          {isSupplierOpen && (
            <div className="absolute z-50 w-full mt-3 bg-white border border-gray-100 rounded-[2rem] shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
              {isSearching ? (
                <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-green-500" /></div>
              ) : suppliers.length > 0 ? (
                suppliers.map((sup) => (
                  <div 
                    key={sup.id} 
                    onClick={() => { setSelectedSupplier(sup); setIsSupplierOpen(false); }}
                    className="px-6 py-4 hover:bg-green-50 cursor-pointer border-b border-gray-50 last:border-none"
                  >
                    <div className="font-black text-gray-700 uppercase text-xs">{sup.name}</div>
                  </div>
                ))
              ) : (
                <div className="p-10 text-center text-[10px] font-black text-gray-300 uppercase italic">No supplier found</div>
              )}
            </div>
          )}
        </div>
        <Link href="/inventory/suppliers" target="_blank">
          <button type="button" className="p-5 bg-green-600 text-white rounded-2xl hover:bg-gray-900 transition-all"><Plus size={24} /></button>
        </Link>
      </div>
    </div>
  );
};