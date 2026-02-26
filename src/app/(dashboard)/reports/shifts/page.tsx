"use client";

import React, { useEffect, useState } from 'react';
import ShiftDashboard from '@/components/reports/ShiftDashboard';
import { getShiftReports } from '@/services/report.service';

const ShiftReportPage: React.FC = () => {
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    startDate: '',
    endDate: ''
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await getShiftReports(filters);
      if (result.success) setReportData(result);
    } catch (error) {
      console.error("Shift fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  if (loading) return <div className="p-10 text-center font-bold">Memuat Laporan Shift...</div>;
  if (!reportData) return <div className="p-10 text-center text-red-500">Gagal memuat data.</div>;

  return (
    <ShiftDashboard 
      reportData={reportData} 
      filters={filters} 
      setFilters={setFilters} 
    />
  );
};

export default ShiftReportPage;