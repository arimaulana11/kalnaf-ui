#!/bin/bash

# Konfigurasi Folder Berdasarkan Path Dashboard Anda
BASE_PATH="src"
COMPONENTS_PATH="$BASE_PATH/components/suppliers"
SERVICES_PATH="$BASE_PATH/services"
# Path disesuaikan dengan (dashboard)
PAGE_PATH="$BASE_PATH/app/(dashboard)/suppliers"

echo "🚀 Memulai pembuatan modul Supplier di folder (dashboard)..."

# 1. Membuat Folder
mkdir -p $COMPONENTS_PATH
mkdir -p $SERVICES_PATH
mkdir -p $PAGE_PATH

# 2. Membuat File Service (supplier.service.ts)
cat <<EOF > $SERVICES_PATH/supplier.service.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const getSuppliers = async ({ page = 1, limit = 10 }) => {
  return await axios.get(\`\${API_URL}/suppliers\`, { params: { page, limit } });
};

export const searchSuppliers = async (q: string) => {
  return await axios.get(\`\${API_URL}/suppliers/search\`, { params: { q } });
};
EOF

# 3. Membuat File Table (SupplierTable.tsx)
cat <<EOF > $COMPONENTS_PATH/SupplierTable.tsx
"use client";
import React from 'react';
import { Edit2, Truck, Phone, Mail } from 'lucide-react';

const SupplierTable = ({ suppliers, onEdit, pagination, onPageChange }: any) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Vendor Info</th>
              <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Contact Details</th>
              <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Status</th>
              <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {suppliers.map((sup: any) => (
              <tr key={sup.id} className="hover:bg-blue-50/20 transition-all group">
                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                      <Truck size={20} />
                    </div>
                    <div>
                      <div className="font-bold text-gray-800 uppercase text-sm tracking-tight">{sup.name}</div>
                      <div className="text-[10px] font-black text-blue-500 font-mono tracking-tighter uppercase">{sup.code}</div>
                    </div>
                  </div>
                </td>
                <td className="p-5">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                      <Phone size={12} className="text-gray-400" /> {sup.phone || '-'}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-medium text-gray-400">
                      <Mail size={12} /> {sup.email || 'no-email@vendor.com'}
                    </div>
                  </div>
                </td>
                <td className="p-5">
                  <span className={\`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider \${sup.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}\`}>
                    {sup.isActive ? '● ACTIVE' : '○ INACTIVE'}
                  </span>
                </td>
                <td className="p-5 text-right">
                  <button onClick={() => onEdit(sup)} className="p-2.5 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm hover:shadow-blue-200">
                    <Edit2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-5 flex justify-between items-center bg-gray-50/50 border-t border-gray-100">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Showing Page {pagination.currentPage} of {pagination.lastPage}</span>
        <div className="flex gap-2">
          <button 
            disabled={pagination.currentPage <= 1}
            onClick={() => onPageChange(pagination.currentPage - 1)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase hover:bg-gray-50 disabled:opacity-40 transition-all"
          >Prev</button>
          <button 
            disabled={pagination.currentPage >= pagination.lastPage}
            onClick={() => onPageChange(pagination.currentPage + 1)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase hover:bg-gray-50 disabled:opacity-40 transition-all"
          >Next</button>
        </div>
      </div>
    </div>
  );
};

export default SupplierTable;
EOF

# 4. Membuat File Modal (SupplierModal.tsx)
cat <<EOF > $COMPONENTS_PATH/SupplierModal.tsx
"use client";
import React from 'react';
import { X, Truck, Save } from 'lucide-react';

const SupplierModal = ({ isOpen, onClose, initialData }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[99] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl border border-white/20 relative overflow-hidden">
        <div className="flex justify-between items-center mb-8 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200">
              <Truck size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase italic tracking-tighter text-gray-800">
                {initialData ? 'Update Vendor' : 'New Supplier'}
              </h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Supply Chain Management</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-all bg-gray-50 text-gray-400">
            <X size={20} />
          </button>
        </div>

        <form className="space-y-5 relative z-10">
          <div className="group">
            <label className="text-[10px] font-black uppercase text-gray-400 mb-2 ml-1 flex items-center gap-2">
               Company Name <span className="w-1 h-1 rounded-full bg-blue-500"></span>
            </label>
            <input type="text" defaultValue={initialData?.name} className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all font-bold text-gray-700 placeholder:font-medium uppercase text-sm" placeholder="PT. GLOBAL LOGISTICS" />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 mb-2 ml-1">Vendor Code</label>
              <input type="text" defaultValue={initialData?.code} className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all font-bold text-gray-700 text-sm uppercase" placeholder="SUP-001" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 mb-2 ml-1">Phone Line</label>
              <input type="text" defaultValue={initialData?.phone} className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all font-bold text-gray-700 text-sm" placeholder="021-..." />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-gray-400 mb-2 ml-1">Full Address</label>
            <textarea className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all font-bold text-gray-700 text-sm h-24 resize-none" placeholder="Enter company address..."></textarea>
          </div>

          <button type="button" className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-black uppercase italic hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-3 group active:scale-[0.98]">
            <Save size={20} className="group-hover:animate-bounce" /> Save Supplier Record
          </button>
        </form>
      </div>
    </div>
  );
};

export default SupplierModal;
EOF

# 5. Membuat File Page Utama (page.tsx)
cat <<EOF > $PAGE_PATH/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import SupplierTable from '@/components/suppliers/SupplierTable';
import SupplierModal from '@/components/suppliers/SupplierModal';
import { Plus, Search, Truck, Loader2, RefreshCw } from 'lucide-react';
import { getSuppliers, searchSuppliers } from '@/services/supplier.service';
import { debounce } from 'lodash';

const SupplierPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [meta, setMeta] = useState({ currentPage: 1, lastPage: 1, total: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);

  const fetchInitialData = async (page = 1) => {
    setLoading(true);
    try {
      const res = await getSuppliers({ page, limit: 10 });
      setSuppliers(res?.data?.data || []);
      if (res?.data?.meta) setMeta(res.data.meta);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const debouncedSearch = useCallback(debounce(async (q: string) => {
    if (!q.trim()) { fetchInitialData(1); return; }
    setLoading(true);
    try {
      const res = await searchSuppliers(q);
      setSuppliers(res?.data?.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, 500), []);

  useEffect(() => { fetchInitialData(1); }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-800 italic uppercase flex items-center gap-2 tracking-tight">
            <Truck className="text-blue-600" size={28} /> 
            Supplier Management
          </h1>
          <p className="text-sm text-gray-500 font-medium italic">Monitoring basis data mitra vendor & rantai pasok</p>
        </div>
        
        <div className="flex gap-2">
          <button onClick={() => fetchInitialData(meta.currentPage)} className="p-4 bg-white border border-gray-200 text-gray-600 rounded-2xl hover:bg-gray-50 transition-all shadow-sm">
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          <button onClick={() => { setSelectedSupplier(null); setIsModalOpen(true); }} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase italic flex items-center justify-center gap-3 hover:bg-blue-700 active:scale-95 transition-all shadow-xl shadow-blue-100">
            <Plus size={20} /> Register Vendor
          </button>
        </div>
      </div>

      <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 mb-8 flex items-center gap-4 focus-within:ring-4 focus-within:ring-blue-100 transition-all">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input type="text" placeholder="Cari vendor, kode, atau kategori..." className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-0 outline-none font-bold text-gray-700 text-sm placeholder:font-medium" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); debouncedSearch(e.target.value); }} />
        </div>
        {loading && <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black animate-pulse uppercase"><Loader2 className="animate-spin" size={14} /> Syncing</div>}
      </div>

      <SupplierTable suppliers={suppliers} onEdit={(s: any) => { setSelectedSupplier(s); setIsModalOpen(true); }} pagination={meta} onPageChange={fetchInitialData} />
      <SupplierModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialData={selectedSupplier} />

      <div className="mt-12 pt-8 border-t border-gray-200/60 flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2 italic"><span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span> Supply-Chain Core V1</span>
          <span>Regional: Jakarta, ID</span>
        </div>
        <span>Generated by Gemini AI Platform</span>
      </div>
    </div>
  );
};

export default SupplierPage;
EOF

chmod +x $SERVICES_PATH/supplier.service.ts
echo "✅ SUKSES! Modul Supplier telah dibuat di: $PAGE_PATH"