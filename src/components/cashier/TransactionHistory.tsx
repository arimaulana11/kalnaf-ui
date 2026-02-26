'use client';

import React, { useState, useEffect } from 'react';
import {
  Search, Printer, RotateCcw,
  ArrowLeft, AlertCircle, Loader2,
  ChevronLeft, ChevronRight, ShoppingBag
} from 'lucide-react';
import { getTransactionDetail, getTransactionHistory, voidTransaction } from '@/services/cashier.service';
import { TransactionSummary } from '@/types/transactions';
import { Receipt } from 'components/cashier/Receipt';

export const TransactionHistory = () => {
  // --- STATES ---
  const [transactions, setTransactions] = useState<TransactionSummary[]>([]);
  const [selectedTx, setSelectedTx] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, lastPage: 1 });

  // --- LOGIKA PRINT ---
  const handlePrint = () => {
    const printContent = document.getElementById('receipt-print');
    if (!printContent) return;

    const windowPrint = window.open('', '', 'width=450,height=600');
    if (windowPrint) {
      windowPrint.document.write(`
        <html>
          <head>
            <title>Print Receipt - ${selectedTx?.id}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              @page { size: 48mm auto; margin: 0; }
              body { margin: 0; padding: 0; background: white; }
              #receipt-print { width: 48mm; margin: 0 auto; }
              * { -webkit-print-color-adjust: exact; }
            </style>
          </head>
          <body>
            ${printContent.outerHTML}
            <script>
              setTimeout(() => {
                window.print();
                window.close();
              }, 500);
            </script>
          </body>
        </html>
      `);
      windowPrint.document.close();
    }
  };

  // --- 1. FETCH HISTORY ---
  const fetchHistory = async (page: number = 1) => {
    try {
      setLoading(true);
      const res = await getTransactionHistory({ search: searchTerm, page: page });
      const finalArray = res?.data?.data?.data || res?.data?.data || res?.data || [];
      const pagination = res?.data?.data?.meta || res?.data?.meta || { total: 0, lastPage: 1 };

      setTransactions(Array.isArray(finalArray) ? [...finalArray] : []);
      setMeta({
        total: pagination.total ?? 0,
        lastPage: pagination.lastPage ?? pagination.totalPages ?? 1
      });
      setCurrentPage(page);
    } catch (err) {
      console.error("Gagal ambil history:", err);
      setTransactions([]);
      setMeta({ total: 0, lastPage: 1 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => { fetchHistory(1); }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // --- 2. FETCH DETAIL ---
  const handleSelectTx = async (db_id: number) => {
    try {
      setDetailLoading(true);
      const res = await getTransactionDetail(db_id);
      const detailData = res?.data?.data || res?.data;
      if (detailData) setSelectedTx(detailData);
    } catch (err) {
      console.error("Gagal memuat detail:", err);
    } finally {
      setDetailLoading(false);
    }
  };

  // --- 3. VOID TRANSACTION ---
  const handleVoid = async () => {
    if (!selectedTx) return;

    // 1. Minta alasan void
    const reason = window.prompt("Alasan pembatalan (Void):");
    if (!reason) return; // Jika batal mengisi alasan

    // 2. Konfirmasi terakhir
    if (window.confirm(`Apakah Anda yakin ingin me-void transaksi ${selectedTx.id}?`)) {
      try {
        setDetailLoading(true); // Tampilkan loader pada panel detail

        // 3. Panggil API Void
        await voidTransaction(selectedTx.db_id, reason);

        // 4. REFRESH LIST: Ambil ulang daftar transaksi (History)
        await fetchHistory(currentPage);

        // 5. REFRESH DETAIL: Ambil ulang detail transaksi yang baru saja di-void
        // Ini supaya status di panel kanan langsung berubah jadi 'VOID' dan tombol void hilang
        await handleSelectTx(selectedTx.db_id);

        // Opsional: Jika ingin otomatis menutup panel setelah void, gunakan:
        // setSelectedTx(null); 

      } catch (err: any) {
        alert(err.response?.data?.message || "Gagal melakukan void");
      } finally {
        setDetailLoading(false);
      }
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PAID': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'DEBT': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'VOID': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] p-4 gap-4 font-sans text-slate-900">

      {/* --- HIDDEN RECEIPT COMPONENT FOR PRINTING --- */}
      <div className="hidden">
        {selectedTx && (
          <Receipt
            cart={(selectedTx.items || selectedTx.items_detail || selectedTx.details || []).map((item: any) => ({
              id: item.id || Math.random(),
              name: item.name || item.product_name || item.product?.name || "Item",
              price: item.price || item.unit_price || 0,
              quantity: item.quantity || item.qty || 0,
              total: item.total || 0
            }))}
            subtotal={selectedTx.pricing?.subtotal || selectedTx.subtotal || 0}
            discountAmount={selectedTx.pricing?.discount_amount || 0}
            discountPercent={selectedTx.pricing?.discount_percentage || 0}
            taxAmount={selectedTx.pricing?.tax_amount || selectedTx.tax_amount || 0}
            grandTotal={selectedTx.pricing?.grand_total || selectedTx.total || 0}
            paymentMethod={selectedTx.payment_method || 'CASH'}
            cashAmount={selectedTx.cash_amount || 0}
            changeAmount={selectedTx.change_amount || 0}
            customerName={selectedTx.customer_name || selectedTx.customer || ''}
            customerPhone=""
          />
        )}
      </div>

      {/* --- LIST KIRI --- */}
      <div className="flex-1 bg-white rounded-[2rem] shadow-sm border border-slate-200 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-xl font-black uppercase mb-6 text-slate-800 tracking-tight">
            History <span className="text-blue-600">Transactions</span>
          </h1>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by ID or customer..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/5 transition-all text-sm font-medium"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-400">
              <Loader2 className="animate-spin text-blue-500" size={32} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Synchronizing...</span>
            </div>
          ) : transactions.length > 0 ? (
            <table className="w-full text-left border-separate border-spacing-0">
              <tbody className="divide-y divide-slate-100">
                {transactions.map((tx) => (
                  <tr
                    key={tx.db_id}
                    onClick={() => handleSelectTx(tx.db_id)}
                    className={`hover:bg-blue-50/40 transition-all cursor-pointer group ${selectedTx?.db_id === tx.db_id ? 'bg-blue-50/60' : ''}`}
                  >
                    <td className="px-6 py-5">
                      <p className="text-sm font-black text-slate-800">{tx.id}</p>
                      <span className="text-[10px] font-bold text-slate-400 uppercase italic">
                        {tx.time} • {tx.items || 0} Items
                      </span>
                    </td>
                    <td className="px-6 py-5 font-bold text-slate-600 text-sm">
                      {tx.customer}
                    </td>
                    <td className="px-6 py-5 text-right font-black text-sm text-slate-900">
                      Rp {(tx.total || 0).toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`px-3 py-1.5 rounded-full text-[9px] font-black border transition-colors ${getStatusStyle(tx.status)}`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-300">
              <AlertCircle size={48} strokeWidth={1} className="mb-4 opacity-20" />
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">No Data Found</p>
            </div>
          )}
        </div>

        {/* --- PAGINATION --- */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
            Total Record: {meta.total}
          </span>
          <div className="flex gap-2 items-center">
            <button
              disabled={currentPage === 1 || loading}
              onClick={() => fetchHistory(currentPage - 1)}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="px-4 py-2 bg-blue-600 rounded-xl text-white text-[10px] font-black shadow-md">
              {currentPage} / {meta.lastPage}
            </div>
            <button
              disabled={currentPage === meta.lastPage || loading}
              onClick={() => fetchHistory(currentPage + 1)}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* --- PANEL KANAN --- */}
      <div className="w-[420px] bg-white rounded-[2rem] shadow-sm border border-slate-200 flex flex-col overflow-hidden relative">
        {detailLoading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-50 flex items-center justify-center">
            <Loader2 className="animate-spin text-blue-600" size={32} />
          </div>
        )}

        {selectedTx ? (
          <>
            <div className="p-6 bg-slate-50/50 border-b border-slate-100">
              <div className="flex justify-between mb-6">
                <button
                  onClick={() => setSelectedTx(null)}
                  className="p-2 text-slate-400 hover:bg-white rounded-xl transition-all"
                >
                  <ArrowLeft size={20} />
                </button>
                <button
                  onClick={handlePrint}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-transform active:scale-95"
                >
                  <Printer size={14} /> Print Receipt
                </button>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">{selectedTx.id}</h2>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] font-black text-slate-400 uppercase">Cashier:</span>
                <span className="text-[10px] font-black text-blue-600 uppercase italic">
                  {selectedTx.cashier_name || selectedTx.cashier || 'System'}
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {/* ITEM LIST */}
              <div className="space-y-4 mb-8">
                {(selectedTx.items || selectedTx.items_detail || selectedTx.details || []).map((item: any, i: number) => (
                  <div key={i} className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <p className="text-xs font-black text-slate-800 uppercase leading-tight">
                        {item.name || item.product_name || item.product?.name || "Unknown Item"}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">
                        Qty: <span className="text-slate-600">{item.quantity || item.qty || 0}</span>
                      </p>
                    </div>
                    <p className="text-xs font-black text-slate-900">
                      Rp {(item.total || (item.price * item.quantity) || 0).toLocaleString('id-ID')}
                    </p>
                  </div>
                ))}
              </div>

              {/* PAYMENT SUMMARY SECTION */}
              <div className="space-y-3 bg-slate-50/80 p-5 rounded-[1.5rem] border border-slate-100">
                <div className="flex items-center gap-2 mb-2">
                  <ShoppingBag size={14} className="text-blue-500" />
                  <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Order Summary</span>
                </div>

                <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase">
                  <span>Subtotal</span>
                  <span className="text-slate-900 font-black">
                    Rp {(selectedTx.pricing?.subtotal || selectedTx.subtotal || 0).toLocaleString('id-ID')}
                  </span>
                </div>

                {(selectedTx.pricing?.tax_amount > 0 || selectedTx.tax_amount > 0) && (
                  <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase">
                    <span>Tax ({selectedTx.pricing?.tax_percentage || selectedTx.tax_percentage || 0}%)</span>
                    <span className="text-rose-500 font-black">
                      + Rp {(selectedTx.pricing?.tax_amount || selectedTx.tax_amount || 0).toLocaleString('id-ID')}
                    </span>
                  </div>
                )}

                <div className="pt-3 mt-1 border-t border-slate-200 flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">Total Amount</span>
                    <span className="text-xs text-slate-400 font-bold italic uppercase leading-none">Including Taxes</span>
                  </div>
                  <span className="text-xl font-black text-slate-900 tracking-tight">
                    Rp {(selectedTx.pricing?.grand_total || selectedTx.grand_total || selectedTx.total || 0).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>

            {/* VOID BUTTON */}
            {selectedTx.status !== 'VOID' && (
              <div className="p-6 bg-white border-t border-slate-100">
                <button
                  onClick={handleVoid}
                  className="w-full py-4 bg-white border-2 border-rose-100 hover:border-rose-500 hover:bg-rose-50 text-rose-500 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-sm group"
                >
                  <RotateCcw size={16} className="group-hover:rotate-180 transition-all duration-500" />
                  Void Transaction
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-300">
            <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-6 border border-slate-100">
              <AlertCircle size={40} strokeWidth={1} />
            </div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-800">No Selection</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-3 leading-relaxed max-w-[200px]">
              Tap a transaction to see the complete invoice details
            </p>
          </div>
        )}
      </div>
    </div>
  );
};