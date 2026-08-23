import { useState, useEffect } from 'react';
import {
  Truck, Navigation, AlertTriangle, ShieldCheck, CheckCircle2,
  Phone, ArrowRight, CornerUpRight, RotateCcw, CloudRain,
  MapPin, Radio, Compass, WifiOff, Wifi, Clock, ShieldAlert,
  HelpCircle, Coffee, Check, Volume2, VolumeX, RefreshCw
} from 'lucide-react';
import clsx from 'clsx';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAppStore } from '../../store/useAppStore';
import {
  vehicles, shipments, safeLaybys, driverWaypoints,
  routeAPPath, routeBPath
} from '../../data/mockData';

// Custom icons for Driver Navigation
const driverTruckIcon = L.divIcon({
  className: 'driver-truck-pin',
  html: `<div style="background: linear-gradient(135deg, #10b981, #059669); color: white; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 0 5px rgba(16, 185, 129, 0.4), 0 6px 14px rgba(0,0,0,0.35); border: 2px solid white;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg></div>`,
  iconSize: [38, 38],
  iconAnchor: [19, 19],
});

const laybyIcon = L.divIcon({
  className: 'driver-layby-pin',
  html: `<div style="background: #3b82f6; color: white; width: 26px; height: 26px; border-radius: 8px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.3); border: 2px solid white;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg></div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 13],
});

const dangerIcon = L.divIcon({
  className: 'driver-danger-pin',
  html: `<div style="background: #ef4444; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.4); animation: pulse 1s infinite;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

export default function DriverApp() {
  const {
    isDriverRerouted,
    acceptDriverReroute,
    driverTripStatus,
    setDriverTripStatus,
    isOffline,
    toggleOffline,
    offlineQueue,
    addOfflineAction,
    syncOfflineQueue,
    logout,
    language,
    setLanguage
  } = useAppStore();

  const [activeDriverTab, setActiveDriverTab] = useState<'nav' | 'reroute' | 'checkpoints' | 'laybys'>('nav');
  const [showRerouteAlertModal, setShowRerouteAlertModal] = useState(!isDriverRerouted);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [deliveryConfirmed, setDeliveryConfirmed] = useState(driverTripStatus === 'DELIVERED');
  const [speed, setSpeed] = useState(44);

  const vehicle = vehicles[0]; // TRK-204
  const shipment = shipments[0]; // SHIP-104

  // Simulate speed oscillations slightly for realistic live dashboard
  useEffect(() => {
    const interval = setInterval(() => {
      setSpeed((prev) => Math.min(52, Math.max(38, prev + (Math.floor(Math.random() * 5) - 2))));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleAcceptReroute = () => {
    acceptDriverReroute();
    setShowRerouteAlertModal(false);
    setActiveDriverTab('nav');
    if (isOffline) {
      addOfflineAction('Driver accepted NH-106 Reroute (Pending Cellular Sync)');
    }
  };

  const handleConfirmDelivery = () => {
    setDeliveryConfirmed(true);
    setDriverTripStatus('DELIVERED');
    if (isOffline) {
      addOfflineAction('Delivery Handover Completed at District X Hospital');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[var(--bg-base)] text-[var(--text-primary)] min-h-0 overflow-y-auto select-none">

      {/* ── DRIVER TOP TELEMETRY STATUS BAR ── */}
      <header className="sticky top-0 z-30 bg-slate-950 text-white border-b border-slate-800 px-4 py-3 shrink-0 shadow-lg">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-500/20">
              <Truck size={18} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black tracking-tight">{vehicle.id}</span>
                <span className="text-[10px] font-mono text-slate-400 font-bold">{vehicle.plateNo}</span>
              </div>
              <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                {vehicle.driverName} • Active Trip
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Offline Mode Toggle Button */}
            <button
              onClick={toggleOffline}
              className={clsx(
                'flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer',
                isOffline
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              )}
              title="Toggle Simulated Network / Mountain Gap"
            >
              {isOffline ? <WifiOff size={12} /> : <Wifi size={12} />}
              <span>{isOffline ? 'OFFLINE QUEUE' : 'ONLINE 5G'}</span>
            </button>

            <button
              onClick={logout}
              className="text-[11px] font-bold text-slate-400 hover:text-white px-2 py-1 rounded-lg bg-white/5 border border-white/10 cursor-pointer"
            >
              Exit
            </button>
          </div>
        </div>

        {/* Offline Queue Badge Notice */}
        {isOffline && offlineQueue.length > 0 && (
          <div className="mt-2 py-1 px-2 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-between text-[10px] text-amber-300">
            <span>{offlineQueue.length} telemetry action(s) stored locally</span>
            <button onClick={syncOfflineQueue} className="font-bold underline cursor-pointer">
              Sync Now
            </button>
          </div>
        )}
      </header>

      {/* ── HIGH PRIORITY HAZARD ALERT POPUP BANNER (WHEN NOT REROUTED) ── */}
      {!isDriverRerouted && showRerouteAlertModal && (
        <aside aria-label="Route risk alert" className="m-3 p-4 rounded-2xl bg-gradient-to-br from-red-600 to-red-700 text-white shadow-2xl border-2 border-red-400 animate-fade-up relative z-20">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-white/20">
                <AlertTriangle size={18} className="text-amber-200 animate-bounce" />
              </span>
              <div>
                <span className="text-[10px] font-black tracking-wider uppercase bg-white/20 px-2 py-0.5 rounded text-amber-200">
                  CRITICAL ROUTE ALERT
                </span>
                <h2 className="text-sm font-black text-white mt-0.5">HIGH LANDSLIDE DISRUPTION (91%)</h2>
              </div>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="text-white/80 hover:text-white p-1"
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
          </div>

          <p className="text-xs text-red-100 leading-relaxed mb-3">
            Heavy rainfall (87mm) + slope destabilization detected on <strong>NH-27 near Umtru Gorge</strong>.
            PurvaSaarthi recommends an immediate detour via <strong>NH-106 East Bypass</strong> before the 4:30 PM cutoff.
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs mb-3 bg-black/20 p-2.5 rounded-xl">
            <div>
              <span className="text-[10px] text-red-200 block">CURRENT NH-27</span>
              <strong className="text-white">91% Risk • Delay +11h</strong>
            </div>
            <div>
              <span className="text-[10px] text-emerald-200 block">AI DETOUR (NH-106)</span>
              <strong className="text-emerald-300">24% Risk • ETA 6:15 PM</strong>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAcceptReroute}
              className="flex-1 py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-red-700 font-black text-xs shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-transform cursor-pointer"
            >
              <Check size={16} className="text-emerald-600 stroke-[3]" />
              <span>ACCEPT ROUTE B DETOUR</span>
            </button>
            <button
              onClick={() => setShowRerouteAlertModal(false)}
              className="px-3 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs cursor-pointer"
            >
              Later
            </button>
          </div>
        </aside>
      )}

      {/* ── TAB CONTENT ── */}
      {activeDriverTab === 'nav' && (
        <div className="p-3.5 space-y-3.5 pb-20">

          {/* 1. TURN-BY-TURN INSTRUCTION CARD (HUD) */}
          <section className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-500/30">
                <CornerUpRight size={26} className="stroke-[2.5]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs font-mono font-semibold text-emerald-400">
                  <span>IN 3.2 KM</span>
                  <span>•</span>
                  <span>SPEED LIMIT {vehicle.speedLimit} KM/H</span>
                </div>
                <h1 className="text-sm sm:text-base font-black text-white leading-snug mt-0.5">
                  {isDriverRerouted
                    ? 'Follow NH-106 East Bypass towards Ri-Bhoi Corridor'
                    : 'Turn Left onto NH-106 Bypass (Safe Landslide Detour)'}
                </h1>
                <p className="text-[11px] text-slate-400 mt-1">
                  Destination: {shipment.destinationFacility}
                </p>
              </div>
            </div>

            {/* Live Telemetry Gauges */}
            <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-white/10 text-center">
              <div className="bg-white/5 p-2 rounded-xl">
                <div className="text-[9px] text-slate-400 font-semibold">SPEED</div>
                <div className="text-base font-black text-white font-mono">{speed}</div>
                <div className="text-[8px] text-slate-400">km/h</div>
              </div>
              <div className="bg-white/5 p-2 rounded-xl">
                <div className="text-[9px] text-slate-400 font-semibold">ELEVATION</div>
                <div className="text-base font-black text-white font-mono">{vehicle.currentElevation}</div>
                <div className="text-[8px] text-slate-400">meters</div>
              </div>
              <div className="bg-white/5 p-2 rounded-xl">
                <div className="text-[9px] text-slate-400 font-semibold">GRADIENT</div>
                <div className="text-base font-black text-orange-400 font-mono">{vehicle.slopeGradient}°</div>
                <div className="text-[8px] text-slate-400">slope</div>
              </div>
              <div className="bg-white/5 p-2 rounded-xl">
                <div className="text-[9px] text-slate-400 font-semibold">ROUTE RISK</div>
                <div className={clsx('text-base font-black font-mono', isDriverRerouted ? 'text-emerald-400' : 'text-red-400')}>
                  {isDriverRerouted ? '24%' : '91%'}
                </div>
                <div className="text-[8px] text-slate-400">{isDriverRerouted ? 'Low' : 'Critical'}</div>
              </div>
            </div>
          </section>

          {/* 2. LIVE LEAFLET NAVIGATION MAP */}
          <section className="bg-white dark:bg-[#090f1c] rounded-2xl border border-slate-200 dark:border-white/[0.08] overflow-hidden shadow-md">
            <div className="px-3.5 py-2.5 bg-slate-50 dark:bg-white/[0.02] border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                <Compass size={14} className="text-emerald-500" />
                <span>Live Route Navigation View</span>
              </div>
              <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                {isDriverRerouted ? '● ACTIVE ROUTE B' : '● ROUTE A (HAZARD DETECTED)'}
              </span>
            </div>

            <div className="h-64 w-full relative">
              <MapContainer
                center={vehicle.currentLocation}
                zoom={10}
                scrollWheelZoom={false}
                style={{ width: '100%', height: '100%' }}
                className="z-10"
              >
                <TileLayer
                  attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />

                {/* Route lines */}
                <Polyline
                  positions={routeAPPath}
                  color={isDriverRerouted ? '#94a3b8' : '#ef4444'}
                  weight={isDriverRerouted ? 3 : 5}
                  dashArray={isDriverRerouted ? '5, 5' : undefined}
                />

                <Polyline
                  positions={routeBPath}
                  color={isDriverRerouted ? '#10b981' : '#3b82f6'}
                  weight={isDriverRerouted ? 6 : 4}
                />

                {/* Driver Truck Pin */}
                <Marker position={vehicle.currentLocation} icon={driverTruckIcon}>
                  <Popup>
                    <div className="text-xs font-bold">
                      TRK-204 (You)<br />Speed: {speed} km/h
                    </div>
                  </Popup>
                </Marker>

                {/* Danger Zone Marker */}
                <Marker position={[25.85, 91.88]} icon={dangerIcon}>
                  <Popup>
                    <div className="text-xs text-red-600 font-bold">
                      Landslide Danger Sector (Avoided on Detour)
                    </div>
                  </Popup>
                </Marker>

                {/* Safe Laybys Markers */}
                {safeLaybys.map((l) => (
                  <Marker key={l.id} position={l.latlng} icon={laybyIcon}>
                    <Popup>
                      <div className="text-xs font-semibold">
                        <strong>{l.name}</strong><br />
                        Capacity: {l.capacityTrucks} Trucks<br />
                        Amenities: {l.amenities.join(', ')}
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>

              {/* Floating Reroute Trigger button on map */}
              {!isDriverRerouted && (
                <button
                  onClick={() => setShowRerouteAlertModal(true)}
                  className="absolute bottom-3 left-3 right-3 z-[400] py-2.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <AlertTriangle size={15} />
                  <span>Review AI Reroute Recommendation</span>
                </button>
              )}
            </div>
          </section>

          {/* 3. TRIP SHIPMENT & CARGO STATUS */}
          <section className="bg-white dark:bg-[#090f1c] rounded-2xl p-4 border border-slate-200 dark:border-white/[0.08] shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white">Active Cargo Manifest</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300">
                CRITICAL LIFE-SAVING
              </span>
            </div>

            <div className="text-xs text-slate-700 dark:text-slate-300 font-semibold mb-1">
              {shipment.commodityLabel}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
              Shipment #{shipment.id} • Consignee: {shipment.consigneeName} ({shipment.consigneePhone})
            </p>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.06] text-xs">
              <div>
                <div className="text-[10px] text-slate-400 font-semibold">EXPECTED ETA</div>
                <div className="text-sm font-black text-slate-900 dark:text-white">{shipment.expectedDeliveryTime}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-400 font-semibold">COLD CHAIN STATUS</div>
                <div className="text-xs font-bold text-blue-600 dark:text-blue-400">❄️ 3.4°C SECURE</div>
              </div>
            </div>
          </section>

          {/* 4. TRIP ACTION: DELIVERY COMPLETION */}
          <section className="bg-white dark:bg-[#090f1c] rounded-2xl p-4 border border-slate-200 dark:border-white/[0.08] shadow-xs text-center">
            {deliveryConfirmed ? (
              <div className="py-3 text-emerald-600 dark:text-emerald-400 font-bold text-sm flex flex-col items-center gap-1.5">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle2 size={24} />
                </div>
                <span>Delivery Handover Verified at Hospital</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">
                  District stock updated from 1.7 to 3.8 days. Alert resolved.
                </p>
              </div>
            ) : (
              <button
                onClick={handleConfirmDelivery}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <CheckCircle2 size={16} />
                <span>Mark Arrived & Handover Delivery at Hospital</span>
              </button>
            )}
          </section>

        </div>
      )}

      {/* ── REROUTE DETAILS TAB ── */}
      {activeDriverTab === 'reroute' && (
        <div className="p-4 space-y-4 pb-20">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">AI Dynamic Reroute Comparison</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Real-time pgRouting single point of failure calculation</p>
          </div>

          {/* Current vs Alternative Route Cards */}
          <div className="space-y-3">

            {/* Route A Card */}
            <div className={clsx(
              'p-4 rounded-2xl border transition-all',
              !isDriverRerouted
                ? 'bg-red-50/70 dark:bg-red-500/10 border-red-300 dark:border-red-500/30'
                : 'bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.06] opacity-75'
            )}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Original Corridor: NH-27 (Road A)</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400">
                  91% DISRUPTION RISK
                </span>
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                <div>• Active heavy rainfall (87mm) & mudslide warnings at Umtru Sector</div>
                <div>• Single Point of Failure (SPOF): High risk of bridge approach submergence</div>
                <div>• Predicted Delay if stranded: <strong>+11 hours</strong></div>
              </div>
            </div>

            {/* Route B Card */}
            <div className={clsx(
              'p-4 rounded-2xl border transition-all',
              isDriverRerouted
                ? 'bg-emerald-50/70 dark:bg-emerald-500/10 border-emerald-400 dark:border-emerald-500/40 shadow-xs'
                : 'bg-white dark:bg-[#090f1c] border-emerald-300 dark:border-emerald-500/30'
            )}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Recommended AI Detour: NH-106 East Bypass</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
                  24% LOW RISK (SAFE)
                </span>
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                <div>• Avoids vulnerable Umtru river gorge and low-lying bridge B-17</div>
                <div>• Lower slope gradient (14°) and reinforced asphalt pavement</div>
                <div>• Estimated Arrival Time: <strong>6:15 PM (+2h 05m detour vs 11h cutoff)</strong></div>
              </div>

              {!isDriverRerouted && (
                <button
                  onClick={handleAcceptReroute}
                  className="w-full mt-3 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check size={16} />
                  <span>Accept and Switch Navigation to Route B</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ── CHECKPOINTS TAB ── */}
      {activeDriverTab === 'checkpoints' && (
        <div className="p-4 space-y-3 pb-20">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Trip Checkpoints & Geofences</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Real-time driver transit progression log</p>
          </div>

          <div className="space-y-3">
            {driverWaypoints.map((wp, idx) => (
              <div
                key={wp.id}
                className="p-3.5 rounded-xl bg-white dark:bg-[#090f1c] border border-slate-200 dark:border-white/[0.08] shadow-xs flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{wp.roadName}</span>
                    <span className="text-[10px] font-mono text-slate-400">{wp.distanceRemaining}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">{wp.instruction}</p>
                  {wp.hazard && (
                    <div className="text-[10px] font-bold text-red-600 dark:text-red-400 mt-1">
                      ⚠️ {wp.hazard}
                    </div>
                  )}
                  {wp.isReroutedSegment && (
                    <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                      ✓ AI Verified Safe Detour Segment
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SAFE LAYBYS TAB ── */}
      {activeDriverTab === 'laybys' && (
        <div className="p-4 space-y-3 pb-20">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Safe Laybys & Emergency Shelters</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Designated disaster-time freight staging locations on this route</p>
          </div>

          <div className="space-y-3">
            {safeLaybys.map((layby) => (
              <div
                key={layby.id}
                className="p-4 rounded-2xl bg-white dark:bg-[#090f1c] border border-slate-200 dark:border-white/[0.08] shadow-sm"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{layby.name}</h4>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      Distance: {layby.distanceKm} km ahead • Capacity: {layby.capacityTrucks} heavy trucks
                    </span>
                  </div>
                  <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <Coffee size={16} />
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-2">
                  {layby.amenities.map((am) => (
                    <span
                      key={am}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/[0.05] text-slate-700 dark:text-slate-300 font-medium"
                    >
                      {am}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── DRIVER BOTTOM NAVIGATION BAR ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 px-3 py-2 flex items-center justify-around select-none text-white">
        {[
          { id: 'nav', label: 'Navigation', icon: <Navigation size={18} /> },
          { id: 'reroute', label: 'AI Reroute', icon: <RotateCcw size={18} /> },
          { id: 'checkpoints', label: 'Checkpoints', icon: <MapPin size={18} /> },
          { id: 'laybys', label: 'Safe Shelters', icon: <Coffee size={18} /> },
        ].map((tab) => {
          const isActive = activeDriverTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveDriverTab(tab.id as any)}
              className={clsx(
                'flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer',
                isActive
                  ? 'text-emerald-400 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200'
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
