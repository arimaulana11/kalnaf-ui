import { ArrowDownLeft, ArrowUpRight, MoveHorizontal } from 'lucide-react';
import { MovementType } from '@/types/inventory';

interface Props {
  movementType: MovementType;
  setMovementType: (type: MovementType) => void;
  resetForm: () => void;
}

export const StockMovementHeader = ({ movementType, setMovementType, resetForm }: Props) => {
  const themes = {
    IN: { bg: 'bg-green-100', text: 'text-green-600', active: 'bg-white shadow-md text-green-600 scale-105' },
    OUT: { bg: 'bg-red-100', text: 'text-red-600', active: 'bg-white shadow-md text-red-600 scale-105' },
    TRANSFER: { bg: 'bg-orange-100', text: 'text-orange-600', active: 'bg-white shadow-md text-orange-600 scale-105' }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className={`p-2 rounded-lg ${themes[movementType].bg} ${themes[movementType].text}`}>
            {movementType === 'IN' && <ArrowDownLeft size={18} />}
            {movementType === 'OUT' && <ArrowUpRight size={18} />}
            {movementType === 'TRANSFER' && <MoveHorizontal size={18} />}
          </div>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Inventory Control</span>
        </div>
        <h1 className="text-3xl font-black text-gray-800 italic uppercase tracking-tighter">Stock Movement</h1>
      </div>

      <div className="flex bg-gray-200/50 p-1.5 rounded-[1.8rem] border border-gray-200/50 shadow-inner">
        {(['IN', 'OUT', 'TRANSFER'] as MovementType[]).map((type) => (
          <button
            key={type}
            onClick={() => { setMovementType(type); resetForm(); }}
            className={`flex items-center gap-2 px-6 py-3.5 rounded-[1.4rem] text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${movementType === type ? themes[type].active : 'text-gray-500 hover:text-gray-800'}`}
          >
            {type === 'IN' && <ArrowDownLeft size={14} />}
            {type === 'OUT' && <ArrowUpRight size={14} />}
            {type === 'TRANSFER' && <MoveHorizontal size={14} />}
            {type}
          </button>
        ))}
      </div>
    </div>
  );
};