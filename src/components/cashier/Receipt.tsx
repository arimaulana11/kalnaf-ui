import { CartItem } from '@/types/cashier';

interface Props {
  cart: CartItem[];
  subtotal: number;
  discountAmount: number;
  discountPercent: number;
  taxAmount: number;
  grandTotal: number;
  paymentMethod: string;
  cashAmount: number;
  changeAmount: number;
  customerName: string;
  customerPhone: string;
}

export const Receipt = ({
  cart,
  subtotal,
  discountAmount,
  discountPercent,
  taxAmount,
  grandTotal,
  paymentMethod,
  cashAmount,
  changeAmount,
  customerName,
}: Props) => {
  if (!cart || cart.length === 0) return null;

  const separator = "****************************";
  const line = "----------------------------";

  return (
    <div 
      id="receipt-print" 
      className="font-mono text-[10px] text-black w-[48mm] bg-white leading-tight p-2"
    >
      {/* Header Toko */}
      <div className="text-center mb-1 uppercase">
        <h2 className="font-bold text-sm">KALNAF STORE</h2>
        <p className="text-[9px]">JL. KALIURANG NO. 45</p>
        <p className="text-[9px]">YOGYAKARTA</p>
        <p className="text-[8px] mt-1">{line}</p>
      </div>

      {/* Metadata Transaksi */}
      <div className="mb-1 text-[9px] uppercase">
        <div className="flex justify-between">
          <span>BON: {Math.random().toString(36).substring(7).toUpperCase()}</span>
          <span>KASIR: ADMIN</span>
        </div>
        <div className="flex justify-between">
          <span>TGL: {new Date().toLocaleDateString('id-ID')}</span>
          <span>{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</span>
        </div>
        {customerName && (
          <div className="flex justify-between">
            <span>MEMBER:</span>
            <span>{customerName}</span>
          </div>
        )}
        <p className="text-[8px] mt-1">{separator}</p>
      </div>

      {/* Daftar Produk */}
      <div className="space-y-2 mb-2 text-[9px] uppercase">
        {cart.map((item, idx) => (
          <div key={idx} className="flex flex-col">
            <span className="break-words">{item.name}</span>
            <div className="flex justify-between pl-2">
              <span>{item.quantity} X {item.price.toLocaleString('id-ID')}</span>
              <span>{(item.price * item.quantity).toLocaleString('id-ID')}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Perincian Pembayaran */}
      <div className="border-t border-black border-dashed pt-1 text-[9px] uppercase">
        <div className="flex justify-between">
          <span>SUBTOTAL</span>
          <span>{subtotal.toLocaleString('id-ID')}</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between">
            <span>DISKON ({discountPercent}%)</span>
            <span>-{discountAmount.toLocaleString('id-ID')}</span>
          </div>
        )}

        {taxAmount > 0 && (
          <div className="flex justify-between">
            <span>PPN (11%)</span>
            <span>{taxAmount.toLocaleString('id-ID')}</span>
          </div>
        )}

        <div className="flex justify-between font-bold text-xs mt-1 border-t border-black pt-1">
          <span>TOTAL</span>
          <span>{grandTotal.toLocaleString('id-ID')}</span>
        </div>

        <div className="flex justify-between mt-1">
          <span>{paymentMethod === 'CASH' ? 'TUNAI' : paymentMethod}</span>
          <span>{(cashAmount || grandTotal).toLocaleString('id-ID')}</span>
        </div>

        {paymentMethod === 'CASH' && (
          <div className="flex justify-between font-bold">
            <span>KEMBALI</span>
            <span>{changeAmount.toLocaleString('id-ID')}</span>
          </div>
        )}
      </div>

      {/* Footer / Catatan Bawah */}
      <div className="text-center mt-4 uppercase text-[9px]">
        <p className="text-[8px]">{separator}</p>
        <p className="font-bold">TERIMA KASIH</p>
        <p className="text-[8px]">BARANG YG SDH DIBELI</p>
        <p className="text-[8px]">TIDAK DAPAT DITUKAR</p>
      </div>
    </div>
  );
};