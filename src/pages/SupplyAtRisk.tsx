import { useState } from 'react';
import clsx from 'clsx';
import { 
  ArrowRight, Clock, Pill, Wheat, Sprout, HardHat, Boxes, 
  AlertTriangle, ShieldAlert, Sparkles, MapPin, Search, Navigation, 
  Brain, ShieldCheck, TrendingDown, Users, Flame, Zap
} from 'lucide-react';
import { shipments, supplyInventory, districts } from '../data/mockData';
import { useAppStore } from '../store/useAppStore';
import type { CommodityType } from '../types';

const PRIORITY_BADGES: Record<number, { label: string; color: string }> = {
  100: { label: 'CRITICAL PRIORITY', color: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-300 dark:border-red-500/30' },
  90: { label: 'HIGH PRIORITY', color: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/20 dark:text-orange-300 dark:border-orange-500/30' },
  60: { label: 'MEDIUM PRIORITY', color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30' },
  40: { label: 'ROUTINE', color: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-white/[0.05] dark:text-slate-300 dark:border-white/10' },
};

function CommodityAvatar({ commodity, size = 20 }: { commodity: CommodityType; size?: number }) {
  switch (commodity) {
    case 'medicine':
      return (
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-500/20 to-red-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 flex items-center justify-center shadow-xs shrink-0">
          <Pill size={size} />
        </div>
      );
    case 'food':
      return (
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-xs shrink-0">
          <Wheat size={size} />
        </div>
      );
    case 'agri':
      return (
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-xs shrink-0">
          <Sprout size={size} />
        </div>
      );
    case 'construction':
      return (
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 flex items-center justify-center shadow-xs shrink-0">
          <HardHat size={size} />
        </div>
      );
    default:
      return (
        <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-white/[0.06] text-slate-500 flex items-center justify-center shadow-xs shrink-0">
          <Boxes size={size} />
        </div>
      );
  }
}

function StockGauge({ days, maxDays = 7 }: { days: number; maxDays?: number }) {
  const pct = Math.min((days / maxDays) * 100, 100);
  const isCritical = days <= 2;
  const isHigh = days > 2 && days <= 3.5;
  const isModerate = days > 3.5 && days <= 5;

  const colorClass = isCritical 
    ? 'from-red-500 to-rose-600' 
    : isHigh 
    ? 'from-amber-500 to-orange-500' 
    : isModerate 
    ? 'from-yellow-400 to-amber-500' 
    : 'from-emerald-400 to-teal-500';

  const badgeColor = isCritical
    ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20'
    : isHigh
    ? 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/20'
    : isModerate
    ? 'text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/20'
    : 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20';

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500 dark:text-slate-400 font-medium">Warehouse Reserve</span>
        <span className={clsx('px-2 py-0.5 rounded-full text-[11px] font-bold border', badgeColor)}>
          {days.toFixed(1)} Days Left
        </span>
      </div>

      <div className="relative w-full bg-slate-200/80 dark:bg-white/[0.07] rounded-full h-2 overflow-hidden shadow-inner">
        <div 
          className={clsx('h-full rounded-full bg-gradient-to-r transition-all duration-500', colorClass)}
          style={{ width: `${Math.max(pct, 6)}%` }} 
        />
      </div>
    </div>
  );
}

function MiniStockGauge({ days, maxDays = 7 }: { days: number; maxDays?: number }) {
  const pct = Math.min((days / maxDays) * 100, 100);
  const isCritical = days <= 2;
  const isHigh = days > 2 && days <= 3.5;
  const isModerate = days > 3.5 && days <= 5;

  const colorClass = isCritical 
    ? 'from-red-500 to-rose-600' 
    : isHigh 
    ? 'from-amber-500 to-orange-500' 
    : isModerate 
    ? 'from-yellow-400 to-amber-500' 
    : 'from-emerald-400 to-teal-500';

  const textColor = isCritical 
    ? 'text-red-600 dark:text-red-400' 
    : isHigh 
    ? 'text-orange-600 dark:text-orange-400' 
    : isModerate 
    ? 'text-yellow-700 dark:text-yellow-400' 
    : 'text-emerald-700 dark:text-emerald-400';

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500 dark:text-slate-400 font-medium">Stock Remaining</span>
        <span className={clsx('font-bold', textColor)}>{days.toFixed(1)} Days</span>
      </div>
      <div className="relative w-full bg-slate-200/80 dark:bg-white/[0.07] rounded-full h-1.5 overflow-hidden">
        <div 
          className={clsx('h-full rounded-full bg-gradient-to-r transition-all duration-300', colorClass)}
          style={{ width: `${Math.max(pct, 6)}%` }} 
        />
      </div>
    </div>
  );
}

function ShipmentCard({ s }: { s: typeof shipments[0] }) {
  const { openRerouteModal, openExplainabilityDrawer, trackVehicleOnMap } = useAppStore();
  const dist = districts.find(d => d.id === s.destinationDistrictId);
  const isAtRisk = s.status === 'AT_RISK' || s.status === 'DELAYED' || s.supplyShortageRisk === 'CRITICAL' || s.supplyShortageRisk === 'HIGH';
  const priorityInfo = PRIORITY_BADGES[s.priority] || PRIORITY_BADGES[40];

  return (
    <div className={clsx(
      'group relative bg-white dark:bg-[#0c1424] rounded-2xl border transition-all duration-200 hover:shadow-xl p-5 space-y-4 text-slate-900 dark:text-slate-100',
      s.supplyShortageRisk === 'CRITICAL' 
        ? 'border-red-300 dark:border-red-500/30 shadow-md shadow-red-500/5 ring-1 ring-red-500/10' 
        : s.supplyShortageRisk === 'HIGH'
        ? 'border-orange-300 dark:border-orange-500/25 shadow-md shadow-orange-500/5'
        : 'border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/20'
    )}>
      
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3.5 min-w-0">
          <CommodityAvatar commodity={s.commodity} size={22} />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-slate-900 dark:text-white truncate">
                {s.commodityLabel}
              </h3>
              {s.supplyShortageRisk === 'CRITICAL' && (
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping shrink-0" title="Active Stockout Risk" />
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Shipment #{s.trackingNumber || s.id}</span>
              <span>•</span>
              <span className="truncate">{s.origin}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className={clsx(
            'text-[10px] font-black tracking-wider px-2.5 py-0.8 rounded-full border shadow-2xs uppercase',
            s.supplyShortageRisk === 'CRITICAL' 
              ? 'bg-red-500 text-white border-red-600 shadow-red-500/20' 
              : s.supplyShortageRisk === 'HIGH'
              ? 'bg-orange-500 text-white border-orange-600 shadow-orange-500/20'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30'
          )}>
            {s.supplyShortageRisk} SHORTAGE RISK
          </span>
          <span className={clsx('text-[10px] font-bold px-2 py-0.5 rounded-md border', priorityInfo.color)}>
            {priorityInfo.label}
          </span>
        </div>
      </div>

      {/* Structured Telemetry Grid */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.06] rounded-xl p-2.5 space-y-0.5">
          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-[10px] font-semibold">
            <MapPin size={11} className="text-orange-500 shrink-0" />
            <span>Destination</span>
          </div>
          <div className="text-slate-900 dark:text-white text-xs font-bold truncate">
            {dist?.name.split('—')[0].trim() || 'Haflong Depot'}
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.06] rounded-xl p-2.5 space-y-0.5">
          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-[10px] font-semibold">
            <Flame size={11} className="text-red-500 shrink-0" />
            <span>Route Disruption</span>
          </div>
          <div className={clsx(
            'text-xs font-black',
            s.routeRisk > 80 ? 'text-red-600 dark:text-red-400' : s.routeRisk > 60 ? 'text-orange-600 dark:text-orange-400' : 'text-emerald-600 dark:text-green-400'
          )}>
            {s.routeRisk}% {s.routeRisk > 70 ? 'HIGH' : 'NORMAL'}
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.06] rounded-xl p-2.5 space-y-0.5">
          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-[10px] font-semibold">
            <Clock size={11} className="text-amber-500 shrink-0" />
            <span>Projected Offset</span>
          </div>
          <div className={clsx('text-xs font-black', s.predictedDelay > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-emerald-600 dark:text-green-400')}>
            {s.predictedDelay > 0 ? `+${s.predictedDelay}h Delay` : 'On Schedule'}
          </div>
        </div>
      </div>

      {/* Stock Reserve Depletion Gauge */}
      <div className="bg-slate-50/70 dark:bg-white/[0.02] p-3 rounded-xl border border-slate-200/70 dark:border-white/[0.05]">
        <StockGauge days={s.stockDaysRemaining} />
      </div>

      {/* AI Root Cause Diagnosis Callout */}
      {isAtRisk && (
        <div className="rounded-xl border border-orange-200 dark:border-orange-500/20 bg-orange-50/60 dark:bg-orange-500/[0.04] p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-orange-800 dark:text-orange-300 uppercase tracking-wider">
              <Sparkles size={13} className="text-orange-500" />
              <span>AI Disruption Diagnosis</span>
            </div>
            <span className="text-[10px] text-orange-700 dark:text-orange-400 font-semibold">Confidence: 94%</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              <span>Corridor Risk: <b className="text-red-600 dark:text-red-400">{s.routeRisk}% on NH-27</b></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
              <span>Warehouse Stockout: <b className="text-amber-700 dark:text-amber-400">{s.stockDaysRemaining} Days left</b></span>
            </div>
            {s.alternativeRoute && (
              <div className="flex items-center gap-1.5 sm:col-span-2 text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-500/10 p-1.5 rounded-lg border border-emerald-200 dark:border-emerald-500/20">
                <ShieldCheck size={13} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>Recommended Alt: <b>{s.alternativeRoute}</b></span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Last Safe Action Ribbon */}
      {s.lastSafeAction && (
        <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-500/[0.08] border border-amber-200 dark:border-amber-500/20 rounded-xl px-3.5 py-2 text-xs">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold">
            <Clock size={14} className="text-amber-600 dark:text-amber-400 shrink-0 animate-pulse" />
            <span>Decision Window: {s.lastSafeAction}</span>
          </div>
          <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400">Proactive Dispatch</span>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center gap-2 pt-1">
        {isAtRisk ? (
          <>
            <button
              onClick={openRerouteModal}
              className="flex-1 h-9 flex items-center justify-center gap-1.5 rounded-xl text-xs font-bold text-white shadow-md shadow-orange-500/20 hover:opacity-95 transition-all cursor-pointer bg-gradient-to-r from-orange-500 to-red-600"
            >
              <Zap size={13} />
              <span>Reroute Shipment</span>
              <ArrowRight size={13} />
            </button>

            <button
              onClick={() => openExplainabilityDrawer('shipment', s.id)}
              title="Inspect AI Factor Weights"
              className="h-9 px-3.5 rounded-xl text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 hover:bg-purple-100 dark:bg-purple-500/10 dark:hover:bg-purple-500/20 border border-purple-200 dark:border-purple-500/20 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <Brain size={13} />
              <span>Explain AI</span>
            </button>
          </>
        ) : (
          <button
            onClick={() => trackVehicleOnMap('TRK-204')}
            className="flex-1 h-9 flex items-center justify-center gap-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.09] border border-slate-200 dark:border-white/10 transition-all cursor-pointer"
          >
            <Navigation size={13} className="text-emerald-500" />
            <span>Track Vehicle Live</span>
          </button>
        )}
      </div>

    </div>
  );
}

export default function SupplyAtRisk() {
  const [filter, setFilter] = useState<'all' | CommodityType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | 'critical' | 'delayed'>('all');

  const filtered = shipments.filter((s) => {
    const matchesCommodity = filter === 'all' || s.commodity === filter;
    const matchesSearch = s.commodityLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.origin.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesCommodity || !matchesSearch) return false;

    if (riskFilter === 'critical') return s.supplyShortageRisk === 'CRITICAL';
    if (riskFilter === 'delayed') return s.predictedDelay > 0 || s.status === 'DELAYED';
    return true;
  });

  const criticalCount = shipments.filter(s => s.supplyShortageRisk === 'CRITICAL').length;
  const highRiskCount = shipments.filter(s => s.routeRisk > 70).length;

  return (
    <div className="flex h-full min-h-0 bg-slate-100 dark:bg-[#070c18] transition-colors duration-200">
      
      {/* Main Content Area */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        
        {/* Top Summary Intelligence Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#0c1424] border border-slate-200/90 dark:border-white/10 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Critical Stockouts</div>
              <div className="text-2xl font-black text-red-600 dark:text-red-500 mt-0.5">{criticalCount} Consignments</div>
              <div className="text-[10px] text-red-600 dark:text-red-400 font-semibold mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                <span>Reserve depleted &lt; 48 hours</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-500 flex items-center justify-center">
              <Flame size={20} />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#0c1424] border border-slate-200/90 dark:border-white/10 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">High-Risk Corridors</div>
              <div className="text-2xl font-black text-orange-600 dark:text-orange-500 mt-0.5">{highRiskCount} Routes</div>
              <div className="text-[10px] text-orange-600 dark:text-orange-400 font-semibold mt-1">
                NH-27 Lifeline segment compromised
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 text-orange-500 flex items-center justify-center">
              <AlertTriangle size={20} />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#0c1424] border border-slate-200/90 dark:border-white/10 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Affected Population</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">1.28M Citizens</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-1">
                Across 4 isolated district centers
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-500 flex items-center justify-center">
              <Users size={20} />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#0c1424] border border-slate-200/90 dark:border-white/10 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Decision Window</div>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">&lt; 1h 22m</div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                NH-106 Bypass Detour Available
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-500 flex items-center justify-center">
              <ShieldAlert size={20} />
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white dark:bg-[#0c1424] p-4 rounded-2xl border border-slate-200/90 dark:border-white/10 shadow-xs">
          
          {/* Commodity Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {[
              { id: 'all', label: 'All Commodities', count: shipments.length, icon: null },
              { id: 'medicine', label: 'Medicine', count: shipments.filter(s => s.commodity === 'medicine').length, icon: <Pill size={13} className="text-red-500" /> },
              { id: 'food', label: 'Food', count: shipments.filter(s => s.commodity === 'food').length, icon: <Wheat size={13} className="text-amber-500" /> },
              { id: 'agri', label: 'Agri', count: shipments.filter(s => s.commodity === 'agri').length, icon: <Sprout size={13} className="text-emerald-500" /> },
              { id: 'construction', label: 'Construction', count: shipments.filter(s => s.commodity === 'construction').length, icon: <HardHat size={13} className="text-blue-500" /> },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setFilter(t.id as any)}
                className={clsx(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border whitespace-nowrap',
                  filter === t.id
                    ? 'bg-orange-50 text-orange-800 border-orange-300 dark:bg-orange-500/20 dark:text-orange-300 dark:border-orange-500/30 shadow-2xs'
                    : 'bg-slate-50 dark:bg-white/[0.03] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/[0.06] hover:bg-slate-100 dark:hover:bg-white/[0.06]'
                )}
              >
                {t.icon}
                <span>{t.label}</span>
                <span className={clsx(
                  'text-[10px] px-1.5 py-0.2 rounded-full font-bold',
                  filter === t.id ? 'bg-orange-200 dark:bg-orange-500/40 text-orange-950 dark:text-orange-200' : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400'
                )}>
                  {t.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search & Risk Quick Switch */}
          <div className="flex items-center gap-2.5">
            <div className="relative flex-1 md:w-56">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search consignments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/[0.04] p-1 rounded-xl border border-slate-200 dark:border-white/10">
              <button
                onClick={() => setRiskFilter('all')}
                className={clsx(
                  'px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer',
                  riskFilter === 'all' ? 'bg-white dark:bg-[#121c30] text-slate-900 dark:text-white shadow-2xs' : 'text-slate-500 dark:text-slate-400'
                )}
              >
                All
              </button>
              <button
                onClick={() => setRiskFilter('critical')}
                className={clsx(
                  'px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer',
                  riskFilter === 'critical' ? 'bg-red-500 text-white shadow-2xs' : 'text-slate-500 dark:text-slate-400'
                )}
              >
                Critical
              </button>
            </div>
          </div>

        </div>

        {/* Shipment Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map(s => <ShipmentCard key={s.id} s={s} />)}
        </div>

      </div>

      {/* Right-side District Stock Coverage Rail */}
      <div className="w-80 shrink-0 bg-white dark:bg-[#090f1c] border-l border-slate-200 dark:border-white/[0.06] p-5 overflow-y-auto space-y-4 flex flex-col">
        
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">District Stock Coverage</h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 border border-red-200 dark:border-red-500/20">
              4 Critical
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Buffer inventory levels across North East hubs
          </p>
        </div>

        <div className="space-y-2.5 flex-1 min-h-0">
          {supplyInventory.map((inv) => (
            <div 
              key={`${inv.districtId}-${inv.commodity}`} 
              className={clsx(
                'p-3 rounded-xl border transition-all duration-150 hover:shadow-xs space-y-2 text-slate-900 dark:text-slate-100 bg-white dark:bg-[#0c1424]',
                inv.risk === 'CRITICAL' 
                  ? 'border-red-300/80 dark:border-red-500/25 bg-red-50/20 dark:bg-red-500/[0.02]' 
                  : inv.risk === 'HIGH'
                  ? 'border-orange-300/70 dark:border-orange-500/20'
                  : 'border-slate-200 dark:border-white/[0.06]'
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <CommodityAvatar commodity={inv.commodity} size={14} />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {inv.districtName.split('—')[0].trim()}
                    </div>
                  </div>
                </div>

                <span className={clsx(
                  'text-[9px] font-extrabold px-1.5 py-0.5 rounded border uppercase shrink-0',
                  inv.risk === 'CRITICAL' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-300 dark:border-red-500/30' :
                  inv.risk === 'HIGH' ? 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/20 dark:text-orange-300 dark:border-orange-500/30' :
                  inv.risk === 'MEDIUM' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30' :
                  'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30'
                )}>
                  {inv.risk}
                </span>
              </div>

              <MiniStockGauge days={inv.stockDays} />
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
