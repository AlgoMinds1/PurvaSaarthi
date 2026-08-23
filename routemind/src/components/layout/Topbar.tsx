import { useEffect, useState } from 'react';
import { Cloud, Bell, Radio } from 'lucide-react';
import clsx from 'clsx';
import { useAppStore } from '../../store/useAppStore';

export function Topbar() {
  const { activeView, emergencyMode, unreadCount, setView } = useAppStore();
  const [time, setTime] = useState('');

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

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
      'flex items-center justify-between px-6 py-3 border-b shrink-0 transition-colors duration-500',
      emergencyMode
        ? 'bg-red-950/40 border-red-500/20'
        : 'bg-[#090f1c] border-white/[0.06]'
    )}>

      <div>
        <h2 className="text-white font-semibold text-[15px] leading-tight">{title}</h2>
        <p className="text-slate-500 text-xs mt-0.5">{subtitle}</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Live clock */}
        <div className="font-mono text-slate-400 text-sm tabular-nums">{time}</div>

        {/* Weather chip */}
        <div className="flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-full">
          <Cloud size={13} className="text-blue-400" />
          <span className="text-blue-300 text-xs font-medium">87mm forecast</span>
        </div>

        {/* Realtime indicator */}
        <div className="flex items-center gap-1.5">
          <span className="pulse-dot green" />
          <Radio size={13} className="text-green-400" />
          <span className="text-green-400 text-xs font-medium">LIVE</span>
        </div>

        {/* Emergency banner */}
        {emergencyMode && (
          <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 px-3 py-1.5 rounded-full animate-pulse">
            <span className="pulse-dot red" />
            <span className="text-red-400 text-xs font-bold tracking-widest">EMERGENCY MODE</span>
          </div>
        )}

        {/* Alert button */}
        <button
          onClick={() => setView('alerts')}
          className="relative flex items-center gap-1.5 bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] px-3 py-1.5 rounded-full transition-colors"
        >
          <Bell size={13} className="text-slate-300" />
          <span className="text-slate-300 text-xs">{unreadCount} Critical</span>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

    </header>
  );
}
