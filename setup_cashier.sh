#!/bin/bash

# Konfigurasi Folder
BASE_DIR="components/cashier"
TYPES_DIR="types"
HOOKS_DIR="hooks"
MAIN_FILE="CashierLayout.tsx"

echo "🚀 Memulai setup sistem kasir lengkap (Full Stack Mock)..."

# 1. Buat struktur folder
mkdir -p $BASE_DIR
mkdir -p $TYPES_DIR
mkdir -p $HOOKS_DIR

# ---------------------------------------------------------
# 2. FILE TYPES: types/cashier.ts
# ---------------------------------------------------------
echo "Creating types..."
cat <<EOF > $TYPES_DIR/cashier.ts
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
}

export interface CartItem extends Product {
  tempId: string;
  quantity: number;
}
EOF

# ---------------------------------------------------------
# 3. FILE HOOK: hooks/useCashier.ts
# ---------------------------------------------------------
echo "Creating hooks..."
cat <<EOF > $HOOKS_DIR/useCashier.ts
import { useQuery } from '@tanstack/react-query';

export const useCashier = () => {
  // Mock query: Di masa depan, ganti [] dengan fetch ke API aslimu
  const productsQuery = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      return []; 
    },
  });

  return { productsQuery };
};
EOF

# ---------------------------------------------------------
# 4. SUB-KOMPONEN (Berada di components/cashier/)
# ---------------------------------------------------------
echo "Creating sub-components..."

# ProductCard.tsx
cat <<EOF > $BASE_DIR/ProductCard.tsx
import { Coffee, Plus } from 'lucide-react';
import { Product } from '@/types/cashier';

interface Props {
  product: Product;
  onAdd: (p: Product) => void;
}

export const ProductCard = ({ product, onAdd }: Props) => (
  <button 
    onClick={() => onAdd(product)} 
    className="bg-white p-6 rounded-[2.5rem] border border-slate-100 text-left hover:border-blue-500 hover:shadow-2xl transition-all group relative overflow-hidden"
  >
    <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
      <Coffee size={28} />
    </div>
    <p className="font-black text-slate-800 uppercase text-sm leading-tight mb-1">{product.name}</p>
    <p className="text-blue-600 font-black text-xl">Rp {product.price.toLocaleString('id-ID')}</p>
    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
      <div className="bg-blue-600 text-white p-1 rounded-lg"><Plus size={16}/></div>
    </div>
  </button>
);
EOF

# CartItemRow.tsx
cat <<EOF > $BASE_DIR/CartItemRow.tsx
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
EOF

# PaymentSelector.tsx
cat <<EOF > $BASE_DIR/PaymentSelector.tsx
import { Banknote, CreditCard, Wallet, HandCoins } from 'lucide-react';

interface Props {
  method: 'CASH' | 'DEBIT' | 'QRIS' | 'DEBT';
  setMethod: (m: 'CASH' | 'DEBIT' | 'QRIS' | 'DEBT') => void;
}

