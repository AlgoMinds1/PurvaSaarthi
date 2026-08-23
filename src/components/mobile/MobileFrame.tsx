import {
  Sun, Moon, Shield, Truck, User, ArrowLeft
} from 'lucide-react';
import clsx from 'clsx';
import { useAppStore } from '../../store/useAppStore';

interface MobileFrameProps {
  children: React.ReactNode;
  roleName: 'User' | 'Truck Driver';
}

export function MobileFrame({ children, roleName }: MobileFrameProps) {
  const { theme, toggleTheme, login, goToLanding, language } = useAppStore();

  const isHindi = language === 'hi';

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] flex flex-col transition-colors duration-300">
      
      {/* Top Floating Control Bar on Desktop/Laptop */}
      <header className="hidden md:flex items-center justify-between w-full px-6 py-2.5 bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 backdrop-blur-md sticky top-0 z-40 transition-colors">
        <div className="flex items-center gap-3">
          <button
            onClick={goToLanding}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>{isHindi ? 'मुख्य दृश्य' : 'Overview'}</span>
          </button>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
              {roleName === 'User'
                ? isHindi ? 'प्राप्तकर्ता / डिलीवरी ट्रैकिंग' : 'Consignee / User Delivery Tracking'
                : isHindi ? 'ट्रक चालक लाइव नेविगेशन व ट्रैकिंग' : 'Truck Driver Road-Tracking Navigation'}
            </span>
          </div>
        </div>

        {/* Role Quick Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/90 rounded-xl p-1 border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => login('User')}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all cursor-pointer',
                roleName === 'User' ? 'bg-blue-600 text-white font-bold shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              )}
            >
              <User size={13} />
              <span>User / Consignee</span>
            </button>
            <button
              onClick={() => login('Truck Driver')}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all cursor-pointer',
                roleName === 'Truck Driver' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              )}
            >
              <Truck size={13} />
              <span>Driver (TRK-204)</span>
            </button>
            <button
              onClick={() => login('Admin')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-medium transition-all cursor-pointer"
            >
              <Shield size={13} />
              <span>Admin Dashboard</span>
            </button>
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all cursor-pointer border border-slate-200 dark:border-slate-700"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-indigo-600" />}
          </button>
        </div>
      </header>

      {/* Main Responsive Content Container */}
      <main className="flex-1 w-full flex flex-col bg-[var(--bg-main)] min-h-0">
        {children}
      </main>

    </div>
  );
}
