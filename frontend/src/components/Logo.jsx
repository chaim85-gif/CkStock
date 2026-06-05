import React from 'react';
import { useTheme } from '../context/ThemeContext';

const CkStockLogo = ({ className = "", size = "md" }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Primary colors
  const blue = isDark ? '#3B82F6' : '#2563EB';
  const blueLight = isDark ? '#60A5FA' : '#3B82F6';
  const purple = '#7C3AED';

  const sizeMap = {
    sm: { box: 28, font: 'text-base', icon: 16 },
    md: { box: 40, font: 'text-2xl', icon: 22 },
    lg: { box: 52, font: 'text-3xl', icon: 28 },
    xl: { box: 64, font: 'text-4xl', icon: 34 },
  };

  const s = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Vector SVG Logo Mark */}
      <div className="relative" style={{ width: s.box, height: s.box }}>
        {/* Glow effect behind logo */}
        <svg
          width={s.box}
          height={s.box}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-lg"
        >
          {/* Background rounded square with gradient */}
          <defs>
            <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={blue} />
              <stop offset="100%" stopColor={purple} />
            </linearGradient>
            <linearGradient id="logoGradLight" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={blueLight} />
              <stop offset="100%" stopColor={purple} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Base shape */}
          <rect
            x="1" y="1" width="38" height="38" rx="10"
            fill="url(#logoGrad)"
            filter="url(#glow)"
          />

          {/* Inner glass highlight */}
          <rect
            x="1" y="1" width="38" height="38" rx="10"
            fill="url(#logoGradLight)"
            opacity="0.3"
          />

          {/* Inner shine */}
          <rect
            x="3" y="3" width="34" height="17" rx="7"
            fill="white" opacity="0.15"
          />

          {/* Ck ligature icon - abstract stock/box with check */}
          {/* Top bar of box */}
          <rect x="10" y="12" width="20" height="2.5" rx="1.25" fill="white" opacity="0.9" />
          {/* Left side of box */}
          <rect x="10" y="14" width="2.5" height="14" rx="1.25" fill="white" opacity="0.9" />
          {/* Right side of box */}
          <rect x="27.5" y="14" width="2.5" height="14" rx="1.25" fill="white" opacity="0.9" />
          {/* Bottom of box */}
          <rect x="10" y="26" width="20" height="2.5" rx="1.25" fill="white" opacity="0.9" />
          {/* Middle shelf */}
          <rect x="12" y="19" width="16" height="1.8" rx="0.9" fill="white" opacity="0.5" />
          {/* Checkmark accent */}
          <path
            d="M17 23 L19.5 25.5 L23 21"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0.95"
          />
        </svg>
      </div>

      {/* Text: CkStock */}
      <div className="flex items-baseline">
        <span className={`${s.font} font-extrabold tracking-tight`}
          style={{
            background: `linear-gradient(135deg, ${blue}, ${purple})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Ck
        </span>
        <span className={`${s.font} font-bold tracking-tight`}
          style={{ color: 'var(--color-foreground)' }}
        >
          Stock
        </span>
      </div>
    </div>
  );
};

export default CkStockLogo;