export const PaymentSelector = ({ method, setMethod }: Props) => {
  const options = [
    { id: 'CASH', icon: <Banknote size={18}/>, label: 'TUNAI' },
    { id: 'DEBIT', icon: <CreditCard size={18}/>, label: 'DEBIT' },
    { id: 'QRIS', icon: <Wallet size={18}/>, label: 'QRIS' },
    { id: 'DEBT', icon: <HandCoins size={18}/>, label: 'BON' }
  ] as const;

  return (
    <div className="grid grid-cols-4 gap-2">
      {options.map((m) => (
        <button 
          key={m.id} 
          onClick={() => setMethod(m.id)}
          className={\`flex flex-col items-center justify-center py-4 rounded-2xl border-2 transition-all \${method === m.id ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white border-slate-100 text-slate-400 hover:border-blue-200'}\`}
        >
          {m.icon}
          <span className="text-[9px] font-black mt-1.5 tracking-tighter">{m.label}</span>
        </button>
      ))}
    </div>
  );
};
EOF

# OrderSummary.tsx
cat <<EOF > $BASE_DIR/OrderSummary.tsx
import { Loader2 } from 'lucide-react';

interface Props {
  subtotal: number;
  discountAmount: number;
  discountPercent: number;
  taxAmount: number;
  grandTotal: number;
  changeAmount: number;
  paymentMethod: string;
  isProcessing: boolean;
  onCheckout: () => void;
  canCheckout: boolean;
}

export const OrderSummary = ({ 
  subtotal, discountAmount, discountPercent, taxAmount, grandTotal, 
  changeAmount, paymentMethod, isProcessing, onCheckout, canCheckout 
}: Props) => (
  <div className="p-8 bg-slate-900 rounded-t-[3.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
    <div className="space-y-2 text-[11px] font-bold uppercase tracking-widest border-b border-slate-800 pb-5 mb-5">
      <div className="flex justify-between text-slate-400">
        <span>Subtotal</span>
        <span>Rp {subtotal.toLocaleString('id-ID')}</span>
      </div>
      {discountPercent > 0 && (
        <div className="flex justify-between text-rose-400">
          <span>Diskon ({discountPercent}%)</span>
          <span>- Rp {discountAmount.toLocaleString('id-ID')}</span>
        </div>
      )}
      <div className="flex justify-between text-slate-500">
        <span>Pajak (10%)</span>
        <span>+ Rp {taxAmount.toLocaleString('id-ID')}</span>
      </div>
    </div>
    
    <div className="flex justify-between items-center mb-8">
      <div>
        <span className="text-white/40 font-black text-[10px] uppercase italic block mb-1">Grand Total</span>
        <span className="text-4xl font-black text-blue-400 italic tracking-tighter leading-none">
          Rp {grandTotal.toLocaleString('id-ID')}
        </span>
      </div>
      {paymentMethod === 'CASH' && (
         <div className="text-right">
            <span className="text-slate-500 font-black text-[10px] uppercase block mb-1">Kembali</span>
            <span className="text-emerald-400 font-black text-xl italic leading-none">
              Rp {Math.max(0, changeAmount).toLocaleString('id-ID')}
            </span>
         </div>
      )}
    </div>

    <button
      onClick={onCheckout}
      disabled={!canCheckout || isProcessing}
      className="w-full py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black text-2xl uppercase italic transition-all disabled:bg-slate-800 disabled:text-slate-600 shadow-2xl active:scale-[0.98]"
    >
      {isProcessing ? <Loader2 className="animate-spin mx-auto" /> : 'Selesaikan Pesanan'}
    </button>
  </div>
);
EOF

# Receipt.tsx
cat <<EOF > $BASE_DIR/Receipt.tsx
import { CartItem } from '@/types/cashier';

interface Props {
  cart: CartItem[];
  subtotal: number;
  discountAmount: number;
  discountPercent: number;
  taxAmount: number;
  grandTotal: number;
  paymentMethod: string;
  cashAmount: number;
  changeAmount: number;
}

export const Receipt = ({ 
  cart, subtotal, discountAmount, discountPercent, taxAmount, 
  grandTotal, paymentMethod, cashAmount, changeAmount 
}: Props) => (
  <div id="receipt-print" className="hidden print:block font-mono text-[12px] text-black">
    <div className="text-center mb-4">
      <h2 className="font-bold text-lg">KALNAF COFFEE</h2>
      <p>Jl. Kaliurang No. 45, Yogyakarta</p>
      <p>--------------------------------</p>
    </div>
    <div className="space-y-1 mb-4">
      {cart.map((item) => (
        <div key={item.tempId} className="flex justify-between italic">
          <span>{item.name} x{item.quantity}</span>
          <span>{(item.price * item.quantity).toLocaleString('id-ID')}</span>
        </div>
      ))}
    </div>
    <div className="border-t border-black border-dashed pt-2 space-y-1">
      <div className="flex justify-between"><span>Subtotal:</span><span>{subtotal.toLocaleString('id-ID')}</span></div>
      {discountPercent > 0 && <div className="flex justify-between text-rose-700"><span>Diskon:</span><span>-{discountAmount.toLocaleString('id-ID')}</span></div>}
      <div className="flex justify-between"><span>Pajak (10%):</span><span>{taxAmount.toLocaleString('id-ID')}</span></div>
      <div className="flex justify-between font-bold text-lg pt-2 mt-2 border-t border-black">
        <span>TOTAL:</span>
        <span>Rp {grandTotal.toLocaleString('id-ID')}</span>
      </div>
      <div className="flex justify-between pt-2"><span>Metode:</span><span>{paymentMethod}</span></div>
      {paymentMethod === 'CASH' && (
        <>
          <div className="flex justify-between"><span>Bayar:</span><span>Rp {cashAmount.toLocaleString('id-ID')}</span></div>
          <div className="flex justify-between"><span>Kembali:</span><span>Rp {changeAmount.toLocaleString('id-ID')}</span></div>
        </>
      )}
    </div>
    <div className="text-center mt-8">
      <p className="uppercase italic text-[10px]">Lunas - Terima Kasih</p>
      <p className="text-[8px] mt-1">{new Date().toLocaleString('id-ID')}</p>
    </div>
  </div>
);
EOF

# ---------------------------------------------------------
# 5. FILE UTAMA: CashierLayout.tsx
# ---------------------------------------------------------
echo "Creating main layout file..."
cat <<EOF > $MAIN_FILE
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Search, ShoppingCart, Trash2, Maximize, Minimize, Tag, Percent, Archive, FolderOpen } from 'lucide-react';
import { useCashier } from '@/hooks/useCashier';
import { Product, CartItem } from '@/types/cashier';

// Import sub-komponen
import { ProductCard } from './components/cashier/ProductCard';
import { CartItemRow } from './components/cashier/CartItemRow';
import { PaymentSelector } from './components/cashier/PaymentSelector';
import { OrderSummary } from './components/cashier/OrderSummary';
import { Receipt } from './components/cashier/Receipt';

const DUMMY_PRODUCTS: Product[] = [
  { id: 'd1', name: 'Caramel Macchiato', price: 35000, category: 'Coffee', stock: 10 },
  { id: 'd2', name: 'Iced Caffe Latte', price: 30000, category: 'Coffee', stock: 15 },
  { id: 'd3', name: 'Chocolate Croissant', price: 25000, category: 'Pastry', stock: 8 },
  { id: 'd4', name: 'Green Tea Latte', price: 32000, category: 'Non-Coffee', stock: 12 },
  { id: 'd5', name: 'Beef Lasagna', price: 45000, category: 'Food', stock: 5 },
  { id: 'd6', name: 'Espresso Single', price: 18000, category: 'Coffee', stock: 20 },
];

export const CashierLayout = () => {
  const { productsQuery } = useCashier();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'DEBIT' | 'QRIS' | 'DEBT'>('CASH');
  const [cashAmount, setCashAmount] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [drafts, setDrafts] = useState<{id: string, items: CartItem[], time: string}[]>([]);

  const TAX_RATE = 0.1;

  useEffect(() => { setMounted(true); }, []);

  // --- KALKULASI ---
  const subtotal = cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
  const discountAmount = subtotal * (discountPercent / 100);
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = taxableAmount * TAX_RATE;
  const grandTotal = taxableAmount + taxAmount;
  const changeAmount = cashAmount - grandTotal;

  const products = useMemo(() => {
    const apiData = productsQuery?.data;
    return (Array.isArray(apiData) && apiData.length > 0) ? apiData : DUMMY_PRODUCTS;
  }, [productsQuery?.data]);

  // --- ACTIONS ---
  const addToCart = (product: Product) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)));
    } else {
      setCart([...cart, { ...product, quantity: 1, tempId: Math.random().toString(36).substring(7) }]);
    }
  };

  const removeFromCart = (tempId: string) => setCart(cart.filter(i => i.tempId !== tempId));
  const updateQty = (tempId: string, delta: number) => {
    setCart(cart.map(i => i.tempId === tempId ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i));
  };

  const saveToDraft = () => {
    if (cart.length === 0) return;
    const newDraft = {
      id: Math.random().toString(36).substring(7),
      items: [...cart],
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };
    setDrafts([newDraft, ...drafts]);
    setCart([]);
    setCashAmount(0);
    setDiscountPercent(0);
  };

  const restoreDraft = (draftId: string) => {
    const target = drafts.find(d => d.id === draftId);
    if (target) {
      if (cart.length > 0) saveToDraft();
      setCart(target.items);
      setDrafts(drafts.filter(d => d.id !== draftId));
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setIsProcessing(true);
    setTimeout(() => {
      window.print();
      setIsProcessing(false);
      setCart([]);
      setCashAmount(0);
      setDiscountPercent(0);
    }, 1000);
  };

  if (!mounted) return null;

  return (
    <div className={\`flex h-screen bg-[#F8FAFC] overflow-hidden relative \${!isFullscreen ? 'p-4' : ''}\`}>
      <style jsx global>{\`
        @media print {
          @page { size: 80mm auto; margin: 0; }
          body * { visibility: hidden; }
          #receipt-print, #receipt-print * { visibility: visible; }
          #receipt-print { position: absolute; left: 0; top: 0; width: 100%; display: block !important; padding: 20px; }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
      \`}</style>

      <div className="flex flex-1 bg-white rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-2xl relative">
        
        {/* PANEL KIRI */}
        <div className="flex-1 flex flex-col p-8 overflow-hidden bg-[#F8FAFC]">
          <div className="flex justify-between items-end mb-8">
            <div className="flex items-start gap-4">
              <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-400 hover:text-blue-600">
                {isFullscreen ? <Minimize size={22}/> : <Maximize size={22}/>}
              </button>
              <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">Terminal<br/>Kasir</h1>
                <div className="h-1.5 w-12 bg-blue-600 rounded-full mt-3"></div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-3">
              <div className="flex gap-2">
                {drafts.map((d) => (
                  <button key={d.id} onClick={() => restoreDraft(d.id)} className="bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase flex items-center gap-2">
                    <FolderOpen size={12}/> Draft {d.time}
                  </button>
                ))}
              </div>
              <div className="relative w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input type="text" placeholder="Cari menu..." className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border-none shadow-sm focus:ring-4 focus:ring-blue-100 font-bold outline-none" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 overflow-y-auto pr-2 custom-scrollbar">
            {products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).map((product) => (
              <ProductCard key={product.id} product={product} onAdd={addToCart} />
            ))}
          </div>
        </div>

        {/* PANEL KANAN */}
        <div className="w-[480px] bg-white border-l border-slate-100 flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.02)] z-10">
          <div className="p-8 pb-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-slate-900 text-white rounded-2xl"><ShoppingCart size={22} /></div>
              <h3 className="font-black text-xl uppercase">Ringkasan</h3>
            </div>
            <div className="flex gap-2">
              <button onClick={saveToDraft} disabled={cart.length === 0} className="p-3 bg-slate-100 text-slate-500 rounded-xl hover:bg-amber-500 hover:text-white disabled:opacity-20"><Archive size={20} /></button>
              <button onClick={() => setCart([])} className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white"><Trash2 size={20} /></button>
            </div>
          </div>
          
          <div className="flex-1 px-8 py-4 space-y-4 overflow-y-auto custom-scrollbar">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-300">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-dashed border-slate-200"><ShoppingCart size={32} /></div>
                <p className="font-black text-[10px] uppercase tracking-widest">Belum ada pesanan</p>
              </div>
            ) : (
              cart.map((item) => (
                <CartItemRow key={item.tempId} item={item} onUpdateQty={updateQty} onRemove={removeFromCart} />
              ))
            )}
          </div>

          <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 space-y-6">
            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl"><Tag size={20}/></div>
              <div className="flex-1">
                <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Diskon (%)</p>
                <input type="number" className="w-full font-black text-emerald-600 outline-none bg-transparent text-lg" placeholder="0" value={discountPercent || ''} onChange={(e) => setDiscountPercent(Math.min(100, Number(e.target.value)))} />
              </div>
              <span className="text-slate-300 font-bold">%</span>
            </div>

            <PaymentSelector method={paymentMethod} setMethod={setPaymentMethod} />

            {paymentMethod === 'CASH' && (
              <div className="space-y-4">
                <div className="flex justify-between items-end px-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Diterima (Cash)</label>
                  <div className="flex gap-2">
                    {[50000, 100000].map(val => (
                      <button key={val} onClick={() => setCashAmount(val)} className="text-[10px] font-bold bg-white border border-slate-200 px-3 py-1.5 rounded-xl hover:border-blue-500 shadow-sm">+{val/1000}k</button>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-slate-400 text-lg">Rp</span>
                  <input type="number" className="w-full pl-14 pr-6 py-5 rounded-[1.5rem] border-2 border-white bg-white shadow-sm focus:border-blue-500 outline-none font-black text-2xl text-slate-800" placeholder="0" value={cashAmount || ''} onChange={(e) => setCashAmount(Number(e.target.value))} />
                </div>
              </div>
            )}
          </div>

          <OrderSummary 
            subtotal={subtotal} 
            discountAmount={discountAmount}
            discountPercent={discountPercent}
            taxAmount={taxAmount}
            grandTotal={grandTotal}
            changeAmount={changeAmount}
            paymentMethod={paymentMethod}
            isProcessing={isProcessing}
            onCheckout={handleCheckout}
            canCheckout={cart.length > 0 && (paymentMethod !== 'CASH' || cashAmount >= grandTotal)}
          />
        </div>
      </div>

      <Receipt 
        cart={cart}
        subtotal={subtotal}
        discountAmount={discountAmount}
        discountPercent={discountPercent}
        taxAmount={taxAmount}
        grandTotal={grandTotal}
        paymentMethod={paymentMethod}
        cashAmount={cashAmount}
        changeAmount={changeAmount}
      />
    </div>
  );
};
EOF

# ---------------------------------------------------------
# 6. PENUTUP
# ---------------------------------------------------------
chmod +x setup_full_cashier.sh
echo "----------------------------------------------------"
echo "✅ SEMUA FILE BERHASIL DIBUAT!"
echo "----------------------------------------------------"
echo "Pastikan folder 'types' dan 'hooks' ada di root project src kamu."
echo "Instalasi dependensi jika belum:"
echo "npm install lucide-react @tanstack/react-query"
echo "----------------------------------------------------"