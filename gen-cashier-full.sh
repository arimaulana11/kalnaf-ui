#!/bin/bash

# Konfigurasi Path
APP_DIR="src/app/(dashboard)/cashier"
COMP_DIR="src/components/cashier"
TYPE_DIR="src/types"
SERVICE_DIR="src/services"
HOOK_DIR="src/hooks"

# Membuat folder
mkdir -p "$APP_DIR" "$COMP_DIR" "$TYPE_DIR" "$SERVICE_DIR" "$HOOK_DIR"

echo "=========================================="
echo "🚀 GENERATING FULL CASHIER SYSTEM"
echo "=========================================="

# 1. TYPE: Produk & Transaksi
cat << 'EOF' > "$TYPE_DIR/cashier.ts"
export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
}

export interface CartItem extends Product {
  quantity: number;
  tempId: string;
}
EOF

# 2. SERVICE: Mengambil Produk & Simpan Transaksi
cat << 'EOF' > "$SERVICE_DIR/cashier.service.ts"
import axiosInstance from '@/lib/axios';

export const getProducts = async () => {
  const response = await axiosInstance.get('/products');
  return response.data; // Expected: { data: [...] }
};

export const createTransaction = async (payload: any) => {
  const response = await axiosInstance.post('/transactions', payload);
  return response.data;
};
EOF

# 3. HOOK: useCashier
cat << 'EOF' > "$HOOK_DIR/useCashier.ts"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducts, createTransaction } from '@/services/cashier.service';
import toast from 'react-hot-toast';

export const useCashier = () => {
  const queryClient = useQueryClient();

  const productsQuery = useQuery({
    queryKey: ['cashier-products'],
    queryFn: getProducts,
  });

  const checkoutMutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cashier-products'] });
      toast.success('Transaksi Berhasil Disimpan');
    },
    onError: () => toast.error('Gagal memproses transaksi')
  });

  return { productsQuery, checkoutMutation };
};
EOF

# 4. UI COMPONENT: CashierLayout.tsx
cat << 'EOF' > "$COMP_DIR/CashierLayout.tsx"
'use client';
import React, { useState } from 'react';
import { Search, ShoppingCart, Trash2, Banknote, CreditCard, Wallet, Plus, Minus } from 'lucide-react';
import { useCashier } from '@/hooks/useCashier';
import { Product, CartItem } from '@/types/cashier';

export const CashierLayout = () => {
  const { productsQuery, checkoutMutation } = useCashier();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');

  const products: Product[] = productsQuery.data?.data || [];
  
  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...product, quantity: 1, tempId: Math.random().toString() }]);
    }
  };

  const removeFromCart = (tempId: string) => setCart(cart.filter(item => item.tempId !== tempId));
  
  const updateQty = (tempId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.tempId === tempId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    const payload = {
      items: cart.map(item => ({ product_id: item.id, qty: item.quantity })),
      total_amount: subtotal
    };
    checkoutMutation.mutate(payload, { onSuccess: () => setCart([]) });
  };

  return (
    <div className="flex h-[calc(100vh-2rem)] bg-slate-50 rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-2xl font-sans">
      {/* PANEL KIRI: PRODUK */}
      <div className="flex-1 flex flex-col p-8 overflow-hidden">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Menu Kasir</h2>
          <div className="relative w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
            <input 
              type="text" 
              placeholder="Cari item..." 
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl shadow-sm outline-none focus:ring-4 focus:ring-blue-50 border-none font-bold"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 overflow-y-auto pr-2">
          {products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).map((product) => (
            <button 
              key={product.id}
              onClick={() => addToCart(product)}
              className="bg-white p-5 rounded-[2.5rem] border border-transparent hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-100 transition-all text-left group relative"
            >
              <div className="w-full aspect-square bg-slate-50 rounded-[2rem] mb-4 flex items-center justify-center text-slate-200 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all">
                 <ShoppingCart size={40} />
              </div>
              <p className="font-black text-slate-800 leading-tight">{product.name}</p>
              <p className="text-blue-600 font-black text-lg mt-1">Rp {product.price.toLocaleString()}</p>
            </button>
          ))}
        </div>
      </div>

      {/* PANEL KANAN: KERANJANG */}
      <div className="w-[450px] bg-white border-l border-slate-50 flex flex-col">
        <div className="p-8 border-b border-slate-50">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg">
                <ShoppingCart size={24} />
             </div>
             <div>
                <h3 className="font-black text-xl text-slate-900 uppercase tracking-tight">Keranjang</h3>
                <p className="text-xs text-slate-400 font-bold">{cart.length} Item Terpilih</p>
             </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-300">
               <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <ShoppingCart size={32} />
               </div>
               <p className="font-black uppercase tracking-widest text-xs">Belum ada pesanan</p>
            </div>
          ) : cart.map((item) => (
            <div key={item.tempId} className="flex justify-between items-center group">
              <div className="flex-1">
                <p className="font-black text-slate-800 text-sm leading-none mb-1">{item.name}</p>
                <p className="text-[11px] font-bold text-slate-400">Rp {(item.price * item.quantity).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-slate-50 rounded-xl p-1">
                   <button onClick={() => updateQty(item.tempId, -1)} className="p-1 hover:text-blue-600 transition-colors"><Minus size={14}/></button>
                   <span className="w-8 text-center font-black text-sm">{item.quantity}</span>
                   <button onClick={() => updateQty(item.tempId, 1)} className="p-1 hover:text-blue-600 transition-colors"><Plus size={14}/></button>
                </div>
                <button 
                  onClick={() => removeFromCart(item.tempId)}
                  className="text-slate-200 hover:text-rose-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-8 bg-slate-900 rounded-t-[3rem] shadow-2xl">
          <div className="flex justify-between items-center mb-8">
             <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Total Bayar</p>
             <h2 className="text-3xl font-black text-white italic">Rp {subtotal.toLocaleString()}</h2>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-8">
             {[ {n: 'Cash', i: <Banknote/>}, {n: 'Card', i: <CreditCard/>}, {n: 'QRIS', i: <Wallet/>} ].map((m, i) => (
               <button key={i} className="flex flex-col items-center p-4 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white hover:text-slate-900 transition-all">
                  {m.i}
                  <span className="text-[10px] font-black mt-2 uppercase">{m.n}</span>
               </button>
             ))}
          </div>

          <button 
            disabled={cart.length === 0 || checkoutMutation.isPending}
            onClick={handleCheckout}
            className="w-full py-6 bg-blue-600 text-white rounded-[1.8rem] font-black text-xl shadow-xl shadow-blue-900/20 hover:bg-blue-500 disabled:bg-slate-700 transition-all uppercase tracking-tighter italic"
          >
            {checkoutMutation.isPending ? 'Processing...' : 'Selesaikan Pesanan'}
          </button>
        </div>
      </div>
    </div>
  );
};
EOF

# 5. NEXT.JS PAGE
cat << 'EOF' > "$APP_DIR/page.tsx"
import { CashierLayout } from "@/components/cashier/CashierLayout";

export default function CashierPage() {
  return (
    <div className="min-h-screen bg-white p-4">
      <CashierLayout />
    </div>
  );
}
EOF

chmod +x gen-cashier-full.sh
echo "✅ SUCCESS! Semua sistem kasir telah digenerate."
echo "URL: /(dashboard)/cashier"