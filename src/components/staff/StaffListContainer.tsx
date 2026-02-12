"use client";
import { useState } from "react";
import { useStaff } from "@/hooks/useStaff";
import { Plus, Edit, Trash2, UserCircle, Search, Mail, ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";
import StaffFormModal from "./StaffFormModal";
import { Staff } from "@/types/staff";

export default function StaffListContainer() {
  // 1. State untuk halaman (Default ke 1)
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  
  // 2. Kirim parameter page ke hook useStaff (pastikan hook & service kamu menerima parameter ini)
  const { staffQuery, createMutation, updateMutation, deleteMutation } = useStaff(page);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  // Akses data dan meta
  const staffList = Array.isArray(staffQuery.data?.data?.data) ? staffQuery.data.data.data : [];
  const meta = staffQuery.data?.data?.meta;

  const filteredData = staffList.filter((s: Staff) => {
    return (
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleEdit = (staff: Staff) => {
    setSelectedStaff(staff);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedStaff(null);
    setIsModalOpen(true);
  };

  const onSubmit = (values: any) => {
    if (selectedStaff) {
      updateMutation.mutate(
        { id: selectedStaff.id, data: values }, 
        { onSuccess: () => setIsModalOpen(false) }
      );
    } else {
      const { is_active, ...createPayload } = values;
      createMutation.mutate(createPayload, { 
        onSuccess: () => setIsModalOpen(false) 
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Cari staff..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={handleAdd}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-700 transition shadow-sm"
        >
          <Plus size={18} /> Tambah Staff
        </button>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-semibold text-sm text-gray-600 uppercase">Profil</th>
                <th className="p-4 font-semibold text-sm text-gray-600 uppercase">Akses</th>
                <th className="p-4 font-semibold text-sm text-gray-600 uppercase">Status</th>
                <th className="p-4 font-semibold text-sm text-gray-600 uppercase text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {staffQuery.isLoading ? (
                <tr><td colSpan={4} className="p-10 text-center text-gray-400">Memuat data...</td></tr>
              ) : filteredData.length === 0 ? (
                <tr><td colSpan={4} className="p-10 text-center text-gray-400">Tidak ada data staff ditemukan.</td></tr>
              ) : filteredData.map((staff: Staff) => (
                <tr key={staff.id} className="hover:bg-gray-50 transition">
                  {/* ... (Data Row Sama Seperti Sebelumnya) ... */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                        <UserCircle size={24} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{staff.name || 'Tanpa Nama'}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1"><Mail size={12} /> {staff.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <ShieldCheck size={14} className="text-indigo-500" />
                      <span className="capitalize">{staff.role}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${staff.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {staff.is_active ? 'Aktif' : 'Non-aktif'}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-3">
                      <button onClick={() => handleEdit(staff)} className="p-1 text-gray-400 hover:text-indigo-600 transition"><Edit size={18} /></button>
                      <button onClick={() => { if (confirm('Hapus?')) deleteMutation.mutate(staff.id) }} className="p-1 text-gray-400 hover:text-red-600 transition"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION UI */}
        {meta && meta.lastPage > 1 && (
          <div className="px-4 py-3 bg-gray-50 border-t flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Menampilkan <span className="font-medium">{filteredData.length}</span> dari <span className="font-medium">{meta.total}</span> staff
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 border rounded bg-white hover:bg-gray-50 disabled:opacity-50 transition"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex items-center px-4 text-sm font-medium">
                Halaman {meta.page} dari {meta.lastPage}
              </div>
              <button
                onClick={() => setPage(p => Math.min(meta.lastPage, p + 1))}
                disabled={page === meta.lastPage}
                className="p-2 border rounded bg-white hover:bg-gray-50 disabled:opacity-50 transition"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      <StaffFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={onSubmit}
        initialData={selectedStaff}
        loading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}