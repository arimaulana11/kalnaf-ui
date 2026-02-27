"use client";

import React, { useState, useEffect, useCallback } from 'react';
import CustomerTable from '@/components/customers/CustomerTable';
import CustomerModal from '@/components/customers/CustomerModal';
import { Plus, Search, Users, Loader2, RefreshCw } from 'lucide-react';
import { getCustomers, searchCustomers } from '@/services/customer.service';
import { debounce } from 'lodash';

const CustomerPage = () => {
  // --- STATES ---
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // State untuk Pagination (Metadata dari API)
  const [meta, setMeta] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0
  });

  // State untuk Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  // --- API HANDLERS ---

  // Ambil data pelanggan dengan parameter halaman
  const fetchInitialData = async (page = 1) => {
    setLoading(true);
    try {
      const res = await getCustomers({ page, limit: 10 });
      
      // Ekstraksi data dari struktur res.data.data
      const dataArray = res?.data?.data || [];
      const pagination = res?.data?.meta;

      setCustomers(dataArray);
      
      // Update state pagination jika ada di response
      if (pagination) {
        setMeta({
          currentPage: pagination.currentPage,
          lastPage: pagination.lastPage,
          total: pagination.total
        });
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  // Logika pencarian (Server-side) dengan Debounce
  const debouncedSearch = useCallback(
    debounce(async (q: string) => {
      if (!q.trim()) {
        fetchInitialData(1);
        return;
      }

      setLoading(true);
      try {
        const res = await searchCustomers(q);
        const searchResult = res?.data?.data || [];
        const searchMeta = res?.data?.meta;

        setCustomers(searchResult);
        if (searchMeta) {
          setMeta({
            currentPage: searchMeta.currentPage,
            lastPage: searchMeta.lastPage,
            total: searchMeta.total
          });
        }
      } catch (err) {
        console.error("Search Error:", err);
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  // Load data pertama kali
  useEffect(() => {
    fetchInitialData(1);
  }, []);

  // --- EVENT HANDLERS ---

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    debouncedSearch(val);
  };

  const handleOpenAddModal = () => {
    setSelectedCustomer(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (customer: any) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handlePageChange = (newPage: number) => {
    fetchInitialData(newPage);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-800 italic uppercase flex items-center gap-2 tracking-tight">
            <Users className="text-blue-600" size={28} /> 
            Customer Management
          </h1>
          <p className="text-sm text-gray-500 font-medium italic">
            Monitoring loyalitas & basis data pelanggan
          </p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => fetchInitialData(meta.currentPage)}
            className="p-3 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-all shadow-sm"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          
          <button 
            onClick={handleOpenAddModal}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-100"
          >
            <Plus size={20} /> 
            Register Customer
          </button>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex items-center gap-3 transition-all focus-within:ring-4 focus-within:ring-blue-50/50">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Cari nama, nomor telepon, atau email..."
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-0 outline-none font-medium text-gray-700"
            value={searchQuery}
            onChange={onSearchChange}
          />
        </div>
        {loading && (
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black animate-pulse">
            <Loader2 className="animate-spin" size={14} />
            SYNCING
          </div>
        )}
      </div>

      {/* DATA TABLE */}
      <CustomerTable 
        customers={customers} 
        onRefresh={() => fetchInitialData(meta.currentPage)} 
        onEdit={handleOpenEditModal}
        pagination={meta}
        onPageChange={handlePageChange}
      />

      {/* MODAL (REGISTER/EDIT) */}
      <CustomerModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSaveSuccess={() => fetchInitialData(meta.currentPage)}
        initialData={selectedCustomer}
      />

    </div>
  );
};

export default CustomerPage;