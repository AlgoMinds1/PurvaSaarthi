import { useState } from 'react';
import clsx from 'clsx';
import { ChevronRight, Info, AlertTriangle, CloudRain, Mountain, Gauge, Landmark, Check, Route, Search, Zap } from 'lucide-react';
import { roads } from '../data/mockData';
import { statusColor, statusLabel, riskLabel } from '../lib/utils';
import type { Road } from '../types';

function RoadListItem({ road, selected, onClick }: { road: Road; selected: boolean; onClick: () => void }) {
  const color = statusColor(road.status);
  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full text-left p-3 rounded-xl border transition-all duration-150 flex items-center gap-3 cursor-pointer group',
        selected 
          ? 'bg-orange-50/90 dark:bg-orange-500/10 border-orange-300 dark:border-orange-500/30 shadow-xs ring-1 ring-orange-500/20' 
          : 'bg-white dark:bg-[#0c1424] border-slate-200/80 dark:border-white/[0.06] hover:border-slate-300 dark:hover:border-white/15 hover:shadow-2xs'
      )}
    >
      <div 
        className="w-2.5 h-10 rounded-full shrink-0 shadow-xs" 
        style={{ background: color }} 
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <div className="text-slate-900 dark:text-white text-xs font-bold truncate group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
            {road.name}
          </div>
          {road.isSPOF && (
            <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/30 shrink-0 uppercase">
              SPOF
            </span>
          )}
        </div>
        <div className="flex items-center justify-between mt-1.5 text-[11px]">
          <span className="font-extrabold" style={{ color }}>{statusLabel(road.status)}</span>
          <span className="font-semibold text-slate-500 dark:text-slate-400">
            Risk: <strong className="text-slate-800 dark:text-slate-200">{road.riskScore}%</strong>
          </span>
        </div>
      </div>
      <ChevronRight 
        size={15} 
        className={clsx(
          'shrink-0 transition-transform duration-150 group-hover:translate-x-0.5',
          selected ? 'text-orange-600 dark:text-orange-400' : 'text-slate-400 dark:text-slate-600'
        )} 
      />
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
      <div className="bg-white dark:bg-[#0c1424] p-5 rounded-2xl mb-5 border border-slate-200/90 dark:border-white/10 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-xs font-black text-slate-800 dark:text-slate-200 tracking-wider uppercase">
              Disruption Probability
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live AI predictive blockage score
            </p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-2.5 py-1 rounded-xl">
            <span className="text-xs text-emerald-700 dark:text-emerald-300 font-bold">
              Confidence: {road.confidence}%
            </span>
          </div>
        </div>
        <div className="flex items-baseline gap-3 mb-3">
          <span className="text-4xl font-black tracking-tight" style={{ color }}>{road.disruptionProbability}%</span>
          <span className="text-sm font-black px-2.5 py-0.5 rounded-lg border uppercase" style={{ color, borderColor: `${color}40`, backgroundColor: `${color}15` }}>
            {riskLvl}
          </span>
        </div>
        <RiskBar score={road.disruptionProbability} />
        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 font-medium flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Data freshness verified: <strong className="text-slate-700 dark:text-slate-300">{road.lastVerified}</strong></span>
        </div>
      </div>

      {/* Current conditions */}
      <div className="bg-white dark:bg-[#0c1424] p-5 rounded-2xl mb-5 border border-slate-200/90 dark:border-white/10 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 tracking-wider uppercase">
              Current Corridor Environmental &amp; Route Telemetry
            </h4>
          </div>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            5 Critical Parameters Analyzed
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
          {[
            { 
              label: 'Rainfall Forecast', 
              val: `${road.rainfallForecast}mm`, 
              subtitle: road.rainfallForecast > 70 ? 'High Precipitation' : 'Optimal Weather',
              icon: <CloudRain size={18} />, 
              theme: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20',
              warn: road.rainfallForecast > 70 
            },
            { 
              label: 'Terrain Slope', 
              val: `${road.terrainSlope}°`, 
              subtitle: road.terrainSlope > 25 ? 'Steep Mountain Incline' : 'Moderate Incline',
              icon: <Mountain size={18} />, 
              theme: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20',
              warn: road.terrainSlope > 25 
            },
            { 
              label: 'Historical Landslides', 
              val: `${road.historicalLandslides} Events`, 
              subtitle: road.historicalLandslides > 0 ? 'High Slip Vulnerability' : 'Stable Sector',
              icon: <AlertTriangle size={18} />, 
              theme: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20',
              warn: road.historicalLandslides > 0 
            },
            { 
              label: 'Traffic Density', 
              val: road.trafficLevel, 
              subtitle: (road.trafficLevel === 'HEAVY' || road.trafficLevel === 'CONGESTED') ? 'Slow Corridor Speed' : 'Normal Traffic Flow',
              icon: <Gauge size={18} />, 
              theme: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20',
              warn: road.trafficLevel === 'HEAVY' || road.trafficLevel === 'CONGESTED' 
            },
            { 
              label: 'Bridge Dependency', 
              val: road.bridgeDependency, 
              subtitle: (road.bridgeDependency === 'HIGH' || road.bridgeDependency === 'CRITICAL') ? 'Single Route SPOF' : 'Redundant Crossings',
              icon: <Landmark size={18} />, 
              theme: 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/20',
              warn: road.bridgeDependency === 'HIGH' || road.bridgeDependency === 'CRITICAL' 
            },
          ].map((c) => (
            <div 
              key={c.label} 
              className={clsx(
                'group relative p-4 rounded-2xl border transition-all duration-200 hover:shadow-md flex flex-col justify-between bg-slate-50/60 dark:bg-white/[0.02]',
                c.warn 
                  ? 'border-orange-200/90 dark:border-orange-500/20 bg-orange-50/20 dark:bg-orange-500/[0.03]' 
                  : 'border-slate-200/80 dark:border-white/[0.06]'
              )}
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {c.label}
                </span>
                <div className={clsx('w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border', c.theme)}>
                  {c.icon}
                </div>
              </div>

              <div>
                <div className={clsx(
                  'text-2xl font-black tracking-tight',
                  c.warn ? 'text-orange-600 dark:text-orange-400' : 'text-slate-900 dark:text-white'
                )}>
                  {c.val}
                </div>
                <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1 truncate">
                  {c.subtitle}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WHY section */}
      <div className="bg-white dark:bg-[#0c1424] p-5 rounded-2xl mb-5 border border-slate-200/90 dark:border-white/10 shadow-xs">
        <div className="flex items-center gap-2 mb-3.5">
          <div className="w-7 h-7 rounded-lg bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 text-orange-500 flex items-center justify-center">
            <Info size={15} />
          </div>
          <span className="text-xs font-black text-slate-800 dark:text-slate-200 tracking-wider uppercase">
            WHY IS THIS ROAD CLASSIFIED AS {riskLvl}?
          </span>
        </div>
        <div className="space-y-2.5">
          {road.reasons.map((r, i) => (
            <div key={i} className="flex items-start gap-2.5 text-xs bg-slate-50 dark:bg-white/[0.02] p-2.5 rounded-xl border border-slate-200/60 dark:border-white/[0.04]">
              <Check size={14} className="text-orange-500 font-bold shrink-0 mt-0.5" />
              <span className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{r}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/[0.06] text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-2">
          <span>AI Model Confidence: <strong className="text-emerald-600 dark:text-emerald-400">{road.confidence}%</strong></span>
          <span>·</span>
          <span>Verified: <strong className="text-slate-700 dark:text-slate-300">{road.lastVerified}</strong></span>
          <span>·</span>
          <span>Primary Data Source: <strong className="text-slate-700 dark:text-slate-300">{road.source}</strong></span>
        </div>
      </div>

      {/* SPOF warning */}
      {road.isSPOF && road.affectedDistricts && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl p-5 shadow-xs">
          <div className="text-red-700 dark:text-red-400 font-black text-xs mb-2 flex items-center gap-2">
            <AlertTriangle size={15} /> SINGLE POINT OF FAILURE DETECTED
          </div>
          <p className="text-slate-700 dark:text-slate-300 text-xs mb-3 font-medium">
            Structural failure of this road/corridor would disconnect the following downstream regions:
          </p>
          <div className="flex flex-wrap gap-2">
            {road.affectedDistricts.map((d) => (
              <span key={d} className="bg-red-100 text-red-800 border border-red-200 dark:bg-red-500/20 dark:text-red-300 dark:border-red-500/30 text-xs font-bold px-2.5 py-1 rounded-xl">
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
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filtered = roads.filter((r) => {
    // Filter type
    const matchesFilter = filter === 'all' 
      ? true 
      : filter === 'BLOCKED' 
      ? r.status === 'BLOCKED' 
      : filter === 'HIGH_RISK' 
      ? r.status === 'HIGH_RISK' 
      : filter === 'CRITICAL' 
      ? r.riskScore >= 81 
      : true;

    // Search query
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || r.name.toLowerCase().includes(q) || (r.affectedDistricts && r.affectedDistricts.some(d => d.toLowerCase().includes(q)));

    return matchesFilter && matchesSearch;
  });

  const filterTabs = [
    { id: 'all', label: 'All', count: roads.length },
    { id: 'CRITICAL', label: 'Critical', count: roads.filter(r => r.riskScore >= 81).length },
    { id: 'HIGH_RISK', label: 'High Risk', count: roads.filter(r => r.status === 'HIGH_RISK').length },
    { id: 'BLOCKED', label: 'Blocked', count: roads.filter(r => r.status === 'BLOCKED').length },
  ];

  return (
    <div className="flex h-full min-h-0 transition-colors duration-200">
      {/* Roads list sidebar */}
      <div className="w-80 shrink-0 bg-white dark:bg-[#090f1c] border-r border-slate-200 dark:border-white/[0.06] flex flex-col">
        
        {/* Top Header */}
        <div className="px-4 py-3.5 border-b border-slate-200 dark:border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Route size={16} className="text-orange-500" />
            <span className="text-slate-900 dark:text-white text-sm font-bold">Corridor Network</span>
          </div>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10">
            {roads.length} Corridors
          </span>
        </div>

        {/* Search Bar */}
        <div className="px-3 pt-3 pb-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search highway or corridor..."
              className="w-full h-8.5 pl-8.5 pr-3 text-xs rounded-xl bg-slate-100/80 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 px-3 pb-2.5 overflow-x-auto border-b border-slate-200 dark:border-white/[0.05]">
          {filterTabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className={clsx(
                'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 border',
                filter === t.id
                  ? 'bg-orange-50 text-orange-800 border-orange-300 dark:bg-orange-500/20 dark:text-orange-300 dark:border-orange-500/30'
                  : 'bg-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 border-transparent hover:bg-slate-100/60 dark:hover:bg-white/[0.04]'
              )}
            >
              <span>{t.label}</span>
              <span className={clsx(
                'text-[10px] px-1.5 py-0.2 rounded-full font-bold',
                filter === t.id ? 'bg-orange-200 dark:bg-orange-500/40 text-orange-950 dark:text-orange-200' : 'bg-slate-200/80 dark:bg-white/10 text-slate-600 dark:text-slate-400'
              )}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* Road List Cards */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filtered.length > 0 ? (
            filtered.map((road) => (
              <RoadListItem
                key={road.id}
                road={road}
                selected={selected?.id === road.id}
                onClick={() => setSelected(road)}
              />
            ))
          ) : (
            <div className="text-center py-8 text-xs text-slate-400 font-medium">
              No matching corridors found
            </div>
          )}
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
