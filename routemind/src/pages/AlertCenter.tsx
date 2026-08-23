import { useState } from 'react';
import clsx from 'clsx';
import { CheckCircle } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import type { AlertSeverity } from '../types';

const SEVERITY_ORDER: AlertSeverity[] = ['EMERGENCY', 'CRITICAL', 'HIGH', 'WARNING', 'INFO'];

const severityConfig: Record<AlertSeverity, { bg: string; border: string; badge: string; dot: string }> = {
  EMERGENCY: {
    bg: 'bg-red-500/[0.07]', border: 'border-red-500/20',
    badge: 'bg-red-500/20 text-red-400 border border-red-500/30',
    dot: 'bg-red-500',
  },
  CRITICAL: {
    bg: 'bg-orange-500/[0.06]', border: 'border-orange-500/20',
    badge: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
    dot: 'bg-orange-500',
  },
  HIGH: {
    bg: 'bg-yellow-500/[0.05]', border: 'border-yellow-500/15',
    badge: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20',
    dot: 'bg-yellow-500',
  },
  WARNING: {
    bg: 'bg-blue-500/[0.05]', border: 'border-blue-500/15',
    badge: 'bg-blue-500/15 text-blue-400 border border-blue-500/20',
    dot: 'bg-blue-500',
  },
  INFO: {
    bg: 'bg-slate-500/[0.05]', border: 'border-slate-500/15',
    badge: 'bg-slate-500/15 text-slate-400 border border-slate-500/20',
    dot: 'bg-slate-500',
  },
};

export default function AlertCenter() {
  const { alerts, markAlertRead, language, setLanguage } = useAppStore();
  const [filter, setFilter] = useState<'all' | AlertSeverity>('all');

  const filtered = filter === 'all'
    ? [...alerts].sort((a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity))
    : alerts.filter(a => a.severity === filter);

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header row */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-[#090f1c] shrink-0">
        <div className="flex items-center gap-2 flex-wrap">
          {(['all', ...SEVERITY_ORDER] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={clsx(
                'px-3 py-1.5 rounded-full text-xs font-semibold transition-all',
                filter === f
                  ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                  : 'text-slate-400 border border-white/[0.06] hover:text-slate-200 hover:border-white/20'
              )}
            >
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-500 text-xs">Language:</span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="bg-white/[0.05] border border-white/[0.08] text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-orange-500/40 cursor-pointer"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="as">অসমীয়া</option>
            <option value="bn">বাংলা</option>
          </select>
        </div>
      </div>

      {/* Alerts list */}
      <div className="flex-1 overflow-y-auto p-6 space-y-3">
        {filtered.map((alert) => {
          const cfg = severityConfig[alert.severity];
          return (
            <div
              key={alert.id}
              onClick={() => markAlertRead(alert.id)}
              className={clsx(
                'rounded-xl border p-5 cursor-pointer transition-all hover:brightness-110 animate-fade-up',
                cfg.bg, cfg.border,
                alert.read && 'opacity-60'
              )}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  {!alert.read && <span className={clsx('w-2 h-2 rounded-full shrink-0 pulse-dot', cfg.dot)} />}
                  <span className={clsx('text-[10px] font-bold px-2 py-1 rounded', cfg.badge)}>
                    {alert.severity}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 text-xs font-mono">{alert.timestamp}</span>
                  {alert.read && <CheckCircle size={14} className="text-slate-600" />}
                </div>
              </div>

              <div className="text-white font-semibold text-sm mb-2 leading-snug">
                {alert.title[language]}
              </div>
              <div className="text-slate-400 text-xs leading-relaxed">
                {alert.body[language]}
              </div>

              {alert.actionRequired && !alert.read && (
                <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-orange-400">
                  <span className="pulse-dot orange w-1.5 h-1.5" />
                  Action required — click to acknowledge
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
