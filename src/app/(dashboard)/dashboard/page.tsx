export default function DashboardPage() {
  const stats = [
    { label: 'Penjualan Hari Ini', value: 'Rp 2.450.000', color: 'bg-blue-500' },
    { label: 'Transaksi', value: '12', color: 'bg-purple-500' },
    { label: 'Stok Menipis', value: '5 Item', color: 'bg-orange-500' },
    { label: 'Total Hutang', value: 'Rp 450.000', color: 'bg-red-500' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Halo, Selamat Datang! 👋</h1>
        <p className="text-gray-500">Berikut adalah ringkasan toko Anda hari ini.</p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 font-medium">{s.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{s.value}</p>
            <div className={`h-1 w-12 ${s.color} rounded-full mt-4`}></div>
          </div>
        ))}
      </div>

      {/* RECENT TRANSACTIONS PLACEHOLDER */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 mb-4">Transaksi Terakhir</h3>
        <div className="h-48 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-xl text-gray-400 italic">
          Data transaksi akan muncul di sini setelah tersambung ke IndexedDB.
        </div>
      </div>
    </div>
  );
}