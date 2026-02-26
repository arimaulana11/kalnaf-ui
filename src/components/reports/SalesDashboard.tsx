"use client"; // <--- Tambahkan ini di baris paling pertama
import React, { Dispatch, SetStateAction } from 'react';
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  User,
  Clock,
  Download
} from 'lucide-react';

// --- INTERFACES ---
interface Summary {
  revenue: number;
  transactions_count: number;
  average_per_order: number;
  total_void_amount: number;
  total_void_count: number;
}

interface PaymentMethod {
  method: string;
  total: number;
}

interface TopProduct {
  name: string;
  sold: number;
  revenue: number;
}

interface TransactionRecord {
  id: number;
  customer_name: string;
  total_amount: number;
  payment_status: 'PAID' | 'VOID' | string;
  payment_method: string;
  cashier: string;
  date: string;
  time: string;
}

interface Meta {
  total: number;
  page: number;
  lastPage: number;
  limit: number;
}

interface Filters {
  startDate: string;
  endDate: string;
  page: number;
  limit: number;
}

interface SalesReportResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    summary: Summary;
    payment_methods: PaymentMethod[];
    top_products: TopProduct[];
    records: TransactionRecord[];
    meta: Meta;
  };
}

interface SalesDashboardProps {
  reportData: SalesReportResponse;
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
}

