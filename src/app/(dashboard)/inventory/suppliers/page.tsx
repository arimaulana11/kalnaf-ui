"use client";

import React, { useState, useEffect, useCallback } from 'react';
import SupplierTable from '@/components/suppliers/SupplierTable';
import SupplierModal from '@/components/suppliers/SupplierModal';
import { Plus, Search, Truck, Loader2, RefreshCw } from 'lucide-react';
import { getSuppliers, searchSuppliers, deleteSupplier } from '@/services/supplier.service';
import { debounce } from 'lodash';

const SupplierPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [meta, setMeta] = useState({ currentPage: 1, lastPage: 1, total: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);

  // Fungsi Fetch Data Utama
  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      // Sesuai template service: response.data langsung berisi body dari API
      const res = await getSuppliers({ page, limit: 10 });
      
      // Jika struktur API NestJS Anda adalah { success: true, data: [...], meta: {...} }
      setSuppliers(res?.data?.data || []);
      if (res?.meta) {
        setMeta(res.meta);
      }
    } catch (err) { 
      console.error("Fetch Error:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  // Fungsi Hapus (Delete)
  const handleDelete = async (id: string) => {
    try {
      await deleteSupplier(id);
      // Refresh ke halaman yang sama setelah hapus
      fetchData(meta.currentPage);
    } catch (err) {
      console.error("Delete Error:", err);
      alert("Gagal menghapus supplier. Data mungkin masih terikat dengan stok barang.");
    }
  };

  // Fungsi Search dengan Debounce
  const debouncedSearch = useCallback(
    debounce(async (q: string) => {
      if (!q.trim()) {
        fetchData(1);
        return;
      }
      setLoading(true);
      try {
        const res = await searchSuppliers(q);
        setSuppliers(res?.data?.data || []);
        // Reset meta saat searching karena hasil pencarian biasanya tidak ber-paginasi standar
        setMeta({ currentPage: 1, lastPage: 1, total: res?.data?.length || 0 });
      } catch (err) { 
        console.error("Search Error:", err); 
      } finally { 
        setLoading(false); 
      }
    }, 500),
    []
  );

  useEffect(() => {
    fetchData(1);
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-800 italic uppercase flex items-center gap-2 tracking-tight">
            <Truck className="text-blue-600" size={28} /> 
            Supplier Management
          </h1>
          <p className="text-sm text-gray-500 font-medium italic tracking-wide">
            Monitoring basis data mitra vendor & rantai pasok
          </p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => fetchData(meta.currentPage)} 
            className="p-4 bg-white border border-gray-200 text-gray-600 rounded-2xl hover:bg-gray-50 transition-all shadow-sm active:scale-95"
            title="Refresh Data"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          <button 
            onClick={() => { 
              setSelectedSupplier(null); 
              setIsModalOpen(true); 
            }} 
            className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase italic flex items-center justify-center gap-3 hover:bg-blue-700 active:scale-95 transition-all shadow-xl shadow-blue-100"
          >
            <Plus size={20} /> Register Vendor
          </button>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 mb-8 flex items-center gap-4 focus-within:ring-4 focus-within:ring-blue-100 transition-all">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Cari vendor berdasarkan nama, email, atau alamat..." 
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-0 outline-none font-bold text-gray-700 text-sm placeholder:font-medium" 
            value={searchQuery} 
            onChange={(e) => { 
              setSearchQuery(e.target.value); 
              debouncedSearch(e.target.value); 
            }} 
          />
        </div>
        {loading && (
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black animate-pulse uppercase">
            <Loader2 className="animate-spin" size={14} /> Syncing
          </div>
        )}
      </div>

      {/* DATA TABLE */}
      <SupplierTable 
        suppliers={suppliers} 
        onEdit={(s: any) => { 
          setSelectedSupplier(s); 
          setIsModalOpen(true); 
        }} 
        onDelete={handleDelete}
        pagination={meta} 
        onPageChange={fetchData} 
      />

      {/* MODAL FORM */}
      <SupplierModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSupplier(null);
        }} 
        initialData={selectedSupplier}
        onSuccess={() => fetchData(meta.currentPage)} 
      />
    </div>
  );
};

export default SupplierPage;