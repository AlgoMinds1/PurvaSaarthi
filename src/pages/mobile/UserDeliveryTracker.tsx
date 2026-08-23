import { useState } from 'react';
import {
  Package, Truck, MapPin, Clock, Calendar, AlertTriangle, ShieldCheck,
  Phone, MessageSquare, ChevronRight, CheckCircle2, ArrowRight,
  RefreshCw, Layers, ShieldAlert, Sparkles, User, ExternalLink,
  Search, Info, AlertOctagon, Share2
} from 'lucide-react';
import clsx from 'clsx';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAppStore } from '../../store/useAppStore';
import { shipments, vehicles, roads, routeAPPath, routeBPath } from '../../data/mockData';
import type { Shipment, Vehicle } from '../../types';

// Leaflet custom icons for mobile map
const truckIcon = L.divIcon({
  className: 'custom-truck-pin',
  html: `<div style="background: linear-gradient(135deg, #f97316, #ef4444); color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.35), 0 4px 10px rgba(0,0,0,0.3);"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg></div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

const originIcon = L.divIcon({
  className: 'custom-origin-pin',
  html: `<div style="background: #3b82f6; color: white; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.25); border: 2px solid white;"><span style="font-size: 11px; font-weight: bold;">A</span></div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 13],
});

const destIcon = L.divIcon({
  className: 'custom-dest-pin',
  html: `<div style="background: #10b981; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.25); border: 2px solid white;"><span style="font-size: 12px; font-weight: bold;">B</span></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const hazardIcon = L.divIcon({
  className: 'custom-hazard-pin',
  html: `<div style="background: #ef4444; color: white; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.4); animation: pulse 1.5s infinite;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg></div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 13],
});

