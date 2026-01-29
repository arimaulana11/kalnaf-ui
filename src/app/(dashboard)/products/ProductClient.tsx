'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Product, ProductPayload, ProductVariantPayload } from '@/types/product';
import { ProductTable } from '@/components/products/ProductTable';
import { ProductModal } from '@/components/products/ProductModal';
import { Plus, Search, Loader2, RefreshCw, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ProductClient() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  // 1. Fetch Products
  const { data: productResponse, isLoading, isFetching } = useQuery({
    queryKey: ['products', page, search],
    queryFn: async () => {
      const res = await api.get(`/products`, {
        params: { page, limit: 10, search: search || undefined }
      });
      return res.data.data; // Mengambil res.data.data (Object pagination)
    },
    placeholderData: (previousData) => previousData,
  });

  // 2. Mutation: Save (Create/Update)
  const saveProduct = useMutation({
    mutationFn: async (payload: ProductPayload) => {
      if (selectedProduct) {
        return api.patch(`/products/${selectedProduct.id}`, payload);
      }
      return api.post('/products', payload);
    },
    onSuccess: () => {
      toast.success(selectedProduct ? 'Produk diperbarui' : 'Produk berhasil ditambah');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      handleCloseModal();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Gagal menyimpan produk');
    }
  });

  // 3. Mutation: Delete
  const deleteProduct = useMutation({
    mutationFn: async (id: number) => api.delete(`/products/${id}/force`),
    onSuccess: () => {
      toast.success('Produk berhasil dihapus');
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });

  // --- LOGIKA TRANSFORMASI DATA ---
  const handleSaveProduct = (rawForm: any) => {
    // Cari SKU dari varian yang merupakan Base Unit (satuan terkecil)
    const baseVariant = rawForm.variants.find((v: ProductVariantPayload) => v.isBaseUnit);
    const baseSku = baseVariant?.sku || null;

    const formattedPayload: ProductPayload = {
      name: rawForm.name,
      description: rawForm.description || '',
      categoryId: Number(rawForm.categoryId),
      type: rawForm.type || 'PHYSICAL',
      imageUrl: rawForm.imageUrl || '',
      isActive: rawForm.isActive ?? true,
      purchasePrice: Number(rawForm.purchasePrice || 0),
      
      // Transformasi Varian (Multi-UOM)
      variants: rawForm.variants.map((v: any) => ({
        name: v.name,
        sku: v.sku,
        unitName: v.unitName,
        price: Number(v.price),
        multiplier: Number(v.multiplier),
        isBaseUnit: v.isBaseUnit,
        // Otomatis set parentSku ke unit dasar jika bukan base unit itu sendiri
        parentSku: v.isBaseUnit ? null : (v.parentSku || baseSku)
      })),

      // Mapping Stok Awal (Hanya untuk produk baru)
      initialStocks: !selectedProduct ? rawForm.initialStocks?.map((s: any) => ({
        storeId: s.storeId,
        qty: Number(s.qty),
        purchasePrice: Number(s.purchasePrice || rawForm.purchasePrice)
      })) : undefined,

      // Mapping Parcel Items (Hanya jika tipe PARCEL)
      parcelItems: rawForm.type === 'PARCEL' ? rawForm.parcelItems?.map((p: any) => ({
        variantId: Number(p.variantId),
        qty: Number(p.qty)
      })) : undefined
    };

    saveProduct.mutate(formattedPayload);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const meta = productResponse?.meta;

  return (
    <div className="p-6 space-y-6 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Katalog Produk</h1>
          <p className="text-slate-500 font-medium">Kelola item, varian unit, dan stok inventaris</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 text-white px-8 py-4 rounded-[1.5rem] font-bold flex items-center gap-2 hover:bg-blue-600 transition-all shadow-xl active:scale-95"
        >
          <Plus size={20} strokeWidth={3} /> Tambah Produk
        </button>
      </div>

      {/* FILTER & SEARCH */}
      <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input 
            type="text"
            placeholder="Cari produk atau SKU..."
            className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 border-2 border-transparent focus:border-blue-500 transition-all font-bold text-slate-700"
            value={search}
            onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
            }}
          />
        </div>
        <div className="flex items-center gap-2">
            {isFetching && <Loader2 className="animate-spin text-blue-600" size={20} />}
            <button 
                onClick={() => queryClient.invalidateQueries({ queryKey: ['products'] })}
                className="p-4 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all"
            >
                <RefreshCw size={20} />
            </button>
        </div>
      </div>

      {/* CONTENT */}
      {isLoading ? (
        <div className="flex flex-col items-center py-32 space-y-4">
          <div className="relative">
            <Loader2 className="animate-spin text-blue-600" size={48} strokeWidth={3} />
            <Package className="absolute inset-0 m-auto text-blue-200" size={20} />
          </div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Sinkronisasi Database...</p>
        </div>
      ) : (
        <>
          <ProductTable 
            data={productResponse?.data || []} 
            onEdit={handleEdit}
            onDelete={(id) => {
                if(window.confirm('Hapus produk ini beserta seluruh variannya?')) {
                    deleteProduct.mutate(id);
                }
            }}
          />

          {/* PAGINATION */}
          {meta && meta.last_page > 1 && (
            <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
              <p className="text-sm font-bold text-slate-400">
                Menampilkan <span className="text-slate-900">{productResponse?.data.length}</span> dari <span className="text-slate-900">{meta.total}</span> Produk
              </p>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(old => Math.max(old - 1, 1))}
                  className="p-3 rounded-xl border border-slate-100 hover:bg-slate-50 disabled:opacity-30 transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="flex items-center px-4 font-black text-sm uppercase italic">
                  Hal {page} / {meta.last_page}
                </div>
                <button
                  disabled={page >= meta.last_page}
                  onClick={() => setPage(old => old + 1)}
                  className="p-3 rounded-xl border border-slate-100 hover:bg-slate-50 disabled:opacity-30 transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* MODAL */}
      <ProductModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSaveProduct} // Gunakan handler transformasi di sini
        initialData={selectedProduct}
        isLoading={saveProduct.isPending}
      />
    </div>
  );
}