'use client';
import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { SidebarItem } from '@/components/Sidebar/SidebarItem';
import { Header } from '@/components/Dashboard/Header';
import { LogOut } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { menuGroups } from '@/constants/menuData';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const isOnline = useOnlineStatus();

  // Fungsi Logout yang lebih bersih
  const handleLogout = async () => {
    if (!confirm('Yakin ingin keluar?')) return;

    setIsLoggingOut(true);
    try {
      await authService.logout(); // Panggil Service
      router.refresh();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Tetap arahkan ke home jika session dianggap tidak valid/expired
      router.push('/');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Bagian Aside di layout.tsx */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-100 transition-all duration-300 flex flex-col z-30 h-screen sticky top-0 overflow-x-hidden shadow-sm`}>

        {/* Header Logo */}
        <div className="p-6 mb-4 flex-shrink-0">
          <h2 className={`text-2xl font-black italic text-blue-600 transition-all duration-300 ${!isSidebarOpen ? 'opacity-0 hidden' : 'opacity-100'}`}>
            KALNAF.
          </h2>
          {!isSidebarOpen && <div className="w-8 h-8 bg-blue-600 rounded-lg mx-auto shadow-lg" />}
        </div>

        {/* Navigasi dengan scrollbar yang disembunyikan */}
        <nav className="flex-1 px-3 space-y-6 overflow-y-auto overflow-x-hidden no-scrollbar">
          {menuGroups.map((group) => (
            <div key={group.label}>
              {isSidebarOpen && (
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-3 truncate">
                  {group.label}
                </p>
              )}
              <div className="space-y-1">
                {group.items.map((item) => (
                  <SidebarItem
                    key={item.label}
                    item={item}
                    isOpen={isSidebarOpen}
                    isActive={pathname === item.path}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* LOGOUT BUTTON SECTION */}
        <div className="p-4 border-t border-slate-999">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center w-full p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all group"
          >
            <LogOut size={20} className={isLoggingOut ? 'animate-spin' : 'group-hover:-translate-x-1 transition-transform'} />
            {isSidebarOpen && (
              <span className="ml-3 font-bold italic text-sm">
                {isLoggingOut ? 'Leaving...' : 'Sign Out'}
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header isOnline={isOnline} onMenuClick={() => setSidebarOpen(!isSidebarOpen)} />
        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
}