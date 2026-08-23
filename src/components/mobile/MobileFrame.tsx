import {
  Smartphone, Maximize2,
  Sun, Moon, Shield, Truck, User, ArrowLeft
} from 'lucide-react';
import clsx from 'clsx';
import { useAppStore } from '../../store/useAppStore';

interface MobileFrameProps {
  children: React.ReactNode;
  roleName: 'User' | 'Truck Driver';
}

export function MobileFrame({ children, roleName }: MobileFrameProps) {
  const { theme, toggleTheme, mobilePreviewMode, toggleMobilePreviewMode, login, goToLanding } = useAppStore();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center relative overflow-x-hidden p-0 sm:p-4 md:p-6 transition-colors duration-300">

      {/* Background Ambience on Desktop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-orange-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-10 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '36px 36px'
          }}
        />
      </div>

      {/* Top Floating Control Bar on Desktop */}
      <header className="hidden sm:flex items-center justify-between w-full max-w-5xl mb-4 px-4 py-2.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 backdrop-blur-xl shadow-xl z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={goToLanding}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-all cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Overview</span>
          </button>

          <div className="h-4 w-px bg-slate-700 mx-1" />

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-100">
              {roleName === 'User' ? 'Consignee / User Delivery Tracking PWA' : 'Truck Driver Road-Tracking Navigation PWA'}
            </span>
          </div>
        </div>

        {/* Role Quick Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-900/90 rounded-xl p-1 border border-slate-700/70 text-xs">
            <button
              onClick={() => login('User')}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all cursor-pointer',
                roleName === 'User' ? 'bg-blue-600 text-white font-bold shadow-xs' : 'text-slate-400 hover:text-slate-200'
              )}
            >
              <User size={13} />
              <span>User / Consignee</span>
            </button>
            <button
              onClick={() => login('Truck Driver')}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all cursor-pointer',
                roleName === 'Truck Driver' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'text-slate-400 hover:text-slate-200'
              )}
            >
              <Truck size={13} />
              <span>Driver (TRK-204)</span>
            </button>
            <button
              onClick={() => login('Admin')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-slate-400 hover:text-slate-200 font-medium transition-all cursor-pointer"
            >
              <Shield size={13} />
              <span>Admin Dashboard</span>
            </button>
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Toggle theme inside frame"
          >
            {theme === 'dark' ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-indigo-300" />}
          </button>

          <button
            onClick={toggleMobilePreviewMode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
            title="Toggle between phone simulator frame and full viewport"
          >
            {mobilePreviewMode === 'phone' ? (
              <>
                <Maximize2 size={13} />
                <span>Fullscreen</span>
              </>
            ) : (
              <>
                <Smartphone size={13} />
                <span>Phone Frame</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Container: Either Framed or Fullscreen */}
      <main className={clsx(
        'w-full transition-all duration-300 z-20 flex justify-center',
        mobilePreviewMode === 'fullscreen' ? 'max-w-4xl h-[92vh]' : 'max-w-md h-[100vh] sm:h-[880px]'
      )}>
        <div className={clsx(
          'w-full h-full flex flex-col overflow-hidden bg-[var(--bg-base)] text-[var(--text-primary)] transition-all duration-300 shadow-2xl relative',
          mobilePreviewMode === 'phone'
            ? 'sm:rounded-[44px] sm:border-[8px] sm:border-slate-800 sm:ring-1 sm:ring-slate-700/80'
            : 'sm:rounded-2xl sm:border sm:border-slate-700/80'
        )}>



          {/* Actual Screen Content */}
          <div className="flex-1 min-h-0 overflow-y-auto flex flex-col relative bg-[var(--bg-main)]">
            {children}
          </div>

          {/* Mobile Bottom Home Indicator Bar */}
          <div className="w-full py-2 flex justify-center bg-[var(--bg-base)] shrink-0 select-none">
            <div className="w-32 h-1 rounded-full bg-slate-400/40 dark:bg-white/20" />
          </div>

        </div>
      </main>

    </div>
  );
}
