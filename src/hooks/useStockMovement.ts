import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import api from '@/lib/axios'; // Pastikan path axios Anda benar
import {
  getMyStores,
  getOpnameProducts,
  stockIn,
  stockOut,
  transferStock
} from '@/services/inventory.service';

export type MovementType = 'IN' | 'OUT' | 'TRANSFER';

export const useStockMovement = () => {
  // --- Form States ---
  const [movementType, setMovementType] = useState<MovementType>('IN');
  const [items, setItems] = useState<any[]>([]);
  const [referenceNo, setReferenceNo] = useState("");
  const [reason, setReason] = useState(""); // Untuk OUT: 'WASTE' | 'EXPIRED' | 'DAMAGE'

  // State Toko & Relasi
  const [originStoreId, setOriginStoreId] = useState("");
  const [targetStoreId, setTargetStoreId] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);

  // --- UI States ---
  const [isLoading, setIsLoading] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [stores, setStores] = useState<any[]>([]);

  // --- Modal Search States ---
  const [modalSearchQuery, setModalSearchQuery] = useState("");
  const [modalProducts, setModalProducts] = useState<any[]>([]);
  const [isSearchingModal, setIsSearchingModal] = useState(false);

  // 1. Load Initial Data (Stores)
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await getMyStores();
        if (res.data) setStores(res.data);
      } catch (e) {
        console.error("Failed to load stores", e);
      }
    };
    fetchStores();
  }, []);

  // 2. Search Products Logic
  const fetchModalProducts = async (query: string, storeId: string) => {
    if (!storeId || !isProductModalOpen) return;
    setIsSearchingModal(true);
    try {
      const res = await getOpnameProducts(query, storeId);
      console.log("res.data ", res.data)
      if (res?.data) setModalProducts(res.data.data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearchingModal(false);
    }
  };

  const debouncedFetch = useCallback(
    debounce((q: string, sId: string) => fetchModalProducts(q, sId), 500),
    [isProductModalOpen]
  );

  useEffect(() => {
    if (isProductModalOpen && originStoreId) {
      debouncedFetch(modalSearchQuery, originStoreId);
    }
  }, [modalSearchQuery, originStoreId, isProductModalOpen, debouncedFetch]);

  // 3. Reset targetStore jika bukan tipe TRANSFER
  useEffect(() => {
    if (movementType !== 'TRANSFER') setTargetStoreId("");
  }, [movementType]);

  // --- Handlers ---
  const updateQty = (id: string, qty: number) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, qty) } : i));
  };

  const updatePrice = (id: string, price: number) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, purchasePrice: price } : i));
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const resetForm = () => {
    setItems([]);
    setReferenceNo("");
    setSelectedSupplier(null);
    setReason("");
    setTargetStoreId("");
  };

  const onProductSelect = (p: any) => {
    setItems(prev => {
      const exists = prev.find(i => i.id === p.id.toString());
      if (exists) {
        return prev.map(i => i.id === p.id.toString() ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, {
        id: p.id.toString(),
        name: p.name,
        sku: p.sku,
        quantity: 1,
        purchasePrice: p.purchasePrice || 0,
        currentStock: p.systemStock || 0,
        unitName: p.unitName
      }];
    });
    setIsProductModalOpen(false);
    setModalSearchQuery("");
  };

  // --- MAIN SUBMIT LOGIC ---
  const handleSubmit = async () => {
    if (!originStoreId) return alert("Pilih Toko Asal terlebih dahulu");
    if (items.length === 0) return alert("Tambahkan minimal 1 produk");
    if (movementType === 'TRANSFER' && !targetStoreId) return alert("Pilih Toko Tujuan");

    setIsLoading(true);
    try {
      const promises = items.map(item => {
        const basePayload = {
          variantId: parseInt(item.id),
          qty: item.quantity,
          referenceId: referenceNo || `${movementType}-${Date.now()}`,
          notes: reason || `Process ${movementType}`,
        };

        // ... di dalam loops items.map ...

        if (movementType === 'IN') {
          return stockIn({
            variantId: parseInt(item.id),
            qty: item.quantity,
            purchasePrice: item.purchasePrice || 0,
            supplierId: selectedSupplier?.id || null,
            storeId: originStoreId,
            referenceId: referenceNo || `IN-${Date.now()}`,
            notes: reason || "Stock In Manual",
            // TAMBAHKAN INI:
            receivedFrom: selectedSupplier?.name || "Supplier Manual",
          });
        }

        if (movementType === 'OUT') {
          // 1. Ambil keterangan dari item (jika ada) atau gunakan fallback
          const itemRemark = (item as any).notes || (item as any).remark || 'Tanpa catatan tambahan';

          // 2. Buat deskripsi yang lebih manusiawi dan deskriptif
          const detailedNotes = [
            `Stok Keluar (${reason})`,
            reason === 'WASTE' ? 'Barang Rusak/Dibuang' :
              reason === 'EXPIRED' ? 'Barang Kadaluarsa' :
                'Kerusakan/Lainnya',
            `Keterangan: ${itemRemark}`
          ].join(' - ');

          return stockOut({
            variantId: parseInt(item.id),
            storeId: originStoreId,
            qty: item.quantity,
            type: reason as any,
            referenceId: referenceNo || `OUT-${Date.now()}`,
            notes: detailedNotes,
          });
        }

        if (movementType === 'TRANSFER') {
          return transferStock({
            ...basePayload,
            fromStoreId: originStoreId,
            toStoreId: targetStoreId,
          });
        }
      });

      await Promise.all(promises);
      alert(`Berhasil memproses ${items.length} item!`);
      resetForm();
    } catch (error: any) {
      const msg = error.response?.data?.message || "Gagal memproses transaksi";
      alert(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    movementType, setMovementType,
    items, setItems,
    referenceNo, setReferenceNo,
    reason, setReason,
    originStoreId, setOriginStoreId,
    targetStoreId, setTargetStoreId,
    isLoading,
    selectedSupplier, setSelectedSupplier,
    stores,
    isProductModalOpen, setIsProductModalOpen,
    modalSearchQuery, setModalSearchQuery,
    modalProducts,
    isSearchingModal,
    onProductSelect,
    updateQty, updatePrice, removeItem, resetForm, handleSubmit
  };
};