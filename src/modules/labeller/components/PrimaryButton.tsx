import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline';
  loading?: boolean;
}

export const PrimaryButton: React.FC<ButtonProps> = ({ children, variant = 'primary', loading, ...props }) => {
  const baseStyles = "px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50";
  
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)]",
    outline: "border border-zinc-900 text-zinc-300 hover:bg-white/5 hover:text-white"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]}`} disabled={loading} {...props}>
      {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : children}
    </button>
  );
};