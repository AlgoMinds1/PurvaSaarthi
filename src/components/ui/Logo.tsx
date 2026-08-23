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
    sm: { box: 36, title: 'text-[15px]', subtitle: 'text-[10px]' },
    md: { box: 46, title: 'text-lg', subtitle: 'text-xs' },
    lg: { box: 68, title: 'text-3xl', subtitle: 'text-sm' },
    xl: { box: 92, title: 'text-4xl', subtitle: 'text-base' }
  };

  const current = sizeMap[size];

  return (
    <div className={clsx('flex items-center gap-3 select-none', className)}>
      {/* Official PurvaSaarthi Brand Logo */}
      <div
        className="relative shrink-0 flex items-center justify-center overflow-hidden rounded-xl bg-white/5 dark:bg-white/5 p-1"
        style={{ width: current.box, height: current.box }}
      >
        <img
          src="/logo.svg"
          alt="PurvaSaarthi Logo"
          className="w-full h-full object-contain drop-shadow-md"
        />
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
