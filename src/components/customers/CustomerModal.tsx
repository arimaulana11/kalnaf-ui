"use client";

import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, User, Phone, Mail, MapPin } from 'lucide-react';
import { createCustomer, updateCustomer } from '@/services/customer.service';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess: () => void;
  initialData?: any; // Menampung data detail untuk mode Edit
}

const CustomerModal: React.FC<CustomerModalProps> = ({ 
  isOpen, 
  onClose, 
  onSaveSuccess, 
  initialData 
}) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  // Sinkronisasi data saat modal dibuka atau initialData berubah
  useEffect(() => {
    if (initialData && isOpen) {
      setForm({
        name: initialData.name || '',
        phone: initialData.phone || '',
        email: initialData.email || '',
        address: initialData.address || ''
      });
    } else if (isOpen) {
      // Reset form jika membuka mode Register (Tambah Baru)
      setForm({ name: '', phone: '', email: '', address: '' });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Menyusun payload sesuai format JSON yang kamu minta
      const payload = {
        name: form.name,
        phone: form.phone,
        email: form.email || null,
        address: form.address || null,
        metadata: initialData?.metadata || {
          member_type: "Gold",
          points: 0
        }
      };

      let res;
      if (initialData?.id) {
        // Jika ada ID, berarti panggil API Update (PATCH)
        res = await updateCustomer(initialData.id, payload);
      } else {
        // Jika tidak ada ID, panggil API Create (POST)
        res = await createCustomer(payload);
      }

      if (res.success) {
        alert(initialData ? "Data berhasil diperbarui!" : "Customer berhasil terdaftar!");
        onSaveSuccess(); // Refresh list di halaman utama
        onClose(); // Tutup modal
      }
    } catch (err: any) {
      console.error("Submit Error:", err);
      const errorMsg = err.response?.data?.message || "Terjadi kesalahan pada server";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in duration-200">
        
        {/* HEADER */}
        <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black uppercase italic tracking-wider">
              {initialData ? 'Edit Customer' : 'Register Customer'}
            </h2>
            <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest">
              {initialData ? `ID: ${initialData.id.substring(0,8)}...` : 'New Entry Port 3001'}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* FORM BODY */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-3">
            {/* Input Nama */}
            <div className="relative">
              <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <input 
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-all"
                placeholder="Full Name"
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
              />
            </div>

            {/* Input Phone */}
            <div className="relative">
              <Phone className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <input 
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-all"
                placeholder="Phone Number (e.g. 0812...)"
                value={form.phone}
                onChange={e => setForm({...form, phone: e.target.value})}
              />
            </div>

            {/* Input Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <input 
                type="email"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-all"
                placeholder="Email Address (Optional)"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
              />
            </div>

            {/* Input Alamat */}
            <div className="relative">
              <MapPin className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <textarea 
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium resize-none transition-all"
                placeholder="Home Address"
                rows={2}
                value={form.address}
                onChange={e => setForm({...form, address: e.target.value})}
              />
            </div>
          </div>

          {/* ACTION BUTTON */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-[0.98] disabled:bg-gray-400 transition-all shadow-lg shadow-blue-100 mt-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Save size={20} />
            )}
            {initialData ? 'Update Details' : 'Save & Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerModal;