import { useState } from 'react';
import clsx from 'clsx';
import { 
  ChevronRight, Radio, AlertTriangle, Truck, Map, ArrowRight, Navigation, 
  Search, Shield, Phone, Clock, Gauge, ThermometerSnowflake, Package, Brain, Sparkles, CheckCircle2 
} from 'lucide-react';
import { vehicles } from '../data/mockData';
import { useAppStore } from '../store/useAppStore';
import type { Vehicle } from '../types';

function VehicleDetail({ v }: { v: Vehicle }) {
  const { trackVehicleOnMap, openExplainabilityDrawer, openRerouteModal } = useAppStore();
  const isHighRisk = v.routeRisk > 70;
  const isMediumRisk = v.routeRisk > 40 && v.routeRisk <= 70;
  const riskColor = isHighRisk ? '#ef4444' : isMediumRisk ? '#f97316' : '#10b981';

  return (
    <div className="p-6 h-full overflow-y-auto space-y-6 animate-fade-up">
      
      {/* ── 1. HERO VEHICLE PROFILE CARD ── */}
      <div className="bg-white dark:bg-[#0c1424] p-5 rounded-2xl border border-slate-200/90 dark:border-white/10 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-orange-500/20 shrink-0">
              <Truck size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-slate-900 dark:text-white font-black text-lg tracking-tight">
                  {v.id}
                </h3>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10">
                  {v.plateNo}
                </span>
                <span className={clsx(
                  'text-[10px] font-extrabold px-2 py-0.5 rounded-md border uppercase',
                  v.status === 'TELEMETRY_UNAVAILABLE' 
                    ? 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/20 dark:text-orange-300 dark:border-orange-500/30' 
                    : v.status === 'IN_TRANSIT' 
                    ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30' 
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30'
                )}>
                  {v.status.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span>Driver: <strong className="text-slate-800 dark:text-slate-200">{v.driverName}</strong></span>
                <span>•</span>
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <Phone size={11} /> +91 94350-11223
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => openExplainabilityDrawer('shipment', 'sh-001')}
              className="h-10 px-3.5 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-500/10 dark:hover:bg-purple-500/20 border border-purple-200 dark:border-purple-500/20 text-purple-700 dark:text-purple-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              title="Inspect AI Route Risk Factors"
            >
              <Brain size={14} />
              <span>Explain AI</span>
            </button>

            <button
              onClick={() => trackVehicleOnMap(v.id)}
              className="h-10 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-[0.99] text-white font-bold text-xs shadow-md shadow-orange-500/20 flex items-center gap-2 transition-all cursor-pointer group shrink-0"
            >
              <Navigation size={14} className="text-white group-hover:rotate-12 transition-transform" />
              <span>Track Live On Map</span>
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Telemetry Warning Alert */}
      {!v.telemetryFresh && (
        <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle size={18} className="text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <div className="text-orange-800 dark:text-orange-300 font-bold">
              GPS Telemetry Signal Intermittent
            </div>
            <p className="text-slate-600 dark:text-slate-400 mt-0.5">
              Last GPS ping recorded at <strong>{v.lastPingAt}</strong>. Status flagged as <em>TELEMETRY UNAVAILABLE</em> while crossing mountain dead-zone.
            </p>
          </div>
        </div>
      )}

      {/* ── 2. ACTIVE JOURNEY CORRIDOR PIPELINE ── */}
      <div className="bg-white dark:bg-[#0c1424] p-5 rounded-2xl border border-slate-200/90 dark:border-white/10 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-black text-slate-800 dark:text-slate-200 tracking-wider uppercase">
            Corridor Route Progression
          </span>
          <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
            {v.delayMinutes > 0 ? `+${v.delayMinutes} min Delay Expected` : 'On Schedule'}
          </span>
        </div>

        {/* Origin / Current / Destination Track */}
        <div className="relative flex items-center justify-between pt-2 pb-3">
          {/* Connecting Line */}
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-slate-200 dark:bg-white/10 rounded-full">
            <div className="h-full bg-gradient-to-r from-emerald-500 via-orange-500 to-orange-500 rounded-full w-[65%]" />
          </div>

          {/* Node 1: Origin */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-emerald-500/20">
              <CheckCircle2 size={16} />
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white mt-1.5">Guwahati Hub</span>
            <span className="text-[10px] text-slate-400">Departed 11:30 AM</span>
          </div>

          {/* Node 2: Active Position */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-xs shadow-lg shadow-orange-500/30 ring-4 ring-orange-500/20 animate-pulse">
              <Truck size={17} />
            </div>
            <span className="text-xs font-bold text-orange-600 dark:text-orange-400 mt-1.5">NH-27 (Silchar Cutoff)</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">Active Position</span>
          </div>

          {/* Node 3: Destination */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 border-2 border-slate-300 dark:border-white/20 text-slate-500 dark:text-slate-400 flex items-center justify-center font-bold text-xs">
              <Map size={15} />
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white mt-1.5">{v.destination.split('—')[0].trim()}</span>
            <span className="text-[10px] text-slate-400">ETA: {v.eta}</span>
          </div>
        </div>
      </div>

      {/* ── 3. DETAILED TELEMETRY GRID ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Tile 1: Route & Delay */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0c1424] border border-slate-200/90 dark:border-white/10 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Estimated Arrival
            </span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 text-orange-500 flex items-center justify-center shrink-0">
              <Clock size={16} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">{v.eta}</span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1.5">
              Original: <strong className="text-slate-700 dark:text-slate-300">{v.originalEta}</strong>
            </div>
          </div>
        </div>

        {/* Tile 2: Corridor Disruption Risk */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0c1424] border border-slate-200/90 dark:border-white/10 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Corridor Risk
            </span>
            <div className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-500 flex items-center justify-center shrink-0">
              <AlertTriangle size={16} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black leading-none" style={{ color: riskColor }}>{v.routeRisk}%</span>
              <span className="text-xs font-bold uppercase" style={{ color: riskColor }}>
                {isHighRisk ? 'Critical' : isMediumRisk ? 'High' : 'Low'}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1.5 truncate">
              {v.routeName}
            </div>
          </div>
        </div>

        {/* Tile 3: Live Dynamics */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0c1424] border border-slate-200/90 dark:border-white/10 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Speed &amp; Heading
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-500 flex items-center justify-center shrink-0">
              <Gauge size={16} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">48 km/h</span>
              <span className="text-xs font-semibold text-slate-500">North-East</span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1.5">
              Mountain Incline: <strong>32°</strong>
            </div>
          </div>
        </div>

        {/* Tile 4: Reefer Cold Chain */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0c1424] border border-slate-200/90 dark:border-white/10 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Cold Chain Reefer
            </span>
            <div className="w-8 h-8 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 text-cyan-500 flex items-center justify-center shrink-0">
              <ThermometerSnowflake size={16} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-cyan-600 dark:text-cyan-400 leading-none">3.4°C</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Nominal</span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1.5">
              Range: 2°C – 8°C ICU standard
            </div>
          </div>
        </div>

      </div>

      {/* ── 4. CARGO MANIFEST & GPS TELEMETRY ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Cargo Manifest Card */}
        <div className="bg-white dark:bg-[#0c1424] p-5 rounded-2xl border border-slate-200/90 dark:border-white/10 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/[0.06] pb-3">
            <div className="flex items-center gap-2">
              <Package size={16} className="text-orange-500" />
              <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Consignment Manifest
              </span>
            </div>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-500/30">
              Priority 100/100
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-white/[0.04]">
              <span className="text-slate-500 dark:text-slate-400">Commodity Type</span>
              <strong className="text-slate-900 dark:text-white font-bold">Critical ICU Supplies &amp; Vaccines</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-white/[0.04]">
              <span className="text-slate-500 dark:text-slate-400">Consignment ID</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">#PS-MED-8921-X</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-white/[0.04]">
              <span className="text-slate-500 dark:text-slate-400">Consignee Authority</span>
              <strong className="text-slate-900 dark:text-white">Dr. Anamika Das (District X Hospital)</strong>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500 dark:text-slate-400">Batch Number</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">BAT-9842-COLD</span>
            </div>
          </div>
        </div>

        {/* GPS Live Telemetry Card */}
        <div className="bg-white dark:bg-[#0c1424] p-5 rounded-2xl border border-slate-200/90 dark:border-white/10 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/[0.06] pb-3">
            <div className="flex items-center gap-2">
              <Radio size={16} className={v.telemetryFresh ? 'text-emerald-500 animate-pulse' : 'text-orange-500'} />
              <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Live GPS &amp; Sensor Telemetry
              </span>
            </div>
            <span className={clsx(
              'text-[10px] font-bold px-2 py-0.5 rounded-full border',
              v.telemetryFresh 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' 
                : 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20'
            )}>
              {v.telemetryFresh ? '● FRESH (GPS Live)' : '● SIGNAL UNAVAILABLE'}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-white/[0.04]">
              <span className="text-slate-500 dark:text-slate-400">GPS Coordinates</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                {v.currentLocation[0].toFixed(4)}°N, {v.currentLocation[1].toFixed(4)}°E
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-white/[0.04]">
              <span className="text-slate-500 dark:text-slate-400">Cellular / Satellite Lock</span>
              <strong className="text-emerald-600 dark:text-emerald-400">4G Nominal (8 Satellites Lock)</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-white/[0.04]">
              <span className="text-slate-500 dark:text-slate-400">Last Telemetry Ping</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">{v.lastPingAt}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500 dark:text-slate-400">Assigned Detour Corridors</span>
              <strong className="text-orange-600 dark:text-orange-400">NH-106 Bypass Detour Active</strong>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

export default function VehicleTracking() {
  const [selected, setSelected] = useState<Vehicle | null>(vehicles[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'in_transit' | 'risk'>('all');

  const filtered = vehicles.filter((v) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || v.id.toLowerCase().includes(q) || v.plateNo.toLowerCase().includes(q) || v.driverName.toLowerCase().includes(q) || v.destination.toLowerCase().includes(q);
    const matchesFilter = filter === 'all' 
      ? true 
      : filter === 'in_transit' 
      ? v.status === 'IN_TRANSIT' 
      : v.routeRisk > 60 || !v.telemetryFresh;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex h-full min-h-0 transition-colors duration-200">
      
      {/* ── FLEET LIST SIDEBAR ── */}
      <div className="w-80 shrink-0 bg-white dark:bg-[#090f1c] border-r border-slate-200 dark:border-white/[0.06] flex flex-col">
        
        {/* Top Header */}
        <div className="px-4 py-3.5 border-b border-slate-200 dark:border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck size={16} className="text-orange-500" />
            <span className="text-slate-900 dark:text-white text-sm font-bold">Vehicle Fleet</span>
          </div>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10">
            {vehicles.length} Vehicles
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
              placeholder="Search vehicle, driver, plate..."
              className="w-full h-8.5 pl-8.5 pr-3 text-xs rounded-xl bg-slate-100/80 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 px-3 pb-2.5 overflow-x-auto border-b border-slate-200 dark:border-white/[0.05]">
          {[
            { id: 'all', label: 'All Fleet', count: vehicles.length },
            { id: 'in_transit', label: 'In Transit', count: vehicles.filter(v => v.status === 'IN_TRANSIT').length },
            { id: 'risk', label: 'At Risk', count: vehicles.filter(v => v.routeRisk > 60 || !v.telemetryFresh).length },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id as any)}
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

        {/* Vehicle Cards List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filtered.length > 0 ? (
            filtered.map((v) => {
              const riskColor = v.routeRisk > 80 ? '#ef4444' : v.routeRisk > 60 ? '#f97316' : '#10b981';
              const isSelected = selected?.id === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => setSelected(v)}
                  className={clsx(
                    'w-full text-left p-3 rounded-xl border transition-all duration-150 flex items-center gap-3 cursor-pointer group',
                    isSelected
                      ? 'bg-orange-50/90 dark:bg-orange-500/10 border-orange-300 dark:border-orange-500/30 shadow-xs ring-1 ring-orange-500/20'
                      : 'bg-white dark:bg-[#0c1424] border-slate-200/80 dark:border-white/[0.06] hover:border-slate-300 dark:hover:border-white/15 hover:shadow-2xs'
                  )}
                >
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/[0.06] flex items-center justify-center text-slate-700 dark:text-slate-300 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                      <Truck size={18} />
                    </div>
                    {!v.telemetryFresh && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-white dark:border-[#0c1424]" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-slate-900 dark:text-white text-xs font-black truncate">{v.id}</span>
                      <span className="text-[11px] font-black" style={{ color: riskColor }}>{v.routeRisk}% Risk</span>
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 text-[11px] truncate font-medium mt-0.5">
                      {v.driverName} • {v.plateNo}
                    </div>
                    <div className="text-slate-600 dark:text-slate-300 text-[11px] font-semibold truncate mt-0.5">
                      → {v.destination.split('—')[0].trim()}
                    </div>
                  </div>

                  <ChevronRight 
                    size={14} 
                    className={clsx(
                      'shrink-0 transition-transform duration-150 group-hover:translate-x-0.5',
                      isSelected ? 'text-orange-600 dark:text-orange-400' : 'text-slate-400 dark:text-slate-600'
                    )} 
                  />
                </button>
              );
            })
          ) : (
            <div className="text-center py-8 text-xs text-slate-400 font-medium">
              No matching vehicles found
            </div>
          )}
        </div>
      </div>

      {/* ── DETAIL PANEL ── */}
      <div className="flex-1 min-w-0 bg-[var(--bg-main)]">
        {selected ? (
          <VehicleDetail v={selected} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-600">
            <Truck size={48} className="text-slate-300 dark:text-slate-600 mb-3 stroke-[1.5]" />
            <p className="text-sm font-medium">Select a vehicle to view intelligence</p>
          </div>
        )}
      </div>

    </div>
  );
}
