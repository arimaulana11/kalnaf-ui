'use client';
import FormRenderer from '@/components/dynamic-form/FormRenderer';
import { LOGIN_FORM_META } from '@/constants/forms/auth';
import { authService } from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  const handleLogin = async (formData: any) => {
    try {
      setError('');
      await authService.login(formData);
      
      // Redirect ke dashboard setelah sukses
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Email atau password salah');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black italic text-blue-600">KALNAF</h1>
          <p className="text-gray-500 mt-2">Sistem Kasir Offline-First</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <FormRenderer meta={LOGIN_FORM_META} onSubmit={handleLogin} />
        
        <p className="mt-6 text-center text-sm text-gray-600">
          Belum punya akun? <a href="/register" className="text-blue-600 font-bold">Daftar Toko</a>
        </p>
      </div>
    </div>
  );
}