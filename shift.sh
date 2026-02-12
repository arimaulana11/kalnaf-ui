#!/bin/bash

# Nama folder tujuan
TARGET_DIR="src/components/shift"

# Membuat folder jika belum ada
mkdir -p "$TARGET_DIR"

echo "=========================================="
echo "Shift Components Generator (SH Version)"
echo "=========================================="

# 1. Generate OpenShiftForm.tsx
echo "Generating OpenShiftForm.tsx..."
cat << 'EOF' > "$TARGET_DIR/OpenShiftForm.tsx"
'use client';
import React, { useState } from 'react';
import { Wallet } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface OpenShiftFormProps {
  onOpen: (cash: number) => void;
}

export const OpenShiftForm = ({ onOpen }: OpenShiftFormProps) => {
  const [cash, setCash] = useState<number>(0);

  return (
    <div className="bg-white rounded-[2rem] p-10 border border-slate-100 shadow-sm text-center font-sans">
      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Wallet size={28} />
      </div>
      <h3 className="text-xl font-bold text-slate-900">Mulai Shift Baru</h3>
      <p className="text-slate-500 text-sm mb-6">Masukkan modal awal uang tunai di laci kasir.</p>
      <div className="max-w-xs mx-auto space-y-4">
        <input 
          type="number"
          className="w-full p-4 bg-slate-50 border-none rounded-xl text-center text-2xl font-bold focus:ring-2 focus:ring-blue-500"
          placeholder="0"
          onChange={(e) => setCash(Number(e.target.value))}
        />
        <Button onClick={() => onOpen(cash)} variant="primary" className="w-full py-4 rounded-xl shadow-lg shadow-blue-100">
          Buka Kasir Sekarang
        </Button>
      </div>
    </div>
  );
};
EOF

# 2. Generate ActiveShiftDetail.tsx
echo "Generating ActiveShiftDetail.tsx..."
cat << 'EOF' > "$TARGET_DIR/ActiveShiftDetail.tsx"
'use client';
import React from 'react';
import { Clock, Lock, User, CircleDollarSign } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ActiveShiftDetailProps {
  data: any;
  onClose: () => void;
}

export const ActiveShiftDetail = ({ data, onClose }: ActiveShiftDetailProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
      <div className="md:col-span-2 bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-slate-200">
        <div className="relative z-10">
          <p className="text-slate-400 text-sm font-medium">Estimasi Kas di Laci</p>
          <h2 className="text-4xl font-black mt-2">Rp {data?.totalExpected?.toLocaleString()}</h2>
          <div className="flex gap-4 mt-8">
            <div className="bg-white/10 px-4 py-3 rounded-xl border border-white/5">
              <p className="text-[10px] uppercase opacity-60 tracking-wider">Modal Awal</p>
              <p className="font-bold text-sm">Rp {data?.initialCash?.toLocaleString()}</p>
            </div>
            <div className="bg-white/10 px-4 py-3 rounded-xl border border-white/5">
              <p className="text-[10px] uppercase opacity-60 tracking-wider">Total Penjualan</p>
              <p className="font-bold text-sm">Rp {data?.currentSales?.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <CircleDollarSign size={200} className="absolute -right-10 -bottom-10 opacity-5" />
      </div>
      <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 flex flex-col justify-between shadow-sm">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-slate-600">
            <User size={18} className="text-blue-500" />
            <span className="text-sm font-bold text-slate-700">{data?.cashierName}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-600">
            <Clock size={18} className="text-blue-500" />
            <span className="text-sm font-medium">{data?.startTime}</span>
          </div>
        </div>
        <Button onClick={onClose} variant="outline" className="mt-6 border-red-100 text-red-600 hover:bg-red-50 w-full rounded-xl flex gap-2 font-bold">
          <Lock size={16} /> Akhiri Shift
        </Button>
      </div>
    </div>
  );
};
EOF

# 3. Generate ShiftWrapper.tsx
echo "Generating ShiftWrapper.tsx..."
cat << 'EOF' > "$TARGET_DIR/ShiftWrapper.tsx"
'use client';
import React from 'react';
import { OpenShiftForm } from './OpenShiftForm';
import { ActiveShiftDetail } from './ActiveShiftDetail';

interface ShiftWrapperProps {
  isActive: boolean;
  onOpenShift: (initialCash: number) => void;
  onCloseShift: () => void;
  data?: any;
}

export const ShiftWrapper = ({ isActive, onOpenShift, onCloseShift, data }: ShiftWrapperProps) => {
  return (
    <div className="w-full">
      {!isActive ? (
        <OpenShiftForm onOpen={onOpenShift} />
      ) : (
        <ActiveShiftDetail data={data} onClose={onCloseShift} />
      )}
    </div>
  );
};
EOF

echo "=========================================="
echo "BERHASIL! Semua file digenerate di $TARGET_DIR"
echo "=========================================="