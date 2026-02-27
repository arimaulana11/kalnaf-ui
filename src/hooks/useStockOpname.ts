import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { debounce } from 'lodash';
import { getOpnameProducts, finalizeStockOpname, getMyStores } from '@/services/inventory.service'; // Pastikan getMyStores diimport

export const useStockOpname = () => {
    const router = useRouter();
    const [isAuditActive, setIsAuditActive] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [items, setItems] = useState<any[]>([]);
    const [inputExpressions, setInputExpressions] = useState<Record<string, string>>({});

    // State untuk Store
    const [selectedStoreId, setSelectedStoreId] = useState<string>("");
    const [stores, setStores] = useState<any[]>([]);

    // 1. Fungsi ambil daftar toko dari API
    const fetchStores = async () => {
        try {
            const response = await getMyStores(); // Panggil endpoint /api/stores/my-access
            if (response?.data) {
                setStores(response.data); // Karena data ada di property "data" sesuai response JSON Anda
            }
        } catch (error) {
            console.error("Failed to fetch stores:", error);
        }
    };

    // Load stores saat pertama kali render
    useEffect(() => {
        fetchStores();
    }, []);

    useEffect(() => {
        const getInitialStores = async () => {
            try {
                const res = await getMyStores();
                if (res.success) setStores(res.data); // data sesuai JSON curl anda
            } catch (e) { console.error(e) }
        };
        getInitialStores();
    }, []);

    const evaluateExpression = (input: string): number => {
        try {
            const sanitized = input.replace(/[^-+*/0-9.]/g, '');
            if (!sanitized) return 0;
            const result = new Function(`return ${sanitized}`)();
            return isFinite(result) ? Math.floor(Math.max(0, result)) : 0;
        } catch { return 0; }
    };

    const fetchProducts = async (query: string) => {
        // Hanya fetch jika audit aktif DAN store sudah dipilih
        if (!isAuditActive || !selectedStoreId) return;

        try {
            setIsLoadingData(true);
            // Sertakan selectedStoreId agar API memfilter barang milik toko tersebut
            const response = await getOpnameProducts(query, selectedStoreId);
            const products = response?.data?.data;

            if (Array.isArray(products)) {
                setItems(products.map((item: any) => ({
                    id: item.id.toString(),
                    baseVariantId: item.baseVariantId,
                    name: item.name,
                    sku: item.sku,
                    systemStock: Number(item.systemStock || 0),
                    physicalStock: Number(item.systemStock || 0),
                    unitName: item.unitName || 'Unit',
                    baseUnitName: item.baseUnitName,
                    multiplier: Number(item.multiplier || 1),
                    isBase: item.isBase,
                    note: ''
                })));
            }
        } catch (error) {
            console.error("Fetch Error:", error);
        } finally {
            setIsLoadingData(false);
        }
    };

    const debouncedSearch = useCallback(debounce((v) => fetchProducts(v), 500), [isAuditActive, selectedStoreId]);

    // Re-fetch jika session dimulai
    useEffect(() => {
        if (isAuditActive) fetchProducts(searchQuery);
    }, [isAuditActive]);

    const handlePhysicalChange = (id: string, rawValue: string) => {
        setInputExpressions(prev => ({ ...prev, [id]: rawValue }));

        if (!/[+*/-]$/.test(rawValue)) {
            const calculated = evaluateExpression(rawValue);
            setItems(prev => prev.map(item =>
                item.id === id ? { ...item, physicalStock: calculated } : item
            ));
        }
    };

    const handleFinalize = async () => {
        const changedItems = items.filter(item => item.physicalStock !== item.systemStock);

        if (!selectedStoreId) {
            alert("Harap pilih toko terlebih dahulu.");
            return;
        }

        if (changedItems.length === 0) {
            alert("Tidak ada perubahan stok.");
            return;
        }

        if (!confirm(`Finalize ${changedItems.length} item?`)) return;

        try {
            setIsSubmitting(true);
            const payload = {
                storeId: selectedStoreId,
                auditorName: "Staff Gudang",
                items: changedItems.map(item => {
                    const actualBaseQty = Math.floor(item.physicalStock * item.multiplier);
                    return {
                        variantId: item.baseVariantId,
                        actualQty: actualBaseQty,
                        note: `Opname via ${item.unitName}. Final: ${actualBaseQty} ${item.baseUnitName}`
                    };
                })
            };

            const res = await finalizeStockOpname(payload);
            if (res.success) {
                alert("Berhasil sinkronisasi!");
                router.push('/inventory/stock-opname/history');
            }
        } catch (error) {
            alert("Gagal mengirim data.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        isAuditActive, setIsAuditActive,
        isSubmitting, isLoadingData,
        searchQuery, setSearchQuery,
        items, inputExpressions,
        selectedStoreId, setSelectedStoreId,
        stores,
        debouncedSearch, handlePhysicalChange,
        handleFinalize, router
    };
};