import { useState } from 'react';
import clsx from 'clsx';
import { ChevronRight } from 'lucide-react';
import { districts, roads, supplyInventory } from '../data/mockData';
import type { District } from '../types';

function ConnectivityBar({ pct }: { pct: number }) {
  const color = pct >= 80 ? '#22c55e' : pct >= 60 ? '#eab308' : pct >= 40 ? '#f97316' : '#ef4444';
  return (
    <div>
      <div className="flex justify-between text-[10px] mb-1">
        <span className="text-slate-500 dark:text-slate-400 font-medium">Connectivity</span>
        <span className="font-bold" style={{ color }}>{pct}%</span>
      </div>
      <div className="w-full bg-slate-200 dark:bg-white/[0.06] rounded-full h-1.5">
        <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

function IsolationRing({ pct }: { pct: number }) {
  const r = 42;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  const color = pct >= 80 ? '#ef4444' : pct >= 60 ? '#f97316' : pct >= 40 ? '#eab308' : '#22c55e';
  return (
    <div className="relative w-28 h-28 shrink-0">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="currentColor" className="text-slate-200 dark:text-white/[0.08]" strokeWidth="8" />
        <circle cx="50" cy="50" r={r} fill="none"
          stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ transition: 'stroke-dasharray 0.8s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-black" style={{ color }}>{pct}%</span>
        <span className="text-[9px] text-slate-500 dark:text-slate-400 font-bold">ISOLATION</span>
      </div>
    </div>
  );
}

function DistrictDetail({ district }: { district: District }) {
  const criticalRoad = district.criticalRoadId
    ? roads.find(r => r.id === district.criticalRoadId)
    : null;

  const distInventory = supplyInventory.filter(s => s.districtId === district.id);

  const weatherColors = {
    LOW: 'text-emerald-700 dark:text-green-400',
    MEDIUM: 'text-yellow-700 dark:text-yellow-400',
    HIGH: 'text-orange-700 dark:text-orange-400',
    CRITICAL: 'text-red-700 dark:text-red-400'
  };

  return (
    <div className="h-full overflow-y-auto p-6 animate-fade-up">
      <div className="mb-5">
        <h3 className="text-slate-900 dark:text-white font-bold text-base mb-1">{district.name}</h3>
        <span className={clsx(
          'text-xs font-bold px-2 py-0.5 rounded border',
          district.status === 'ISOLATED' ? 'bg-red-100 text-red-800 border-red-300 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30' :
          district.status === 'HIGH_RISK' ? 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-500/15 dark:text-orange-400 dark:border-orange-500/20' :
          district.status === 'DEGRADED' ? 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-500/15 dark:text-yellow-400 dark:border-yellow-500/20' :
          district.status === 'ACCESSIBLE' ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-green-500/15 dark:text-green-400 dark:border-green-500/20' :
          'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-500/15 dark:text-slate-400 dark:border-slate-500/20'
        )}>
          {district.status.replace('_', ' ')}
        </span>
      </div>

      {/* Main metrics with ring */}
      <div className="glass-card p-4 rounded-xl flex items-center gap-6 mb-4 border border-slate-200/80 dark:border-white/[0.07]">
        <IsolationRing pct={district.isolationRisk} />
        <div className="flex-1 space-y-2.5">
          <ConnectivityBar pct={district.connectivity} />
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-50 dark:bg-white/[0.04] border border-slate-200/60 dark:border-transparent rounded-lg px-2.5 py-2">
              <div className="text-slate-500 dark:text-slate-400 text-[10px]">Alt. Routes</div>
              <div className={clsx('font-bold', district.alternativeRoutes === 0 ? 'text-red-600 dark:text-red-400' : district.alternativeRoutes <= 1 ? 'text-orange-600 dark:text-orange-400' : 'text-emerald-700 dark:text-green-400')}>
                {district.alternativeRoutes}
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-white/[0.04] border border-slate-200/60 dark:border-transparent rounded-lg px-2.5 py-2">
              <div className="text-slate-500 dark:text-slate-400 text-[10px]">Critical Corridors</div>
              <div className="text-slate-900 dark:text-white font-bold">{district.criticalCorridors}</div>
            </div>
            <div className="bg-slate-50 dark:bg-white/[0.04] border border-slate-200/60 dark:border-transparent rounded-lg px-2.5 py-2">
              <div className="text-slate-500 dark:text-slate-400 text-[10px]">Weather Risk</div>
              <div className={clsx('font-bold', weatherColors[district.weatherRisk])}>{district.weatherRisk}</div>
            </div>
            <div className="bg-slate-50 dark:bg-white/[0.04] border border-slate-200/60 dark:border-transparent rounded-lg px-2.5 py-2">
              <div className="text-slate-500 dark:text-slate-400 text-[10px]">Supply Coverage</div>
              <div className={clsx('font-bold', district.supplyDays <= 2 ? 'text-red-600 dark:text-red-400' : district.supplyDays <= 4 ? 'text-orange-600 dark:text-orange-400' : 'text-emerald-700 dark:text-green-400')}>
                {district.supplyDays} days
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* IF Road Fails simulation */}
      {criticalRoad && (
        <div className="glass-card p-4 rounded-xl mb-4 border border-orange-300 dark:border-orange-500/15 bg-orange-50/40 dark:bg-orange-500/[0.03]">
          <div className="text-xs font-bold text-slate-900 dark:text-slate-300 mb-3">
            🔮 IF <span className="text-orange-600 dark:text-orange-400">{criticalRoad.name.split('—')[0].trim()}</span> FAILS:
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">District connectivity</span>
              <span className="text-red-600 dark:text-red-400 font-bold">→ ~41%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Isolation probability</span>
              <span className="text-red-600 dark:text-red-400 font-bold">→ {district.isolationRisk}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Medicine supply</span>
              <span className="text-red-600 dark:text-red-400 font-bold">HIGH RISK</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Food supply</span>
              <span className="text-orange-600 dark:text-orange-400 font-bold">MEDIUM RISK</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-white/[0.06] text-[10px] text-slate-500 dark:text-slate-400">
            Analysis powered by pgRouting connected-components simulation
          </div>
        </div>
      )}

      {/* Supply inventory */}
      {distInventory.length > 0 && (
        <div className="glass-card p-4 rounded-xl border border-slate-200/80 dark:border-white/[0.07]">
          <div className="text-xs font-bold text-slate-900 dark:text-slate-300 mb-3">📦 Commodity Stock</div>
          <div className="space-y-3">
            {distInventory.map((inv) => (
              <div key={inv.commodity}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-700 dark:text-slate-400 capitalize font-medium">{inv.commodity === 'agri' ? 'Agricultural' : inv.commodity}</span>
                  <span className={clsx(
                    'font-bold',
                    inv.risk === 'CRITICAL' ? 'text-red-600 dark:text-red-400' :
                    inv.risk === 'HIGH' ? 'text-orange-600 dark:text-orange-400' :
                    inv.risk === 'MEDIUM' ? 'text-yellow-700 dark:text-yellow-400' : 'text-emerald-700 dark:text-green-400'
                  )}>{inv.stockDays} days — {inv.risk}</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-white/[0.06] rounded-full h-1.5">
                  <div className="h-1.5 rounded-full" style={{
                    width: `${Math.min((inv.stockDays / 7) * 100, 100)}%`,
                    background: inv.risk === 'CRITICAL' ? '#ef4444' : inv.risk === 'HIGH' ? '#f97316' : inv.risk === 'MEDIUM' ? '#eab308' : '#22c55e'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DistrictIntelligence() {
  const [selected, setSelected] = useState<District | null>(districts[0]);

  return (
    <div className="flex h-full min-h-0 transition-colors duration-200">
      {/* Districts list */}
      <div className="w-72 shrink-0 bg-white dark:bg-[#090f1c] border-r border-slate-200 dark:border-white/[0.06] flex flex-col">
        <div className="px-4 py-3 border-b border-slate-200 dark:border-white/[0.06] flex items-center justify-between">
          <span className="text-slate-900 dark:text-white text-sm font-semibold">Districts</span>
          <span className="text-slate-500 text-xs">{districts.length} monitored</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          {districts.map((d) => {
            const riskColor = d.isolationRisk >= 80 ? '#ef4444' : d.isolationRisk >= 60 ? '#f97316' : d.isolationRisk >= 40 ? '#eab308' : '#22c55e';
            return (
              <button
                key={d.id}
                onClick={() => setSelected(d)}
                className={clsx(
                  'w-full text-left px-4 py-3.5 border-b border-slate-200/80 dark:border-white/[0.05] flex items-center gap-3 transition-all hover:bg-slate-50 dark:hover:bg-white/[0.04] cursor-pointer',
                  selected?.id === d.id && 'bg-orange-50/80 dark:bg-white/[0.06] border-l-3 border-l-orange-500 font-medium'
                )}
              >
                <div className="relative w-12 h-12 shrink-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" className="text-slate-200 dark:text-white/[0.08]" strokeWidth="10" />
                    <circle cx="50" cy="50" r="40" fill="none"
                      stroke={riskColor} strokeWidth="10" strokeLinecap="round"
                      strokeDasharray={`${(d.isolationRisk / 100) * 251} 251`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold" style={{ color: riskColor }}>
                    {d.isolationRisk}%
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-slate-900 dark:text-white text-xs font-semibold truncate">{d.name.split('—')[0].trim()}</div>
                  <div className="text-slate-500 dark:text-slate-400 text-[10px] mt-0.5">{d.name.split('—')[1]?.trim()}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-semibold" style={{ color: riskColor }}>{d.status.replace('_', ' ')}</span>
                    <span className="text-slate-300 dark:text-slate-600 text-[10px]">·</span>
                    <span className="text-slate-500 dark:text-slate-400 text-[10px]">{d.supplyDays}d supply</span>
                  </div>
                </div>
                <ChevronRight size={14} className={clsx('text-slate-400 dark:text-slate-600 shrink-0', selected?.id === d.id && 'text-orange-500 dark:text-orange-400')} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Detail */}
      <div className="flex-1 min-w-0 bg-[var(--bg-main)]">
        {selected ? (
          <DistrictDetail district={selected} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-600">
            <div className="text-5xl mb-3">🏘️</div>
            <p className="text-sm font-medium">Select a district to view isolation intelligence</p>
          </div>
        )}
      </div>
    </div>
  );
}
