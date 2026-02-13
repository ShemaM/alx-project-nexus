import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loadingText?: string;
  magical?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText,
  magical = false,
  className = '',
  disabled,
  ...props 
}) => {
  const baseClasses = 'relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group'
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-[#2D8FDD] to-[#1E6BB8] hover:from-[#1E6BB8] hover:to-[#2D8FDD] text-white focus:ring-[#2D8FDD] shadow-md hover:shadow-lg hover:shadow-[#2D8FDD]/20 hover:-translate-y-0.5',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700 focus:ring-slate-400 hover:shadow-md hover:-translate-y-0.5',
    outline: 'border-2 border-[#2D8FDD] text-[#2D8FDD] hover:bg-[#2D8FDD] hover:text-white focus:ring-[#2D8FDD] hover:shadow-lg hover:shadow-[#2D8FDD]/20 hover:-translate-y-0.5',
    ghost: 'text-slate-600 hover:bg-slate-100 hover:text-[#2D8FDD] focus:ring-slate-400',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-500 text-white focus:ring-red-500 shadow-md hover:shadow-lg hover:shadow-red-500/20 hover:-translate-y-0.5',
    gradient: 'bg-gradient-to-r from-[#2D8FDD] via-[#F5D300] to-[#D52B2B] text-white focus:ring-[#2D8FDD] shadow-md hover:shadow-lg hover:-translate-y-0.5 bg-size-200 hover:bg-pos-100',
  }
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm gap-2',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-8 py-3.5 text-base gap-2.5',
  }

  const magicalClasses = magical 
    ? 'before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/0 before:via-white/25 before:to-white/0 before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700' 
    : ''

  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${magicalClasses} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="w-4 h-4 relative">
          <svg className="animate-spin" viewBox="0 0 20 20">
            <defs>
              <linearGradient id="btn-spinner-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
                <stop offset="100%" stopColor="currentColor" />
              </linearGradient>
            </defs>
            <circle cx="10" cy="10" r="8" fill="none" stroke="url(#btn-spinner-grad)" strokeWidth="2" strokeLinecap="round" strokeDasharray="32 16" />
          </svg>
        </span>
      )}
      <span className="relative z-10">
        {isLoading ? (loadingText || children) : children}
      </span>
    </button>
  );
};

export default Button;
