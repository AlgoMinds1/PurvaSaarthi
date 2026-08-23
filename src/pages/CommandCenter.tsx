import { useEffect, useRef } from 'react';
import {
  ArrowRight, Route, Truck, Package, Building2,
  AlertTriangle, AlertOctagon, CloudRain, Mountain, Radio, Landmark, Users, Map,
  Activity, Sliders, ShieldAlert
} from 'lucide-react';
import clsx from 'clsx';
import { useAppStore } from '../store/useAppStore';
import { shipments, roads, vehicles } from '../data/mockData';
import L from 'leaflet';
import { statusColor } from '../lib/utils';

// ── KPI CARD ────────────────────────────────────────────────────────────────
function KpiCard({
  label, value, icon, trend, trendUp, onClick, critical
}: {
  label: string; value: string | number; icon: React.ReactNode;
  trend?: string; trendUp?: boolean; onClick?: () => void; critical?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'glass-card p-4 text-left flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-white/[0.05] transition-all duration-200 group cursor-pointer border border-slate-200 dark:border-white/[0.07]',
        critical && 'border-orange-300 dark:border-orange-500/20 bg-orange-50/60 dark:bg-orange-500/[0.04]'
      )}
    >
      <div className={clsx(
        'w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 shadow-xs',
        critical ? 'bg-orange-100 dark:bg-orange-500/15' : 'bg-slate-100 dark:bg-white/[0.06]'
      )}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className={clsx(
          'text-2xl font-black leading-none mb-1',
          critical ? 'gradient-text-orange' : 'text-slate-900 dark:text-white'
        )}>
          {value}
        </div>
        <div className="text-slate-600 dark:text-slate-400 text-xs font-semibold">{label}</div>
      </div>
      {trend && (
        <div className={clsx(
          'text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 border',
          trendUp ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-transparent' : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-transparent'
        )}>
          {trend}
        </div>
      )}
    </button>
  );
}

