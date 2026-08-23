import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import clsx from 'clsx';
import { Route, Landmark, Building2, Truck, AlertTriangle, CloudRain, Check } from 'lucide-react';
import { roads, bridges, vehicles, districts } from '../data/mockData';
import { statusColor } from '../lib/utils';

type LayerKey = 'roads' | 'bridges' | 'districts' | 'vehicles' | 'incidents' | 'weather';

export default function LiveMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const layerGroups = useRef<Record<LayerKey, L.LayerGroup>>({} as Record<LayerKey, L.LayerGroup>);
  const vehicleMarkers = useRef<Record<string, L.Marker>>({});

  const [layers, setLayers] = useState<Record<LayerKey, boolean>>({
    roads: true, bridges: true, districts: true,
    vehicles: true, incidents: true, weather: false,
  });

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [26.1, 92.5],
      zoom: 7,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);

    // ── ROADS LAYER ──
    const roadsGroup = L.layerGroup().addTo(map);
    roads.forEach((r) => {
      L.polyline(r.latlngs, {
        color: statusColor(r.status),
        weight: r.status === 'BLOCKED' ? 5 : r.status === 'HIGH_RISK' ? 4 : 3,
        opacity: 0.9,
        dashArray: r.status === 'UNKNOWN' ? '8,5' : r.status === 'DEGRADED' ? '12,4' : undefined,
      }).bindPopup(
        `<div style="min-width:220px">
          <div style="font-weight:700;font-size:13px;margin-bottom:8px">${r.name}</div>
          <div style="display:grid;gap:4px;font-size:12px">
            <div style="display:flex;justify-content:space-between">
              <span style="opacity:0.7">Status</span>
              <span style="font-weight:600;color:${statusColor(r.status)}">${r.status.replace('_',' ')}</span>
            </div>
            <div style="display:flex;justify-content:space-between">
              <span style="opacity:0.7">Risk Score</span>
              <span style="font-weight:600;color:#f97316">${r.riskScore}%</span>
            </div>
            <div style="display:flex;justify-content:space-between">
              <span style="opacity:0.7">Confidence</span>
              <span style="color:#22c55e;font-weight:600">${r.confidence}%</span>
            </div>
            <div style="display:flex;justify-content:space-between">
              <span style="opacity:0.7">Rainfall</span>
              <span>${r.rainfallForecast}mm forecast</span>
            </div>
            <div style="display:flex;justify-content:space-between">
              <span style="opacity:0.7">Updated</span>
              <span>${r.lastVerified}</span>
            </div>
            <div style="opacity:0.6;font-size:11px;margin-top:4px;padding-top:4px;border-top:1px solid rgba(128,128,128,0.2)">Source: ${r.source}</div>
          </div>
        </div>`
      ).addTo(roadsGroup);
    });

    // ── BRIDGES LAYER ──
    const bridgesGroup = L.layerGroup().addTo(map);
    bridges.forEach((b) => {
      const bridgeIcon = L.divIcon({
        className: 'truck-icon-custom',
        html: `<div style="width:26px;height:26px;background:#2563eb;border:2px solid white;border-radius:6px;display:flex;align-items:center;justify-content:center;color:white;box-shadow:0 2px 5px rgba(0,0,0,0.35);cursor:pointer" title="${b.name}"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 19V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14"/><path d="M4 15h16"/><path d="M10 3v16"/><path d="M14 3v16"/></svg></div>`,
        iconSize: [26, 26], iconAnchor: [13, 13],
      });
      L.marker(b.latlng, { icon: bridgeIcon })
        .bindPopup(
          `<div style="min-width:200px">
            <div style="font-weight:700;font-size:13px;margin-bottom:6px">${b.name}</div>
            ${b.isSPOF ? '<div style="background:#ef444420;color:#dc2626;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:700;margin-bottom:8px">SINGLE POINT OF FAILURE</div>' : ''}
            <div style="font-size:12px;display:grid;gap:4px">
              <div style="display:flex;justify-content:space-between"><span style="opacity:0.7">Status</span><span style="color:${statusColor(b.status)};font-weight:600">${b.status}</span></div>
              <div style="display:flex;justify-content:space-between"><span style="opacity:0.7">Criticality</span><span style="color:#f97316;font-weight:600">${b.criticalityScore}%</span></div>
              <div style="display:flex;justify-content:space-between"><span style="opacity:0.7">Load Capacity</span><span>${b.loadCapacity}</span></div>
              ${b.isSPOF ? `<div style="color:#dc2626;font-size:11px;margin-top:4px;font-weight:500">Failure affects: ${b.affectedDistricts.join(', ')}</div>` : ''}
            </div>
          </div>`
        ).addTo(bridgesGroup);
    });

    // ── DISTRICTS LAYER ──
    const districtsGroup = L.layerGroup().addTo(map);
    districts.forEach((d) => {
      const riskColor = d.isolationRisk > 80 ? '#ef4444' : d.isolationRisk > 60 ? '#f97316' : d.isolationRisk > 40 ? '#eab308' : '#22c55e';
      const distIcon = L.divIcon({
        className: 'truck-icon-custom',
        html: `<div style="
          background:${riskColor}28;
          border:2px solid ${riskColor};
          border-radius:50%;
          width:48px;height:48px;
          display:flex;align-items:center;justify-content:center;
          font-size:11px;font-weight:800;color:${riskColor};
          backdrop-filter:blur(4px);
          cursor:pointer;
          box-shadow:0 2px 8px rgba(0,0,0,0.15);
        ">${d.isolationRisk}%</div>`,
        iconSize: [48, 48], iconAnchor: [24, 24],
      });
      L.marker(d.latlng, { icon: distIcon })
        .bindPopup(
          `<div style="min-width:210px">
            <div style="font-weight:700;font-size:13px;margin-bottom:8px">${d.name}</div>
            <div style="font-size:12px;display:grid;gap:4px">
              <div style="display:flex;justify-content:space-between"><span style="opacity:0.7">Connectivity</span><span style="font-weight:600">${d.connectivity}%</span></div>
              <div style="display:flex;justify-content:space-between"><span style="opacity:0.7">Isolation Risk</span><span style="font-weight:600;color:${riskColor}">${d.isolationRisk}%</span></div>
              <div style="display:flex;justify-content:space-between"><span style="opacity:0.7">Alt. Routes</span><span>${d.alternativeRoutes}</span></div>
              <div style="display:flex;justify-content:space-between"><span style="opacity:0.7">Supply (days)</span><span>${d.supplyDays}</span></div>
              <div style="display:flex;justify-content:space-between"><span style="opacity:0.7">Weather Risk</span><span style="color:#f97316;font-weight:600">${d.weatherRisk}</span></div>
            </div>
          </div>`
        ).addTo(districtsGroup);
    });

    // ── VEHICLES LAYER ──
    const vehiclesGroup = L.layerGroup().addTo(map);
    vehicles.forEach((v) => {
      const riskC = v.routeRisk > 80 ? '#ef4444' : v.routeRisk > 60 ? '#f97316' : '#22c55e';
      const truckIcon = L.divIcon({
        className: 'truck-icon-custom',
        html: `<div style="position:relative;cursor:pointer">
          <div style="width:28px;height:28px;background:#0284c7;border:2px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;box-shadow:0 2px 6px rgba(0,0,0,0.35)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18.5" r="2.5"/><circle cx="7" cy="18.5" r="2.5"/></svg></div>
          <div style="
            position:absolute;top:-6px;right:-6px;
            background:${riskC};color:white;
            border-radius:50%;width:16px;height:16px;
            font-size:8px;font-weight:800;
            display:flex;align-items:center;justify-content:center;
            border:1.5px solid #ffffff;
            box-shadow:0 1px 3px rgba(0,0,0,0.3);
          ">${Math.round(v.routeRisk)}</div>
        </div>`,
        iconSize: [32, 32], iconAnchor: [16, 16],
      });
      const marker = L.marker(v.currentLocation, { icon: truckIcon })
        .bindPopup(
          `<div style="min-width:210px">
            <div style="font-weight:700;font-size:13px;margin-bottom:8px">Vehicle ${v.id}</div>
            <div style="font-size:12px;display:grid;gap:4px">
              <div style="display:flex;justify-content:space-between"><span style="opacity:0.7">Driver</span><span style="font-weight:500">${v.driverName}</span></div>
              <div style="display:flex;justify-content:space-between"><span style="opacity:0.7">Destination</span><span style="font-weight:500">${v.destination}</span></div>
              <div style="display:flex;justify-content:space-between"><span style="opacity:0.7">Route Risk</span><span style="font-weight:700;color:${riskC}">${v.routeRisk}%</span></div>
              <div style="display:flex;justify-content:space-between"><span style="opacity:0.7">ETA</span><span style="font-weight:500">${v.eta}</span></div>
              <div style="display:flex;justify-content:space-between"><span style="opacity:0.7">Delay</span><span style="color:#f97316;font-weight:600">${v.delayMinutes > 0 ? '+' + v.delayMinutes + ' min' : 'On time'}</span></div>
              <div style="display:flex;justify-content:space-between">
                <span style="opacity:0.7">GPS Status</span>
                <span style="color:${v.telemetryFresh ? '#16a34a' : '#f97316'};font-weight:600">${v.telemetryFresh ? '● Fresh — ' + v.lastPingAt : 'TELEMETRY UNAVAILABLE'}</span>
              </div>
            </div>
          </div>`
        ).addTo(vehiclesGroup);
      vehicleMarkers.current[v.id] = marker;
    });

    // Store layer groups
    layerGroups.current = {
      roads: roadsGroup,
      bridges: bridgesGroup,
      districts: districtsGroup,
      vehicles: vehiclesGroup,
      incidents: L.layerGroup().addTo(map),
      weather: L.layerGroup(),
    };

    mapInstance.current = map;
  }, []);

  const toggleLayer = (layer: LayerKey) => {
    const map = mapInstance.current;
    const group = layerGroups.current[layer];
    if (!map || !group) return;
    if (map.hasLayer(group)) { map.removeLayer(group); }
    else { map.addLayer(group); }
    setLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  const layerDefs: { id: LayerKey; label: string; icon: React.ReactNode }[] = [
    { id: 'roads', label: 'Roads', icon: <Route size={14} className="text-orange-500" /> },
    { id: 'bridges', label: 'Bridges', icon: <Landmark size={14} className="text-blue-500" /> },
    { id: 'districts', label: 'Districts', icon: <Building2 size={14} className="text-purple-500" /> },
    { id: 'vehicles', label: 'Vehicles', icon: <Truck size={14} className="text-sky-500" /> },
    { id: 'incidents', label: 'Incidents', icon: <AlertTriangle size={14} className="text-red-500" /> },
    { id: 'weather', label: 'Weather Risk', icon: <CloudRain size={14} className="text-cyan-500" /> },
  ];

  return (
    <div className="flex h-full min-h-0 transition-colors duration-200">
      {/* Controls */}
      <div className="w-52 shrink-0 bg-white dark:bg-[#090f1c] border-r border-slate-200 dark:border-white/[0.06] flex flex-col overflow-y-auto">
        <div className="px-4 py-3 border-b border-slate-200 dark:border-white/[0.06]">
          <h3 className="text-slate-900 dark:text-white text-sm font-semibold">Map Layers</h3>
        </div>
        <div className="p-4 space-y-2.5">
          {layerDefs.map((l) => (
            <label key={l.id} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={layers[l.id]}
                onChange={() => toggleLayer(l.id)}
                className="sr-only"
              />
              <div className={clsx(
                'w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all',
                layers[l.id] ? 'bg-orange-500 border-orange-500' : 'border-slate-300 dark:border-white/20 bg-transparent'
              )}>
                {layers[l.id] && <Check size={10} strokeWidth={3} className="text-white" />}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors font-medium">
                {l.icon}
                <span>{l.label}</span>
              </div>
            </label>
          ))}
        </div>

        {/* Legend */}
        <div className="px-4 py-3 border-t border-slate-200 dark:border-white/[0.06]">
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-400 mb-3">Road Status</div>
          {[
            { color: '#22c55e', label: 'Open' },
            { color: '#eab308', label: 'Degraded' },
            { color: '#f97316', label: 'High Risk' },
            { color: '#ef4444', label: 'Blocked' },
            { color: '#6b7280', label: 'Unknown / Stale' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 mb-1.5">
              <div className="w-7 h-1.5 rounded-full" style={{ background: item.color }} />
              <span className="text-xs text-slate-600 dark:text-slate-400">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Active vehicles list */}
        <div className="px-4 py-3 border-t border-slate-200 dark:border-white/[0.06] flex-1">
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-400 mb-3">Active Vehicles</div>
          <div className="space-y-2">
            {vehicles.map((v) => (
              <div key={v.id} className="text-xs p-2 rounded-lg bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-transparent">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Truck size={13} className="text-slate-500" />
                    <span className="text-slate-900 dark:text-white font-semibold">{v.id}</span>
                  </div>
                  <span className={clsx(
                    'text-[10px] font-bold',
                    v.routeRisk > 80 ? 'text-red-600 dark:text-red-400' : v.routeRisk > 60 ? 'text-orange-600 dark:text-orange-400' : 'text-emerald-600 dark:text-green-400'
                  )}>{v.routeRisk}%</span>
                </div>
                <div className="text-slate-500 dark:text-slate-400 text-[10px] mt-0.5">{v.destination}</div>
                {!v.telemetryFresh && (
                  <div className="text-orange-600 dark:text-orange-400 text-[9px] font-bold mt-1">TELEMETRY UNAVAILABLE</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Map */}
      <div ref={mapRef} className="flex-1 min-h-0" />
    </div>
  );
}
