export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  sku?: string;          // Tambahkan ini (opsional)
  productType?: string;  // Tambahkan ini agar tidak error ts(2339)
}

export interface CartItem extends Product {
  quantity: number;
  tempId: string;
}