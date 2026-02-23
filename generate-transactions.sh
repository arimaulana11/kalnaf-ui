#!/bin/bash

# Konfigurasi Path
APP_DIR="src/app/(dashboard)/transactions"
COMP_DIR="src/components/transactions"
TYPE_DIR="src/types"
SERVICE_DIR="src/services"
HOOK_DIR="src/hooks"

# Membuat semua folder
mkdir -p "$APP_DIR" "$COMP_DIR" "$TYPE_DIR" "$SERVICE_DIR" "$HOOK_DIR"

echo "=========================================="
echo "🚀 FINAL TRANSACTION GENERATOR"
echo "=========================================="

# 1. Type dengan Export Interface yang Jelas
cat << 'EOF' > "$TYPE_DIR/transaction.ts"
export interface Transaction {
  id: string;
  reference_no: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  category: string;
  description: string;
  transaction_date: string;
  status: 'COMPLETED' | 'PENDING' | 'CANCELLED';
}
EOF

# 2. Service (Memastikan return data.data sesuai struktur NestJS kamu)
cat << 'EOF' > "$SERVICE_DIR/transaction.service.ts"
import axiosInstance from '@/lib/axios';

export const getTransactions = async (page: number = 1, search: string = "") => {
  const response = await axiosInstance.get(`/transactions?page=${page}&search=${search}&limit=10`);
  return response.data; // Mengembalikan { success, data: { data, meta, stats } }
};
EOF

# 3. Hook dengan Placeholder Data agar UI tidak jumping
cat << 'EOF' > "$HOOK_DIR/useTransactions.ts"
import { useQuery } from '@tanstack/react-query';
import { getTransactions } from '@/services/transaction.service';

export const useTransactions = (page: number, search: string) => {
  return useQuery({
    queryKey: ['transactions', page, search],
    queryFn: () => getTransactions(page, search),
  });
};
EOF

# 4. UI Shell dengan Safe Number Formatting
cat << 'EOF' > "$COMP_DIR/TransactionShell.tsx"
'use client';
import React from 'react';
import { Wallet, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export const TransactionShell = ({ stats }: { stats?: any }) => {
  const formatIDR = (val: number) => new Intl.NumberFormat('id-ID').format(val || 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
          <Wallet size={24} />
        </div>
        <p className="text-slate-400 text-[10px] uppercase font-black tracking-widest">Saldo Kas</p>
        <h3 className="text-3xl font-black text-slate-900 mt-1">Rp {formatIDR(stats?.total)}</h3>
      </div>
      <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
          <ArrowDownLeft size={24} />
        </div>
        <p className="text-slate-400 text-[10px] uppercase font-black tracking-widest">Pemasukan</p>
        <h3 className="text-3xl font-black text-emerald-600 mt-1">Rp {formatIDR(stats?.income)}</h3>
      </div>
      <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-4">
          <ArrowUpRight size={24} />
        </div>
        <p className="text-slate-400 text-[10px] uppercase font-black tracking-widest">Pengeluaran</p>
        <h3 className="text-3xl font-black text-rose-600 mt-1">Rp {formatIDR(stats?.expense)}</h3>
      </div>
    </div>
  );
};
EOF

# 5. UI Table dengan FIX: Proteksi .map()
cat << 'EOF' > "$COMP_DIR/TransactionTable.tsx"
'use client';
import React from 'react';
import { Transaction } from '@/types/transaction';

export const TransactionTable = ({ data = [], isLoading }: { data?: Transaction[], isLoading: boolean }) => {
  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-slate-50">
            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Keterangan</th>
            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Nominal</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {isLoading ? (
            <tr><td colSpan={2} className="p-20 text-center text-slate-300 font-bold italic">Menghubungkan ke Server...</td></tr>
          ) : !data || data.length === 0 ? (
            <tr><td colSpan={2} className="p-20 text-center text-slate-300 font-bold">Tidak Ada Riwayat Transaksi</td></tr>
          ) : data.map((trx) => (
            <tr key={trx.id} className="hover:bg-slate-50/50 transition-all">
              <td className="p-6">
                <p className="font-bold text-slate-800">{trx.reference_no || 'No Ref'}</p>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tighter">{trx.category} • {trx.transaction_date}</p>
              </td>
              <td className={`p-6 text-right font-black text-lg ${trx.type === 'INCOME' ? 'text-emerald-500' : 'text-rose-500'}`}>
                {trx.type === 'INCOME' ? '+' : '-'} {trx.amount?.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
EOF

# 6. Main List Component (Memastikan data dikirim sebagai array)
cat << 'EOF' > "$COMP_DIR/TransactionList.tsx"
'use client';
import React, { useState } from 'react';
import { Search, Plus, Filter } from 'lucide-react';
import { TransactionShell } from './TransactionShell';
import { TransactionTable } from './TransactionTable';
import { useTransactions } from '@/hooks/useTransactions';

export const TransactionList = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data: res, isLoading } = useTransactions(page, search);

  // Proteksi data agar selalu array sebelum dikirim ke tabel
  const transactionData = res?.data?.data || [];
  const statsData = res?.data?.stats || { total: 0, income: 0, expense: 0 };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight italic uppercase">Activity</h2>
          <div className="h-1.5 w-12 bg-blue-600 rounded-full mt-1"></div>
        </div>
        <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold shadow-2xl shadow-slate-200 hover:scale-105 transition-all flex items-center gap-3">
          <Plus size={20} /> Tambah Data
        </button>
      </div>

      <TransactionShell stats={statsData} />

      <div className="relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
        <input 
          type="text" 
          placeholder="Cari transaksi..."
          className="w-full pl-16 pr-6 py-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm outline-none focus:ring-4 focus:ring-blue-50 transition-all font-bold text-slate-700"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <TransactionTable data={transactionData} isLoading={isLoading} />
    </div>
  );
};
EOF

# 7. Page Next.js
cat << 'EOF' > "$APP_DIR/page.tsx"
import { TransactionList } from "@/components/transactions/TransactionList";

export default function TransactionsPage() {
  return (
    <div className="min-h-screen bg-[#fcfcfd] p-8">
      <TransactionList />
    </div>
  );
}
EOF

chmod +x gen-transactions-final.sh
echo "✅ SUCCESS: Jalankan 'bash gen-transactions-final.sh' sekarang!"