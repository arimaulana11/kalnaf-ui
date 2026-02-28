"use client";

import React from 'react';
import { ProductSearchModal } from '@/components/inventory/ProductSearchModal';
import { StockMovementHeader } from '@/components/inventory/StockMovementHeader';
import { StockMovementSummary } from '@/components/inventory/StockMovementSummary';
import { StockMovementTable } from '@/components/inventory/StockMovementTable';
import { SupplierSelector } from '@/components/inventory/SupplierSelector';
import { StoreSelector } from '@/components/inventory/StoreSelector';
import { useStockMovement } from '@/hooks/useStockMovement';

export default function StockMovementPage() {
  // 1. Ambil SEMUA variabel yang diperlukan dari hook (termasuk modal state)
  const {
    movementType, setMovementType,
    items,
    referenceNo, setReferenceNo,
    reason, setReason,
    targetStoreId, setTargetStoreId,
    originStoreId, setOriginStoreId,
    isLoading,
    selectedSupplier, setSelectedSupplier,
    // --- Pastikan variabel modal di bawah ini ada di sini ---
    isProductModalOpen, setIsProductModalOpen,
    modalSearchQuery, setModalSearchQuery,
    modalProducts,
    isSearchingModal,
    // --- Handlers ---
    updateQty,
    updatePrice,
    removeItem,
    resetForm,
    handleSubmit,
    onProductSelect,
    stores
  } = useStockMovement();

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <StockMovementHeader
        movementType={movementType}
        setMovementType={setMovementType}
        resetForm={resetForm}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">

            {/* 1. SELEKSI TOKO ASAL */}
            <div className="mb-10 pb-10 border-b border-gray-50">
              <StoreSelector
                label="Origin Store (Toko Asal / Lokasi Stok)"
                stores={stores}
                selectedStoreId={originStoreId}
                onStoreChange={setOriginStoreId}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              {/* 2. KONDISIONAL INPUT */}
              {movementType === 'TRANSFER' ? (
                <StoreSelector
                  label="Target Store (Tujuan Transfer)"
                  // Filter agar toko asal tidak muncul sebagai tujuan
                  stores={stores?.filter(s => s.id !== originStoreId) || []}
                  selectedStoreId={targetStoreId}
                  onStoreChange={setTargetStoreId}
                />
              ) : (
                <SupplierSelector
                  movementType={movementType}
                  selectedSupplier={selectedSupplier}
                  setSelectedSupplier={setSelectedSupplier}
                  reason={reason}
                  setReason={setReason}
                />
              )}

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-gray-400 italic tracking-widest">Reference Number</label>
                <input
                  type="text"
                  value={referenceNo}
                  onChange={(e) => setReferenceNo(e.target.value)}
                  placeholder="E.G. TRX-990011"
                  className="w-full p-5 bg-gray-50 rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>

            {/* 3. TABEL ITEM */}
            <StockMovementTable
              items={items}
              movementType={movementType}
              onUpdateQty={updateQty}
              onUpdatePrice={updatePrice}
              onRemove={removeItem}
              onAddClick={() => {
                if (!originStoreId) return alert("Pilih Toko Asal terlebih dahulu");
                setIsProductModalOpen(true);
              }}
            />
          </div>
        </div>

        {/* 4. SUMMARY PANEL */}
        <StockMovementSummary
          totalSku={items.length}
          totalQty={items.reduce((acc, curr) => acc + curr.quantity, 0)}
          totalValue={items.reduce((acc, curr) => acc + (curr.quantity * (curr.purchasePrice || 0)), 0)}
          movementType={movementType}
          isLoading={isLoading}
          onProcess={handleSubmit}
          disabled={
            items.length === 0 ||
            !originStoreId ||
            (movementType === 'TRANSFER' && targetStoreId === originStoreId) // Proteksi asal == tujuan
          }
        />
      </div>

      {/* 5. MODAL PENCARIAN (Sudah lengkap dengan data dari hook) */}
      <ProductSearchModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSelect={onProductSelect}
        searchQuery={modalSearchQuery}
        setSearchQuery={setModalSearchQuery}
        products={modalProducts}
        isLoading={isSearchingModal}
      />
    </div>
  );
}