import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...props }, ref) => (
    <div className="w-full flex flex-col gap-1.5">
      {/* Label yang tegas */}
      <label className="text-sm font-semibold text-slate-800 ml-0.5">
        {label}
      </label>
      
      <div className="relative w-full">
        <input
          ref={ref}
          // block dan w-full memastikan input mengambil 100% ruang
          className={`
            block w-full px-4 py-3 rounded-xl border-2 text-[15px] transition-all duration-200
            bg-white text-slate-900 outline-none
            
            /* State: Normal */
            ${error 
              ? 'border-red-500 bg-red-50/30' 
              : 'border-slate-100 bg-slate-50/50 hover:border-slate-300 focus:bg-white focus:border-blue-600'
            }

            /* State: Focus (Ring yang tegas tapi tipis) */
            focus:ring-4 focus:ring-blue-600/10
          `}
          {...props}
        />
        
        {error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
        )}
      </div>

      {error && (
        <p className="text-[12px] font-medium text-red-600 ml-1">
          {error}
        </p>
      )}
    </div>
  )
);

Input.displayName = 'Input';