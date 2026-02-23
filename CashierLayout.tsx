'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, ShoppingCart, Trash2, Maximize, Minimize, Tag, User, Phone, Archive, History, Clock, X } from 'lucide-react';
import { useCashier } from '@/hooks/useCashier';
import { CartItem } from '@/types/cashier';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTransaction } from '@/services/cashier.service';

// Sub-komponen
import { ProductCard } from './components/cashier/ProductCard';
import { PaymentSelector } from './components/cashier/PaymentSelector';
import { OrderSummary } from './components/cashier/OrderSummary';
import { Receipt } from 'components/cashier/Receipt';
import { renderToString } from 'react-dom/server';

export const CashierLayout = () => {
  const { productsQuery, search, setSearch } = useCashier();
  const queryClient = useQueryClient();
  const containerRef = useRef<HTMLDivElement>(null);

  // --- 1. STATES ---
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'DEBIT' | 'QRIS' | 'DEBT'>('CASH');
  const [cashAmount, setCashAmount] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [activeCategory, setActiveCategory] = useState('All Menus');
  const [isPrinting, setIsPrinting] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [archivedOrders, setArchivedOrders] = useState<any[]>([]);
  const [showArchive, setShowArchive] = useState(false);

  // --- 2. DATA PROCESSING (Diletakkan sebelum useEffect agar tidak error) ---
  const products = useMemo(() => {
    const rawData = productsQuery?.data?.data?.data;
    if (Array.isArray(rawData)) {
      return rawData.map((item: any) => ({
        id: item.id.toString(),
        name: item.name || 'Unknown Product',
        price: Number(item.price) || 0,
        category: item.category || 'General',
        stock: Number(item.stock) || 0,
        productType: item.productType || 'REGULER',
        sku: item.sku || '-'
      }));
    }
    return [];
  }, [productsQuery?.data]);

  const totals = useMemo(() => {
    const sub = cart.reduce((sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 0), 0);
    const disc = sub * (Number(discountPercent || 0) / 100);
    const grand = sub - disc;
    return {
      subtotal: sub,
      discountAmount: disc,
      taxAmount: 0,
      grandTotal: grand,
      changeAmount: cashAmount > 0 ? cashAmount - grand : 0
    };
  }, [cart, discountPercent, cashAmount]);

  // --- 3. PRINTING LOGIC (METODE TAB TERPISAH) ---
  useEffect(() => {
    if (isPrinting) {
      // 1. Render komponen ke HTML
      const receiptHtml = renderToString(
        <Receipt
          {...totals}
          cart={cart}
          paymentMethod={paymentMethod}
          cashAmount={cashAmount}
          customerName={customerName}
          customerPhone={customerPhone}
          discountPercent={discountPercent}
        />
      );

      // 2. Buka tab cetak
      const printWindow = window.open('', '_blank', 'width=350,height=600');

      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Cetak Struk</title>
              <script src="https://cdn.tailwindcss.com"></script>
              <style>
                @page { size: 58mm auto; margin: 0; }
                body { margin: 0; padding: 0; background: white; }
                #receipt-print { display: block !important; margin: 0 auto; }
              </style>
            </head>
            <body>
              <div id="print-content">${receiptHtml}</div>
              <script>
                window.onload = function() {
                  setTimeout(() => {
                    window.print();
                    window.onafterprint = function() { window.close(); };
                  }, 300);
                };
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }

      // --- LOGIKA KEMBALI KE FULLSCREEN ---
      // Kadang membuka window baru membatalkan fokus fullscreen di beberapa browser
      if (isFullscreen && containerRef.current) {
        if (!document.fullscreenElement) {
          containerRef.current.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable full-screen mode: ${err.message}`);
          });
        }
      }

      // 3. Reset State
      setIsPrinting(false);
      setCart([]);
      setCashAmount(0);
      setDiscountPercent(0);
      setCustomerName('');
      setCustomerPhone('');
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  }, [isPrinting, cart, totals, paymentMethod, cashAmount, customerName, isFullscreen, discountPercent, queryClient]);
  // --- 4. MUTATION & HANDLERS ---
  const mutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      setIsPrinting(true);
    },
    onError: (error: any) => {
      alert("Transaksi gagal: " + (error.response?.data?.message || "Terjadi kesalahan server"));
    }
  });

  const handleCheckout = async () => {
    if (cart.length === 0 || mutation.isPending) return;
    const payload = {
      storeId: "58f9cee0-29b5-47df-bf63-fd1df3ab3cd1",
      paymentMethod,
      customerName,
      customerPhone,
      items: cart.map(item => ({
        variantId: Number(item.id),
        qty: item.quantity,
        price: item.price,
        discount: 0
      })),
      totalAmount: totals.grandTotal,
      paidAmount: paymentMethod === 'CASH' ? cashAmount : totals.grandTotal,
    };
    mutation.mutate(payload);
  };

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1, tempId: Math.random().toString(36).substring(7) }];
    });
  };

  const removeFromCart = (tempId: string) => {
    setCart(prev => prev.filter(item => item.tempId !== tempId));
  };

  const handleArchiveOrder = () => {
    if (cart.length === 0) return;
    const newArchive = {
      id: Date.now(),
      items: [...cart],
      customerName,
      customerPhone,
      total: totals.grandTotal,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setArchivedOrders([newArchive, ...archivedOrders]);
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setDiscountPercent(0);
  };

  const restoreOrder = (order: any) => {
    setCart(order.items);
    setCustomerName(order.customerName);
    setCustomerPhone(order.customerPhone);
    setArchivedOrders(prev => prev.filter(o => o.id !== order.id));
    setShowArchive(false);
  };

  const categories = useMemo(() => ['All Menus', ...Array.from(new Set(products.map(p => p.category)))], [products]);

  const filteredProducts = useMemo(() => {
    let result = activeCategory === 'All Menus' ? products : products.filter(p => p.category === activeCategory);
    if (search) {
      result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }
    return result;
  }, [products, activeCategory, search]);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <div ref={containerRef} className={`flex h-screen bg-slate-100 transition-all ${isFullscreen ? 'p-0' : 'p-4'}`}>
      <div className={`flex flex-1 bg-white overflow-hidden shadow-2xl relative ${isFullscreen ? 'rounded-none' : 'rounded-[2.5rem] border border-slate-200/60'}`}>

        {/* LEFT PANEL */}
        <div className="flex-1 flex flex-col p-6 overflow-hidden bg-[#F8FAFC]">
          {/* Header & Search */}
          <div className="flex justify-between items-center mb-6 gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  if (!document.fullscreenElement) containerRef.current?.requestFullscreen();
                  else document.exitFullscreen();
                  setIsFullscreen(!isFullscreen);
                }}
                className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-sm text-slate-400 hover:text-blue-600 transition-all active:scale-90"
              >
                {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
              </button>
              <h1 className="text-xl font-black text-slate-900 tracking-tighter italic">KALNAF<span className="text-blue-600">.POS</span></h1>
            </div>

            <div className="relative flex-1 max-w-xl group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Cari menu favorit..."
                className="w-full pl-12 pr-10 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <button
              onClick={() => setShowArchive(!showArchive)}
              className={`relative p-3 rounded-2xl border transition-all active:scale-95 ${archivedOrders.length > 0 ? 'bg-orange-50 border-orange-200 text-orange-600' : 'bg-white border-slate-200 text-slate-400'}`}
            >
              <Archive size={20} />
              {archivedOrders.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {archivedOrders.length}
                </span>
              )}
            </button>
          </div>

          {/* Categories */}
          <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-200 hover:border-slate-300'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredProducts.map(p => (
                <ProductCard key={p.id} product={p} onAdd={addToCart} />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-[380px] bg-white border-l border-slate-100 flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.02)]">
          <div className="p-5 bg-slate-50/50 border-b border-slate-100 space-y-3">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <User size={12} /> Member Info
            </p>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-[11px] font-bold outline-none focus:border-blue-500 transition-all shadow-sm"
                placeholder="NAMA"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
              />
              <input
                type="text"
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-[11px] font-bold outline-none focus:border-blue-500 transition-all shadow-sm"
                placeholder="NO HP"
                value={customerPhone}
                onChange={e => setCustomerPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="p-5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-900 text-white rounded-lg shadow-md"><ShoppingCart size={16} /></div>
              <span className="uppercase tracking-tight text-sm font-black text-slate-800">Orders</span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={handleArchiveOrder}
                disabled={cart.length === 0}
                className="p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all disabled:opacity-30"
              >
                <Archive size={18} />
              </button>
              <button onClick={() => setCart([])} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all">
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          <div className="flex-1 px-5 py-2 space-y-3 overflow-y-auto custom-scrollbar">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 opacity-60">
                <ShoppingCart size={40} strokeWidth={1.5} />
                <p className="text-[9px] font-bold uppercase mt-4 tracking-[0.2em]">Belum ada pesanan</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.tempId} className="group flex justify-between items-center">
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="text-[11px] font-black text-slate-700 truncate uppercase leading-tight">{item.name}</p>
                    <div className="flex items-center mt-0.5">
                      <span className="text-[11px] font-black text-blue-500">{item.price.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-1 border border-slate-100">
                      <button onClick={() => setCart(prev => prev.map(i => i.tempId === item.tempId ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i))} className="w-6 h-6 flex items-center justify-center text-slate-400 font-bold">-</button>
                      <span className="text-[11px] font-black w-4 text-center">{item.quantity}</span>
                      <button onClick={() => setCart(prev => prev.map(i => i.tempId === item.tempId ? { ...i, quantity: i.quantity + 1 } : i))} className="w-6 h-6 flex items-center justify-center text-slate-400 font-bold">+</button>
                    </div>
                    <button onClick={() => removeFromCart(item.tempId)} className="p-1.5 text-slate-300 hover:text-rose-500">
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-5 bg-white border-t border-slate-100 space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={12} />
                <input
                  type="number"
                  className="w-full pl-8 pr-2 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold outline-none focus:bg-white"
                  placeholder="DISKON %"
                  value={discountPercent || ''}
                  onChange={e => setDiscountPercent(Number(e.target.value))}
                />
              </div>
              <div className="flex-1">
                <PaymentSelector method={paymentMethod} setMethod={setPaymentMethod} />
              </div>
            </div>

            {paymentMethod === 'CASH' && (
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-blue-400 uppercase">Bayar</span>
                <input
                  type="number"
                  className="w-full pl-14 pr-4 py-4 bg-blue-50/30 border-2 border-blue-100 rounded-2xl text-xl font-black text-blue-600 outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner"
                  placeholder="0"
                  value={cashAmount || ''}
                  onChange={e => setCashAmount(Number(e.target.value))}
                />
              </div>
            )}

            <OrderSummary
              {...totals}
              paymentMethod={paymentMethod}
              isProcessing={mutation.isPending}
              onCheckout={handleCheckout}
              canCheckout={cart.length > 0 && (paymentMethod !== 'CASH' || cashAmount >= totals.grandTotal)}
              setCashAmount={setCashAmount}
              discountPercent={discountPercent}
            />
          </div>
        </div>
      </div>

      {showArchive && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/40 backdrop-blur-sm">
          <div className="w-[400px] h-full bg-white shadow-2xl flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-black text-slate-800 tracking-tight uppercase">Antrean Tersimpan</h2>
              <button onClick={() => setShowArchive(false)} className="p-2 hover:bg-slate-100 rounded-full">
                <X size={20} className="text-slate-300" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {archivedOrders.map((order) => (
                <div key={order.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50 cursor-pointer" onClick={() => restoreOrder(order)}>
                  <p className="text-xs font-black text-slate-800 uppercase">{order.customerName || 'Pelanggan Umum'}</p>
                  <p className="text-xs font-black text-orange-600">Rp {order.total.toLocaleString('id-ID')}</p>
                </div>
              ))}
            </div>
            <div className="p-6">
              <button onClick={() => setShowArchive(false)} className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest">Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};