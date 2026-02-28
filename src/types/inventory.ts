export interface StockItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  purchasePrice: number; // Untuk Harga Baru (In)
  currentStock?: number;
}

export type MovementType = 'IN' | 'OUT' | 'TRANSFER';