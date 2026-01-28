import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface SidebarItemProps {
  item: {
    icon: React.ReactNode;
    label: string;
    path: string;
  };
  isOpen: boolean;
  isActive: boolean;
}

export const SidebarItem = ({ item, isOpen, isActive }: SidebarItemProps) => (
  <Link
    href={item.path}
    className={`flex items-center p-3 rounded-xl transition-all group relative ${
      isActive
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
        : 'text-slate-400 hover:bg-slate-900 hover:text-white'
    }`}
  >
    <span className={`${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform flex-shrink-0`}>
      {item.icon}
    </span>
    
    {isOpen && (
      <>
        <span className="ml-3 font-bold italic text-sm truncate">{item.label}</span>
        {isActive && <ChevronRight size={14} className="ml-auto opacity-50 flex-shrink-0" />}
      </>
    )}

    {/* TOOLTIP FIX */}
    {!isOpen && (
      <div className="fixed left-[72px] ml-2 px-3 py-2 bg-slate-800 text-white text-[10px] font-bold uppercase tracking-widest rounded-md shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-x-[-10px] group-hover:translate-x-0 z-[9999] whitespace-nowrap border border-slate-700">
        {item.label}
        {/* Panah Tooltip */}
        <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45 border-l border-b border-slate-700" />
      </div>
    )}
  </Link>
);