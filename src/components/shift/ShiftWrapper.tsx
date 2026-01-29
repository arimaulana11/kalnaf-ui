'use client';
import React from 'react';
import { OpenShiftForm } from './OpenShiftForm';
import { ActiveShiftDetail } from './ActiveShiftDetail';

interface ShiftWrapperProps {
  isActive: boolean;
  onOpenShift: (initialCash: number) => void;
  // Tambahkan parameter agar sinkron dengan mutasi di Page
  onCloseShift: (actualCash: number, note: string) => void; 
  data?: any;
  isLoadingAction?: boolean;
}

export const ShiftWrapper = ({ 
  isActive, 
  onOpenShift, 
  onCloseShift, 
  data, 
  isLoadingAction 
}: ShiftWrapperProps) => {
  
  if (!isActive) {
    return (
      <div className="animate-in fade-in zoom-in duration-500">
        <OpenShiftForm onOpen={onOpenShift} isLoading={isLoadingAction} />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <ActiveShiftDetail 
        data={data} 
        onClose={onCloseShift} 
        isLoading={isLoadingAction}
      />
    </div>
  );
};