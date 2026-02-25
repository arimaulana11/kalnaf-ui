import React, { useState } from 'react';
import { Clock, Banknote, FileText, XCircle, Loader2 } from 'lucide-react';

export const ActiveShiftDetail = ({ 
  data, 
  onClose, 
  isLoading 
}: { 
  data: any, 
  onClose: (cash: number, note: string) => void,
  isLoading?: boolean 
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const [actualCash, setActualCash] = useState<string>('');
  const [note, setNote] = useState('');

  // Format Mata Uang
  const formatIDR = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(val);

  if (isClosing) {
    return (
      <div className="bg-white rounded-[2.5rem] p-10 border-2 border-orange-500 shadow-2xl max-w-2xl mx-auto">
        <h2 className="text-2xl font-black text-slate-900 uppercase italic mb-2">Rekonsiliasi Kas</h2>
        <p className="text-slate-500 text-sm mb-8 font-medium">Hitung total uang fisik di laci saat ini.</p>
        
        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Total Uang Fisik</label>
            <input 
              type="number" 
              className="w-full p-5 bg-slate-50 rounded-2xl text-2xl font-black focus:ring-4 focus:ring-orange-500/10 outline-none border-none"
              placeholder="0"
              value={actualCash}
              onChange={(e) => setActualCash(e.target.value)}
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Catatan Akhir Shift</label>
            <textarea 
              className="w-full p-5 bg-slate-50 rounded-2xl text-sm font-medium border-none outline-none focus:ring-4 focus:ring-orange-500/10"
              rows={3}
              placeholder="Contoh: Selisih Rp 2.000 karena tidak ada kembalian"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          
          <div className="flex gap-4 pt-4">
            <button className="flex-1 font-bold text-slate-400" onClick={() => setIsClosing(false)}>Batal</button>
            <button 
              disabled={isLoading || !actualCash}
              className="flex-[2] bg-orange-600 text-white p-5 rounded-2xl font-black uppercase tracking-widest hover:bg-orange-700 disabled:bg-slate-200 transition-all flex justify-center items-center gap-2"
              onClick={() => onClose(Number(actualCash), note)}
            >
              {isLoading && <Loader2 className="animate-spin" />}
              Konfirmasi Tutup Shift
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* CARD INFO */}
      <div className="md:col-span-2 space-y-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="bg-green-100 text-green-600 p-4 rounded-2xl"><Clock size={32} /></div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Waktu Mulai</p>
              <h3 className="text-xl font-black text-slate-800">{new Date(data?.startTime).toLocaleTimeString()}</h3>
            </div>
          </div>
          <div className="text-right">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID Shift</p>
             <code className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{data?.id?.split('-')[0]}</code>
          </div>
        </div>

        <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-2xl shadow-slate-300 relative overflow-hidden">
          <Banknote className="absolute -right-10 -bottom-10 text-white/5 w-64 h-64" />
          <p className="text-xs font-bold text-white/50 uppercase tracking-[0.2em] mb-2">Saldo Sistem Saat Ini</p>
          <h2 className="text-5xl font-black tracking-tighter italic">
            {formatIDR(data?.startingCash || 0)}
          </h2>
        </div>
      </div>

      {/* SIDEBAR ACTIONS */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-2xl">
             <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Kasir Bertugas</p>
             <p className="font-bold text-slate-700">Staff Mode</p>
          </div>
        </div>
        
        <button 
          onClick={() => setIsClosing(true)}
          className="w-full mt-8 bg-red-50 text-red-600 p-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white transition-all group"
        >
          <XCircle size={20} className="group-hover:rotate-90 transition-transform" />
          Akhiri Shift
        </button>
      </div>
    </div>
  );
};