export default function UserDeliveryTracker() {
  const {
    selectedShipmentId,
    setSelectedShipmentId,
    isDriverRerouted,
    userRole,
    logout,
    trackVehicleOnMap,
    language,
    setLanguage
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'track' | 'shipments' | 'hazards' | 'support'>('track');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [mapExpanded, setMapExpanded] = useState(false);

  // Find active shipment
  const currentShipment: Shipment =
    shipments.find((s) => s.id === selectedShipmentId) || shipments[0];

  // Find linked vehicle
  const currentVehicle: Vehicle | undefined = vehicles.find(
    (v) => v.id === currentShipment.vehicleId
  );

  const isRerouted = isDriverRerouted || currentShipment.id === 'SHIP-104';

  const handleCopyLink = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col bg-[var(--bg-base)] text-[var(--text-primary)] min-h-0 overflow-y-auto">
      
      {/* ── TOP PWA APP BAR ── */}
      <header className="sticky top-0 z-20 bg-white/90 dark:bg-[#090f1c]/90 backdrop-blur-md border-b border-slate-200 dark:border-white/[0.08] px-4 py-3 shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <Package size={18} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black tracking-tight text-slate-900 dark:text-white">PurvaSaarthi</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                  Consignee PWA
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate max-w-[170px]">
                {currentShipment.destinationFacility}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="text-[10px] font-semibold bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.1] rounded-lg px-2 py-1 text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
            >
              <option value="en">EN</option>
              <option value="hi">हिन्दी</option>
              <option value="as">অসমীয়া</option>
              <option value="bn">বাংলা</option>
            </select>

            <button
              onClick={logout}
              className="text-[11px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 px-2 py-1 rounded-lg bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.1] cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Shipment Quick Selector Pills */}
        <div className="flex items-center gap-1.5 mt-3 overflow-x-auto no-scrollbar pb-0.5">
          {shipments.map((s) => {
            const isSelected = s.id === currentShipment.id;
            return (
              <button
                key={s.id}
                onClick={() => setSelectedShipmentId(s.id)}
                className={clsx(
                  'px-2.5 py-1.2 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer flex items-center gap-1.5 border',
                  isSelected
                    ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                    : 'bg-slate-100 text-slate-600 border-slate-200/80 dark:bg-white/[0.04] dark:text-slate-300 dark:border-white/[0.08] hover:bg-slate-200'
                )}
              >
                <span>{s.id}</span>
                <span className="text-[9px] opacity-80 uppercase">({s.commodity})</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* ── CONTENT SWITCHER BASED ON TAB ── */}
      {activeTab === 'track' && (
        <div className="p-4 space-y-4 pb-20">

          {/* 1. HERO DISPATCH & ARRIVAL CARD */}
          <section className="rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800 shadow-xl relative overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-start justify-between gap-3 mb-3 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 uppercase">
                    Waybill #{currentShipment.trackingNumber}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE TAKEN OFF
                  </span>
                </div>
                <h1 className="text-base sm:text-lg font-black text-white leading-snug">
                  {currentShipment.commodityLabel}
                </h1>
              </div>

              <div className="text-right shrink-0">
                <span className="inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-red-500 text-white shadow-xs">
                  PRIORITY {currentShipment.priority}/100
                </span>
                <div className="text-[10px] text-slate-400 mt-1 font-mono">Stock: {currentShipment.stockDaysRemaining} Days</div>
              </div>
            </div>

            {/* Taken Off vs Predicted Arrival Times */}
            <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-white/[0.06] border border-white/[0.08] backdrop-blur-md mb-3 relative z-10">
              <div>
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-semibold mb-0.5">
                  <Calendar size={12} className="text-blue-400" />
                  <span>TAKEN OFF (DISPATCH)</span>
                </div>
                <div className="text-sm font-black text-white">{currentShipment.dispatchedTime}</div>
                <div className="text-[10px] text-slate-400 font-medium">{currentShipment.dispatchedDate}</div>
                <div className="text-[9px] text-slate-400 truncate mt-0.5">From: {currentShipment.origin}</div>
              </div>

              <div className="border-l border-white/10 pl-3">
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-semibold mb-0.5">
                  <Clock size={12} className="text-emerald-400" />
                  <span>EXPECTED ARRIVAL</span>
                </div>
                <div className="text-sm font-black text-emerald-400">{currentShipment.expectedDeliveryTime}</div>
                <div className="text-[10px] text-slate-400 font-medium">{currentShipment.expectedDeliveryDate}</div>
                <div className="text-[9px] text-orange-400 font-bold mt-0.5">
                  Delay: +{currentShipment.predictedDelay > 0 ? `${currentShipment.predictedDelay}h` : 'On Schedule'}
                </div>
              </div>
            </div>

            {/* Active Hazard & Proactive Reroute Notice */}
            {currentShipment.routeRisk > 60 && (
              <div className="p-2.5 rounded-xl bg-orange-500/15 border border-orange-500/30 text-xs text-orange-200 flex items-start gap-2.5 relative z-10">
                <ShieldAlert size={16} className="text-orange-400 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-orange-300 text-[11px]">
                    Proactive Mountain Detour Active
                  </div>
                  <p className="text-[10px] text-orange-200/90 leading-tight mt-0.5">
                    PurvaSaarthi rerouted this truck to bypass Umtru Viaduct landslide risk ({currentShipment.routeRisk}% risk). Cargo secured.
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* 2. LIVE INTERACTIVE ROAD MAP VIEW */}
          <section className="bg-white dark:bg-[#090f1c] rounded-2xl border border-slate-200 dark:border-white/[0.08] overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between bg-slate-50 dark:bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <MapPin size={15} className="text-orange-500" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">Live Highway Corridor Tracking</span>
              </div>
              <button
                onClick={() => setMapExpanded(!mapExpanded)}
                className="text-[11px] font-semibold text-orange-600 dark:text-orange-400 flex items-center gap-1 cursor-pointer"
              >
                <span>{mapExpanded ? 'Compact' : 'Expand View'}</span>
                <ChevronRight size={12} className={mapExpanded ? '-rotate-90 transition-transform' : 'rotate-90 transition-transform'} />
              </button>
            </div>

            {/* Embedded Map Container */}
            <div className={clsx('w-full relative transition-all duration-300', mapExpanded ? 'h-80' : 'h-52')}>
              <MapContainer
                center={currentVehicle?.currentLocation || [25.96, 91.88]}
                zoom={9}
                scrollWheelZoom={false}
                style={{ width: '100%', height: '100%' }}
                className="z-10"
              >
                <TileLayer
                  attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />

                {/* Planned Highway Route A (Red if high risk) */}
                <Polyline
                  positions={routeAPPath}
                  color="#ef4444"
                  weight={4}
                  dashArray="6, 6"
                  opacity={0.8}
                />

                {/* Safe Detour Route B (Green) */}
                <Polyline
                  positions={routeBPath}
                  color="#10b981"
                  weight={5}
                  opacity={0.9}
                />

                {/* Origin Marker */}
                <Marker position={[26.14, 91.74]} icon={originIcon}>
                  <Popup>
                    <div className="text-xs font-semibold">
                      <strong>Origin Hub:</strong> Guwahati Central Depot
                    </div>
                  </Popup>
                </Marker>

                {/* Destination Marker */}
                <Marker position={[25.57, 91.88]} icon={destIcon}>
                  <Popup>
                    <div className="text-xs font-semibold">
                      <strong>Destination:</strong> {currentShipment.destinationFacility}
                    </div>
                  </Popup>
                </Marker>

                {/* Landslide Hazard Point */}
                <Marker position={[25.85, 91.88]} icon={hazardIcon}>
                  <Popup>
                    <div className="text-xs font-semibold text-red-600">
                      <strong>Active Hazard:</strong> Landslide at Umtru Viaduct (91% Disruption Risk)
                    </div>
                  </Popup>
                </Marker>

                {/* Active Truck Marker */}
                {currentVehicle && (
                  <Marker position={currentVehicle.currentLocation} icon={truckIcon}>
                    <Popup>
                      <div className="text-xs">
                        <strong className="text-orange-600">{currentVehicle.id}</strong> — {currentVehicle.driverName}<br />
                        Speed: {currentVehicle.currentSpeed} km/h<br />
                        Status: {currentVehicle.status}
                      </div>
                    </Popup>
                  </Marker>
                )}
              </MapContainer>

              {/* Map Floating Legend */}
              <div className="absolute bottom-2 left-2 right-2 z-[400] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/[0.1] flex items-center justify-between text-[9px] font-semibold text-slate-700 dark:text-slate-300 shadow-md">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-1 bg-emerald-500 rounded-full" /> Safe Detour (NH-106)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-1 bg-red-500 rounded-full border-dashed" /> Blocked/Hazard (NH-27)
                </span>
                <span className="flex items-center gap-1 font-mono text-orange-500">
                  {currentVehicle?.currentSpeed || 44} km/h
                </span>
              </div>
            </div>

            {/* Road Details strip */}
            <div className="p-3 bg-slate-50/70 dark:bg-white/[0.02] border-t border-slate-200 dark:border-white/[0.06] text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Corridor In Transit:</span>
                <span className="font-bold text-slate-900 dark:text-white">{currentShipment.currentRoadName}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500 dark:text-slate-400">Weather & Terrain:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{currentShipment.weatherRiskSummary}</span>
              </div>
            </div>
          </section>

          {/* 3. STEP-BY-STEP DELIVERY MILESTONES PROGRESSION */}
          <section className="bg-white dark:bg-[#090f1c] rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-white/[0.08] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <RefreshCw size={14} className="text-orange-500 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Delivery Milestone Progression</span>
              </h2>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">
                Step 4 of 6 Active
              </span>
            </div>

            {/* Stepper Timeline */}
            <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-white/[0.08]">
              {currentShipment.milestones.map((m, idx) => {
                const isCompleted = m.status === 'completed';
                const isCurrent = m.status === 'current';

                return (
                  <div key={m.id} className="relative flex items-start gap-3.5 pl-1 group">
                    {/* Step Icon */}
                    <div className={clsx(
                      'w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 transition-all text-xs font-bold shadow-xs',
                      isCompleted
                        ? 'bg-emerald-500 text-white'
                        : isCurrent
                        ? 'bg-orange-500 text-white ring-4 ring-orange-500/25'
                        : 'bg-slate-200 dark:bg-white/[0.08] text-slate-500 dark:text-slate-400'
                    )}>
                      {isCompleted ? <CheckCircle2 size={14} /> : idx + 1}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 min-w-0 pb-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className={clsx(
                          'text-xs font-bold leading-tight',
                          isCurrent ? 'text-orange-600 dark:text-orange-400' : 'text-slate-900 dark:text-white'
                        )}>
                          {m.title}
                        </h4>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0 font-medium">
                          {m.timestamp}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                        {m.description}
                      </p>

                      {m.location && (
                        <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                          <MapPin size={10} className="text-slate-400" />
                          <span>{m.location}</span>
                        </div>
                      )}

                      {m.note && (
                        <div className="mt-1.5 p-2 rounded-lg bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 text-[10px] text-orange-800 dark:text-orange-300">
                          {m.note}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 4. ASSIGNED DRIVER & TELEMETRY CARD */}
          {currentVehicle && (
            <section className="bg-white dark:bg-[#090f1c] rounded-2xl p-4 border border-slate-200 dark:border-white/[0.08] shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Assigned Lifeline Transport</span>
                <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  {currentVehicle.lastPingAt}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.06] mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                    {currentVehicle.driverName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">{currentVehicle.driverName}</h3>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-medium">
                      Truck {currentVehicle.id} • {currentVehicle.plateNo}
                    </div>
                    <div className="text-[10px] text-slate-600 dark:text-slate-300 font-medium">
                      Speed: <span className="font-bold text-slate-900 dark:text-white">{currentVehicle.currentSpeed} km/h</span> (Elev. {currentVehicle.currentElevation}m)
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <a
                    href={`tel:${currentVehicle.driverPhone || '+919845211094'}`}
                    className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm transition-all cursor-pointer"
                    title="Call Driver"
                  >
                    <Phone size={15} />
                  </a>
                  <button
                    onClick={handleCopyLink}
                    className="p-2 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 text-slate-700 dark:text-white transition-all cursor-pointer"
                    title="Share Live Tracking"
                  >
                    <Share2 size={15} />
                  </button>
                </div>
              </div>

              {isCopied && (
                <div className="text-[10px] text-center font-bold text-emerald-600 dark:text-emerald-400 animate-fade-up">
                  ✓ Real-time tracking link copied to clipboard!
                </div>
              )}
            </section>
          )}

          {/* 5. COMMODITY CARGO MANIFEST */}
          <section className="bg-white dark:bg-[#090f1c] rounded-2xl p-4 border border-slate-200 dark:border-white/[0.08] shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Package size={14} className="text-blue-500" />
                <span>Cargo Manifest ({currentShipment.items.length} Essential Items)</span>
              </h3>
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-full">
                Inspected
              </span>
            </div>

            <div className="space-y-2">
              {currentShipment.items.map((it) => (
                <div
                  key={it.id}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.06] flex items-center justify-between gap-2"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">{it.name}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Batch #{it.batchNumber} • {it.category}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-mono font-black text-slate-900 dark:text-white">{it.quantity}</div>
                    {it.tempControlled && (
                      <span className="text-[9px] font-bold text-blue-600 dark:text-blue-300">
                        ❄️ {it.tempRange}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 6. CONSIGNEE RECIPIENT INFORMATION */}
          <section className="bg-white dark:bg-[#090f1c] rounded-2xl p-4 border border-slate-200 dark:border-white/[0.08] shadow-sm text-xs">
            <div className="flex items-center gap-2 mb-2 font-bold text-slate-900 dark:text-white">
              <User size={14} className="text-orange-500" />
              <span>Consignee & Destination Facility</span>
            </div>
            <div className="text-slate-700 dark:text-slate-300 font-semibold">{currentShipment.consigneeName}</div>
            <div className="text-slate-500 text-[11px]">{currentShipment.consigneeRole}</div>
            <div className="text-slate-500 text-[11px] mt-1 font-mono">{currentShipment.consigneePhone}</div>
          </section>

        </div>
      )}

      {/* ── ALL SHIPMENTS TAB ── */}
      {activeTab === 'shipments' && (
        <div className="p-4 space-y-3 pb-20">
          <div className="mb-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">All Active Consignments</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Select any shipment to track its road corridor</p>
          </div>

          {/* Search bar */}
          <div className="relative mb-3">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Waybill #, Commodity, or City..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white placeholder-slate-400 outline-none"
            />
          </div>

          <div className="space-y-2.5">
            {shipments
              .filter((s) =>
                s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.commodityLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.destinationFacility.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((s) => {
                const isCurrent = s.id === currentShipment.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSelectedShipmentId(s.id);
                      setActiveTab('track');
                    }}
                    className={clsx(
                      'w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3',
                      isCurrent
                        ? 'bg-orange-50/80 dark:bg-orange-500/10 border-orange-400 dark:border-orange-500/30 shadow-xs'
                        : 'bg-white dark:bg-[#090f1c] border-slate-200 dark:border-white/[0.06] hover:border-slate-300'
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400">
                          {s.id}
                        </span>
                        <span className={clsx(
                          'text-[9px] font-bold px-1.5 py-0.2 rounded',
                          s.status === 'ON_TIME' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300' :
                          s.status === 'AT_RISK' ? 'bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-300' :
                          'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300'
                        )}>
                          {s.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{s.commodityLabel}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        → {s.destinationFacility}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 font-mono">
                        ETA: <strong className="text-slate-700 dark:text-slate-200">{s.expectedDeliveryTime}</strong> ({s.expectedDeliveryDate})
                      </div>
                    </div>

                    <ChevronRight size={16} className="text-slate-400 shrink-0" />
                  </button>
                );
              })}
          </div>
        </div>
      )}

      {/* ── HAZARDS TAB ── */}
      {activeTab === 'hazards' && (
        <div className="p-4 space-y-3 pb-20">
          <div className="mb-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Active Corridor Hazards</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Live terrain, landslide and weather advisories across NER</p>
          </div>

          <div className="space-y-3">
            {roads.map((r) => (
              <div
                key={r.id}
                className="p-3.5 rounded-xl bg-white dark:bg-[#090f1c] border border-slate-200 dark:border-white/[0.08] shadow-xs"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{r.name}</span>
                  <span className={clsx(
                    'text-[10px] font-bold px-2 py-0.5 rounded-full',
                    r.status === 'BLOCKED' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' :
                    r.status === 'HIGH_RISK' ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400' :
                    r.status === 'DEGRADED' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                    'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                  )}>
                    {r.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-400 my-2">
                  <div>Disruption Risk: <strong className="text-slate-900 dark:text-white">{r.disruptionProbability}%</strong></div>
                  <div>Rainfall: <strong className="text-slate-900 dark:text-white">{r.rainfallForecast}mm</strong></div>
                  <div>Slope: <strong className="text-slate-900 dark:text-white">{r.terrainSlope}°</strong></div>
                  <div>Confidence: <strong className="text-slate-900 dark:text-white">{r.confidence}%</strong></div>
                </div>

                <div className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-white/[0.03] p-2 rounded-lg">
                  {r.reasons[0]}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SUPPORT & EMERGENCY TAB ── */}
      {activeTab === 'support' && (
        <div className="p-4 space-y-4 pb-20 text-xs">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Emergency Logistics Support</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">PurvaSaarthi North East 24x7 Lifeline Desk</p>
          </div>

          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 space-y-2">
            <div className="flex items-center gap-2 font-bold text-red-700 dark:text-red-400">
              <AlertOctagon size={16} />
              <span>National Disaster / Isolation SOS</span>
            </div>
            <p className="text-[11px] text-red-900/80 dark:text-red-200/90 leading-relaxed">
              If your facility is facing critical stock-out (&lt;24 hours) or lifeline highway cut-off, trigger emergency escalation.
            </p>
            <button className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer">
              Call State Emergency Operations (SEOC)
            </button>
          </div>

          <div className="bg-white dark:bg-[#090f1c] p-4 rounded-2xl border border-slate-200 dark:border-white/[0.08] space-y-3">
            <div className="font-bold text-slate-900 dark:text-white">Key Helpdesks</div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-white/5">
              <span>NER Lifeline Logistics Control</span>
              <span className="font-mono font-bold text-orange-600 dark:text-orange-400">1800-345-9090</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-white/5">
              <span>Directorate of Health Services (DHS)</span>
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400">+91 361 226 0033</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span>National Highway Helpline</span>
              <span className="font-mono font-bold text-slate-700 dark:text-slate-300">1033</span>
            </div>
          </div>
        </div>
      )}

      {/* ── MOBILE BOTTOM NAVIGATION BAR ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-[#090f1c]/95 backdrop-blur-lg border-t border-slate-200 dark:border-white/[0.08] px-3 py-2 flex items-center justify-around select-none">
        {[
          { id: 'track', label: 'Track Delivery', icon: <Package size={18} /> },
          { id: 'shipments', label: 'All Orders', icon: <Layers size={18} /> },
          { id: 'hazards', label: 'Road Hazards', icon: <AlertTriangle size={18} /> },
          { id: 'support', label: 'Emergency Desk', icon: <Phone size={18} /> },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={clsx(
                'flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer',
                isActive
                  ? 'text-orange-600 dark:text-orange-400 font-bold scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              )}
            >
              {tab.icon}
              <span className="text-[10px] tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </nav>

    </div>
  );
}
