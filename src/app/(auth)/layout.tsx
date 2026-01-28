export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* Sisi Kiri: Branding/Visual (Hanya tampil di Desktop) */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-blue-600 p-12 text-white">
        <div className="max-w-md space-y-4 text-center">
          <h1 className="text-4xl font-bold italic tracking-tighter">KALNAF POS</h1>
          <p className="text-blue-100 text-lg">
            Solusi manajemen kasir modern, cepat, dan handal untuk pertumbuhan bisnis Anda.
          </p>
          <div className="pt-8 opacity-20 text-9xl font-black select-none">
            {/* Dekorasi belakang */}
            CORE
          </div>
        </div>
      </div>

      {/* Sisi Kanan: Form */}
      <div className="flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}