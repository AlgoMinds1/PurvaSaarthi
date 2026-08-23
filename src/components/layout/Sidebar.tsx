import {
  Map, Route, Package, Building2, Bell, Truck, User,
  Shield, LogOut, AlertTriangle, LayoutDashboard,
  PanelLeftClose, PanelLeftOpen
} from 'lucide-react';
import clsx from 'clsx';
import { useAppStore, type AppView } from '../../store/useAppStore';
import { Logo } from '../ui/Logo';

interface NavItem { id: AppView; label: string; icon: React.ReactNode }

const navItems: NavItem[] = [
  { id: 'command',   label: 'Command Center',      icon: <LayoutDashboard size={18} /> },
  { id: 'map',       label: 'Live GIS Map',         icon: <Map size={18} /> },
  { id: 'roads',     label: 'Road Intelligence',    icon: <Route size={18} /> },
  { id: 'supply',    label: 'Supply at Risk',       icon: <Package size={18} /> },
  { id: 'districts', label: 'District Intelligence',icon: <Building2 size={18} /> },
  { id: 'alerts',    label: 'Alert Center',         icon: <Bell size={18} /> },
  { id: 'vehicles',  label: 'Vehicle Tracking',     icon: <Truck size={18} /> },
];

export function Sidebar() {
  const {
    activeView,
    setView,
    emergencyMode,
    toggleEmergency,
    userRole,
    logout,
    unreadCount,
    sidebarCollapsed,
    toggleSidebar,
  } = useAppStore();

  return (
    <aside
      className={clsx(
        'flex flex-col shrink-0 bg-white dark:bg-[#090f1c] border-r border-slate-200 dark:border-white/[0.06] h-full transition-all duration-300 ease-in-out relative z-30 select-none',
        sidebarCollapsed ? 'w-[68px]' : 'w-60'
      )}
    >
      {/* Brand & Toggle Header */}
      <div
        className={clsx(
          'flex items-center border-b border-slate-200 dark:border-white/[0.06] h-[65px] transition-all',
          sidebarCollapsed ? 'justify-center px-2' : 'justify-between px-4'
        )}
      >
        {!sidebarCollapsed ? (
          <>
            <div className="flex items-center min-w-0 overflow-hidden">
              <Logo size="sm" withText />
            </div>
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer shrink-0"
              title="Collapse Sidebar"
              aria-label="Collapse Sidebar"
            >
              <PanelLeftClose size={18} />
            </button>
          </>
        ) : (
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-xl text-slate-500 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-white/[0.08] transition-all cursor-pointer flex items-center justify-center group"
            title="Expand Sidebar"
            aria-label="Expand Sidebar"
          >
            <PanelLeftOpen size={20} className="group-hover:scale-110 transition-transform text-orange-500" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-2.5 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
        {!sidebarCollapsed && (
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2.5 pb-1 transition-opacity">
            Command Modules
          </div>
        )}
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              title={sidebarCollapsed ? item.label : undefined}
              className={clsx(
                'w-full flex items-center rounded-xl text-sm font-medium transition-all duration-150 relative text-left cursor-pointer group',
                sidebarCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2',
                isActive
                  ? 'bg-orange-50 text-orange-600 dark:bg-white/[0.08] dark:text-white font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.04] hover:text-slate-900 dark:hover:text-slate-200'
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gradient-to-b from-orange-500 to-red-500 rounded-full" />
              )}
              <span className={clsx('shrink-0 transition-transform group-hover:scale-105', isActive ? 'text-orange-500 dark:text-orange-400' : '')}>
                {item.icon}
              </span>
              {!sidebarCollapsed && (
                <span className="truncate flex-1">{item.label}</span>
              )}
              {item.id === 'alerts' && unreadCount > 0 && (
                sidebarCollapsed ? (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-[#090f1c]" />
                ) : (
                  <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {unreadCount}
                  </span>
                )
              )}
            </button>
          );
        })}

        {/* Mobile Portals */}
        <div className={clsx('pt-3 pb-1 border-t border-slate-100 dark:border-white/[0.04] mt-2', sidebarCollapsed && 'flex flex-col items-center gap-1')}>
          {!sidebarCollapsed && (
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2.5 pb-1">
              Mobile PWA Portals
            </div>
          )}
          <button
            onClick={() => useAppStore.getState().login('User')}
            title={sidebarCollapsed ? 'User / Consignee PWA' : undefined}
            className={clsx(
              'w-full flex items-center rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors cursor-pointer text-left',
              sidebarCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2'
            )}
          >
            <User size={17} className="shrink-0" />
            {!sidebarCollapsed && <span className="truncate">User / Consignee PWA</span>}
          </button>
          <button
            onClick={() => useAppStore.getState().login('Truck Driver')}
            title={sidebarCollapsed ? 'Driver Navigation PWA' : undefined}
            className={clsx(
              'w-full flex items-center rounded-xl text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors cursor-pointer text-left',
              sidebarCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2'
            )}
          >
            <Truck size={17} className="shrink-0" />
            {!sidebarCollapsed && <span className="truncate">Driver Navigation PWA</span>}
          </button>
        </div>
      </nav>

      {/* Emergency Toggle */}
      <div className="px-2.5 pb-2.5">
        {sidebarCollapsed ? (
          <button
            onClick={toggleEmergency}
            title={`Emergency Mode: ${emergencyMode ? 'ACTIVE' : 'OFF'}`}
            className={clsx(
              'w-full flex items-center justify-center p-2.5 rounded-xl border transition-all duration-300 cursor-pointer',
              emergencyMode
                ? 'bg-red-500 text-white border-red-400 shadow-md animate-pulse'
                : 'bg-slate-50 border-slate-200 text-slate-500 dark:bg-white/[0.03] dark:border-white/[0.06] hover:text-slate-900 dark:hover:text-slate-200'
            )}
          >
            <AlertTriangle size={18} />
          </button>
        ) : (
          <button
            onClick={toggleEmergency}
            className={clsx(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all duration-300 cursor-pointer',
              emergencyMode
                ? 'bg-red-50 border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-400'
                : 'bg-slate-50 border-slate-200 text-slate-700 dark:bg-white/[0.03] dark:border-white/[0.06] dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            )}
          >
            <AlertTriangle size={16} className={emergencyMode ? 'text-red-500 dark:text-red-400' : 'text-slate-500'} />
            <div className="flex-1 text-left min-w-0">
              <div className="text-xs font-semibold truncate">Emergency Mode</div>
              <div className="text-[10px] opacity-75">{emergencyMode ? 'ACTIVE' : 'OFF'}</div>
            </div>
            {/* Toggle switch */}
            <div className={clsx(
              'relative w-8 h-4.5 rounded-full transition-colors duration-300 shrink-0',
              emergencyMode ? 'bg-red-500' : 'bg-slate-300 dark:bg-white/15'
            )}>
              <div className={clsx(
                'absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full shadow transition-transform duration-300',
                emergencyMode ? 'translate-x-3.5' : 'translate-x-0.5'
              )} />
            </div>
          </button>
        )}
      </div>

      {/* User / Logout pill */}
      <div className="px-2.5 pb-3.5 border-t border-slate-200 dark:border-white/[0.06] pt-3">
        {sidebarCollapsed ? (
          <div className="flex flex-col items-center gap-2">
            <div
              className={clsx(
                'w-8 h-8 rounded-full flex items-center justify-center shadow-xs text-white shrink-0 cursor-pointer',
                userRole === 'Truck Driver' ? 'bg-gradient-to-br from-emerald-500 to-teal-600' :
                userRole === 'User' ? 'bg-gradient-to-br from-blue-500 to-indigo-600' :
                'bg-gradient-to-br from-orange-400 to-red-500'
              )}
              title={`${userRole} (Command Authority)`}
            >
              {userRole === 'Truck Driver' ? <Truck size={15} /> :
               userRole === 'User' ? <User size={15} /> :
               <Shield size={15} />}
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200/60 dark:border-transparent">
            <div className={clsx(
              'w-7 h-7 rounded-full flex items-center justify-center shadow-xs text-white shrink-0',
              userRole === 'Truck Driver' ? 'bg-gradient-to-br from-emerald-500 to-teal-600' :
              userRole === 'User' ? 'bg-gradient-to-br from-blue-500 to-indigo-600' :
              'bg-gradient-to-br from-orange-400 to-red-500'
            )}>
              {userRole === 'Truck Driver' ? <Truck size={14} /> :
               userRole === 'User' ? <User size={14} /> :
               <Shield size={14} />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-slate-900 dark:text-white text-xs font-semibold truncate">{userRole}</div>
              <div className="text-slate-500 dark:text-slate-400 text-[10px] truncate">
                {userRole === 'Truck Driver' ? 'Assigned: TRK-204' :
                 userRole === 'User' ? 'Public & Regional View' :
                 'Command Authority'}
              </div>
            </div>
            <button
              onClick={logout}
              className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors p-1 cursor-pointer"
              title="Logout"
            >
              <LogOut size={14} />
            </button>
          </div>
        )}
      </div>

    </aside>
  );
}
