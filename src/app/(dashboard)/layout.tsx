'use client';
import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { SidebarItem } from '@/components/Sidebar/SidebarItem';
import { Header } from '@/components/Dashboard/Header';
import { LogOut, Zap, Clock, X, ChevronRight, Crown } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { menuGroups } from '@/constants/menuData';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showTrialModal, setShowTrialModal] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const isOnline = useOnlineStatus();

  const subscription = {
    type: 'trial',
    daysLeft: 4,
    percentage: 40 
  };

  // Efek untuk memunculkan modal saat aplikasi dibuka (hanya sekali)
  useEffect(() => {
    const hasSeenTrial = sessionStorage.getItem('hasSeenTrialPopup');
    if (!hasSeenTrial) {
      const timer = setTimeout(() => {
        setShowTrialModal(true);
        sessionStorage.setItem('hasSeenTrialPopup', 'true');
      }, 1000); // Muncul setelah 1 detik agar tidak kaget
      return () => clearTimeout(timer);
    }
  }, []);

  const handleLogout = async () => {
    if (!confirm('Yakin ingin keluar?')) return;
    setIsLoggingOut(true);
    try {
      await authService.logout();
      router.refresh();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-900">
      {/* MODAL TRIAL POPUP */}
      {showTrialModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowTrialModal(false)} />
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-blue-600">
                <Crown size={40} fill="currentColor" className="opacity-20" />
                <Zap size={32} className="absolute" fill="currentColor" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tighter mb-2 italic">Selamat Datang Kembali!</h3>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                Bisnis Anda berjalan lancar hari ini. Ingat, masa uji coba <span className="font-bold text-slate-900">Premium</span> Anda tersisa <span className="text-blue-600 font-bold">{subscription.daysLeft} hari lagi</span>.
              </p>
              
              <div className="bg-slate-50 rounded-2xl p-4 mb-8">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                  <span>Progress Trial</span>
                  <span>{subscription.percentage}%</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full transition-all duration-1000"
                    style={{ width: `${subscription.percentage}%` }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Link 
                  href="/billing/plan"
                  onClick={() => setShowTrialModal(false)}
                  className="flex items-center justify-center gap-2 w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-xl shadow-slate-200"
                >
                  Upgrade Sekarang <ChevronRight size={16} />
                </Link>
                <button 
                  onClick={() => setShowTrialModal(false)}
                  className="w-full py-3 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-slate-600 transition-colors"
                >
                  Nanti Saja
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-slate-200/60 transition-all duration-300 flex flex-col z-30 h-screen sticky top-0 overflow-x-hidden shadow-sm`}>
        <div className="h-20 flex items-center px-6 gap-3 flex-shrink-0 border-b border-slate-50">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex-shrink-0 flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Zap size={20} fill="white" className="text-white" />
          </div>
          {isSidebarOpen && (
            <h2 className="text-xl font-black italic text-blue-600 tracking-tighter uppercase">
              KALNAF<span className="text-slate-900">.</span>
            </h2>
          )}
        </div>

        <nav className="flex-1 px-3 pt-6 space-y-8 overflow-y-auto no-scrollbar">
          {menuGroups.map((group) => (
            <div key={group.label} className="space-y-3">
              {isSidebarOpen && (
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">
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

        {/* BOTTOM SECTION - Tanpa Card, Hanya Indikator Kecil */}
        <div className="p-4 space-y-2 border-t border-slate-100 bg-slate-50/30">
          <Link 
            href="/billing/plan"
            className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all hover:bg-blue-50 group ${!isSidebarOpen && 'justify-center'}`}
          >
            <div className="relative">
              <Zap size={20} className="text-blue-600" fill={subscription.daysLeft <= 3 ? "currentColor" : "none"} />
              {subscription.daysLeft <= 3 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
            </div>
            {isSidebarOpen && (
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-slate-900 tracking-tight">Sisa Trial</span>
                <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">{subscription.daysLeft} Hari Lagi</span>
              </div>
            )}
          </Link>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`flex items-center w-full p-3 rounded-xl transition-all group text-slate-400 hover:bg-red-50 hover:text-red-500 ${!isSidebarOpen && 'justify-center'}`}
          >
            <LogOut size={20} className={isLoggingOut ? 'animate-spin' : 'group-hover:-translate-x-1 transition-transform'} />
            {isSidebarOpen && (
              <span className="ml-3 font-bold text-sm tracking-tight italic">
                {isLoggingOut ? 'Leaving...' : 'Sign Out'}
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header isOnline={isOnline} onMenuClick={() => setSidebarOpen(!isSidebarOpen)} />
        <div className="flex-1 p-6 md:p-8 overflow-y-auto custom-scrollbar bg-slate-50/30">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}