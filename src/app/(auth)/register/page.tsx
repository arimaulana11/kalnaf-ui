'use client';
import FormRenderer from '@/components/dynamic-form/FormRenderer';
import { REGISTER_FORM_META } from '@/constants/auth-meta';
import api from '@/lib/axios';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link'; // PERBAIKAN 1: Gunakan Link dari Next.js, bukan Lucide
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      // PERBAIKAN 2: Pastikan endpoint sesuai dengan base URL (biasanya pakai /api)
      // Jika di Postman Anda '/api/auth/register', gunakan itu.
      const response = await api.post('/auth/register', data);
      return response.data;
    },
    onSuccess: () => {
      alert("Pendaftaran berhasil! Silakan login.");
      router.push('/auth/login'); // PERBAIKAN 3: Arahkan ke path login yang benar
    },
    onError: (err: any) => {
      console.error(err);
      alert(err.response?.data?.message || "Registrasi Gagal");
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 font-sans">
      <div className="w-full max-w-md space-y-6">
        <FormRenderer 
          meta={REGISTER_FORM_META} 
          onSubmit={(data) => mutation.mutate(data)} 
          isLoading={mutation.isPending}
          submitLabel="Daftar Akun Baru"
        />

        <div className="text-center">
          <p className="text-slate-500 text-sm">
            Sudah memiliki akun bisnis?{' '}
            <Link 
              href="/auth/login" 
              className="font-bold text-blue-600 hover:text-blue-700 transition-colors duration-200 underline-offset-4 hover:underline"
            >
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}