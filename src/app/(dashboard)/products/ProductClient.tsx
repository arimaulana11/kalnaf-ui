'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Product, ProductPayload } from '@/types/product';
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

  // 1. Fetch Data
  const { data: productResponse, isLoading, isFetching } = useQuery({
    queryKey: ['products', page, search],
    queryFn: async () => {
      const res = await api.get(`/products`, {
        params: { page, limit: 10, search: search || undefined }
      });
      return res.data.data;
    },
    placeholderData: (previousData) => previousData,
  });

  // --- LETAKKAN DI SINI ---
  // Ambil meta dari response. Pastikan struktur backend Anda adalah { data: [...], meta: {...} }
  const meta = productResponse?.meta;

  // 2. Save Mutation
  const saveProduct = useMutation({
    mutationFn: async (payload: ProductPayload) => {
      if (selectedProduct?.id) {
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

  // 3. Delete Mutation
  const deleteProduct = useMutation({
    mutationFn: async (id: number) => api.delete(`/products/${id}/force`),
    onSuccess: () => {
      toast.success('Produk berhasil dihapus');
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });

  // 4. Transformasi Data SEBELUM dikirim ke Backend
  const handleSaveProduct = (rawForm: any) => {
    const baseVariant = rawForm.variants.find((v: any) => v.isBaseUnit);
    const baseSku = baseVariant?.sku || null;

    const formattedPayload: any = {
      name: rawForm.name,
      description: rawForm.description || '',
      categoryId: Number(rawForm.categoryId),
      type: rawForm.type || 'PHYSICAL',
      imageUrl: rawForm.imageUrl || '',
      isActive: rawForm.isActive ?? true,
      purchasePrice: Number(rawForm.purchasePrice || 0),

      // 1. Mapping Variants
      variants: rawForm.variants.map((v: any) => ({
        ...(v.id && { id: v.id }),
        name: v.name,
        sku: v.sku,
        unitName: v.unitName,
        price: Number(v.price),
        multiplier: Number(v.multiplier),
        isBaseUnit: !!v.isBaseUnit,
        parentSku: v.isBaseUnit ? null : (v.parentSku || baseSku),

        // 2. PINDAHKAN LOGIKA KOMPONEN KE SINI
        // Karena JSON yang kamu mau: variants[ { components: [...] } ]
        ...(rawForm.type === 'PARCEL' && {
          components: v.components?.map((c: any) => ({
            componentVariantId: Number(c.componentVariantId),
            qty: Number(c.qty)
          })) || []
        })
      })),
    };

    // 3. Mapping Parcel Items (Hanya jika backend minta di level root, 
    // tapi berdasarkan JSON request kamu sebelumnya, ini seharusnya ada di dalam variants)
    // Jika backend kamu minta di level root dengan nama 'parcelItems', gunakan ini:
    if (rawForm.type === 'PARCEL' && !formattedPayload.variants[0].components) {
      formattedPayload.parcelItems = rawForm.variants[0].components?.map((p: any) => ({
        variantId: Number(p.componentVariantId),
        qty: Number(p.qty)
      }));
    }

    // Initial Stocks HANYA dikirim saat CREATE
    if (!selectedProduct) {
      formattedPayload.initialStocks = rawForm.initialStocks?.map((s: any) => ({
        storeId: s.storeId,
        qty: Number(s.qty),
        purchasePrice: Number(s.purchasePrice || rawForm.purchasePrice)
      }));
    }

    console.log("PAYLOAD SIAP KIRIM:", formattedPayload);
    saveProduct.mutate(formattedPayload);
  };

  // 5. Transformasi Data SAAT TOMBOL EDIT DIKLIK
  const handleEdit = (product: Product) => {
    // Meratakan data agar Modal bisa membaca value dengan mudah
    const preparedData = {
      ...product,
      categoryId: product.categoryId?.toString(), // Seringkali select butuh string
      // Pastikan varian terpetakan lengkap
      variants: product.productVariants?.map(v => ({
        ...v,
        price: v.price,
        multiplier: v.multiplier
      })),
      // Mapping parcelItems agar componentVariantId terisi di UI
      parcelItems: product.productVariants?.map(item => ({
        variantId: item.id,
        componentVariantId: item.id, // Sync dengan component manager
        qty: item.stocks
      }))
    };

    setSelectedProduct(preparedData as any);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

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
              if (window.confirm('Hapus produk ini beserta seluruh variannya?')) {
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