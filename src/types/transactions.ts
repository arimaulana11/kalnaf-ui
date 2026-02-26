// types/transactions.ts

export type PaymentStatus = 'PAID' | 'PARTIAL' | 'UNPAID' | 'VOID' | 'DEBT';

export interface TransactionSummary {
  db_id: number;
  id: string;        // "TRX-000008"
  customer: string;  // "Pelanggan Umum"
  cashier: string;   // "1772081986727"
  date: string;      // "26 Feb 2026"
  time: string;      // "12.30"
  status: string;    // "PAID"
  total: number;     // 140000
  items: number;     // 1
}

export interface TransactionHistoryResponse {
    success: boolean;
    message: string;
    statusCode: number;
    data: {
        data: TransactionSummary[]; // Array list transaksi
        meta: {
            total: number;
            page: number;
            lastPage: number;
        };
    };
}

export interface TransactionItem {
    name: string;
    quantity: number;
    price: number;
    total: number;
}

export interface TransactionPricing {
    subtotal: number;
    tax_percentage: number;
    tax_amount: number;
    grand_total: number;
    discount?: number;
}

export interface TransactionDetail {
    db_id: number;
    id: string;               // TRX-000008
    status: string;           // PAID, VOID, dll
    cashier_name: string;
    customer: string;
    time: string;
    date: string;
    items: TransactionItem[]; // Array produk yang dibeli
    pricing: TransactionPricing;
}

export interface TransactionDetailResponse {
    success: boolean;
    message: string;
    data: TransactionDetail; // Object detail tunggal
}