import React from 'react';
import clsx from 'clsx';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  withText = false,
  className
}) => {
  const sizeMap = {
    sm: { box: 36, iconSize: 36, title: 'text-[15px]', subtitle: 'text-[10px]' },
    md: { box: 44, iconSize: 44, title: 'text-lg', subtitle: 'text-xs' },
    lg: { box: 64, iconSize: 64, title: 'text-3xl', subtitle: 'text-sm' },
    xl: { box: 80, iconSize: 80, title: 'text-4xl', subtitle: 'text-base' }
  };

  const current = sizeMap[size];

  return (
    <div className={clsx('flex items-center gap-3 select-none', className)}>
      {/* Brand Icon SVG */}
      <div
        className="relative shrink-0 flex items-center justify-center"
        style={{ width: current.box, height: current.box }}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-md"
        >
          <defs>
            <linearGradient id="psGrad1" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="50%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
            <linearGradient id="psGrad2" x1="12" y1="12" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fb923c" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="psGold" x1="24" y1="10" x2="24" y2="38" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#fed7aa" />
            </linearGradient>
          </defs>

          {/* Outer Protective Geometric Hex Shield */}
          <path
            d="M24 3L43 13.5V34.5L24 45L5 34.5V13.5L24 3Z"
            fill="url(#psGrad1)"
            stroke="rgba(255, 255, 255, 0.25)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Inner Corridor Nexus Geometry */}
          <path
            d="M24 10L37 17.5V30.5L24 38L11 30.5V17.5L24 10Z"
            fill="url(#psGrad2)"
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />

          {/* Navigational Compass / Guiding Star Axis */}
          <path
            d="M24 8V40M8 24H40"
            stroke="rgba(255, 255, 255, 0.25)"
            strokeWidth="1.2"
            strokeDasharray="2 2"
          />

          {/* Route Mind/Saarthi Waypoint Arteries */}
          <path
            d="M17 31L24 17L31 31"
            stroke="url(#psGold)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Central Resilient Node */}
          <circle cx="24" cy="24" r="4.5" fill="#ffffff" />
          <circle cx="24" cy="24" r="2" fill="#ea580c" />

          {/* North East Navigational Indicator Pointer */}
          <circle cx="33" cy="15" r="2.5" fill="#fef08a" />
        </svg>
      </div>

      {withText && (
        <div>
          <div className={clsx('text-slate-900 dark:text-white font-bold leading-tight tracking-wide font-sans', current.title)}>
            PurvaSaarthi
          </div>
          <div className={clsx('text-slate-500 dark:text-slate-400 font-medium leading-tight mt-0.5 tracking-normal', current.subtitle)}>
            NER Logistics Intelligence
          </div>
        </div>
      )}
    </div>
  );
};
