import { TransactionHistory } from "@/components/cashier/TransactionHistory";

export default function HistoryPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Memanggil View yang sudah kita buat sebelumnya */}
      <TransactionHistory />
    </main>
  );
}