"use client";
import React from 'react';
import { Edit2, Truck, Phone, Mail, Trash2 } from 'lucide-react';

interface SupplierTableProps {
  suppliers: any[];
  onEdit: (supplier: any) => void;
  onDelete: (id: string) => void; // Tambahkan prop ini
  pagination: {
    currentPage: number;
    lastPage: number;
    total?: number;
  };
  onPageChange: (page: number) => void;
}

const SupplierTable = ({ suppliers, onEdit, onDelete, pagination, onPageChange }: SupplierTableProps) => {
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
            {suppliers.length > 0 ? (
              suppliers.map((sup: any) => (
                <tr key={sup.id} className="hover:bg-blue-50/20 transition-all group">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                        <Truck size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-gray-800 uppercase text-sm tracking-tight">{sup.name}</div>
                        <div className="text-[10px] font-black text-blue-500 font-mono tracking-tighter uppercase">{sup.id.slice(0, 8)}</div>
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
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider ${sup.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {sup.isActive ? '● ACTIVE' : '○ INACTIVE'}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => onEdit(sup)} 
                        className="p-2.5 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm hover:shadow-blue-200"
                        title="Edit Supplier"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => {
                          if(window.confirm(`Hapus supplier ${sup.name}?`)) onDelete(sup.id)
                        }} 
                        className="p-2.5 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm hover:shadow-red-200"
                        title="Delete Supplier"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-10 text-center text-gray-400 font-bold uppercase italic text-xs tracking-widest">
                  No suppliers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* PAGINATION CONTROL */}
      <div className="p-5 flex justify-between items-center bg-gray-50/50 border-t border-gray-100">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          Showing Page {pagination.currentPage} of {pagination.lastPage}
        </span>
        <div className="flex gap-2">
          <button 
            disabled={pagination.currentPage <= 1}
            onClick={() => onPageChange(pagination.currentPage - 1)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase hover:bg-gray-50 disabled:opacity-40 transition-all active:scale-95"
          >Prev</button>
          <button 
            disabled={pagination.currentPage >= pagination.lastPage}
            onClick={() => onPageChange(pagination.currentPage + 1)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase hover:bg-gray-50 disabled:opacity-40 transition-all active:scale-95"
          >Next</button>
        </div>
      </div>
    </div>
  );
};

export default SupplierTable;