// --- MAIN COMPONENT ---
const SalesDashboard: React.FC<SalesDashboardProps> = ({ reportData, filters, setFilters }) => {
  const { summary, payment_methods, top_products, records, meta } = reportData.data;

  // Handlers
  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'startDate' | 'endDate') => {
    setFilters(prev => ({
      ...prev,
      [field]: e.target.value,
      page: 1 // Reset ke halaman 1 setiap kali filter berubah
    }));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans transition-all">
      {/* 1. HEADER & FILTER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight italic">SALES REPORT</h1>
          <p className="text-sm text-gray-500 font-medium">Monitoring performa toko Anda hari ini</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <div className="flex items-center bg-white border rounded-lg shadow-sm px-2 focus-within:ring-2 focus-within:ring-blue-500">
            <span className="text-[10px] font-bold text-gray-400 px-1 uppercase">From</span>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleDateChange(e, 'startDate')}
              className="py-2 text-sm outline-none border-none bg-transparent"
            />
          </div>
          <div className="flex items-center bg-white border rounded-lg shadow-sm px-2 focus-within:ring-2 focus-within:ring-blue-500">
            <span className="text-[10px] font-bold text-gray-400 px-1 uppercase">To</span>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleDateChange(e, 'endDate')}
              className="py-2 text-sm outline-none border-none bg-transparent"
            />
          </div>
          <button
            onClick={() => alert('Fitur Export CSV sedang dalam pengembangan.')}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition active:scale-95 shadow-md">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* 2. SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Revenue"
          value={`Rp ${summary.revenue.toLocaleString('id-ID')}`}
          icon={<DollarSign size={20} className="text-green-600" />}
          color="bg-green-100"
        />
        <StatCard
          title="Transactions"
          value={summary.transactions_count.toString()}
          icon={<ShoppingCart size={20} className="text-blue-600" />}
          color="bg-blue-100"
        />
        <StatCard
          title="Avg Order"
          value={`Rp ${summary.average_per_order.toLocaleString('id-ID')}`}
          icon={<TrendingUp size={20} className="text-purple-600" />}
          color="bg-purple-100"
        />
        <StatCard
          title="Total Void"
          value={`Rp ${summary.total_void_amount.toLocaleString('id-ID')}`}
          subtitle={`${summary.total_void_count} transaksi dibatalkan`}
          icon={<AlertCircle size={20} className="text-red-600" />}
          color="bg-red-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* 3. TOP PRODUCTS */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="font-black text-gray-700 mb-6 uppercase tracking-wider text-sm">Produk Terlaris</h3>
          <div className="space-y-6">
            {top_products.map((product, index) => (
              <div key={index} className="group">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-colors">{product.name}</span>
                  <span className="text-xs font-bold text-gray-400">{product.sold} terjual</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-400 h-3 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${(product.revenue / (summary.revenue || 1)) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-black text-gray-800 min-w-[100px] text-right">
                    Rp {product.revenue.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. PAYMENT METHODS */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-black text-gray-700 mb-6 uppercase tracking-wider text-sm">Metode Bayar</h3>
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-40 h-40 rounded-full border-[12px] border-blue-500 flex items-center justify-center mb-8 shadow-inner">
              <div className="text-center">
                <span className="block text-2xl font-black text-blue-600">100%</span>
                <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest leading-none">Cash Only</span>
              </div>
            </div>
            <div className="w-full space-y-2">
              {payment_methods.map((pm, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition-colors">
                  <span className="text-xs font-bold text-gray-600 uppercase">{pm.method}</span>
                  <span className="text-sm font-black text-gray-800 text-blue-600">Rp {pm.total.toLocaleString('id-ID')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5. TRANSACTION TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-50 flex justify-between items-center bg-white">
          <h3 className="font-black text-gray-700 uppercase tracking-wider text-sm">Riwayat Transaksi</h3>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Real-time Data</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-400 text-[10px] uppercase font-black tracking-[0.2em] border-b bg-gray-50/50">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4 text-right">Total</th>
                <th className="px-6 py-4 text-right italic">Waktu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {records.map((row) => (
                <tr key={row.id} className={`group hover:bg-blue-50/50 transition-all ${row.payment_status === 'VOID' ? 'bg-red-50/30' : ''}`}>
                  <td className="px-6 py-4 text-sm font-black text-gray-400 group-hover:text-blue-600">#{row.id}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-block px-3 py-1 rounded-lg text-[9px] font-black tracking-widest uppercase ${row.payment_status === 'PAID' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                      {row.payment_status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200 uppercase font-bold text-xs">
                        {row.customer_name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-700 uppercase">{row.customer_name}</p>
                        <p className="text-[10px] text-gray-400 font-medium tracking-tight">Metode: {row.payment_method}</p>
                      </div>
                    </div>
                  </td>
                  <td className={`px-6 py-4 text-sm font-black text-right ${row.payment_status === 'VOID' ? 'text-gray-300 line-through' : 'text-gray-800'}`}>
                    Rp {row.total_amount.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4 text-[11px] text-gray-400 text-right font-bold italic tracking-tighter">
                    {row.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
          <p className="font-bold">TOTAL <span className="text-blue-600">{meta.total}</span> TRANSAKSI</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handlePageChange(filters.page - 1)}
              className="p-2 border bg-white rounded-xl hover:bg-gray-50 disabled:opacity-20 disabled:scale-95 transition shadow-sm"
              disabled={meta.page === 1}
            >
              <ChevronLeft size={16} />
            </button>
            <div className="text-[11px] font-black text-gray-700 tracking-widest">
              PAGE {meta.page} / {meta.lastPage}
            </div>
            <button
              onClick={() => handlePageChange(filters.page + 1)}
              className="p-2 border bg-white rounded-xl hover:bg-gray-50 disabled:opacity-20 disabled:scale-95 transition shadow-sm"
              disabled={meta.page === meta.lastPage}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENT ---
interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, subtitle }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
    <div className="flex-1">
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-2">{title}</p>
      <h3 className="text-xl font-black text-gray-800 tracking-tighter">{value}</h3>
      {subtitle && <p className="text-[9px] text-red-500 mt-2 font-black uppercase tracking-tighter bg-red-50 px-2 py-0.5 rounded-md inline-block">{subtitle}</p>}
    </div>
    <div className={`p-4 rounded-2xl transition-all duration-500 group-hover:rotate-12 ${color} shadow-inner`}>
      {icon}
    </div>
  </div>
);

export default SalesDashboard;