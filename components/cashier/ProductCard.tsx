import React from 'react';
import { Plus, Package, Tag, AlertCircle } from 'lucide-react';
import { Product } from '@/types/cashier';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

export const ProductCard = ({ product, onAdd }: ProductCardProps) => {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = !isOutOfStock && product.stock < 10;
  const isParcel = (product as any).productType === 'PARCEL';

  return (
    <div
      onClick={() => !isOutOfStock && onAdd(product)}
      className={`group relative flex flex-col justify-between h-52 p-5 rounded-[2rem] transition-all duration-300
        ${isOutOfStock 
          ? 'bg-slate-50/50 border border-slate-100 opacity-60 cursor-not-allowed' 
          : 'bg-white border border-slate-100 hover:border-blue-400/50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgba(59,130,246,0.1)] active:scale-[0.96] cursor-pointer'
        }`}
    >
      {/* HEADER: Badges */}
      <div className="flex justify-between items-start">
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider
          ${isParcel ? 'bg-orange-50 text-orange-600' : 'bg-slate-50 text-slate-500'}`}>
          {isParcel ? <Package size={12} /> : <Tag size={12} />}
          {isParcel ? 'Parcel' : 'Menu'}
        </div>

        {!isOutOfStock && (
          <div className="bg-blue-600 text-white p-1.5 rounded-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-md shadow-blue-200">
            <Plus size={16} strokeWidth={3} />
          </div>
        )}
      </div>

      {/* BODY: Info Produk */}
      <div className="mt-2">
        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
          {product.category}
        </span>
        <h3 className="text-sm font-bold text-slate-700 leading-snug mt-0.5 line-clamp-2 min-h-[2.5rem] group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
      </div>

      {/* FOOTER: Pricing & Inventory */}
      <div className="space-y-3">
        {!isOutOfStock && (
           <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-700 ease-out ${isLowStock ? 'bg-orange-400' : 'bg-emerald-400'}`}
                style={{ width: `${Math.max(10, Math.min((product.stock / 50) * 100, 100))}%` }}
              />
           </div>
        )}

        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Harga</span>
            <div className="flex items-center">
              {/* Penyesuaian Style Rp */}
              <span className="text-[11px] font-bold text-slate-400 mr-0.5">Rp </span>
              <span className="text-[17px] font-black text-slate-900 tracking-tighter">
                {product.price.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Stok Badge */}
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-[10px] border
            ${isOutOfStock 
              ? 'bg-rose-50 border-rose-100 text-rose-500' 
              : isLowStock 
                ? 'bg-orange-50 border-orange-100 text-orange-600' 
                : 'bg-emerald-50 border-emerald-100 text-emerald-600'
            }`}>
            {isOutOfStock ? <AlertCircle size={10} /> : <span className="text-[8px] opacity-50 font-medium">Stok:</span>}
            {isOutOfStock ? 'Habis' : product.stock}
          </div>
        </div>
      </div>
    </div>
  );
};