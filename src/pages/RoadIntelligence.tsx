import { useState } from 'react';
import clsx from 'clsx';
import { ChevronRight, Info, AlertTriangle, CloudRain, Mountain, Gauge, Landmark, Check, Route } from 'lucide-react';
import { roads } from '../data/mockData';
import { statusColor, statusLabel, riskLabel } from '../lib/utils';
import type { Road } from '../types';

function RoadListItem({ road, selected, onClick }: { road: Road; selected: boolean; onClick: () => void }) {
  const color = statusColor(road.status);
  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full text-left px-4 py-3 border-b border-slate-200/80 dark:border-white/[0.05] flex items-center gap-3 transition-all hover:bg-slate-50 dark:hover:bg-white/[0.04] cursor-pointer',
        selected && 'bg-orange-50/80 dark:bg-white/[0.06] border-l-3 border-l-orange-500 font-medium'
      )}
    >
      <div className="w-2 h-10 rounded-full shrink-0" style={{ background: color }} />
      <div className="flex-1 min-w-0">
        <div className="text-slate-900 dark:text-white text-xs font-semibold truncate">{road.name}</div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] font-bold" style={{ color }}>{statusLabel(road.status)}</span>
          <span className="text-slate-400 text-[10px]">·</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">Risk: {road.riskScore}%</span>
        </div>
      </div>
      <ChevronRight size={14} className={clsx('text-slate-400 dark:text-slate-600 shrink-0', selected && 'text-orange-500 dark:text-orange-400')} />
    </button>
  );
}

function RiskBar({ score }: { score: number }) {
  const color = score >= 81 ? '#ef4444' : score >= 61 ? '#f97316' : score >= 31 ? '#eab308' : '#22c55e';
  return (
    <div className="w-full bg-slate-200 dark:bg-white/[0.08] rounded-full h-2">
      <div className="h-2 rounded-full transition-all duration-700" style={{ width: `${score}%`, background: color }} />
    </div>
  );
}

