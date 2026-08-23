import { useEffect, useRef } from 'react';
import {
  ArrowRight, GitBranch
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
        'glass-card p-4.5 text-left flex items-start gap-3.5 hover:bg-slate-50 dark:hover:bg-white/[0.05] transition-all duration-200 group cursor-pointer border border-slate-200 dark:border-white/[0.07]',
        critical && 'border-orange-300 dark:border-orange-500/20 bg-orange-50/60 dark:bg-orange-500/[0.04]'
      )}
    >
      <div className={clsx(
        'w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 shadow-xs',
        critical ? 'bg-orange-100 dark:bg-orange-500/15' : 'bg-slate-100 dark:bg-white/[0.06]'
      )}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className={clsx(
          'text-2xl font-black leading-none mb-1.5',
          critical ? 'gradient-text-orange' : 'text-slate-900 dark:text-white'
        )}>
          {value}
        </div>
        <div className="text-slate-600 dark:text-slate-400 text-xs font-semibold">{label}</div>
      </div>
      {trend && (
        <div className={clsx(
          'text-xs font-bold px-2 py-0.5 rounded-md shrink-0 border',
          trendUp ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-transparent' : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-transparent'
        )}>
          {trend}
        </div>
      )}
    </button>
  );
}

// ── INTEL CARD ───────────────────────────────────────────────────────────────
function IntelCard({
  severity, title, children, time, onAction, actionLabel
}: {
  severity: 'EMERGENCY' | 'CRITICAL' | 'HIGH';
  title: string; children: React.ReactNode;
  time: string; onAction?: () => void; actionLabel?: string;
}) {
  const colors = {
    EMERGENCY: 'border-red-200 bg-red-50/80 dark:border-red-500/25 dark:bg-red-500/[0.05]',
    CRITICAL: 'border-orange-200 bg-orange-50/80 dark:border-orange-500/25 dark:bg-orange-500/[0.05]',
    HIGH: 'border-yellow-200 bg-yellow-50/80 dark:border-yellow-500/20 dark:bg-yellow-500/[0.04]',
  };
  const badgeColors = {
    EMERGENCY: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30',
    CRITICAL: 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500/30',
    HIGH: 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-500/15 dark:text-yellow-400 dark:border-yellow-500/20',
  };
  return (
    <div className={clsx('rounded-xl border p-4 animate-fade-up shadow-xs', colors[severity])}>
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <span className={clsx('text-[10px] font-bold px-2 py-0.5 rounded border', badgeColors[severity])}>
          {severity}
        </span>
        <span className="text-slate-500 dark:text-slate-400 text-[11px] font-mono font-medium">{time}</span>
      </div>
      <div className="text-slate-900 dark:text-white text-sm font-bold mb-3 leading-snug">{title}</div>
      <div className="space-y-1.5 mb-3">{children}</div>
      {onAction && (
        <button
          onClick={onAction}
          className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 flex items-center gap-1 transition-colors cursor-pointer"
        >
          {actionLabel ?? 'View Details'} <ArrowRight size={12} />
        </button>
      )}
    </div>
  );
}

function IntelRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-slate-600 dark:text-slate-400 font-medium">{label}</span>
      <span className={clsx('font-bold', color ?? 'text-slate-900 dark:text-slate-200')}>{value}</span>
    </div>
  );
}

