"use client";
import { useState, useEffect } from 'react';
import { Eye, ArrowLeft, Download, AlertCircle, TrendingUp, TrendingDown, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { getStockOpnameHistory } from '@/services/inventory.service';

// Interface
interface MismatchDetails {
  shortages: number;
  overages: number;
}

interface AuditLog {
  id: string;
  date: string;
  auditor: string;
  items: number;
  mismatches: number;
  mismatchDetails: MismatchDetails;
  status: string;
}

export default function OpnameHistoryPage() {
  const [historyData, setHistoryData] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // --- State Pagination ---
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const fetchHistory = async (page: number) => {
    try {
      setLoading(true);
      const response = await getStockOpnameHistory({ page, limit });

      if (response.success) {
        setHistoryData(response.data.data);
        setTotalPages(response.data.meta.totalPages);
        setCurrentPage(response.data.meta.currentPage);
      }
    } catch (err) {
      setError("Gagal mengambil data history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(currentPage);
  }, [currentPage]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <Link href="/inventory/stock-opname" className="flex items-center gap-2 text-gray-500 hover:text-black font-bold italic text-xs uppercase tracking-widest transition-all">
          <ArrowLeft size={16} /> Back to Audit
        </Link>
        <h1 className="text-2xl font-black italic uppercase tracking-tighter text-gray-800">Audit Logs</h1>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center text-gray-400 gap-4">
            <Loader2 className="animate-spin" size={40} />
            <p className="font-bold italic uppercase text-[10px] tracking-widest">Loading History...</p>
          </div>
        ) : error ? (
          <div className="p-20 flex flex-col items-center justify-center text-red-500 gap-4">
            <AlertCircle size={40} />
            <p className="font-bold italic uppercase text-[10px] tracking-widest">{error}</p>
          </div>
        ) : (
          <>
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">ID / Date</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Auditor</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Summary</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {historyData.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/50 transition-all group">
                    <td className="p-6">
                      <div className="font-black text-gray-800 italic group-hover:text-blue-600 transition-colors">{log.id}</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{log.date}</div>
                    </td>
                    <td className="p-6">
                      <div className="font-bold text-gray-600 text-sm">{log.auditor}</div>
                      <div className="text-[9px] font-black text-green-500 uppercase tracking-widest">{log.status}</div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-[10px] font-black px-3 py-1 bg-gray-100 rounded-full text-gray-500 border border-gray-200 uppercase">
                          {log.items} Items
                        </span>
                        {log.mismatchDetails.overages > 0 && (
                          <span className="flex items-center gap-1 text-[10px] font-black px-3 py-1 bg-green-50 text-green-600 rounded-full border border-green-100">
                            <TrendingUp size={12} /> {log.mismatchDetails.overages}
                          </span>
                        )}
                        {log.mismatchDetails.shortages > 0 && (
                          <span className="flex items-center gap-1 text-[10px] font-black px-3 py-1 bg-red-50 text-red-600 rounded-full border border-red-100">
                            <TrendingDown size={12} /> {log.mismatchDetails.shortages}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-1">
                        <Link href={`/inventory/stock-opname/history/${log.id}`}>
                          <button className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-all active:scale-95">
                            <Eye size={18} />
                          </button>
                        </Link>
                        <button className="p-3 text-gray-400 hover:bg-gray-100 rounded-xl transition-all active:scale-95">
                          <Download size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* --- Pagination Controls --- */}
            <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
              <p className="text-[10px] font-black text-gray-400 italic uppercase tracking-widest">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1 || loading}
                  className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || loading}
                  className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}