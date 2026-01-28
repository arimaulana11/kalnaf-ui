// src/lib/sync-manager.ts
import { db } from './db'; // Dexie atau IndexedDB instance
import axios from 'axios';

export const startSync = async () => {
  let batchSize = 50;
  
  // Ambil data yang belum ter-sync
  const pendingData = await db.products.where('sync_status').equals('pending').toArray();
  
  if (pendingData.length === 0) return;

  while (pendingData.length > 0) {
    const startTime = Date.now();
    const batch = pendingData.splice(0, batchSize);
    
    try {
      await axios.post('/api/sync/products', batch);
      
      // Update status di lokal jadi 'synced'
      const ids = batch.map(item => item.id);
      await db.products.bulkUpdate(ids.map(id => ({ key: id, changes: { sync_status: 'synced' } })));

      // Dinamis: Cek kecepatan
      const duration = Date.now() - startTime;
      if (duration < 1000) batchSize += 10;
      else if (duration > 3000) batchSize = Math.max(10, batchSize - 20);

    } catch (error) {
      console.error("Sync gagal, akan dicoba lagi saat online.");
      break; 
    }
  }
};