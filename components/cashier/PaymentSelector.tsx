'use client';

import { Banknote, CreditCard, Wallet, HandCoins } from 'lucide-react';

interface Props {
  method: 'CASH' | 'DEBIT' | 'QRIS' | 'DEBT';
  setMethod: (m: 'CASH' | 'DEBIT' | 'QRIS' | 'DEBT') => void;
}

export const PaymentSelector = ({ method, setMethod }: Props) => {
  const options = [
    { id: 'CASH', icon: <Banknote size={14}/>, label: 'TUNAI' },
    { id: 'DEBIT', icon: <CreditCard size={14}/>, label: 'DEBIT' },
    { id: 'QRIS', icon: <Wallet size={14}/>, label: 'QRIS' },
    { id: 'DEBT', icon: <HandCoins size={14}/>, label: 'BON' }
  ] as const;

  return (
    <div className="flex bg-slate-100 p-1 rounded-xl w-full">
      {options.map((m) => (
        <button 
          key={m.id} 
          onClick={() => setMethod(m.id)}
          className={`flex flex-1 items-center justify-center gap-1.5 py-2 rounded-lg transition-all duration-200 ${
            method === m.id 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-slate-400 hover:text-slate-600'
          }`}
          title={m.label}
        >
          {m.icon}
          <span className="text-[9px] font-black tracking-tighter hidden lg:block">
            {m.label}
          </span>
        </button>
      ))}
    </div>
  );
};