// ── MINI MAP ──────────────────────────────────────────────────────────────────
function MiniMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    const map = L.map(mapRef.current, {
      center: [25.9, 92.2],
      zoom: 7,
      zoomControl: true,
      attributionControl: true,
      dragging: true,
      scrollWheelZoom: true,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);
    // Draw roads
    roads.forEach((r) => {
      L.polyline(r.latlngs, {
        color: statusColor(r.status),
        weight: r.status === 'BLOCKED' ? 4 : 3,
        opacity: 0.85,
        dashArray: r.status === 'UNKNOWN' ? '6,4' : undefined,
      }).bindPopup(`<div style="font-size:12px;color:#0f172a"><b>${r.name}</b><br/>Status: <b style="color:${statusColor(r.status)}">${r.status}</b><br/>Risk: ${r.riskScore}%</div>`)
        .addTo(map);
    });
    // Draw vehicles
    vehicles.forEach((v) => {
      const truckIcon = L.divIcon({
        className: 'truck-icon-custom',
        html: `<div style="width:24px;height:24px;background:#0284c7;border:2px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;box-shadow:0 2px 4px rgba(0,0,0,0.3)"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18.5" r="2.5"/><circle cx="7" cy="18.5" r="2.5"/></svg></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });
      L.marker(v.currentLocation, { icon: truckIcon })
        .bindPopup(`<div style="font-size:12px;color:#0f172a"><b>${v.id}</b><br/>${v.driverName}<br/>${v.destination}</div>`)
        .addTo(map);
    });
    mapInstance.current = map;
  }, []);

  return <div ref={mapRef} className="w-full h-full min-h-[460px] rounded-b-xl" />;
}

// ── PARAMETER ROW ─────────────────────────────────────────────────────────────
function ParamItem({
  icon, label, value, sub, status
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  status?: 'warning' | 'alert' | 'success' | 'normal';
}) {
  const statusColors = {
    warning: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20',
    alert: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20',
    success: 'text-emerald-600 dark:text-green-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20',
    normal: 'text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-white/[0.03] border-slate-200/80 dark:border-white/[0.05]'
  };

  return (
    <div className={clsx('p-2.5 rounded-xl border flex items-center justify-between transition-all', statusColors[status ?? 'normal'])}>
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-white dark:bg-white/[0.08] shadow-2xs flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div className="min-w-0">
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">{label}</div>
          {sub && <div className="text-[9px] text-slate-400 dark:text-slate-500 truncate">{sub}</div>}
        </div>
      </div>
      <div className="text-right pl-2 shrink-0">
        <div className="text-xs font-bold text-slate-900 dark:text-white">{value}</div>
      </div>
    </div>
  );
}

// ── MAIN COMMAND CENTER ────────────────────────────────────────────────────────
export default function CommandCenter() {
  const { setView } = useAppStore();
  const unreadCritical = shipments.filter(s => s.status === 'AT_RISK').length;

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto p-6 transition-colors duration-200">

      {/* Top KPI Grid */}
      <div className="grid grid-cols-6 gap-3">
        <KpiCard label="Roads at Risk" value={7} icon={<Route size={18} className="text-orange-500" />} trend="↑ 2" trendUp onClick={() => setView('roads')} />
        <KpiCard label="Active Vehicles" value={18} icon={<Truck size={18} className="text-blue-500" />} trend="→ 0" onClick={() => setView('vehicles')} />
        <KpiCard label="Supplies at Risk" value={4} icon={<Package size={18} className="text-amber-500" />} trend="↑ 1" trendUp critical onClick={() => setView('supply')} />
        <KpiCard label="Districts at Risk" value={3} icon={<Building2 size={18} className="text-purple-500" />} trend="↑ 1" trendUp onClick={() => setView('districts')} />
        <KpiCard label="Peak Isolation Risk" value="87%" icon={<AlertTriangle size={18} className="text-red-500" />} trend="↑ 12%" trendUp critical onClick={() => setView('districts')} />
        <KpiCard label="Critical Alerts" value={unreadCritical} icon={<AlertOctagon size={18} className="text-red-500" />} trend="NEW" trendUp critical onClick={() => setView('alerts')} />
      </div>

      {/* Main Expanded Map View + Telemetry Parameters Rail */}
      <div className="grid grid-cols-[1fr_290px] gap-4 flex-1 min-h-[500px]">

        {/* Expanded Regional Map */}
        <div className="glass-card overflow-hidden flex flex-col border border-slate-200 dark:border-white/[0.07] h-full shadow-xs">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-white/[0.06] bg-white/50 dark:bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <Map size={16} className="text-orange-500" />
              <span className="text-sm font-bold text-slate-900 dark:text-white">Regional Operations GIS Map</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-green-400 font-bold bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/20">
                <span className="pulse-dot green" /> LIVE GIS
              </span>
              <button
                onClick={() => setView('map')}
                className="text-xs text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 flex items-center gap-1 transition-colors font-bold cursor-pointer"
              >
                Full GIS View <ArrowRight size={12} />
              </button>
            </div>
          </div>

          <div className="flex-1 min-h-0 relative">
            <MiniMap />
          </div>

          {/* Map Legend */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-slate-200 dark:border-white/[0.05] text-[11px] text-slate-700 dark:text-slate-400 bg-slate-50/70 dark:bg-white/[0.02] font-medium">
            <div className="flex items-center gap-4">
              {[['#22c55e', 'Open'], ['#eab308', 'Degraded'], ['#f97316', 'High Risk'], ['#ef4444', 'Blocked'], ['#6b7280', 'Unknown']].map(([c, l]) => (
                <span key={l} className="flex items-center gap-1.5">
                  <span className="inline-block w-4 h-1.5 rounded-full" style={{ background: c }} />
                  {l}
                </span>
              ))}
            </div>
            <div className="text-[10px] text-slate-400">
              Interactive Zoom & Pan Enabled
            </div>
          </div>
        </div>

        {/* Necessary Parameters Panel (Right Side) */}
        <div className="glass-card p-4 rounded-2xl border border-slate-200 dark:border-white/[0.07] flex flex-col justify-between gap-3 overflow-y-auto">
          
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/[0.06] mb-3">
              <div className="flex items-center gap-2">
                <Sliders size={15} className="text-orange-500" />
                <span className="text-xs font-bold text-slate-900 dark:text-white tracking-wide">REGIONAL PARAMETERS</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 font-semibold">NER OPS</span>
            </div>

            {/* Environmental Parameters */}
            <div className="space-y-2 mb-3">
              <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase">Environmental Telemetry</div>
              <ParamItem
                icon={<CloudRain size={15} className="text-blue-500" />}
                label="Forecast Rainfall"
                sub="Next 24 Hours"
                value="87 mm"
                status="warning"
              />
              <ParamItem
                icon={<Mountain size={15} className="text-amber-500" />}
                label="Terrain Gradient"
                sub="Landslide Probability"
                value="HIGH (32°)"
                status="alert"
              />
            </div>

            {/* Network & Infrastructure */}
            <div className="space-y-2 mb-3">
              <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase">Network Telemetry</div>
              <ParamItem
                icon={<Radio size={15} className="text-emerald-500" />}
                label="Roads Monitored"
                sub="National Highways"
                value="24 Corridors"
                status="success"
              />
              <ParamItem
                icon={<Landmark size={15} className="text-cyan-500" />}
                label="Active Bridges"
                sub="Key River Crossings"
                value="8 Bridges"
                status="normal"
              />
              <ParamItem
                icon={<Users size={15} className="text-purple-500" />}
                label="Field Response"
                sub="On-ground Personnel"
                value="7 Officers"
                status="normal"
              />
            </div>

            {/* Resilience Index */}
            <div className="space-y-2">
              <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase">Cascade Vulnerability</div>
              <ParamItem
                icon={<ShieldAlert size={15} className="text-red-500" />}
                label="Peak Disruption Corridor"
                sub="Single Point of Failure"
                value="NH-06 (91%)"
                status="alert"
              />
            </div>
          </div>

          {/* Quick Action */}
          <div className="pt-2 border-t border-slate-200 dark:border-white/[0.06]">
            <button
              onClick={() => setView('roads')}
              className="w-full py-2 px-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Activity size={13} />
              <span>Inspect All Corridors</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
