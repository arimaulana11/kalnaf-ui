'use client';
import { LOGIN_FORM_META } from '@/constants/auth-meta';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/axios';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import FormRenderer from '@/components/dynamic-form/FormRenderer';
import Link from 'next/link'; // Import Link

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/auth/login', data);
      return res.data;
    },
    onSuccess: (res) => {
      console.log("Response Full API:", res); // Debug: Pastikan access_token ada di sini

      const token = res.data.access_token;

      if (token) {
        // Panggil setAuth dari hook Zustand
        setAuth(token, null);

        // Beri jeda sangat singkat agar Zustand selesai menulis ke LocalStorage
        // sebelum router pindah halaman
        setTimeout(() => {
          router.push('/dashboard');
        }, 100);
      } else {
        console.error("Token tidak ditemukan di response API!");
      }
    },
    onError: (err: any) => alert(err.response?.data?.message || "Login Gagal")
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 font-sans">
      <div className="w-full max-w-md space-y-6"> {/* Tambahkan space-y-6 */}
        <FormRenderer
          meta={LOGIN_FORM_META}
          onSubmit={(data) => mutation.mutate(data)}
          isLoading={mutation.isPending}
          submitLabel="Masuk"
        />

        {/* Link Register dengan Style 2026 */}
        <div className="text-center">
          <p className="text-slate-500 text-sm">
            Belum memiliki akun bisnis?{' '}
            <Link
              href="/register"
              className="font-bold text-blue-600 hover:text-blue-700 transition-colors duration-200 underline-offset-4 hover:underline"
            >
              Daftar Sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}