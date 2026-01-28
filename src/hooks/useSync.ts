import { useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '@/lib/db';
import axiosInstance from '@/lib/axios';

export const useSync = () => {
  const queryClient = useQueryClient();

  const syncMutation = useMutation({
    mutationFn: async () => {
      // 1. Ambil data dengan status 'pending' menggunakan index Dexie (Sangat Cepat)
      let pendingItems = await db.products.where('sync_status').equals('pending').toArray();
      
      if (pendingItems.length === 0) return 0;

      let batchSize = 50; // Mulai dengan 50 data
      let processedCount = 0;

      console.log(`🚀 Memulai sinkronisasi ${pendingItems.length} data...`);

      while (pendingItems.length > 0) {
        const startTime = Date.now();
        
        // 2. Ambil potongan data sesuai batchSize
        const batch = pendingItems.splice(0, batchSize);
        
        try {
          // 3. Kirim BATCH ke server (Pastikan Backend Anda siap menerima Array)
          await axiosInstance.post('/products/bulk', { products: batch });

          // 4. Update status di IndexedDB secara massal (Bulk)
          const ids = batch.map(item => item.id);
          await db.products.where('id').anyOf(ids).modify({ sync_status: 'synced' });
          
          processedCount += batch.length;

          // 5. LOGIKA ADAPTIF: Cek kecepatan respon
          const duration = Date.now() - startTime;
          if (duration < 1000) {
            batchSize = Math.min(100, batchSize + 10); // Sinyal bagus? Naikkan
          } else if (duration > 3000) {
            batchSize = Math.max(10, batchSize - 20); // Sinyal lemot? Turunkan
          }

          console.log(`✅ Berhasil kirim ${batch.length} data. Next batch size: ${batchSize}`);

        } catch (err) {
          console.error("❌ Batch gagal, menghentikan proses untuk mencoba lagi nanti.");
          throw err; // Lempar error agar React Query tahu ini gagal
        }
      }
      return processedCount;
    },
    onSuccess: (count) => {
      console.log(`🎉 Sinkronisasi selesai. ${count} data terupdate.`);
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      console.error("Sync Error:", error);
    }
  });

  return { 
    syncNow: syncMutation.mutate, 
    isSyncing: syncMutation.isPending,
    error: syncMutation.error 
  };
};