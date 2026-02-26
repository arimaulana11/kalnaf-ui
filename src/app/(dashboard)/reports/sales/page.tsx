'use client';
import React, { useEffect, useState } from 'react';
import SalesDashboard from '../../../../components/reports/SalesDashboard';
import { getSalesReport } from '@/services/report.service'; // Sesuaikan path service Anda

const SalesPage: React.FC = () => {
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State untuk Filter
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    page: 1,
    limit: 10
  });

  const fetchReportData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Memanggil service yang sudah menggunakan axiosInstance
      const result = await getSalesReport({
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        page: filters.page,
        limit: filters.limit
      });

      if (result.success) {
        setReportData(result);
      } else {
        setError(result.message || 'Gagal mengambil data laporan');
      }
    } catch (err: any) {
      // Axios akan melempar error di sini jika response status bukan 2xx
      setError(err.response?.data?.message || 'Terjadi kesalahan pada server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [filters]); // Otomatis reload jika tanggal atau halaman berubah

  if (loading) return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
        <p className="text-gray-500 font-medium tracking-tight">Memuat Data Penjualan...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex h-screen items-center justify-center">
      <div className="bg-red-50 p-6 rounded-xl border border-red-200 text-center shadow-sm">
        <p className="text-red-600 font-bold mb-2">Error</p>
        <p className="text-red-500 text-sm mb-4">{error}</p>
        <button 
          onClick={fetchReportData}
          className="bg-red-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  );

  return (
    <SalesDashboard 
      reportData={reportData} 
      filters={filters}
      setFilters={setFilters}
    />
  );
};

export default SalesPage;