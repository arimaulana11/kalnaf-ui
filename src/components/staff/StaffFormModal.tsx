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
