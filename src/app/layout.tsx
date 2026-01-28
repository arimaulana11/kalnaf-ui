import './globals.css'; // WAJIB ada untuk Tailwind
import Providers from '@/components/shared/Providers';

export const metadata = {
  title: 'Kalnaf Coresys SaaS',
  description: 'PWA Offline-First POS System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Tambahkan antialiased agar font lebih tajam di mobile/PWA */}
      <body className="antialiased bg-gray-50 text-gray-900">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}