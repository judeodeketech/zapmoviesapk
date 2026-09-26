import React from 'react';

interface PrimaryButtonProps {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  icon,
  onClick,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-9 px-3.5 text-xs rounded-xl gap-1.5',
    md: 'h-12 px-5 text-sm font-semibold rounded-2xl gap-2',
    lg: 'h-14 px-6 text-base font-bold rounded-2xl gap-2.5'
  };

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-[#FFC72C] via-[#F5B301] to-[#E69E00] text-slate-950 font-bold shadow-[0_4px_20px_rgba(245,179,1,0.35)] hover:shadow-[0_6px_25px_rgba(245,179,1,0.5)] active:scale-[0.98] transition-all duration-150',
    secondary:
      'bg-white/10 hover:bg-white/15 text-white backdrop-blur-md active:scale-[0.98] transition-all duration-150',
    outline:
      'border border-[#F5B301]/40 hover:border-[#F5B301] text-[#F5B301] hover:bg-[#F5B301]/10 active:scale-[0.98] transition-all duration-150',
    ghost:
      'text-slate-300 hover:text-white hover:bg-white/5 active:scale-[0.98] transition-all duration-150'
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center select-none whitespace-nowrap cursor-pointer touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B301] ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${fullWidth ? 'w-full' : ''} ${
        disabled ? 'opacity-50 pointer-events-none' : ''
      } ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="truncate">{label}</span>
    </button>
  );
};
