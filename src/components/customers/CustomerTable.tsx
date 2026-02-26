"use client";

import React from 'react';
import { 
  Mail, 
  Phone, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  MapPin, 
  Award, 
  ChevronLeft, 
  ChevronRight, 
  Users 
} from 'lucide-react';
import { deleteCustomer } from '@/services/customer.service';

interface CustomerTableProps {
  customers: any[];
  onRefresh: () => void;
  onEdit: (customer: any) => void;
  pagination: {
    currentPage: number;
    lastPage: number;
    total: number;
  };
  onPageChange: (page: number) => void;
}

const CustomerTable: React.FC<CustomerTableProps> = ({ 
  customers = [], 
  onRefresh, 
  onEdit,
  pagination,
  onPageChange
}) => {

  const handleDelete = async (id: string, name: string) => {
    const isConfirmed = confirm(`Apakah Anda yakin ingin menghapus pelanggan "${name}"?`);
    
    if (isConfirmed) {
      try {
        await deleteCustomer(id);
        alert("Customer berhasil dihapus");
        onRefresh();
      } catch (error: any) {
        console.error("Gagal menghapus:", error);
        alert(error.response?.data?.message || "Gagal menghapus customer");
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b">
              <th className="px-6 py-4">Informasi Pelanggan</th>
              <th className="px-6 py-4">Kontak & Alamat</th>
              <th className="px-6 py-4 text-center">Status Member</th>
              <th className="px-6 py-4 text-center">Poin</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center text-gray-400 font-medium italic">
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-gray-100 p-4 rounded-full">
                      <Users className="text-gray-300" size={32} />
                    </div>
                    Tidak ada data customer ditemukan...
                  </div>
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-blue-50/40 transition-all group">
                  {/* IDENTITAS */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-md uppercase text-xs">
                        {customer.name?.charAt(0) || 'C'}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 uppercase leading-none mb-1 tracking-tight">
                          {customer.name}
                        </p>
                        <p className="text-[10px] text-gray-400 font-mono italic">
                          ID: {customer.id?.substring(0, 8)}...
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* KONTAK & ALAMAT */}
                  <td className="px-6 py-4">
                    <div className="space-y-1 text-gray-600 font-medium">
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-blue-500" /> 
                        {customer.phone}
                      </div>
                      {customer.email && (
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Mail size={14} /> {customer.email}
                        </div>
                      )}
                      {customer.address && (
                        <div className="flex items-center gap-2 text-[11px] text-gray-400 italic truncate max-w-[180px]">
                          <MapPin size={12} /> {customer.address}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* STATUS MEMBER */}
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-tighter border ${
                      customer.metadata?.member_type === 'Gold' || customer.metadata?.member_type === 'Platinum'
                        ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        : 'bg-gray-50 text-gray-500 border-gray-200'
                    }`}>
                      <Award size={10} />
                      {customer.metadata?.member_type || 'Regular'}
                    </span>
                  </td>

                  {/* POIN */}
                  <td className="px-6 py-4 text-center">
                    <div className="font-black text-blue-600 text-base tracking-tighter">
                      {customer.metadata?.points || 0}
                      <span className="text-[9px] text-gray-400 uppercase ml-1 font-bold">Pts</span>
                    </div>
                  </td>

                  {/* AKSI */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                      <button 
                        onClick={() => onEdit(customer)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-white rounded-xl border border-transparent hover:border-gray-100 transition shadow-sm"
                        title="Edit Data"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(customer.id, customer.name)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-white rounded-xl border border-transparent hover:border-gray-100 transition shadow-sm"
                        title="Hapus Data"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="group-hover:hidden text-gray-300">
                       <MoreVertical size={18} className="ml-auto" />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* PAGINATION FOOTER */}
      <div className="bg-gray-50/50 px-6 py-4 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex flex-col">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
            Total Records: {pagination.total}
          </p>
          <p className="text-[9px] font-bold text-blue-500 uppercase">
            Halaman {pagination.currentPage} dari {pagination.lastPage}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            disabled={pagination.currentPage <= 1}
            onClick={() => onPageChange(pagination.currentPage - 1)}
            className="flex items-center justify-center w-10 h-10 rounded-xl border bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex items-center justify-center px-4 h-10 bg-white border rounded-xl font-black text-xs text-blue-600 shadow-sm">
            {pagination.currentPage}
          </div>

          <button 
            disabled={pagination.currentPage >= pagination.lastPage}
            onClick={() => onPageChange(pagination.currentPage + 1)}
            className="flex items-center justify-center w-10 h-10 rounded-xl border bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerTable;