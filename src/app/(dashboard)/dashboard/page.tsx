import React, { useMemo } from 'react';
import { 
  ArrowUpRight, ShoppingCart, Package, AlertTriangle, 
  Clock, Trash2, Trophy, TrendingUp, Plus, ArrowRight,
  ChevronRight, Calendar
} from 'lucide-react';

export default function DashboardPage() {
  // --- LOGIKA RANGE TANGGAL DINAMIS ---
  const dateRangeText = useMemo(() => {
    const now = new Date();
    
    // Cari hari Senin minggu ini
    const first = now.getDate() - (now.getDay() === 0 ? 6 : now.getDay() - 1);
    const last = first + 6;

    const startDate = new Date(now.setDate(first)).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
    const endDate = new Date(now.setDate(last)).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    
    return `${startDate} - ${endDate}`;
  }, []);

  // 1. Data Dummy Grafik Harian (Sinkron dengan trend 7 hari)
  const weeklySales = [
    { day: 'Sen', amount: 1200000, height: '40%' },
    { day: 'Sel', amount: 2100000, height: '70%' },
    { day: 'Rab', amount: 1800000, height: '60%' },
    { day: 'Kam', amount: 2450000, height: '85%' },
    { day: 'Jum', amount: 3000000, height: '100%' },
    { day: 'Sab', amount: 2800000, height: '90%' },
    { day: 'Min', amount: 1500000, height: '50%' },
  ];

  // 2. Main Stats (Data Ringkasan)
  const stats = [
    { label: 'Penjualan Hari Ini', value: 'Rp 2.450.000', trend: '+12.5%', icon: <ShoppingCart className="w-5 h-5" />, color: 'blue' },
    { label: 'Total Transaksi', value: '12', trend: '+2', icon: <ArrowUpRight className="w-5 h-5" />, color: 'purple' },
    { label: 'Stok Menipis', value: '5 Item', trend: 'Cek Segera', icon: <AlertTriangle className="w-5 h-5" />, color: 'orange' },
    { label: 'Waste/Expired', value: 'Rp 125.000', trend: 'Bulan Ini', icon: <Trash2 className="w-5 h-5" />, color: 'red' },
  ];

  // 3. Transaksi Terakhir (Data Aktivitas)
  const recentTransactions = [
    { id: 'TRX-9901', customer: 'Budi Santoso', total: 'Rp 450.000', status: 'Selesai', time: '10:30' },
    { id: 'TRX-9902', customer: 'Siti Aminah', total: 'Rp 120.000', status: 'Hutang', time: '11:15' },
    { id: 'TRX-9903', customer: 'Umum', total: 'Rp 85.000', status: 'Selesai', time: '12:00' },
    { id: 'TRX-9904', customer: 'Rudi Wijaya', total: 'Rp 1.200.000', status: 'Selesai', time: '14:45' },
  ];

  return (
    <div className="space-y-8 p-4 md:p-8 bg-gray-50 min-h-screen font-sans text-gray-900">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Halo, Selamat Datang! 👋</h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-500" /> 
            Laporan performa toko Minggu ini ({dateRangeText})
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95">
            <Plus className="w-4 h-4" /> Transaksi Baru
          </button>
        </div>
      </div>

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all group cursor-default">
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-2xl bg-${s.color}-50 text-${s.color}-600 group-hover:scale-110 transition-transform`}>
                {s.icon}
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-lg bg-${s.color === 'red' ? 'red' : 'green'}-50 text-${s.color === 'red' ? 'red' : 'green'}-600`}>
                {s.trend}
              </span>
            </div>
            <div className="mt-5">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{s.label}</p>
              <p className="text-2xl font-black text-gray-900 mt-1">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* --- MIDDLE SECTION: CHART & LEADERBOARD --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* GRAFIK PENJUALAN */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                Tren Penjualan Mingguan
              </h3>
              <p className="text-xs text-gray-400 italic">Data diupdate otomatis setiap transaksi selesai</p>
            </div>
            <select className="text-xs border-none bg-gray-100 rounded-xl p-2.5 font-bold outline-none ring-0 cursor-pointer hover:bg-gray-200 transition-colors">
              <option>7 Hari Terakhir</option>
              <option>30 Hari Terakhir</option>
            </select>
          </div>
          
          <div className="flex items-end justify-between h-56 gap-3 pt-4">
            {weeklySales.map((data) => (
              <div key={data.day} className="flex-1 flex flex-col items-center group">
                <div className="relative w-full flex justify-center">
                  <div 
                    style={{ height: data.height }} 
                    className="w-full max-w-[45px] bg-blue-500/10 group-hover:bg-blue-600 rounded-t-xl transition-all duration-500 relative"
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl z-10">
                      Rp {data.amount.toLocaleString()}
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-extrabold text-gray-400 mt-4 group-hover:text-gray-900">{data.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* PELANGGAN TERLOYAL */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg text-gray-900 mb-8 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Top Pelanggan
          </h3>
          <div className="space-y-6">
            {[
              { name: 'Budi Santoso', trx: 42, total: 'Rp 8.4jt', rank: 1, img: 'BS' },
              { name: 'Siti Aminah', trx: 31, total: 'Rp 5.2jt', rank: 2, img: 'SA' },
              { name: 'Rudi Wijaya', trx: 15, total: 'Rp 2.1jt', rank: 3, img: 'RW' },
            ].map((c) => (
              <div key={c.rank} className="flex items-center gap-4 group cursor-pointer">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs shadow-sm transition-all ${
                  c.rank === 1 ? 'bg-yellow-500 text-white scale-110 shadow-yellow-100' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                }`}>
                  {c.img}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-800">{c.name}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{c.trx} Transaksi</p>
                </div>
                <p className="text-sm font-black text-gray-900">{c.total}</p>
              </div>
            ))}
          </div>
          <button className="w-full mt-10 py-4 bg-blue-50/50 text-blue-600 rounded-2xl font-bold text-xs hover:bg-blue-50 transition-all flex items-center justify-center gap-2 active:scale-95">
            Lihat Ranking Semua <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* --- BOTTOM SECTION: ACTIVITIES & RISKS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* TABEL AKTIVITAS TERAKHIR */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-500" />
              Aktivitas Terakhir
            </h3>
            <button className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-xl transition-colors active:scale-95">
              Lihat Log
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-widest font-black">
                  <th className="px-8 py-4">ID Transaksi</th>
                  <th className="px-8 py-4">Pelanggan</th>
                  <th className="px-8 py-4">Total</th>
                  <th className="px-8 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentTransactions.map((trx) => (
                  <tr key={trx.id} className="hover:bg-gray-50/30 transition-colors group cursor-default">
                    <td className="px-8 py-5">
                      <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{trx.id}</p>
                      <p className="text-[10px] text-gray-400 font-medium">{trx.time} WIB</p>
                    </td>
                    <td className="px-8 py-5 text-sm text-gray-600 font-medium">{trx.customer}</td>
                    <td className="px-8 py-5 font-black text-gray-900 text-sm">{trx.total}</td>
                    <td className="px-8 py-5 text-center">
                      <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-wider ${
                        trx.status === 'Selesai' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                      }`}>
                        {trx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* MONITORING RISIKO */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
          <h3 className="font-bold text-lg text-gray-900 mb-8 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Monitoring Risiko
          </h3>
          <div className="space-y-4">
            {[
              { name: 'Roti Gandum Z', status: 'Segera Expired', color: 'red', info: '3 Hari lagi' },
              { name: 'Kopi Kapal Api', status: 'Stok Habis', color: 'orange', info: 'Segera PO' },
              { name: 'Susu UHT 1L', status: 'Sering Rusak', color: 'red', info: 'Cek Rak' },
            ].map((item, i) => (
              <div key={i} className={`p-5 rounded-3xl bg-${item.color}-50/50 border border-${item.color}-100 group cursor-pointer hover:bg-${item.color}-50 transition-all active:scale-95`}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className={`text-sm font-black text-${item.color}-900`}>{item.name}</p>
                    <p className={`text-[10px] text-${item.color}-600 font-bold uppercase tracking-widest mt-0.5`}>{item.status}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[9px] font-black bg-white px-2 py-1 rounded-lg text-${item.color}-700 shadow-sm border border-${item.color}-100`}>
                      {item.info}
                    </span>
                    <ChevronRight className={`w-4 h-4 text-${item.color}-400 group-hover:translate-x-1 transition-transform`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* WASTE CARD */}
          <div className="mt-8 p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-[2rem] text-white shadow-xl shadow-gray-200">
            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Total Kerugian Waste</p>
            <div className="flex items-end gap-2">
               <span className="text-2xl font-black">Rp 450.000</span>
               <span className="text-[10px] text-red-400 font-bold mb-1 tracking-tighter">+5% vs Bln Lalu</span>
            </div>
            <div className="mt-4 h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
              <div className="bg-red-500 h-full w-[65%] rounded-full"></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}