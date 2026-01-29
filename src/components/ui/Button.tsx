import { ReactNode } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  children: ReactNode;
  isLoading?: boolean; // Tambahkan prop ini
}

export const Button = ({ variant = 'primary', children, isLoading, ...props }: ButtonProps) => {
  const styles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200",
    secondary: "bg-slate-100 text-slate-800 hover:bg-slate-200 shadow-transparent",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-red-200",
    outline: "border-2 border-slate-100 text-slate-700 hover:bg-slate-50 shadow-transparent",
  };

  return (
    <button
      className={`
        w-full py-4 rounded-xl font-bold transition-all duration-200 
        active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed
        shadow-lg flex items-center justify-center gap-2
        ${styles[variant]} ${props.className}
      `}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <div className="absolute my-0 mx-5">
            <svg className="animate-spin h-5 w-5 text-current" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          <span>Memproses...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};