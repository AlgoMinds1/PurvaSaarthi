import { useState } from 'react';
import clsx from 'clsx';
import { CheckCircle } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import type { AlertSeverity } from '../types';

const SEVERITY_ORDER: AlertSeverity[] = ['EMERGENCY', 'CRITICAL', 'HIGH', 'WARNING', 'INFO'];

const severityConfig: Record<AlertSeverity, { bg: string; border: string; badge: string; dot: string }> = {
  EMERGENCY: {
    bg: 'bg-red-50/80 dark:bg-red-500/[0.07]',
    border: 'border-red-200 dark:border-red-500/20',
    badge: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30',
    dot: 'bg-red-500',
  },
  CRITICAL: {
    bg: 'bg-orange-50/80 dark:bg-orange-500/[0.06]',
    border: 'border-orange-200 dark:border-orange-500/20',
    badge: 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500/30',
    dot: 'bg-orange-500',
  },
  HIGH: {
    bg: 'bg-yellow-50/80 dark:bg-yellow-500/[0.05]',
    border: 'border-yellow-200 dark:border-yellow-500/15',
    badge: 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-500/15 dark:text-yellow-400 dark:border-yellow-500/20',
    dot: 'bg-yellow-500',
  },
  WARNING: {
    bg: 'bg-blue-50/80 dark:bg-blue-500/[0.05]',
    border: 'border-blue-200 dark:border-blue-500/15',
    badge: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/20',
    dot: 'bg-blue-500',
  },
  INFO: {
    bg: 'bg-slate-50/80 dark:bg-slate-500/[0.05]',
    border: 'border-slate-200 dark:border-slate-500/15',
    badge: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-500/15 dark:text-slate-400 dark:border-slate-500/20',
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
    <div className="flex flex-col h-full overflow-y-auto transition-colors duration-200">
      {/* Header row */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#090f1c] shrink-0">
        <div className="flex items-center gap-2 flex-wrap">
          {(['all', ...SEVERITY_ORDER] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={clsx(
                'px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer',
                filter === f
                  ? 'bg-orange-100 text-orange-800 border border-orange-300 dark:bg-orange-500/20 dark:text-orange-300 dark:border-orange-500/30'
                  : 'text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/[0.06] hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-white/20'
              )}
            >
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">Language:</span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="bg-slate-50 dark:bg-white/[0.05] border border-slate-300 dark:border-white/[0.08] text-slate-900 dark:text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-orange-500 cursor-pointer font-medium"
          >
            <option value="en" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">English</option>
            <option value="hi" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">हिंदी</option>
            <option value="as" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">অসমীয়া</option>
            <option value="bn" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">বাংলা</option>
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
                'rounded-xl border p-5 cursor-pointer transition-all hover:shadow-md animate-fade-up',
                cfg.bg, cfg.border,
                alert.read && 'opacity-65'
              )}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  {!alert.read && <span className={clsx('w-2 h-2 rounded-full shrink-0 pulse-dot', cfg.dot)} />}
                  <span className={clsx('text-[10px] font-bold px-2 py-0.5 rounded border', cfg.badge)}>
                    {alert.severity}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 dark:text-slate-400 text-xs font-mono">{alert.timestamp}</span>
                  {alert.read && <CheckCircle size={14} className="text-slate-400 dark:text-slate-600" />}
                </div>
              </div>

              <div className="text-slate-900 dark:text-white font-semibold text-sm mb-2 leading-snug">
                {alert.title[language]}
              </div>
              <div className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed font-medium">
                {alert.body[language]}
              </div>

              {alert.actionRequired && !alert.read && (
                <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400">
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
