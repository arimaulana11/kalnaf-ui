import Dexie, { type Table } from 'dexie';

// Definisikan tipe data produk untuk IndexedDB
export interface Product {
  id: string;          // Gunakan ID dari Backend (UUID)
  name: string;
  stock: number;
  price: number;
  category: string;
  updated_at: string;
  sync_status: 'synced' | 'pending'; // Kunci utama untuk fitur Sync kita
}

export class KalnafDatabase extends Dexie {
  products!: Table<Product>; 

  constructor() {
    super('KalnafDB');
    this.version(1).stores({
      // Indexing 'id' sebagai primary key dan 'sync_status' untuk filter cepat
      products: 'id, name, category, sync_status' 
    });
  }
}

export const db = new KalnafDatabase();