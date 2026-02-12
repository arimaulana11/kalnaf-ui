"use client";

import StaffListContainer from "@/components/staff/StaffListContainer";

export default function StaffPage() {
  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Pengguna</h1>
        <p className="text-gray-500">Kelola akses staff dan manager untuk toko Anda.</p>
      </div>
      
      <StaffListContainer />
    </div>
  );
}
