import { useState } from 'react';
import clsx from 'clsx';
import { ChevronRight, Radio, AlertTriangle, Truck } from 'lucide-react';
import { vehicles } from '../data/mockData';
import type { Vehicle } from '../types';

function VehicleDetail({ v }: { v: Vehicle }) {
  const riskColor = v.routeRisk > 80 ? '#ef4444' : v.routeRisk > 60 ? '#f97316' : '#22c55e';

  return (
    <div className="p-6 h-full overflow-y-auto animate-fade-up">
      <div className="flex items-start justify-between gap-3 mb-5">
        <div>
          <h3 className="text-slate-900 dark:text-white font-bold text-base">{v.id} — {v.plateNo}</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-0.5 font-medium">Driver: {v.driverName}</p>
        </div>
        <span className={clsx(
          'text-xs font-bold px-2.5 py-1 rounded-lg border',
          v.status === 'TELEMETRY_UNAVAILABLE' ? 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-500/15 dark:text-orange-400 dark:border-orange-500/25' :
          v.status === 'IN_TRANSIT' ? 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/25' :
          'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-green-500/15 dark:text-green-400 dark:border-green-500/20'
        )}>
          {v.status.replace(/_/g, ' ')}
        </span>
      </div>

      {/* Telemetry warning */}
      {!v.telemetryFresh && (
        <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-xl p-4 mb-4">
          <div className="text-orange-700 dark:text-orange-400 font-bold text-xs mb-1.5 flex items-center gap-1.5">
            <AlertTriangle size={13} />
            <span>VEHICLE TELEMETRY UNAVAILABLE</span>
          </div>
          <p className="text-slate-700 dark:text-slate-300 text-xs">
            Last GPS ping: <span className="font-semibold text-orange-700 dark:text-orange-300">{v.lastPingAt}</span>
          </p>
          <p className="text-slate-600 dark:text-slate-400 text-xs mt-1">
            This vehicle has not checked in recently. Status is shown as <strong>TELEMETRY UNAVAILABLE</strong> — not "stopped".
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { label: 'Route Name', val: v.routeName },
          { label: 'Destination', val: v.destination },
          { label: 'Route Risk', val: `${v.routeRisk}%`, color: riskColor },
          { label: 'ETA', val: v.eta },
          { label: 'Original ETA', val: v.originalEta },
          { label: 'Delay', val: v.delayMinutes > 0 ? `+${v.delayMinutes} min` : 'On time',
            color: v.delayMinutes > 0 ? '#f97316' : '#22c55e' },
        ].map((s) => (
          <div key={s.label} className="glass-card px-3 py-3 rounded-xl border border-slate-200/80 dark:border-white/[0.07]">
            <div className="text-slate-500 dark:text-slate-400 text-[10px] mb-1">{s.label}</div>
            <div className="text-sm font-bold text-slate-900 dark:text-white" style={{ color: s.color }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* GPS status */}
      <div className="glass-card p-4 rounded-xl mb-4 border border-slate-200/80 dark:border-white/[0.07]">
        <div className="flex items-center gap-2 mb-2">
          <Radio size={14} className={v.telemetryFresh ? 'text-emerald-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'} />
          <span className="text-xs font-semibold text-slate-900 dark:text-slate-300">GPS Telemetry</span>
        </div>
        <div className="text-xs space-y-1 text-slate-600 dark:text-slate-400">
          <div className="flex justify-between">
            <span>Status</span>
            <span className={v.telemetryFresh ? 'text-emerald-600 dark:text-green-400 font-semibold' : 'text-orange-600 dark:text-orange-400 font-semibold'}>
              {v.telemetryFresh ? '● FRESH' : '● UNAVAILABLE'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Last Ping</span>
            <span className="font-mono">{v.lastPingAt}</span>
          </div>
          <div className="flex justify-between">
            <span>Coordinates</span>
            <span className="font-mono text-[10px]">{v.currentLocation[0].toFixed(4)}°N, {v.currentLocation[1].toFixed(4)}°E</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VehicleTracking() {
  const [selected, setSelected] = useState<Vehicle | null>(vehicles[0]);

  return (
    <div className="flex h-full min-h-0 transition-colors duration-200">
      {/* Vehicles list */}
      <div className="w-72 shrink-0 bg-white dark:bg-[#090f1c] border-r border-slate-200 dark:border-white/[0.06] flex flex-col">
        <div className="px-4 py-3 border-b border-slate-200 dark:border-white/[0.06] flex items-center justify-between">
          <span className="text-slate-900 dark:text-white text-sm font-semibold">Vehicle Fleet</span>
          <span className="text-slate-500 text-xs">18 active</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          {vehicles.map((v) => {
            const riskColor = v.routeRisk > 80 ? '#ef4444' : v.routeRisk > 60 ? '#f97316' : '#22c55e';
            return (
              <button
                key={v.id}
                onClick={() => setSelected(v)}
                className={clsx(
                  'w-full text-left px-4 py-3.5 border-b border-slate-200/80 dark:border-white/[0.05] flex items-center gap-3 transition-all hover:bg-slate-50 dark:hover:bg-white/[0.04] cursor-pointer',
                  selected?.id === v.id && 'bg-orange-50/80 dark:bg-white/[0.06] border-l-3 border-l-orange-500 font-medium'
                )}
              >
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/[0.06] flex items-center justify-center text-slate-700 dark:text-slate-300">
                    <Truck size={18} />
                  </div>
                  {!v.telemetryFresh && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border border-white dark:border-[#090f1c]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-900 dark:text-white text-xs font-bold">{v.id}</span>
                    <span className="text-[11px] font-bold" style={{ color: riskColor }}>{v.routeRisk}%</span>
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 text-[10px] truncate font-medium">{v.driverName}</div>
                  <div className="text-slate-500 dark:text-slate-400 text-[10px]">→ {v.destination}</div>
                  {!v.telemetryFresh && (
                    <div className="text-orange-600 dark:text-orange-400 text-[9px] font-bold mt-0.5">TELEMETRY UNAVAILABLE</div>
                  )}
                </div>
                <ChevronRight size={14} className={clsx('text-slate-400 dark:text-slate-600', selected?.id === v.id && 'text-orange-500 dark:text-orange-400')} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Detail */}
      <div className="flex-1 min-w-0 bg-[var(--bg-main)]">
        {selected ? (
          <VehicleDetail v={selected} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-600">
            <Truck size={48} className="text-slate-300 dark:text-slate-600 mb-3 stroke-[1.5]" />
            <p className="text-sm font-medium">Select a vehicle to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}
