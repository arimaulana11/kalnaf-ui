"use client";

import { useParams, useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  ShoppingCart, AlertTriangle, 
  Clock, Trophy, TrendingUp, Plus, 
  Calendar, Wallet, Receipt, RefreshCcw, Store, ChevronDown
} from 'lucide-react';
import { 
  getDailySummary, 
  getDebtSummary, 
  getSalesReport, 
  getSalesSummary, 
  getShiftReports, 
  getTopProducts
} from '@/services/report.service';
import { getMyStores } from '@/services/inventory.service';

// Interface untuk tipe data Toko dari API
interface StoreData {
  id: string;
  name: string;
  address: string;
  is_active: boolean;
}

export default function DashboardPage() {
  const params = useParams();
  const router = useRouter();

  // 1. Ambil Store ID dari URL
  const storeId = params?.storeId as string;

  // 2. States
  const [stores, setStores] = useState<StoreData[]>([]);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [reportData, setReportData] = useState({
    summary: { total_transactions: 0, gross_sales: 0, total_collected: 0, total_unpaid: 0 },
    shifts: { total_shifts: 0, total_expected_cash: 0 },
    topProducts: [] as any[],
    recentTransactions: [] as any[],
    debtSummary: { unpaid_transaction_count: 0, total_outstanding_debt: 0 },
    dailySummary: { date: '-', gross_sales: 0 }
  });

  // 3. Fetch Daftar Toko (My Access)
  const fetchStoresList = useCallback(async () => {
    try {
      const res = await getMyStores();
      if (res.success) {
        setStores(res.data);
        
        // Auto-redirect jika masuk ke /dashboard tanpa ID toko
        if (!storeId && res.data.length > 0) {
          router.push(`/dashboard/${res.data[0].id}`);
        }
      }
    } catch (err) {
      console.error("Gagal load daftar toko:", err);
      setError("Gagal mengambil daftar akses toko.");
    }
  }, [storeId, router]);

  // 4. Fetch Laporan Berdasarkan Store & Tanggal
  const fetchDashboardReports = useCallback(async () => {
    if (!storeId) return;
    
    setLoading(true);
    try {
      const dateParams = { storeId, startDate, endDate };

      // Eksekusi paralel semua report
      const [salesRes, shiftRes, debtRes, topProdRes, summaryRes, dailyRes] = await Promise.all([
        getSalesReport({ storeId, startDate, endDate, limit: 5 }),
        getShiftReports({ storeId, startDate, endDate, limit: 1 }),
        getDebtSummary(storeId),
        getTopProducts({ storeId, startDate, endDate, limit: 5 }),
        getSalesSummary(dateParams),
        getDailySummary(storeId)
      ]);

      setReportData({
        recentTransactions: salesRes.data?.records || [],
        shifts: {
          total_shifts: shiftRes.data?.summary?.total_shifts || 0,
          total_expected_cash: shiftRes.data?.summary?.total_expected_cash || 0
        },
        debtSummary: {
          unpaid_transaction_count: debtRes.data?.unpaid_transaction_count || 0,
          total_outstanding_debt: debtRes.data?.total_outstanding_debt || 0
        },
        topProducts: topProdRes.data?.data || [],
        summary: {
          total_transactions: summaryRes.data?.total_transactions || 0,
          gross_sales: summaryRes.data?.gross_sales || 0,
          total_collected: summaryRes.data?.total_collected || 0,
          total_unpaid: summaryRes.data?.total_unpaid || 0
        },
        dailySummary: {
          date: dailyRes.data?.date || '-',
          gross_sales: dailyRes.data?.gross_sales || 0
        }
      });
    } catch (err) {
      console.error("Fetch Report Error:", err);
      setError("Gagal memuat laporan untuk periode ini.");
    } finally {
      setLoading(false);
    }
  }, [storeId, startDate, endDate]);

  // Life Cycle
  useEffect(() => { fetchStoresList(); }, [fetchStoresList]);
  useEffect(() => { fetchDashboardReports(); }, [fetchDashboardReports]);

  // UI Handlers
  const handleStoreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(`/dashboard/${e.target.value}`);
  };

  const activeStore = useMemo(() => stores.find(s => s.id === storeId), [stores, storeId]);

  return (
    <div className="space-y-8 p-4 md:p-8 bg-gray-50 min-h-screen text-gray-900">
      
      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100 flex flex-wrap gap-4 items-end justify-between">
        <div className="flex flex-wrap gap-4">
          {/* Dropdown Toko Dinamis */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest">Ganti Lokasi</label>
            <div className="relative">
              <Store className="absolute left-3 top-3 w-4 h-4 text-blue-500" />
              <select 
                value={storeId}
                onChange={handleStoreChange}
                className="pl-10 pr-10 py-2.5 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer min-w-[220px]"
              >
                {stores.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Filter Tanggal */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest">Periode Laporan</label>
            <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-transparent border-none text-xs font-bold focus:ring-0 cursor-pointer"
              />
              <span className="text-gray-300 font-bold">→</span>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-transparent border-none text-xs font-bold focus:ring-0 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <button 
          onClick={fetchDashboardReports}
          className="bg-slate-900 hover:bg-slate-800 text-white p-3 rounded-2xl transition-all active:scale-95"
        >
          <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-800">
            {activeStore ? activeStore.name : "Memuat Toko..."} 🚀
          </h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2 font-medium">
            <Calendar className="w-4 h-4 text-blue-500" /> 
            Data: <span className="text-slate-900 font-bold underline decoration-blue-200">{startDate} s/d {endDate}</span>
          </p>
        </div>
        <button className="flex items-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-[1.5rem] text-sm font-bold hover:shadow-xl hover:bg-blue-700 transition-all active:scale-95">
          <Plus className="w-5 h-5" /> Transaksi Baru
        </button>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Omzet', value: reportData.summary.gross_sales, color: 'blue', icon: <TrendingUp className="w-5 h-5"/>, trend: 'Total Bruto' },
          { label: 'Transaksi', value: reportData.summary.total_transactions, color: 'purple', icon: <ShoppingCart className="w-5 h-5"/>, trend: 'Nota Terbit' },
          { label: 'Piutang', value: reportData.debtSummary.total_outstanding_debt, color: 'orange', icon: <AlertTriangle className="w-5 h-5"/>, trend: 'Belum Lunas' },
          { label: 'Diterima', value: reportData.summary.total_collected, color: 'green', icon: <Wallet className="w-5 h-5"/>, trend: 'Kas Bersih' },
        ].map((s) => (
          <div key={s.label} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 group hover:border-blue-200 transition-colors">
            <div className="flex justify-between items-start">
              <div className={`p-4 rounded-2xl ${
                s.color === 'blue' ? 'bg-blue-50 text-blue-600' : 
                s.color === 'purple' ? 'bg-purple-50 text-purple-600' : 
                s.color === 'orange' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'
              }`}>
                {s.icon}
              </div>
              <span className="text-[10px] font-black px-2 py-1 rounded-lg bg-gray-50 text-gray-400 uppercase tracking-tighter">{s.trend}</span>
            </div>
            <div className="mt-5">
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">{s.label}</p>
              <p className="text-2xl font-black text-slate-900 mt-1">
                {typeof s.value === 'number' ? `Rp ${s.value.toLocaleString('id-ID')}` : s.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* TRANSAKSI TERBARU */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-500" /> Transaksi Terakhir
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-gray-400 text-[10px] uppercase font-black tracking-widest">
                  <th className="px-8 py-4">Waktu</th>
                  <th className="px-8 py-4">Pelanggan</th>
                  <th className="px-8 py-4 text-right">Total</th>
                  <th className="px-8 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {reportData.recentTransactions.map((trx, i) => (
                  <tr key={i} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-8 py-5">
                      <p className="text-sm font-bold text-slate-800">TRX-{i+1}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">{new Date(trx.createdAt).toLocaleTimeString('id-ID')}</p>
                    </td>
                    <td className="px-8 py-5 text-sm text-slate-600 font-bold">{trx.customer_name || 'Umum'}</td>
                    <td className="px-8 py-5 font-black text-slate-900 text-sm text-right">Rp {trx.totalAmount.toLocaleString()}</td>
                    <td className="px-8 py-5 text-center">
                      <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest ${
                        trx.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {trx.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* TOP PRODUCTS */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg text-slate-800 mb-8 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" /> Produk Terlaris
          </h3>
          <div className="space-y-6">
            {reportData.topProducts.map((p, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm ${
                  i === 0 ? 'bg-yellow-400 text-yellow-900' : 'bg-slate-100 text-slate-400'
                }`}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-800 line-clamp-1">{p.product_name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-blue-600 font-black uppercase bg-blue-50 px-1.5 py-0.5 rounded-md">{p.total_qty} Item</span>
                    <span className="text-[10px] text-gray-300 font-bold italic">Terjual</span>
                  </div>
                </div>
                <p className="text-xs font-black text-slate-900">Rp {p.total_sales?.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* INFO FOOTER */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Sistem Online: {activeStore?.address || 'Lokasi tidak diketahui'}
        </div>
        <div>Terakhir diperbarui: {new Date().toLocaleTimeString()}</div>
      </div>

    </div>
  );
}