import { Bell, Sun, Moon, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import clsx from 'clsx';
import { useAppStore } from '../../store/useAppStore';

export function Topbar() {
  const { activeView, emergencyMode, unreadCount, setView, theme, toggleTheme, sidebarCollapsed, toggleSidebar } = useAppStore();

  const titles: Record<string, { title: string; subtitle: string }> = {
    command:   { title: 'Command Center',       subtitle: 'Regional Logistics Operations Overview' },
    map:       { title: 'Live GIS Map',          subtitle: 'Real-time NER road & vehicle status' },
    roads:     { title: 'Road Intelligence',     subtitle: 'AI-powered road risk & disruption analysis' },
    supply:    { title: 'Supply at Risk',        subtitle: 'Commodity tracking & shortage prediction' },
    districts: { title: 'District Intelligence', subtitle: 'Isolation risk & cascade impact analysis' },
    alerts:    { title: 'Alert Center',          subtitle: 'Severity-tiered notifications & actions' },
    vehicles:  { title: 'Vehicle Tracking',      subtitle: 'GPS-based fleet monitoring' },
  };

  const { title, subtitle } = titles[activeView] ?? titles.command;

  return (
    <header className={clsx(
      'flex items-center justify-between px-5 py-3 border-b shrink-0 transition-colors duration-300',
      emergencyMode
        ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-500/20'
        : 'bg-white dark:bg-[#090f1c] border-slate-200 dark:border-white/[0.06]'
    )}>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
          title={sidebarCollapsed ? 'Expand Sidebar (Toggle)' : 'Collapse Sidebar (Toggle)'}
          aria-label={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {sidebarCollapsed ? <PanelLeftOpen size={19} className="text-orange-500" /> : <PanelLeftClose size={19} />}
        </button>

        <div>
          <h2 className="text-slate-900 dark:text-white font-semibold text-[15px] leading-tight">{title}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.09] border border-slate-200 dark:border-white/[0.08] px-3 py-1.5 rounded-full text-slate-700 dark:text-slate-300 text-xs transition-all duration-200 font-medium cursor-pointer"
          title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        >
          {theme === 'dark' ? (
            <>
              <Sun size={13} className="text-amber-400" />
              <span>Light</span>
            </>
          ) : (
            <>
              <Moon size={13} className="text-indigo-600" />
              <span>Dark</span>
            </>
          )}
        </button>

        {/* Emergency banner */}
        {emergencyMode && (
          <div className="flex items-center gap-2 bg-red-100 dark:bg-red-500/20 border border-red-300 dark:border-red-500/30 px-3 py-1 rounded-full animate-pulse">
            <span className="pulse-dot red" />
            <span className="text-red-700 dark:text-red-400 text-xs font-bold tracking-wider">EMERGENCY MODE</span>
          </div>
        )}

        {/* Alert button */}
        <button
          onClick={() => setView('alerts')}
          className="relative flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/[0.08] px-3 py-1.5 rounded-full transition-colors cursor-pointer"
        >
          <Bell size={13} className="text-slate-700 dark:text-slate-300" />
          <span className="text-slate-700 dark:text-slate-300 text-xs font-medium">{unreadCount} Critical</span>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center shadow-sm">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

    </header>
  );
}
