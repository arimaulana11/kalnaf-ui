/**
 * BASE INTERFACES (Untuk Response API)
 */
export type ProductType = 'PHYSICAL' | 'PARCEL';

export interface CategoryRelation {
  id: number;
  name: string;
}

export interface Stock {
  id: number;
  storeId: string;
  variantId: number;
  stockQty: string; // Database sering menyimpan Decimal sebagai string
}

export interface ProductVariant {
  id: number;
  productId: number;
  name: string;
  sku: string;
  unitName: string;
  price: number;
  multiplier: number;
  isBaseUnit: boolean;
  available_stock: number;
  parentVariantId?: number | null;
  stocks?: Stock[];
}

export interface Product {
  id: number;
  tenantId: string;
  categoryId: number;
  name: string;
  description: string;
  type: ProductType;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  categories: CategoryRelation;
  productVariants: ProductVariant[];
}

/**
 * PAYLOAD INTERFACES (Untuk Create/Update)
 */

export interface ProductVariantPayload {
  id?: number;          // Untuk Update
  name: string;         // Contoh: "Kemasan 5 Kg"
  sku: string;          // Contoh: "BRS-5KG"
  unitName: string;     // Contoh: "Pack"
  price: number;        
  multiplier: number;   // Contoh: 5000 (untuk 5kg ke gram)
  isBaseUnit: boolean;
  parentSku?: string | null; // Sesuai CURL: menggunakan parentSku untuk relasi Multi-UOM
}

export interface InitialStockPayload {
  storeId: string;
  qty: number;
  purchasePrice: number;
}

export interface ParcelItemPayload {
  variantId: number;
  qty: number;
}

export interface ProductPayload {
  categoryId: number;
  name: string;
  description?: string;
  type: ProductType;
  imageUrl?: string;
  isActive?: boolean;
  purchasePrice?: number; // HPP Utama
  variants: ProductVariantPayload[];
  initialStocks?: InitialStockPayload[]; // Untuk kasus "Create Product with Initial Stock"
  parcelItems?: ParcelItemPayload[];     // Untuk kasus "Create Parcel Product"
}