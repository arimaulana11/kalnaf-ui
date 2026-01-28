'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  Database,
  WifiOff,
  Zap,
  Smartphone,
  ArrowRight,
  CheckCircle2,
  Globe,
  ShieldCheck,
  ZapOff
} from 'lucide-react';

export default function HomePage() {
  const [isYearly, setIsYearly] = useState(false); // State untuk Toggle

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-950 font-sans selection:bg-blue-500 selection:text-white">
      {/* 1. FLOATING NAV (Glassmorphism) */}
      <div className="fixed top-6 inset-x-0 z-50 flex justify-center px-4">
        <nav className="flex items-center justify-between w-full max-w-4xl px-6 py-3 bg-white/70 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-full">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
              <Zap className="text-white" size={18} fill="currentColor" />
            </div>
            <span className="text-xl font-black tracking-tighter italic text-blue-600">KALNAF</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-bold text-slate-500">
            <a href="#features" className="hover:text-blue-600 transition-colors">Fitur</a>
            <a href="#pricing" className="hover:text-blue-600 transition-colors">Harga</a>
            <a href="#testi" className="hover:text-blue-600 transition-colors">Testimoni</a>
          </div>
          <Link
            href="/login"
            className="bg-slate-950 text-white px-5 py-2 rounded-full text-sm font-bold hover:shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:bg-blue-600 transition-all active:scale-95"
          >
            Masuk
          </Link>
        </nav>
      </div>

      {/* 2. HERO SECTION (Dynamic Typography) */}
      <section className="relative pt-40 pb-24 px-6 overflow-hidden">
        {/* Background Blur Orbs */}
        <div className="absolute top-0 -left-20 w-72 h-72 bg-blue-400/20 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute bottom-0 -right-20 w-72 h-72 bg-cyan-400/20 rounded-full blur-[120px] -z-10"></div>

        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 px-4 py-1.5 rounded-full shadow-sm mb-10 scale-90 md:scale-100">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-500">Sync Engine v2.0 Ready</span>
          </div>

          <h1 className="text-6xl md:text-9xl font-black tracking-tight leading-[0.85] mb-10">
            STOK AMAN <br />
            <span className="italic font-light text-slate-400">MESKIPUN</span> <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-blue-600 to-blue-900">
              OFFLINE.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed">
            Sistem cerdas yang mengubah cara warung mengelola inventory. Input data di mana saja, sinkronisasi otomatis saat terhubung.
          </p>

          <div className="flex flex-col md:flex-row justify-center items-center gap-6">
            <Link
              href="/dashboard"
              className="w-full md:w-auto px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-[0_20px_40px_-15px_rgba(37,99,235,0.4)] hover:translate-y-[-4px] transition-all flex items-center justify-center gap-3 group"
            >
              Mulai Audit Sekarang
              <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </Link>
            <div className="flex items-center gap-4 text-slate-400 font-bold text-sm italic">
              <CheckCircle2 size={18} className="text-blue-500" /> Terintegrasi Vercel Edge
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURES (Bento Grid Style) */}
      <section id="features" className="px-6 py-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between overflow-hidden relative group">
            <div className="relative z-10">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <WifiOff size={28} />
              </div>
              <h3 className="text-3xl font-black mb-4">Offline Resilience</h3>
              <p className="text-slate-500 text-lg max-w-md">Bekerja tanpa hambatan di gudang bawah tanah atau area terpencil tanpa koneksi internet sama sekali.</p>
            </div>
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-50 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
          </div>

          <div className="md:col-span-4 bg-slate-950 p-10 rounded-[2.5rem] text-white flex flex-col justify-between">
            <Zap className="text-yellow-400 mb-12" size={40} fill="currentColor" />
            <div>
              <h3 className="text-2xl font-bold mb-2 text-white">Adaptive Batching</h3>
              <p className="text-slate-400 text-sm">Menyesuaikan kecepatan upload data berdasarkan kualitas sinyal Anda secara real-time.</p>
            </div>
          </div>

          <div className="md:col-span-4 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <Smartphone className="text-blue-600 mb-8" size={32} />
            <h3 className="text-xl font-bold mb-2">Thumb-Friendly UI</h3>
            <p className="text-slate-500 text-sm font-medium">Layout yang didesain agar jari Anda tidak pegal saat input ribuan stok barang.</p>
          </div>

          <div className="md:col-span-8 bg-gradient-to-br from-blue-600 to-blue-800 p-10 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center gap-10 overflow-hidden">
            <div className="flex-1">
              <h3 className="text-3xl font-black mb-4 leading-tight">Keamanan Data Berlapis</h3>
              <p className="text-blue-100 opacity-80">Enkripsi lokal di tingkat browser sebelum data terbang ke cloud melalui jalur aman TLS 1.3.</p>
            </div>
            <ShieldCheck size={120} className="text-blue-400 opacity-30 -rotate-12" />
          </div>
        </div>
      </section>

      {/* 4. PRICING SECTION (Updated with Logic) */}
      <section id="pricing" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 text-center md:text-left">
            <div>
              <h2 className="text-5xl font-black tracking-tighter uppercase mb-4 italic">Rate Card.</h2>
              <p className="text-slate-500 font-medium">Investasi kontrol stok yang fleksibel.</p>
            </div>

            {/* TOGGLE YEARLY MODERN */}
            <div className="bg-slate-200 p-1.5 rounded-2xl flex gap-1 relative border border-slate-300">
              <button
                onClick={() => setIsYearly(false)}
                className={`relative z-10 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${!isYearly ? 'text-slate-950 bg-white shadow-sm' : 'text-slate-500'}`}
              >
                Bulanan
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={`relative z-10 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${isYearly ? 'text-slate-950 bg-white shadow-sm' : 'text-slate-500'}`}
              >
                Tahunan
              </button>
              {isYearly && (
                <div className="absolute -top-4 -right-4 bg-blue-600 text-white text-[10px] font-black px-2 py-1 rounded-lg animate-bounce shadow-lg">
                  HEMAT 20%
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Paket Starter */}
            <div className="group p-10 rounded-[3rem] bg-white border border-slate-100 hover:shadow-2xl hover:shadow-blue-200/20 transition-all">
              <div className="text-xs font-black tracking-widest text-slate-400 uppercase mb-8 italic">Entry Level</div>
              <div className="text-5xl font-black mb-10 tracking-tighter italic">Gratis</div>
              <ul className="space-y-6 mb-12">
                {['100 Produk', 'Standard Sync', '1 User Access'].map((t) => (
                  <li key={t} className="flex gap-3 items-center text-sm font-bold text-slate-600 italic">
                    <CheckCircle2 size={18} className="text-blue-600" /> {t}
                  </li>
                ))}
              </ul>
              <button className="w-full py-4 rounded-2xl bg-slate-100 font-black text-slate-950 group-hover:bg-blue-600 group-hover:text-white transition-all uppercase text-xs tracking-widest">Gunakan Gratis</button>
            </div>

            {/* Paket Pro Audit (Harga Berubah Berdasarkan State) */}
            <div className="group p-10 rounded-[3rem] bg-slate-950 text-white shadow-2xl relative overflow-hidden scale-105 border-4 border-blue-600/20">
              <div className="absolute top-0 right-0 p-6">
                <Zap size={32} className="text-blue-500" fill="currentColor" />
              </div>
              <div className="text-xs font-black tracking-widest text-blue-400 uppercase mb-8 italic">Paling Banyak Dipilih</div>

              {/* LOGIKA HARGA TAHUNAN */}
              <div className="text-5xl font-black mb-2 tracking-tighter italic text-blue-500 transition-all">
                {isYearly ? 'Rp 39rb' : 'Rp 49rb'}
                <span className="text-lg font-normal text-slate-500 italic">/bln</span>
              </div>
              <p className="text-[10px] font-bold text-slate-400 mb-8 italic">
                {isYearly ? '*Ditagih Rp 468.000 per tahun' : '*Ditagih setiap bulan'}
              </p>

              <ul className="space-y-6 mb-12">
                {['Unlimited Produk', 'Turbo Adaptive Sync', 'Laporan PDF Bulanan', 'Multi-Device Login'].map((t) => (
                  <li key={t} className="flex gap-3 items-center text-sm font-bold italic">
                    <CheckCircle2 size={18} className="text-blue-500" /> {t}
                  </li>
                ))}
              </ul>
              <button className="w-full py-4 rounded-2xl bg-white font-black text-slate-950 hover:bg-blue-500 hover:text-white transition-all uppercase text-xs tracking-widest shadow-[0_10px_30px_rgba(255,255,255,0.1)]">Ambil Pro</button>
            </div>

            {/* Paket Enterprise */}
            <div className="group p-10 rounded-[3rem] bg-white border border-slate-100 hover:shadow-2xl hover:shadow-blue-200/20 transition-all">
              <div className="text-xs font-black tracking-widest text-slate-400 uppercase mb-8 italic">High Volume</div>
              <div className="text-5xl font-black mb-10 tracking-tighter italic">Custom</div>
              <ul className="space-y-6 mb-12">
                {['Akses API Langsung', 'Dedicated Cloud Node', 'SLA 99.9% Up-time', 'Pendampingan Setup'].map((t) => (
                  <li key={t} className="flex gap-3 items-center text-sm font-bold text-slate-600 italic">
                    <CheckCircle2 size={18} className="text-blue-600" /> {t}
                  </li>
                ))}
              </ul>
              <button className="w-full py-4 rounded-2xl bg-slate-100 font-black text-slate-950 group-hover:bg-blue-600 group-hover:text-white transition-all uppercase text-xs tracking-widest">Hubungi Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS (Horizontal Scroll / Snap-center) */}
      <section id="testi" className="py-32 bg-slate-950 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
            <div className="max-w-xl">
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Zap key={i} size={16} className="text-blue-500" fill="currentColor" />
                ))}
              </div>
              <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-none mb-6">
                SUARA DARI <br /> GARIS DEPAN.
              </h2>
              <p className="text-slate-400 font-medium">Pemilik bisnis yang sudah meninggalkan cara lama dan beralih ke sinkronisasi otomatis.</p>
            </div>
          </div>

          {/* Testimonial Cards - Mobile Friendly Scroll */}
          <div className="flex gap-6 overflow-x-auto pb-12 no-scrollbar snap-x">
            {/* Testi 1 */}
            <div className="min-w-[320px] md:min-w-[450px] bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] snap-center hover:border-blue-600 transition-colors group">
              <p className="text-xl md:text-2xl font-bold italic leading-relaxed mb-10 group-hover:text-white transition-colors text-slate-300">
                "Dulu saya pusing kalau sinyal gudang mati, stok berantakan. Sekarang tinggal catat di HP, pas keluar gudang data langsung masuk ke laptop di kantor. Ajaib!"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center font-black text-white shadow-lg">
                  H
                </div>
                <div>
                  <div className="font-black text-sm uppercase tracking-widest">Hendra Wijaya</div>
                  <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Grosir Sembako Jaya</div>
                </div>
              </div>
            </div>

            {/* Testi 2 */}
            <div className="min-w-[320px] md:min-w-[450px] bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] snap-center hover:border-blue-600 transition-colors group">
              <p className="text-xl md:text-2xl font-bold italic leading-relaxed mb-10 group-hover:text-white transition-colors text-slate-300">
                "User interface-nya beneran enak buat jempol. Gak ada lagi salah pencet tombol pas lagi buru-buru audit barang masuk. Top banget buat warung."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-400 flex items-center justify-center font-black text-white shadow-lg">
                  S
                </div>
                <div>
                  <div className="font-black text-sm uppercase tracking-widest">Siti Aminah</div>
                  <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Owner Minimarket Lokal</div>
                </div>
              </div>
            </div>

            {/* Testi 3 */}
            <div className="min-w-[320px] md:min-w-[450px] bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] snap-center hover:border-blue-600 transition-colors group">
              <p className="text-xl md:text-2xl font-bold italic leading-relaxed mb-10 group-hover:text-white transition-colors text-slate-300">
                "Proses integrasinya cepat. Tim support-nya juga sangat membantu pas awal setup data produk yang ribuan. Sangat direkomendasikan!"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-600 to-yellow-400 flex items-center justify-center font-black text-white shadow-lg">
                  R
                </div>
                <div>
                  <div className="font-black text-sm uppercase tracking-widest">Rian Putra</div>
                  <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Distributor Elektronik</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOOTER (Modern Tech Look) */}
      <footer className="bg-slate-950 text-slate-400 py-24 px-8 border-t border-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20 text-center md:text-left">
            <div className="space-y-8 flex flex-col items-center md:items-start">
              <div className="flex items-center gap-2">
                <Zap className="text-blue-500" size={24} fill="currentColor" />
                <span className="text-2xl font-black italic text-white tracking-tighter">KALNAF</span>
              </div>
              <p className="text-sm font-medium leading-relaxed max-w-xs">
                Membangun infrastruktur manajemen stok masa depan yang tahan banting dalam kondisi offline ekstrem.
              </p>
            </div>

            <div className="space-y-6">
              <h4 className="text-white font-black uppercase text-[10px] tracking-[0.3em]">Perusahaan</h4>
              <ul className="space-y-4 text-sm font-bold">
                <li><a href="#" className="hover:text-blue-500 transition-colors">Tentang Kami</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors">Karir</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors">Press Kit</a></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-white font-black uppercase text-[10px] tracking-[0.3em]">Sistem</h4>
              <div className="inline-flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
                <span className="text-[10px] text-white font-black">All Nodes Online</span>
              </div>
              <p className="text-xs">Cluster: ID-JKT-01</p>
            </div>

            <div className="space-y-6">
              <h4 className="text-white font-black uppercase text-[10px] tracking-[0.3em]">HQ Jakarta</h4>
              <div className="h-32 bg-slate-900 rounded-3xl overflow-hidden grayscale hover:grayscale-0 transition-all opacity-50 hover:opacity-100 cursor-crosshair relative border border-slate-800">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126920.24113400589!2d106.759478!3d-6.229728!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e04d4f5d27%3A0x283e390c58744f47!2sJakarta!5e0!3m2!1sid!2sid!4v1700000000000"
                  width="100%" height="100%" style={{ border: 0, filter: 'invert(100%)' }}
                ></iframe>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-10 border-t border-slate-900 opacity-50">
            <p className="text-[10px] font-black tracking-[0.2em] uppercase italic">© 2026 KALNAF CORE SYS. Built on Vercel.</p>
            <div className="flex gap-10 text-[10px] font-black uppercase tracking-widest">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}