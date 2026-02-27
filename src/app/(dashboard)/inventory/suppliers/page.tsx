"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Truck, Plus, Search, RefreshCw, Loader2 } from 'lucide-react';
import { debounce } from 'lodash';
import SupplierTable from '@/components/suppliers/SupplierTable';
import SupplierModal from '@/components/suppliers/SupplierModal';
import { getSuppliers, searchSuppliers, deleteSupplier } from '@/services/supplier.service';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [meta, setMeta] = useState({ currentPage: 1, lastPage: 1, total: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const res = await getSuppliers({ page, limit: 10 });
      setSuppliers(res?.data?.data || []);
      if (res?.meta) setMeta(res.meta);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  const debouncedSearch = useCallback(
    debounce(async (q: string) => {
      if (!q.trim()) return fetchData(1);
      setLoading(true);
      try {
        const res = await searchSuppliers(q);
        setSuppliers(res?.data?.data || []);
        setMeta(prev => ({ ...prev, currentPage: 1, total: res?.data?.data?.length || 0 }));
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    }, 500), [meta]
  );

  useEffect(() => { fetchData(1); }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-gray-800 flex items-center gap-3">
            <Truck className="text-blue-600" size={32} /> Suppliers
          </h1>
          <p className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase mt-1">Vendor Partnership Management</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => fetchData(meta.currentPage)} className="p-4 bg-white border border-gray-200 text-gray-600 rounded-2xl hover:bg-gray-50 active:scale-95 transition-all">
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          <button onClick={() => { setSelectedSupplier(null); setIsModalOpen(true); }} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase italic flex items-center gap-3 hover:bg-blue-700 active:scale-95 transition-all shadow-xl shadow-blue-100">
            <Plus size={20} /> Register Vendor
          </button>
        </div>
      </div>

      <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 mb-8 flex items-center gap-4 focus-within:ring-4 focus-within:ring-blue-100 transition-all">
        <div className="relative flex-1 text-gray-400">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2" size={20} />
          <input type="text" placeholder="Search suppliers..." className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl outline-none font-bold text-gray-700 text-sm" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); debouncedSearch(e.target.value); }} />
        </div>
      </div>

      <SupplierTable suppliers={suppliers} onEdit={(s: any) => { setSelectedSupplier(s); setIsModalOpen(true); }} onDelete={(id: string) => deleteSupplier(id).then(() => fetchData(meta.currentPage))} pagination={meta} onPageChange={fetchData} />
      <SupplierModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialData={selectedSupplier} onSuccess={() => fetchData(meta.currentPage)} />
    </div>
  );
}