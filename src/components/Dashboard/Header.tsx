import { Menu, WifiOff, CloudUpload } from 'lucide-react';

interface HeaderProps {
  isOnline: boolean;
  onMenuClick: () => void;
}

export const Header = ({ isOnline, onMenuClick }: HeaderProps) => (
  <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
    <div className="flex items-center gap-6">
      <button onClick={onMenuClick} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-all active:scale-90">
        <Menu size={20} />
      </button>

      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-500 ${
        isOnline ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
      }`}>
        {isOnline ? (
          <>
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Online Sync</span>
            <CloudUpload size={14} className="opacity-70" />
          </>
        ) : (
          <>
            <WifiOff size={14} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Offline Mode</span>
          </>
        )}
      </div>
    </div>

    <div className="flex items-center gap-4">
      <div className="text-right hidden sm:block">
        <p className="text-sm font-black text-slate-900 leading-none italic uppercase tracking-tighter">Owner Toko</p>
        <p className="text-[10px] text-blue-600 font-bold uppercase mt-1 tracking-widest italic">Cabang Pusat</p>
      </div>
      <div className="w-10 h-10 bg-slate-900 border-2 border-white shadow-xl rounded-full flex items-center justify-center text-blue-500 font-black italic">OT</div>
    </div>
  </header>
);