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
      const response = await api.post('/auth/register', data);
      return { response: response.data, payload: data }; // Kembalikan payload juga agar email terbaca
    },
    onSuccess: (result) => {
      // Ambil email dari data yang diinput user saat daftar
      const email = result.payload.email;

      // Gunakan URLSearchParams untuk encode email agar aman di URL
      const params = new URLSearchParams({ email });

      alert("Pendaftaran berhasil! Silakan cek email Anda.");

      // Redirect ke /verify?email=user@mail.com
      router.push(`/verify?${params.toString()}`);
    },
    onError: (err: any) => {
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