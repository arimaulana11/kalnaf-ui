"use client";
import { useState, useEffect } from 'react';
import { ArrowLeft, Package, AlertCircle, Loader2, Calendar, Store, User, Hash } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getStockOpnameDetail } from '@/services/inventory.service';

interface OpnameDetail {
  logId: number;
  productName: string;
  variantName: string;
  sku: string;
  qtyChange: number;
  notes: string;
}

interface OpnameHeader {
  referenceId: string;
  date: string;
  storeName: string;
  totalItems: number;
  details: OpnameDetail[];
}

export default function OpnameDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [data, setData] = useState<OpnameHeader | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const response = await getStockOpnameDetail(id);
        if (response.success) {
          setData(response.data);
        }
      } catch (err) {
        setError("Gagal memuat detail audit");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetail();
  }, [id]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50 flex-col gap-4">
      <Loader2 className="animate-spin text-blue-600" size={40} />
      <p className="font-black italic uppercase text-xs tracking-widest text-gray-400">Fetching Audit Details...</p>
    </div>
  );

  if (error || !data) return (
    <div className="flex h-screen items-center justify-center bg-gray-50 flex-col gap-4">
      <AlertCircle className="text-red-500" size={40} />
      <p className="font-black italic uppercase text-xs tracking-widest text-red-500">{error || "Data not found"}</p>
      <Link href="/inventory/stock-opname/history" className="text-xs font-bold underline">Back to Logs</Link>
    </div>
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header Navigation */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <Link href="/inventory/stock-opname/history" className="flex items-center gap-2 text-gray-500 hover:text-black font-bold italic text-xs uppercase tracking-widest mb-4 transition-all">
            <ArrowLeft size={16} /> Back to Logs
          </Link>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-gray-800">
            Audit Detail <span className="text-blue-600">#{data.referenceId}</span>
          </h1>
        </div>
        <div className="flex gap-4 mb-1">
          <div className="text-right">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Store Location</p>
            <p className="font-bold text-gray-700">{data.storeName}</p>
          </div>
          <div className="text-right border-l pl-4 border-gray-200">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Audit Date</p>
            <p className="font-bold text-gray-700">{new Date(data.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-gray-100 rounded-2xl text-gray-500"><Package size={24}/></div>
            <div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Monitored</p>
               <p className="text-xl font-black italic text-gray-800">{data.totalItems} Variants</p>
            </div>
         </div>
         {/* ... card lainnya jika butuh ... */}
      </div>

      {/* Table Detail */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Product & Variant</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">SKU</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Qty Change</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Audit Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.details.map((item) => (
              <tr key={item.logId} className="hover:bg-gray-50/50 transition-all">
                <td className="p-6">
                  <div className="font-black text-gray-800 italic uppercase text-sm">{item.productName}</div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase">{item.variantName}</div>
                </td>
                <td className="p-6 font-mono text-xs font-bold text-gray-500">{item.sku}</td>
                <td className="p-6 text-center">
                  <span className={`inline-block px-4 py-1 rounded-full font-black text-xs italic ${
                    item.qtyChange > 0 ? 'bg-green-50 text-green-600' : 
                    item.qtyChange < 0 ? 'bg-red-50 text-red-600' : 
                    'bg-gray-100 text-gray-400'
                  }`}>
                    {item.qtyChange > 0 ? `+${item.qtyChange}` : item.qtyChange}
                  </span>
                </td>
                <td className="p-6">
                  <div className="text-xs text-gray-500 font-medium leading-relaxed max-w-xs">
                    {item.notes}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}