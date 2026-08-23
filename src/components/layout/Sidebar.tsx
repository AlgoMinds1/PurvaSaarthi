import { useState } from 'react';
import {
  Map, Route, Package, Building2, Bell, Truck, User,
  Shield, LogOut, AlertTriangle, LayoutDashboard,
  PanelLeftClose, PanelLeftOpen
} from 'lucide-react';
import clsx from 'clsx';
import { useAppStore, type AppView } from '../../store/useAppStore';

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

  const [isHovered, setIsHovered] = useState(false);

  // If pinned open (!sidebarCollapsed), it's always expanded.
  // If collapsed (sidebarCollapsed), it expands smoothly on hover.
  const isExpanded = !sidebarCollapsed || isHovered;

  const handleNavClick = (viewId: AppView) => {
    setView(viewId);
    if (sidebarCollapsed) {
      setIsHovered(false);
    }
  };

  const handlePwaClick = (role: string) => {
    useAppStore.getState().login(role);
    if (sidebarCollapsed) {
      setIsHovered(false);
    }
  };

  return (
    <div
      className={clsx(
        'relative shrink-0 h-full z-40 select-none transition-[width] duration-300 ease-[cubic-bezier(0.2,0,0,1)]',
        sidebarCollapsed ? 'w-[68px]' : 'w-60'
      )}
      onMouseEnter={() => {
        if (sidebarCollapsed) setIsHovered(true);
      }}
      onMouseLeave={() => {
        if (sidebarCollapsed) setIsHovered(false);
      }}
    >
      <aside
        className={clsx(
          'flex flex-col h-full bg-white dark:bg-[#090f1c] border-r border-slate-200 dark:border-white/[0.06] transition-[width,box-shadow,background-color] duration-300 ease-[cubic-bezier(0.2,0,0,1)] overflow-hidden absolute left-0 top-0 bottom-0 will-change-[width]',
          isExpanded
            ? 'w-60 shadow-2xl bg-white/98 dark:bg-[#090f1c]/98 backdrop-blur-xl z-50 border-r border-slate-200/90 dark:border-white/[0.1]'
            : 'w-[68px] shadow-none z-40'
        )}
      >
        {/* Brand Header */}
        <div className="flex items-center h-[65px] px-3.5 border-b border-slate-200 dark:border-white/[0.06] shrink-0 justify-between">
          <div
            className="flex items-center min-w-0 cursor-pointer overflow-hidden"
            onClick={() => handleNavClick('command')}
            title="PurvaSaarthi Command Center"
          >
            <div className="w-[38px] h-[38px] shrink-0 flex items-center justify-center rounded-xl bg-white/5 dark:bg-white/5 p-1">
              <img
                src="/logo.svg"
                alt="PurvaSaarthi Logo"
                className="w-full h-full object-contain drop-shadow-md"
              />
            </div>
            <div
              className={clsx(
                'ml-3 transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] overflow-hidden whitespace-nowrap',
                isExpanded
                  ? 'opacity-100 max-w-[140px] translate-x-0'
                  : 'opacity-0 max-w-0 -translate-x-3 pointer-events-none'
              )}
            >
              <div className="text-slate-900 dark:text-white font-bold text-[15px] leading-tight font-sans tracking-wide">
                PurvaSaarthi
              </div>
              <div className="text-slate-500 dark:text-slate-400 font-medium text-[10px] leading-tight mt-0.5">
                NER Logistics Intelligence
              </div>
            </div>
          </div>

          <div
            className={clsx(
              'transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] shrink-0 overflow-hidden',
              isExpanded
                ? 'opacity-100 max-w-[40px]'
                : 'opacity-0 max-w-0 pointer-events-none'
            )}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSidebar();
                setIsHovered(false);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
              title={sidebarCollapsed ? 'Pin Sidebar Open' : 'Collapse Sidebar'}
              aria-label={sidebarCollapsed ? 'Pin Sidebar Open' : 'Collapse Sidebar'}
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen size={18} className="text-orange-500" />
              ) : (
                <PanelLeftClose size={18} />
              )}
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto overflow-x-hidden">
          <div
            className={clsx(
              'text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 pb-1 transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] overflow-hidden whitespace-nowrap',
              isExpanded ? 'opacity-100 max-h-6' : 'opacity-0 max-h-0 pointer-events-none'
            )}
          >
            Command Modules
          </div>

          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                title={!isExpanded ? item.label : undefined}
                className={clsx(
                  'w-full flex items-center h-10 px-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative text-left cursor-pointer group',
                  isActive
                    ? 'bg-orange-50 text-orange-600 dark:bg-white/[0.08] dark:text-white font-semibold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.04] hover:text-slate-900 dark:hover:text-slate-200'
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gradient-to-b from-orange-500 to-red-500 rounded-full" />
                )}
                <span
                  className={clsx(
                    'w-5 h-5 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105',
                    isActive ? 'text-orange-500 dark:text-orange-400' : ''
                  )}
                >
                  {item.icon}
                </span>

                <div
                  className={clsx(
                    'flex items-center justify-between flex-1 min-w-0 ml-3 transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] overflow-hidden whitespace-nowrap',
                    isExpanded
                      ? 'opacity-100 max-w-[180px] translate-x-0'
                      : 'opacity-0 max-w-0 -translate-x-3 pointer-events-none'
                  )}
                >
                  <span className="truncate">{item.label}</span>
                  {item.id === 'alerts' && unreadCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shrink-0">
                      {unreadCount}
                    </span>
                  )}
                </div>

                {/* Collapsed Alert Red Dot */}
                {!isExpanded && item.id === 'alerts' && unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-[#090f1c]" />
                )}
              </button>
            );
          })}

          {/* Mobile Portals */}
          <div className="pt-3 pb-1 border-t border-slate-100 dark:border-white/[0.04] mt-2 space-y-1">
            <div
              className={clsx(
                'text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 pb-1 transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] overflow-hidden whitespace-nowrap',
                isExpanded ? 'opacity-100 max-h-6' : 'opacity-0 max-h-0 pointer-events-none'
              )}
            >
              Mobile PWA Portals
            </div>

            <button
              onClick={() => handlePwaClick('User')}
              title={!isExpanded ? 'User / Consignee PWA' : undefined}
              className="w-full flex items-center h-10 px-2.5 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors cursor-pointer text-left group"
            >
              <span className="w-5 h-5 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
                <User size={17} />
              </span>
              <div
                className={clsx(
                  'ml-3 transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] overflow-hidden whitespace-nowrap',
                  isExpanded
                    ? 'opacity-100 max-w-[180px] translate-x-0'
                    : 'opacity-0 max-w-0 -translate-x-3 pointer-events-none'
                )}
              >
                <span className="truncate">User / Consignee PWA</span>
              </div>
            </button>

            <button
              onClick={() => handlePwaClick('Truck Driver')}
              title={!isExpanded ? 'Driver Navigation PWA' : undefined}
              className="w-full flex items-center h-10 px-2.5 rounded-xl text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors cursor-pointer text-left group"
            >
              <span className="w-5 h-5 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
                <Truck size={17} />
              </span>
              <div
                className={clsx(
                  'ml-3 transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] overflow-hidden whitespace-nowrap',
                  isExpanded
                    ? 'opacity-100 max-w-[180px] translate-x-0'
                    : 'opacity-0 max-w-0 -translate-x-3 pointer-events-none'
                )}
              >
                <span className="truncate">Driver Navigation PWA</span>
              </div>
            </button>
          </div>
        </nav>

        {/* Emergency Toggle */}
        <div className="px-3 pb-3 shrink-0">
          <button
            onClick={toggleEmergency}
            title={!isExpanded ? `Emergency Mode: ${emergencyMode ? 'ACTIVE' : 'OFF'}` : undefined}
            className={clsx(
              'w-full flex items-center h-11 px-2.5 rounded-xl border transition-all duration-300 cursor-pointer',
              emergencyMode
                ? 'bg-red-50 border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-400 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 dark:bg-white/[0.03] dark:border-white/[0.06] dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            )}
          >
            <span className="w-5 h-5 flex items-center justify-center shrink-0">
              <AlertTriangle
                size={17}
                className={emergencyMode ? 'text-red-500 dark:text-red-400 animate-pulse' : 'text-slate-500'}
              />
            </span>

            <div
              className={clsx(
                'flex items-center justify-between flex-1 min-w-0 ml-3 transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] overflow-hidden whitespace-nowrap',
                isExpanded
                  ? 'opacity-100 max-w-[180px] translate-x-0'
                  : 'opacity-0 max-w-0 -translate-x-3 pointer-events-none'
              )}
            >
              <div className="text-left min-w-0">
                <div className="text-xs font-semibold truncate leading-tight">Emergency Mode</div>
                <div className="text-[10px] opacity-75 leading-tight">{emergencyMode ? 'ACTIVE' : 'OFF'}</div>
              </div>
              <div
                className={clsx(
                  'relative w-7 h-4 rounded-full transition-colors duration-300 shrink-0 ml-2',
                  emergencyMode ? 'bg-red-500' : 'bg-slate-300 dark:bg-white/15'
                )}
              >
                <div
                  className={clsx(
                    'absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform duration-300',
                    emergencyMode ? 'translate-x-3.5' : 'translate-x-0.5'
                  )}
                />
              </div>
            </div>
          </button>
        </div>

        {/* User Profile / Logout pill */}
        <div className="px-3 pb-3.5 border-t border-slate-200 dark:border-white/[0.06] pt-3 shrink-0">
          <div className="flex items-center h-10 px-2 rounded-xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200/60 dark:border-transparent">
            <div
              className={clsx(
                'w-7 h-7 rounded-full flex items-center justify-center shadow-xs text-white shrink-0 cursor-pointer',
                userRole === 'Truck Driver'
                  ? 'bg-gradient-to-br from-emerald-500 to-teal-600'
                  : userRole === 'User'
                  ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
                  : 'bg-gradient-to-br from-orange-400 to-red-500'
              )}
              title={`${userRole} (Command Authority)`}
            >
              {userRole === 'Truck Driver' ? (
                <Truck size={14} />
              ) : userRole === 'User' ? (
                <User size={14} />
              ) : (
                <Shield size={14} />
              )}
            </div>

            <div
              className={clsx(
                'flex items-center justify-between flex-1 min-w-0 ml-2.5 transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] overflow-hidden whitespace-nowrap',
                isExpanded
                  ? 'opacity-100 max-w-[180px] translate-x-0'
                  : 'opacity-0 max-w-0 -translate-x-3 pointer-events-none'
              )}
            >
              <div className="flex-1 min-w-0 pr-1">
                <div className="text-slate-900 dark:text-white text-xs font-semibold truncate leading-tight">
                  {userRole}
                </div>
                <div className="text-slate-500 dark:text-slate-400 text-[10px] truncate leading-tight">
                  {userRole === 'Truck Driver'
                    ? 'Assigned: TRK-204'
                    : userRole === 'User'
                    ? 'Public & Regional View'
                    : 'Command Authority'}
                </div>
              </div>
              <button
                onClick={logout}
                className="p-1 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors cursor-pointer shrink-0"
                title="Logout"
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
