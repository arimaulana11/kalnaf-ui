"use client";
import React, { useState, useEffect } from 'react';
import { X, Truck, Save, Loader2 } from 'lucide-react';
import { createSupplier, updateSupplier, SupplierData } from '@/services/supplier.service';

interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // Untuk refresh data di page utama
  initialData?: any;
}

const SupplierModal = ({ isOpen, onClose, onSuccess, initialData }: SupplierModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<SupplierData>>({
    name: '',
    phone: '',
    address: '',
    contact: '',
    email: '',
    isActive: true
  });

  // Sinkronisasi data saat mode EDIT (initialData berubah)
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        phone: initialData.phone || '',
        address: initialData.address || '',
        contact: initialData.contact || '',
        email: initialData.email || '',
        isActive: initialData.isActive ?? true
      });
    } else {
      setFormData({ name: '', phone: '', address: '', contact: '', email: '', isActive: true });
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (initialData?.id) {
        // Mode UPDATE
        await updateSupplier(initialData.id, formData);
      } else {
        // Mode CREATE
        await createSupplier(formData as SupplierData);
      }
      onSuccess(); // Refresh tabel
      onClose();   // Tutup modal
    } catch (error) {
      console.error("Error saving supplier:", error);
      alert("Gagal menyimpan data supplier. Pastikan nama unik.");
    } finally {
      setLoading(false);
    }
  };

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

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div className="group">
            <label className="text-[10px] font-black uppercase text-gray-400 mb-2 ml-1 flex items-center gap-2">
               Company Name <span className="w-1 h-1 rounded-full bg-blue-500"></span>
            </label>
            <input 
              required
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all font-bold text-gray-700 placeholder:font-medium uppercase text-sm" 
              placeholder="PT. GLOBAL LOGISTICS" 
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 mb-2 ml-1">Contact Person</label>
              <input 
                type="text" 
                value={formData.contact}
                onChange={(e) => setFormData({...formData, contact: e.target.value})}
                className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all font-bold text-gray-700 text-sm" 
                placeholder="Bpk. Heru" 
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 mb-2 ml-1">Phone Line</label>
              <input 
                type="text" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all font-bold text-gray-700 text-sm" 
                placeholder="021-..." 
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-gray-400 mb-2 ml-1">Email Address</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all font-bold text-gray-700 text-sm" 
              placeholder="vendor@company.com" 
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-gray-400 mb-2 ml-1">Full Address</label>
            <textarea 
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all font-bold text-gray-700 text-sm h-24 resize-none" 
              placeholder="Enter company address..."
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-black uppercase italic hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-3 group active:scale-[0.98] disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} className="group-hover:animate-bounce" />}
            {initialData ? 'Update Vendor' : 'Save Supplier Record'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SupplierModal;