import React, { Dispatch, SetStateAction } from 'react';
import { User, Clock, Wallet, AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

interface ShiftRecord {
  id: string;
  cashier_name: string;
  start_time: string;
  end_time: string | null;
  status: 'OPEN' | 'CLOSED';
  starting_cash: number;
  expected_cash: number;
  actual_cash: number;
  difference: number;
}

interface ShiftDashboardProps {
  reportData: {
    data: {
      records: ShiftRecord[];
      summary: any;
      meta: any;
    }
  };
  filters: any;
  setFilters: Dispatch<SetStateAction<any>>;
}

const ShiftDashboard: React.FC<ShiftDashboardProps> = ({ reportData, filters, setFilters }) => {
  const { records, meta, summary } = reportData.data;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-800 italic uppercase">SHIFT AUDIT REPORT</h1>
        <p className="text-sm text-gray-500 font-medium">Rekonsiliasi kas dan performa shift kasir</p>
      </div>

      {/* SUMMARY MINI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Total Selisih (Loss/Gain)</p>
                <h3 className={`text-xl font-black ${summary.total_difference < 0 ? 'text-red-500' : 'text-green-500'}`}>
                    Rp {summary.total_difference.toLocaleString('id-ID')}
                </h3>
            </div>
            <AlertTriangle className={summary.total_difference < 0 ? 'text-red-500' : 'text-green-500'} />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b">
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Kasir / Shift ID</th>
                <th className="px-6 py-4 text-right">Modal Awal</th>
                <th className="px-6 py-4 text-right">Seharusnya</th>
                <th className="px-6 py-4 text-right">Aktual (Cash)</th>
                <th className="px-6 py-4 text-right">Selisih</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {records.map((shift) => (
                <tr key={shift.id} className="hover:bg-blue-50/50 transition-all">
                  <td className="px-6 py-4">
                    {shift.status === 'OPEN' ? (
                      <span className="flex items-center gap-1 text-blue-600 font-black text-[10px] bg-blue-50 px-2 py-1 rounded-full w-fit">
                        <Clock size={12} className="animate-spin-slow" /> OPEN
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-green-600 font-black text-[10px] bg-green-50 px-2 py-1 rounded-full w-fit">
                        <CheckCircle2 size={12} /> CLOSED
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-800 uppercase">{shift.cashier_name}</p>
                    <p className="text-[10px] text-gray-400 font-mono italic">{shift.id}</p>
                  </td>
                  <td className="px-6 py-4 text-right font-medium">Rp {shift.starting_cash.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4 text-right font-medium">Rp {shift.expected_cash.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4 text-right font-bold text-blue-600">Rp {shift.actual_cash.toLocaleString('id-ID')}</td>
                  <td className={`px-6 py-4 text-right font-black ${
                    shift.difference < 0 ? 'text-red-600 bg-red-50' : 
                    shift.difference > 0 ? 'text-green-600 bg-green-50' : 'text-gray-400'
                  }`}>
                    {shift.difference === 0 ? '-' : `Rp ${shift.difference.toLocaleString('id-ID')}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* PAGINATION (Gunakan logic yang sama dengan Sales Dashboard) */}
    </div>
  );
};

export default ShiftDashboard;