'use client';
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  LogOut, 
  Menu, 
  Wifi, 
  WifiOff, 
  CloudUpload 
} from 'lucide-react';

/**
 * Hook sederhana untuk mendeteksi status koneksi browser
 */
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof window !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const isOnline = useOnlineStatus();

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Overview', path: '/dashboard' },
    { icon: <ShoppingCart size={20} />, label: 'Kasir/POS', path: '/dashboard/pos' },
    { icon: <Package size={20} />, label: 'Produk', path: '/dashboard/products' },
    { icon: <Users size={20} />, label: 'Pelanggan', path: '/dashboard/customers' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* SIDEBAR */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col z-20`}>
        <div className="p-6">
          <h2 className={`text-2xl font-black italic text-blue-600 ${!isSidebarOpen && 'hidden'}`}>KALNAF</h2>
          {!isSidebarOpen && <div className="w-8 h-8 bg-blue-600 rounded-lg mx-auto"></div>}
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => (
            <a key={item.label} href={item.path} className="flex items-center p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors group">
              <span className="group-hover:scale-110 transition-transform">{item.icon}</span>
              {isSidebarOpen && <span className="ml-3 font-medium">{item.label}</span>}
            </a>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button className="flex items-center w-full p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
            <LogOut size={20} />
            {isSidebarOpen && <span className="ml-3 font-medium">Keluar</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
              <Menu size={20} />
            </button>
            
            {/* STATUS KONEKSI DYNAMIS */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-500 ${
              isOnline ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              {isOnline ? (
                <>
                  <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">Online</span>
                  <CloudUpload size={14} className="opacity-70" />
                </>
              ) : (
                <>
                  <WifiOff size={14} className="animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">Offline Mode</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-900 leading-none">Owner Toko</p>
              <p className="text-[10px] text-gray-400 font-medium uppercase mt-1 tracking-tighter">Cabang Pusat</p>
            </div>
            <div className="w-10 h-10 bg-blue-600 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-white font-bold">
              OT
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="flex-1 p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}