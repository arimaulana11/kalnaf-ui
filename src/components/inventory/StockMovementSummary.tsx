import { MovementType } from '@/types/inventory';
import { Save, Loader2 } from 'lucide-react';

interface Props {
  totalSku: number;
  totalQty: number;
  totalValue: number; // Menampilkan total uang yang keluar/masuk
  movementType: MovementType;
  isLoading: boolean;
  onProcess: () => void;
  disabled: boolean;
}

export const StockMovementSummary = ({ totalSku, totalQty, totalValue, movementType, isLoading, onProcess, disabled }: Props) => {
  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 sticky top-8">
      <h3 className="text-sm font-black uppercase italic text-gray-800 mb-8 pb-4 border-b border-gray-50 flex items-center justify-between">
        Summary
        <span className={`px-3 py-1 rounded-full text-[9px] font-black ${movementType === 'IN' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
          {movementType}
        </span>
      </h3>
      
      <div className="space-y-4 mb-10">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total SKU</span>
          <span className="font-mono font-black text-gray-700 text-xl">{totalSku}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Qty</span>
          <span className="font-mono font-black text-gray-700 text-xl">{totalQty}</span>
        </div>
        {movementType === 'IN' && (
          <div className="flex justify-between items-center pt-4 border-t border-gray-50">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Value</span>
            <span className="font-mono font-black text-green-600 text-xl">Rp{totalValue.toLocaleString()}</span>
          </div>
        )}
      </div>

      <button 
        onClick={onProcess} 
        disabled={disabled}
        className={`w-full py-6 rounded-[2rem] font-black uppercase italic tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-2xl active:scale-95 disabled:opacity-50 ${movementType === 'IN' ? 'bg-green-600 text-white shadow-green-200' : 'bg-red-600 text-white shadow-red-200'}`}
      >
        {isLoading ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
        {isLoading ? 'Processing...' : 'Process Movement'}
      </button>
    </div>
  );
};