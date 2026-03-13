'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, ShieldCheck, Loader2, RotateCcw, Timer } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { authService } from '@/services/auth.service';

const verifySchema = z.object({
  email: z.string().email('Format email tidak valid'),
  otp: z.string().length(6, 'OTP harus 6 digit'),
});

type VerifyFormData = z.infer<typeof verifySchema>;

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get('email') || '';
  
  // State countdown: 600 detik = 10 menit
  const [countdown, setCountdown] = useState(60);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<VerifyFormData>({
    resolver: zodResolver(verifySchema),
    defaultValues: { email: emailFromUrl, otp: '' },
  });

  // Fungsi helper format detik ke MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (emailFromUrl) setValue('email', emailFromUrl);
  }, [emailFromUrl, setValue]);

  // Timer logic
  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  const verifyMutation = useMutation({
    mutationFn: authService.verifyOtp,
    onSuccess: (data) => {
      toast.success(data.message || 'Verifikasi Berhasil!');
      router.push('/login');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Kode OTP salah atau kadaluwarsa');
    },
  });

  const resendMutation = useMutation({
    mutationFn: () => authService.resendOtp(watch('email')),
    onSuccess: (data) => {
      toast.success(data.message || 'Kode baru telah dikirim!');
      setCountdown(60); // Reset ke 10 menit setelah berhasil resend
    },
    onError: (error: any) => {
      toast.error(error.message || 'Gagal mengirim ulang kode');
    },
  });

  const onSubmit = (data: VerifyFormData) => {
    verifyMutation.mutate(data);
  };

  const currentEmail = watch('email');
  const currentOtp = watch('otp');

  return (
    <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
          <ShieldCheck className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 font-sans">Verifikasi Akun</h1>
        <p className="text-gray-500 mt-2 text-sm leading-relaxed">
          Masukkan 6 digit kode OTP yang dikirim ke: <br />
          <span className="font-semibold text-gray-800 break-all italic">{currentEmail || 'Email Anda'}</span>
        </p>
        
        {/* Badge Timer Masa Berlaku */}
        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium border border-amber-100">
          <Timer className="w-3.5 h-3.5" />
          <span>Kode berakhir dalam: {formatTime(countdown)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {!emailFromUrl && (
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Alamat Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                {...register('email')}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                placeholder="name@company.com"
              />
            </div>
          </div>
        )}

        <div className="space-y-3">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-[0.2em] block text-center">
            Verification Code
          </label>
          <input
            {...register('otp')}
            type="text"
            maxLength={6}
            onChange={(e) => setValue('otp', e.target.value.replace(/\D/g, ''))}
            className={twMerge(
              clsx(
                "w-full text-center text-3xl tracking-[0.5em] sm:tracking-[0.8em] font-mono font-bold py-5 border-2 rounded-2xl transition-all outline-none",
                errors.otp ? "border-red-200 bg-red-50 text-red-600" : "border-gray-100 bg-gray-50 focus:border-blue-500 focus:bg-white text-blue-700 shadow-inner",
                countdown === 0 && "opacity-50 grayscale cursor-not-allowed"
              )
            )}
            placeholder="000000"
            disabled={countdown === 0}
          />
          {countdown === 0 && (
            <p className="text-xs text-red-500 text-center font-medium">Kode telah kadaluwarsa. Silakan kirim ulang.</p>
          )}
        </div>

        <button
          type="submit"
          disabled={verifyMutation.isPending || currentOtp.length < 6 || countdown === 0}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {verifyMutation.isPending ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Memverifikasi...</>
          ) : (
            'Konfirmasi Verifikasi'
          )}
        </button>
      </form>

      <div className="mt-10 text-center">
        <p className="text-sm text-gray-500">
          Tidak menerima kode?{' '}
          <button 
            type="button"
            disabled={resendMutation.isPending || countdown > 0}
            className="text-blue-600 font-bold hover:text-blue-800 disabled:text-gray-400 flex items-center gap-2 mx-auto mt-2 transition-colors"
            onClick={() => resendMutation.mutate()}
          >
            {resendMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RotateCcw className={clsx("w-4 h-4", countdown > 0 && "animate-none")} />
            )}
            {countdown > 0 ? `Kirim Ulang tersedia dalam ${formatTime(countdown)}` : 'Kirim Ulang Kode Sekarang'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4 font-sans">
      <Suspense fallback={<Loader2 className="w-10 h-10 animate-spin text-blue-500" />}>
        <VerifyOtpForm />
      </Suspense>
    </div>
  );
}