function RoadDetail({ road }: { road: Road }) {
  const color = statusColor(road.status);
  const riskLvl = riskLabel(road.riskScore);

  return (
    <div className="h-full overflow-y-auto p-6 animate-fade-up">
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-slate-900 dark:text-white font-bold text-base leading-snug">{road.name}</h3>
          {road.isSPOF && (
            <span className="shrink-0 text-[10px] font-bold bg-red-100 text-red-800 border border-red-300 dark:bg-red-500/15 dark:text-red-400 dark:border-red-500/25 px-2 py-1 rounded flex items-center gap-1">
              <AlertTriangle size={11} /> SINGLE POINT OF FAILURE
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold" style={{ color }}>{statusLabel(road.status)}</span>
          <span className="text-slate-500 dark:text-slate-400 text-xs">Updated {road.lastVerified}</span>
          <span className="text-slate-400 text-xs">·</span>
          <span className="text-slate-500 dark:text-slate-400 text-xs">Source: {road.source}</span>
        </div>
      </div>

      {/* Risk Score */}
      <div className="glass-card p-4 rounded-xl mb-4 border border-slate-200/80 dark:border-white/[0.07]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-600 dark:text-slate-400 text-xs font-medium">Disruption Probability</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">Confidence: <span className="text-emerald-600 dark:text-green-400 font-semibold">{road.confidence}%</span></span>
          </div>
        </div>
        <div className="flex items-end gap-3 mb-2">
          <span className="text-3xl font-black" style={{ color }}>{road.disruptionProbability}%</span>
          <span className="text-sm font-bold mb-1" style={{ color }}>{riskLvl}</span>
        </div>
        <RiskBar score={road.disruptionProbability} />
        <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
          Data freshness: <span className="text-emerald-600 dark:text-green-400">{road.lastVerified}</span>
        </div>
      </div>

      {/* Current conditions */}
      <div className="glass-card p-4 rounded-xl mb-4 border border-slate-200/80 dark:border-white/[0.07]">
        <div className="text-xs font-bold text-slate-800 dark:text-slate-300 mb-3 tracking-wide">CURRENT CONDITIONS</div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Rainfall Forecast', val: `${road.rainfallForecast}mm`, icon: <CloudRain size={13} className="text-blue-500" />, warn: road.rainfallForecast > 70 },
            { label: 'Terrain Slope', val: `${road.terrainSlope}°`, icon: <Mountain size={13} className="text-amber-500" />, warn: road.terrainSlope > 25 },
            { label: 'Historical Landslides', val: road.historicalLandslides.toString(), icon: <AlertTriangle size={13} className="text-red-500" />, warn: road.historicalLandslides > 0 },
            { label: 'Traffic Level', val: road.trafficLevel, icon: <Gauge size={13} className="text-purple-500" />, warn: road.trafficLevel === 'HEAVY' || road.trafficLevel === 'CONGESTED' },
            { label: 'Bridge Dependency', val: road.bridgeDependency, icon: <Landmark size={13} className="text-cyan-500" />, warn: road.bridgeDependency === 'HIGH' || road.bridgeDependency === 'CRITICAL' },
          ].map((c) => (
            <div key={c.label} className="bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-transparent rounded-lg px-3 py-2.5">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[10px] mb-1">
                {c.icon}
                <span>{c.label}</span>
              </div>
              <div className={clsx('text-sm font-bold', c.warn ? 'text-orange-600 dark:text-orange-400' : 'text-slate-900 dark:text-white')}>
                {c.val}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WHY section */}
      <div className="glass-card p-4 rounded-xl mb-4 border border-slate-200/80 dark:border-white/[0.07]">
        <div className="flex items-center gap-2 mb-3">
          <Info size={14} className="text-orange-500 dark:text-orange-400" />
          <span className="text-xs font-bold text-slate-800 dark:text-slate-300 tracking-wide">WHY IS THIS ROAD {riskLvl}?</span>
        </div>
        <div className="space-y-2">
          {road.reasons.map((r, i) => (
            <div key={i} className="flex items-start gap-2 text-xs">
              <Check size={12} className="text-orange-500 dark:text-orange-400 font-bold shrink-0 mt-0.5" />
              <span className="text-slate-700 dark:text-slate-300 font-medium">{r}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-white/[0.06] text-[10px] text-slate-500 dark:text-slate-400">
          AI Confidence: <span className="text-emerald-600 dark:text-green-400 font-semibold">{road.confidence}%</span>
          &nbsp;·&nbsp; Updated: {road.lastVerified}
          &nbsp;·&nbsp; Source: {road.source}
        </div>
      </div>

      {/* SPOF warning */}
      {road.isSPOF && road.affectedDistricts && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-4">
          <div className="text-red-700 dark:text-red-400 font-bold text-xs mb-2 flex items-center gap-1.5">
            <AlertTriangle size={13} /> SINGLE POINT OF FAILURE DETECTED
          </div>
          <p className="text-slate-700 dark:text-slate-300 text-xs mb-2">
            Failure of this road/corridor would disconnect the following downstream regions:
          </p>
          <div className="flex flex-wrap gap-2">
            {road.affectedDistricts.map((d) => (
              <span key={d} className="bg-red-100 text-red-800 border border-red-200 dark:bg-red-500/15 dark:text-red-300 dark:border-transparent text-[10px] font-semibold px-2 py-1 rounded">
                {d}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function RoadIntelligence() {
  const [selected, setSelected] = useState<Road | null>(roads[0]);
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all' ? roads
    : filter === 'BLOCKED' ? roads.filter(r => r.status === 'BLOCKED')
    : filter === 'HIGH_RISK' ? roads.filter(r => r.status === 'HIGH_RISK')
    : filter === 'CRITICAL' ? roads.filter(r => r.riskScore >= 81)
    : roads;

  return (
    <div className="flex h-full min-h-0 transition-colors duration-200">
      {/* Roads list */}
      <div className="w-72 shrink-0 bg-white dark:bg-[#090f1c] border-r border-slate-200 dark:border-white/[0.06] flex flex-col">
        <div className="px-4 py-3 border-b border-slate-200 dark:border-white/[0.06] flex items-center justify-between">
          <span className="text-slate-900 dark:text-white text-sm font-semibold">Road Network</span>
          <span className="text-slate-500 text-xs">{roads.length} roads</span>
        </div>
        <div className="flex gap-1.5 px-3 py-2 border-b border-slate-200 dark:border-white/[0.05]">
          {['all', 'CRITICAL', 'HIGH_RISK', 'BLOCKED'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={clsx(
                'px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer',
                filter === f
                  ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300 border border-orange-300 dark:border-transparent'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              )}
            >
              {f === 'all' ? 'All' : f.replace('_', ' ')}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.map((road) => (
            <RoadListItem
              key={road.id}
              road={road}
              selected={selected?.id === road.id}
              onClick={() => setSelected(road)}
            />
          ))}
        </div>
      </div>

      {/* Detail panel */}
      <div className="flex-1 min-w-0 bg-[var(--bg-main)]">
        {selected ? (
          <RoadDetail road={selected} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-600">
            <Route size={48} className="text-slate-300 dark:text-slate-600 mb-3 stroke-[1.5]" />
            <p className="text-sm font-medium">Select a road to view intelligence</p>
          </div>
        )}
      </div>
    </div>
  );
}
