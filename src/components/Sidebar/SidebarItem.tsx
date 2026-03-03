import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface SidebarItemProps {
  item: {
    icon: React.ReactNode;
    label: string;
    path: string;
    status?: string; // Menambahkan status (Ongoing)
  };
  isOpen: boolean;
  isActive: boolean;
}

export const SidebarItem = ({ item, isOpen, isActive }: SidebarItemProps) => {
  const isOngoing = item.status === 'Ongoing';

  return (
    <Link
      href={isOngoing ? '#' : item.path} // Mencegah navigasi jika masih ongoing
      className={`flex items-center p-3 rounded-xl transition-all group relative ${
        isOngoing ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'
      } ${
        isActive
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
          : 'text-slate-400 hover:bg-slate-900 hover:text-white'
      }`}
    >
      {/* ICON */}
      <span className={`${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform flex-shrink-0`}>
        {item.icon}
      </span>
      
      {/* LABEL & BADGE */}
      {isOpen && (
        <div className="ml-3 flex items-center justify-between w-full overflow-hidden">
          <span className="font-bold text-sm truncate tracking-tight">{item.label}</span>
          
          {isOngoing ? (
            <span className="flex-shrink-0 ml-2 text-[8px] font-black bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded-md uppercase tracking-tighter border border-slate-700 group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-400 transition-colors">
              Soon
            </span>
          ) : (
            isActive && <ChevronRight size={14} className="ml-auto opacity-50 flex-shrink-0 animate-pulse" />
          )}
        </div>
      )}

      {/* TOOLTIP (Saat Sidebar Tertutup) */}
      {!isOpen && (
        <div className="fixed left-[72px] ml-2 px-3 py-2 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-md shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0 z-[9999] whitespace-nowrap border border-slate-800">
          <div className="flex items-center gap-2">
            {item.label}
            {isOngoing && <span className="text-[8px] text-blue-400 font-black">• SOON</span>}
          </div>
          {/* Panah Tooltip */}
          <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45 border-l border-b border-slate-800" />
        </div>
      )}
    </Link>
  );
};