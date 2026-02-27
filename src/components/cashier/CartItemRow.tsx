import { Minus, Plus, X } from 'lucide-react';
import { CartItem } from '@/types/cashier';

interface Props {
  item: CartItem;
  onUpdateQty: (tempId: string, delta: number) => void;
  onRemove: (tempId: string) => void;
}

export const CartItemRow = ({ item, onUpdateQty, onRemove }: Props) => (
  <div className="group bg-slate-50 p-5 rounded-3xl border border-transparent hover:border-blue-100 hover:bg-white transition-all shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="flex-1">
        <p className="font-black text-slate-900 text-sm uppercase leading-none mb-1">{item.name}</p>
        <p className="text-xs font-bold text-blue-600">Rp {item.price.toLocaleString('id-ID')}</p>
      </div>
      <button onClick={() => onRemove(item.tempId)} className="p-1 text-slate-300 hover:text-rose-500 transition-colors">
        <X size={18} />
      </button>
    </div>
    <div className="flex justify-between items-center">
      <div className="flex items-center bg-white rounded-2xl border border-slate-200 p-1.5 shadow-sm">
        <button onClick={() => onUpdateQty(item.tempId, -1)} className="w-9 h-9 flex items-center justify-center font-bold transition-colors hover:text-blue-600"><Minus size={16}/></button>
        <span className="w-10 text-center font-black text-base">{item.quantity}</span>
        <button onClick={() => onUpdateQty(item.tempId, 1)} className="w-9 h-9 flex items-center justify-center font-bold transition-colors hover:text-blue-600"><Plus size={16}/></button>
      </div>
      <p className="font-black text-slate-900 text-lg font-mono">
        Rp {(item.price * item.quantity).toLocaleString('id-ID')}
      </p>
    </div>
  </div>
);
