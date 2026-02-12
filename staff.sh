#!/bin/bash

# 1. Create Base Directories dengan pengaman untuk Route Group (dashboard)
mkdir -p "src/components/staff"
mkdir -p "src/hooks"
mkdir -p "src/services"
mkdir -p "src/types"
mkdir -p "src/lib/validations"
mkdir -p "src/app/(dashboard)/staff"

# 2. Create Types (Sesuai model users di Prisma)
cat <<EOF > "src/types/staff.ts"
export interface Staff {
  id: string; // UUID
  tenant_id: string; // UUID
  name: string | null;
  email: string;
  role: string; // default: owner, manager, staff, dll
  is_active: boolean | null;
  last_login_at: string | null;
  created_at: string | null;
}
EOF

# 3. Create Zod Validation (Sesuai kolom di tabel users)
cat <<EOF > "src/lib/validations/staff.ts"
import { z } from "zod";

export const staffSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter").nullable(),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter").optional().or(z.literal('')),
  role: z.enum(["owner", "manager", "staff"]).default("staff"),
  is_active: z.boolean().default(true),
});

export type StaffFormValues = z.infer<typeof staffSchema>;
EOF

# 4. Create Service (Targeting endpoint /api/users atau /api/staff)
cat <<EOF > "src/services/staff.service.ts"
import axios from 'axios';
import { Staff } from '../types/staff';
import { StaffFormValues } from '../lib/validations/staff';

export const staffService = {
  getAll: async () => {
    const { data } = await axios.get<Staff[]>('/api/staff');
    return data;
  },
  create: async (payload: StaffFormValues) => {
    const { data } = await axios.post<Staff>('/api/staff', payload);
    return data;
  },
  update: async (id: string, payload: Partial<StaffFormValues>) => {
    const { data } = await axios.patch<Staff>(\`/api/staff/\${id}\`, payload);
    return data;
  },
  delete: async (id: string) => {
    await axios.delete(\`/api/staff/\${id}\`);
  }
};
EOF

# 5. Create Hook (React Query)
cat <<EOF > "src/hooks/useStaff.ts"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { staffService } from '../services/staff.service';
import toast from 'react-hot-toast';

export const useStaff = () => {
  const queryClient = useQueryClient();

  const staffQuery = useQuery({
    queryKey: ['staff'],
    queryFn: staffService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: staffService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast.success('Staff berhasil ditambahkan');
    },
    onError: () => toast.error('Gagal menambahkan staff')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => staffService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast.success('Staff berhasil diperbarui');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: staffService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast.success('Staff berhasil dihapus');
    }
  });

  return { staffQuery, createMutation, updateMutation, deleteMutation };
};
EOF

# 6. Create Staff Form Modal Component
cat <<EOF > "src/components/staff/StaffFormModal.tsx"
"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { staffSchema, StaffFormValues } from "@/lib/validations/staff";
import { Staff } from "@/types/staff";
import { X, Loader2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StaffFormValues) => void;
  initialData?: Staff | null;
  loading: boolean;
}

export default function StaffFormModal({ isOpen, onClose, onSubmit, initialData, loading }: Props) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: { role: 'staff', is_active: true }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        email: initialData.email,
        role: initialData.role as any,
        is_active: initialData.is_active ?? true
      });
    } else {
      reset({ name: '', email: '', role: 'staff', is_active: true });
    }
  }, [initialData, reset, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-bold text-lg">{initialData ? 'Edit Staff' : 'Tambah Staff'}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition"><X size={20}/></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Nama</label>
            <input {...register('name')} className="w-full border p-2 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Masukkan nama lengkap" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input {...register('email')} className="w-full border p-2 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="email@contoh.com" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          {!initialData && (
            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input {...register('password')} type="password" placeholder="Min. 6 karakter" className="w-full border p-2 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none" />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Role</label>
              <select {...register('role')} className="w-full border p-2 rounded-md bg-white">
                <option value="staff">Staff</option>
                <option value="manager">Manager</option>
                <option value="owner">Owner</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Status</label>
              <select {...register('is_active', { setValueAs: v => v === 'true' })} className="w-full border p-2 rounded-md bg-white">
                <option value="true">Aktif</option>
                <option value="false">Non-aktif</option>
              </select>
            </div>
          </div>
          <div className="pt-4 flex gap-2">
            <button type="button" onClick={onClose} className="flex-1 border p-2 rounded-md hover:bg-gray-50">Batal</button>
            <button disabled={loading} className="flex-1 bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 flex justify-center items-center gap-2">
              {loading ? <Loader2 className="animate-spin" size={18} /> : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
EOF

# 7. Create Staff List Container
cat <<EOF > "src/components/StaffListContainer.tsx"
"use client";
import { useState } from "react";
import { useStaff } from "@/hooks/useStaff";
import { Plus, Edit, Trash2, UserCircle, Search, Mail, ShieldCheck } from "lucide-react";
import StaffFormModal from "./staff/StaffFormModal";
import { Staff } from "@/types/staff";

export default function StaffListContainer() {
  const { staffQuery, createMutation, updateMutation, deleteMutation } = useStaff();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = staffQuery.data?.filter(s => 
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (staff: Staff) => {
    setSelectedStaff(staff);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedStaff(null);
    setIsModalOpen(true);
  };

  const onSubmit = (data: any) => {
    if (selectedStaff) {
      updateMutation.mutate({ id: selectedStaff.id, data }, { onSuccess: () => setIsModalOpen(false) });
    } else {
      createMutation.mutate(data, { onSuccess: () => setIsModalOpen(false) });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
          <input 
            type="text" 
            placeholder="Cari staff..." 
            className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button onClick={handleAdd} className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-700 transition shadow-sm">
          <Plus size={18}/> Tambah Staff
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
              ) : filteredData?.length === 0 ? (
                <tr><td colSpan={4} className="p-10 text-center text-gray-400">Tidak ada data staff ditemukan.</td></tr>
              ) : filteredData?.map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-50 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                        <UserCircle size={24}/>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{staff.name || 'Tanpa Nama'}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1"><Mail size={12}/> {staff.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <ShieldCheck size={14} className="text-indigo-500"/>
                      <span className="capitalize">{staff.role}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={\`px-2.5 py-1 rounded-full text-xs font-medium \${staff.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}\`}>
                      {staff.is_active ? 'Aktif' : 'Non-aktif'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-3">
                      <button onClick={() => handleEdit(staff)} className="p-1 text-gray-400 hover:text-indigo-600 transition" title="Edit Staff">
                        <Edit size={18}/>
                      </button>
                      <button 
                        onClick={() => { if(confirm('Hapus staff ' + staff.email + '?')) deleteMutation.mutate(staff.id) }} 
                        className="p-1 text-gray-400 hover:text-red-600 transition"
                        title="Hapus Staff"
                      >
                        <Trash2 size={18}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
EOF

# 8. Create Page Entry di Route Group (dashboard)
cat <<EOF > "src/app/(dashboard)/staff/page.tsx"
"use client";

import StaffListContainer from "@/components/StaffListContainer";

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
EOF

echo "✅ CRUD Staff sesuai skema users Prisma berhasil dibuat!"