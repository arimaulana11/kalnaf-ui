'use client';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { X, UserPlus, Search, Loader2, CheckCircle2 } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AssignStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (userId: string) => void;
  isLoading: boolean;
}

export const AssignStaffModal = ({ isOpen, onClose, onAssign, isLoading }: AssignStaffModalProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch daftar user/staff yang tersedia di tenant ini
  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['available-staff'],
    queryFn: async () => {
      const res = await api.get('/users/staff'); // Sesuaikan dengan endpoint user Anda
      console.log("staff ",res.data.data.items);
      
      return res.data.data.items || [];
    },
    enabled: isOpen,
  });

  if (!isOpen) return null;
  console.log("stafff ",users);
  
  const filteredUsers = users?.filter((user: User) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[99] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-xl text-white">
              <UserPlus size={20} />
            </div>
            <h2 className="text-xl font-black text-slate-900 uppercase italic">Tugaskan Staff</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-slate-400">
            <X size={24} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 px-8">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Cari nama atau email staff..."
              className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* User List */}
        <div className="px-4 pb-4 max-h-[400px] overflow-y-auto scrollbar-hide">
          {isLoadingUsers ? (
            <div className="flex flex-col items-center py-20 text-slate-400">
              <Loader2 className="animate-spin mb-2" />
              <p className="text-xs font-bold uppercase tracking-widest">Memuat Staff...</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredUsers?.map((user: User) => (
                <button
                  key={user.id}
                  onClick={() => onAssign(user.id)}
                  disabled={isLoading}
                  className="w-full flex items-center justify-between p-4 rounded-3xl hover:bg-blue-50 transition-all group border border-transparent hover:border-blue-100"
                >
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-12 h-12 bg-slate-200 rounded-2xl flex items-center justify-center font-black text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all uppercase">
                      {user.name.substring(0, 2)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{user.name}</h4>
                      <p className="text-xs text-slate-400 font-medium">{user.email}</p>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <CheckCircle2 className="text-blue-600" size={24} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Pilih staff untuk memberikan akses kasir</p>
        </div>
      </div>
    </div>
  );
};