import React from 'react';

interface ZapLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withText?: boolean;
  className?: string;
  glow?: boolean;
}

export const ZapLogo: React.FC<ZapLogoProps> = ({
  size = 'md',
  withText = false,
  className = '',
  glow = true
}) => {
  const sizeMap = {
    sm: { icon: 'w-6 h-6', text: 'text-base', subtext: 'text-[9px]' },
    md: { icon: 'w-8 h-8', text: 'text-lg', subtext: 'text-[10px]' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl', subtext: 'text-xs' },
    xl: { icon: 'w-20 h-20', text: 'text-4xl', subtext: 'text-sm' }
  };

  const current = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <div
        className={`relative ${current.icon} shrink-0 flex items-center justify-center ${
          glow ? 'drop-shadow-[0_0_12px_rgba(245,179,1,0.55)]' : ''
        }`}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="zapGoldGrad" x1="10%" y1="10%" x2="90%" y2="90%">
              <stop offset="0%" stopColor="#FFE066" />
              <stop offset="45%" stopColor="#F5B301" />
              <stop offset="100%" stopColor="#C98A00" />
            </linearGradient>
            <linearGradient id="zapDarkAccent" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD13B" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#7A5200" stopOpacity="0.4" />
            </linearGradient>
            <filter id="goldBloom" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#F5B301" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Outer Curved Aerodynamic Shield / Z */}
          <path
            d="M 28 82 C 16 68 18 40 32 24 C 44 10 68 8 82 20 C 72 24 64 30 58 38 C 50 48 46 62 52 74 C 44 80 34 84 28 82 Z"
            fill="url(#zapGoldGrad)"
          />

          {/* Center Lightning Core */}
          <path
            d="M 44 26 L 76 18 C 74 32 64 42 56 46 L 74 44 C 64 64 42 76 34 80 C 40 68 46 54 44 44 L 34 46 L 44 26 Z"
            fill="#FFFFFF"
            opacity="0.95"
            style={{ mixBlendMode: 'overlay' }}
          />

          {/* Main Golden Curved Body */}
          <path
            d="M 38 18 C 54 8 76 12 84 26 C 92 40 88 64 74 78 C 66 86 52 88 42 82 C 34 76 32 64 36 52 C 40 42 48 34 56 28 C 48 26 42 22 38 18 Z"
            fill="url(#zapGoldGrad)"
            filter="url(#goldBloom)"
          />

          {/* Inner Negative Space Cutout */}
          <path
            d="M 52 40 C 46 48 44 58 48 66 C 56 68 64 64 70 56 C 76 46 72 38 64 36 C 58 36 54 38 52 40 Z"
            fill="#0D0D11"
          />

          {/* Fast-forward dynamic wings */}
          <circle cx="78" cy="24" r="5" fill="#FFEAA7" />
          <circle cx="88" cy="38" r="3.5" fill="#F5B301" />
        </svg>
      </div>

      {withText && (
        <div className="flex flex-col">
          <span className={`font-display font-extrabold tracking-tight text-white leading-none ${current.text}`}>
            ZAP<span className="text-[#F5B301]">MOVIES</span>
          </span>
          <span className={`text-slate-400 font-medium tracking-widest uppercase ${current.subtext}`}>
            Stream · Android Edition
          </span>
        </div>
      )}
    </div>
  );
};
