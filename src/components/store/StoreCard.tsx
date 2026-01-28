// src/components/store/StoreCard.tsx
import { MapPin, Phone, ArrowRight, Image as ImageIcon } from 'lucide-react';

export const StoreCard = ({ name, address, phone, logo, status, onSelect }: any) => {
  return (
    <div className="group bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(59,130,246,0.1)] transition-all duration-500 relative overflow-hidden">
      <div className="flex justify-between items-start mb-8">
        <div className="w-16 h-16 rounded-2xl bg-slate-50 overflow-hidden border border-slate-100 flex items-center justify-center">
          {logo ? (
            <img src={logo} alt={name} className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="text-slate-300" size={28} />
          )}
        </div>
        <span className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-tighter ${status ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
          {status ? 'Active' : 'Inactive'}
        </span>
      </div>

      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
          {name}
        </h3>
        
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-slate-500">
            <MapPin size={16} className="text-blue-500" />
            <span className="text-sm font-medium line-clamp-1">{address}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-500">
            <Phone size={16} className="text-blue-500" />
            <span className="text-sm font-medium">{phone}</span>
          </div>
        </div>
      </div>

      <button 
        onClick={onSelect}
        className="w-full mt-8 py-4 bg-slate-50 group-hover:bg-blue-600 text-slate-600 group-hover:text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300"
      >
        Kelola Toko <ArrowRight size={18} />
      </button>
    </div>
  );
};