// ── CASCADE CHAIN ─────────────────────────────────────────────────────────────
function CascadeChain() {
  const steps = [
    { label: 'Road A', sub: 'HIGH RISK', danger: true },
    { label: 'Truck #204', sub: 'AFFECTED', danger: true },
    { label: 'Shipment #104', sub: 'DELAYED', danger: true },
    { label: 'District X', sub: '1.7 DAYS', danger: true, critical: true },
  ];
  return (
    <div className="glass-card p-4 rounded-xl border border-slate-200 dark:border-white/[0.07]">
      <div className="flex items-center gap-2 mb-3">
        <GitBranch size={14} className="text-orange-600 dark:text-orange-400" />
        <span className="text-xs font-bold text-slate-900 dark:text-slate-300 tracking-wide">CASCADE IMPACT CHAIN</span>
      </div>
      <div className="flex items-center gap-1.5 flex-wrap">
        {steps.map((s, i) => (
          <div key={s.label} className="flex items-center gap-1.5">
            <div className={clsx(
              'px-2.5 py-1.5 rounded-lg border text-center shadow-xs',
              s.critical
                ? 'bg-red-50 border-red-200 text-red-800 dark:bg-red-500/15 dark:border-red-500/30 dark:text-red-400'
                : 'bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-500/10 dark:border-orange-500/20 dark:text-orange-300'
            )}>
              <div className={clsx('text-[11px] font-bold', s.critical ? 'text-red-800 dark:text-red-400' : 'text-orange-800 dark:text-orange-300')}>
                {s.label}
              </div>
              <div className="text-[9px] text-slate-600 dark:text-slate-400 mt-0.5 font-medium">{s.sub}</div>
            </div>
            {i < steps.length - 1 && (
              <span className="text-orange-600 dark:text-orange-400 text-xs font-bold">→</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── MINI MAP ──────────────────────────────────────────────────────────────────
function MiniMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    const map = L.map(mapRef.current, {
      center: [25.9, 92.0],
      zoom: 7,
      zoomControl: false,
      attributionControl: true,
      dragging: false,
      scrollWheelZoom: false,
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
        html: `<div style="font-size:20px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.4))">🚛</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });
      L.marker(v.currentLocation, { icon: truckIcon })
        .bindPopup(`<div style="font-size:12px;color:#0f172a"><b>${v.id}</b><br/>${v.driverName}<br/>${v.destination}</div>`)
        .addTo(map);
    });
    mapInstance.current = map;
  }, []);

  return <div ref={mapRef} className="w-full h-full rounded-b-xl" />;
}

// ── STATS STRIP ───────────────────────────────────────────────────────────────
function StatsStrip() {
  const stats = [
    { icon: '🌧️', val: '87mm', lbl: 'Forecast Rainfall' },
    { icon: '🏔️', val: 'HIGH', lbl: 'Terrain Risk' },
    { icon: '📡', val: '24', lbl: 'Roads Monitored' },
    { icon: '🌉', val: '8', lbl: 'Bridges Active' },
    { icon: '📦', val: '23', lbl: 'Active Shipments' },
    { icon: '👤', val: '7', lbl: 'Field Officers' },
  ];
  return (
    <div className="grid grid-cols-6 gap-3">
      {stats.map((s) => (
        <div key={s.lbl} className="glass-card px-4 py-3 flex items-center gap-3 border border-slate-200 dark:border-white/[0.07]">
          <span className="text-xl">{s.icon}</span>
          <div>
            <div className="text-slate-900 dark:text-white font-bold text-sm">{s.val}</div>
            <div className="text-slate-600 dark:text-slate-400 text-[10px] font-medium">{s.lbl}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── MAIN COMMAND CENTER ────────────────────────────────────────────────────────
export default function CommandCenter() {
  const { setView, openRerouteModal } = useAppStore();

  const unreadCritical = shipments.filter(s => s.status === 'AT_RISK').length;

  return (
    <div className="flex flex-col gap-5 h-full overflow-y-auto p-6 transition-colors duration-200">

      {/* KPI Grid */}
      <div className="grid grid-cols-6 gap-3">
        <KpiCard label="Roads at Risk" value={7} icon="🛣️" trend="↑ 2" trendUp onClick={() => setView('roads')} />
        <KpiCard label="Active Vehicles" value={18} icon="🚛" trend="→ 0" onClick={() => setView('vehicles')} />
        <KpiCard label="Supplies at Risk" value={4} icon="📦" trend="↑ 1" trendUp critical onClick={() => setView('supply')} />
        <KpiCard label="Districts at Risk" value={3} icon="🏘️" trend="↑ 1" trendUp onClick={() => setView('districts')} />
        <KpiCard label="Peak Isolation Risk" value="87%" icon="⚠️" trend="↑ 12%" trendUp critical onClick={() => setView('districts')} />
        <KpiCard label="Critical Alerts" value={unreadCritical} icon="🚨" trend="NEW" trendUp critical onClick={() => setView('alerts')} />
      </div>

      {/* Main body: Map + Intel Panel */}
      <div className="grid grid-cols-[1fr_380px] gap-5 flex-1 min-h-0" style={{ minHeight: '420px' }}>

        {/* Mini Map */}
        <div className="glass-card overflow-hidden flex flex-col border border-slate-200 dark:border-white/[0.07]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-white/[0.06]">
            <span className="text-sm font-bold text-slate-900 dark:text-white">🗺️ Regional Status Map</span>
            <button
              onClick={() => setView('map')}
              className="text-xs text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 flex items-center gap-1 transition-colors font-bold cursor-pointer"
            >
              Full Map <ArrowRight size={12} />
            </button>
          </div>
          <div className="flex-1 min-h-0">
            <MiniMap />
          </div>
          {/* Legend */}
          <div className="flex items-center gap-4 px-4 py-2 border-t border-slate-200 dark:border-white/[0.05] text-[10px] text-slate-700 dark:text-slate-400 bg-slate-50/70 dark:bg-transparent font-medium">
            {[['#22c55e', 'Open'], ['#eab308', 'Degraded'], ['#f97316', 'High Risk'], ['#ef4444', 'Blocked'], ['#6b7280', 'Unknown']].map(([c, l]) => (
              <span key={l} className="flex items-center gap-1">
                <span className="inline-block w-6 h-1.5 rounded-full" style={{ background: c }} />
                {l}
              </span>
            ))}
          </div>
        </div>

        {/* Critical Intelligence */}
        <div className="flex flex-col gap-3 overflow-y-auto">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-900 dark:text-white">🧠 Critical Intelligence</span>
            <span className="flex items-center gap-1.5 text-[10px] text-emerald-700 dark:text-green-400 font-bold bg-emerald-50 dark:bg-transparent px-2 py-0.5 rounded-full border border-emerald-200 dark:border-transparent">
              <span className="pulse-dot green" /> LIVE
            </span>
          </div>

          <IntelCard
            severity="CRITICAL"
            title="🚨 Medicine Shipment #104 at Risk"
            time="14:32"
            onAction={openRerouteModal}
            actionLabel="Reroute Now"
          >
            <IntelRow label="Route Risk" value="91%" color="text-red-600 dark:text-red-400" />
            <IntelRow label="Current Stock" value="1.7 days" />
            <IntelRow label="Predicted Delay" value="+11 hours" color="text-orange-600 dark:text-orange-400" />
            <IntelRow label="Last Safe Action" value="Before 4:30 PM" color="text-yellow-700 dark:text-yellow-400" />
          </IntelCard>

          <IntelCard
            severity="HIGH"
            title="⚠️ District X — Isolation Risk 87%"
            time="14:28"
            onAction={() => setView('districts')}
            actionLabel="View District"
          >
            <IntelRow label="Connectivity" value="72%" color="text-orange-600 dark:text-orange-400" />
            <IntelRow label="Alt. Routes" value="2 available" />
            <IntelRow label="Supply Coverage" value="2.8 days" />
          </IntelCard>

          <IntelCard
            severity="HIGH"
            title="🛣️ Road A — 91% Disruption Probability"
            time="14:19"
            onAction={() => setView('roads')}
            actionLabel="Road Details"
          >
            <IntelRow label="Rainfall" value="87mm forecast" />
            <IntelRow label="Terrain Slope" value="32°" color="text-orange-600 dark:text-orange-400" />
            <IntelRow label="Confidence" value="89%" color="text-emerald-700 dark:text-green-400" />
          </IntelCard>

          <CascadeChain />
        </div>
      </div>

      {/* Stats Strip */}
      <StatsStrip />

    </div>
  );
}
