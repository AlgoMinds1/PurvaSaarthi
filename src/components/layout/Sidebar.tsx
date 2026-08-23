import {
  Zap, Map, Route, Package, Building2, Bell, Truck,
  Shield, LogOut, AlertTriangle
} from 'lucide-react';
import clsx from 'clsx';
import { useAppStore, type AppView } from '../../store/useAppStore';

interface NavItem { id: AppView; label: string; icon: React.ReactNode }

const navItems: NavItem[] = [
  { id: 'command',   label: 'Command Center',      icon: <Zap size={18} /> },
  { id: 'map',       label: 'Live GIS Map',         icon: <Map size={18} /> },
  { id: 'roads',     label: 'Road Intelligence',    icon: <Route size={18} /> },
  { id: 'supply',    label: 'Supply at Risk',       icon: <Package size={18} /> },
  { id: 'districts', label: 'District Intelligence',icon: <Building2 size={18} /> },
  { id: 'alerts',    label: 'Alert Center',         icon: <Bell size={18} /> },
  { id: 'vehicles',  label: 'Vehicle Tracking',     icon: <Truck size={18} /> },
];

export function Sidebar() {
  const { activeView, setView, emergencyMode, toggleEmergency, userRole, logout, unreadCount } = useAppStore();

  return (
    <aside className="flex flex-col w-60 shrink-0 bg-white dark:bg-[#090f1c] border-r border-slate-200 dark:border-white/[0.06] h-full transition-colors duration-200">

      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-200 dark:border-white/[0.06]">
        <div className="relative w-9 h-9 shrink-0">
          <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
            <path d="M20 4L34 12V28L20 36L6 28V12L20 4Z"
              fill="url(#sg1)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
            <circle cx="20" cy="19" r="4" fill="white" fillOpacity="0.95"/>
            <defs>
              <linearGradient id="sg1" x1="6" y1="4" x2="34" y2="36">
                <stop offset="0%" stopColor="#f97316"/>
                <stop offset="100%" stopColor="#ef4444"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div>
          <div className="text-slate-900 dark:text-white font-bold text-[15px] leading-tight tracking-wide">PurvaSaarthi</div>
          <div className="text-slate-500 dark:text-slate-400 text-[10px] leading-tight mt-0.5 font-medium">NER Logistics Intelligence</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={clsx(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 relative text-left',
                isActive
                  ? 'bg-orange-50 text-orange-600 dark:bg-white/[0.08] dark:text-white font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.04] hover:text-slate-900 dark:hover:text-slate-200'
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gradient-to-b from-orange-500 to-red-500 rounded-full" />
              )}
              <span className={isActive ? 'text-orange-500 dark:text-orange-400' : ''}>{item.icon}</span>
              <span>{item.label}</span>
              {item.id === 'alerts' && unreadCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {unreadCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Emergency Toggle */}
      <div className="px-3 pb-3">
        <button
          onClick={toggleEmergency}
          className={clsx(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all duration-300',
            emergencyMode
              ? 'bg-red-50 border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-400'
              : 'bg-slate-50 border-slate-200 text-slate-700 dark:bg-white/[0.03] dark:border-white/[0.06] dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          )}
        >
          <AlertTriangle size={16} className={emergencyMode ? 'text-red-500 dark:text-red-400' : 'text-slate-500'} />
          <div className="flex-1 text-left">
            <div className="text-xs font-semibold">Emergency Mode</div>
            <div className="text-[10px] opacity-75">{emergencyMode ? 'ACTIVE' : 'OFF'}</div>
          </div>
          {/* Toggle switch */}
          <div className={clsx(
            'relative w-8 h-4.5 rounded-full transition-colors duration-300',
            emergencyMode ? 'bg-red-500' : 'bg-slate-300 dark:bg-white/15'
          )}>
            <div className={clsx(
              'absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full shadow transition-transform duration-300',
              emergencyMode ? 'translate-x-3.5' : 'translate-x-0.5'
            )} />
          </div>
        </button>
      </div>

      {/* User pill */}
      <div className="px-3 pb-4 border-t border-slate-200 dark:border-white/[0.06] pt-3">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-100 dark:bg-white/[0.03] border border-slate-200/60 dark:border-transparent">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-sm">
            <Shield size={14} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-slate-900 dark:text-white text-xs font-semibold truncate">{userRole}</div>
            <div className="text-slate-500 dark:text-slate-400 text-[10px]">Full Access</div>
          </div>
          <button onClick={logout} className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors p-1" title="Logout">
            <LogOut size={14} />
          </button>
        </div>
      </div>

    </aside>
  );
}
