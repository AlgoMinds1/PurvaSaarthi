import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import clsx from 'clsx';
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
        `<div style="font-family:Inter,sans-serif;min-width:220px">
          <div style="font-weight:700;font-size:13px;margin-bottom:8px">${r.name}</div>
          <div style="display:grid;gap:4px;font-size:12px">
            <div style="display:flex;justify-content:space-between">
              <span style="color:#94a3b8">Status</span>
              <span style="font-weight:600;color:${statusColor(r.status)}">${r.status.replace('_',' ')}</span>
            </div>
            <div style="display:flex;justify-content:space-between">
              <span style="color:#94a3b8">Risk Score</span>
              <span style="font-weight:600;color:#f97316">${r.riskScore}%</span>
            </div>
            <div style="display:flex;justify-content:space-between">
              <span style="color:#94a3b8">Confidence</span>
              <span style="color:#22c55e">${r.confidence}%</span>
            </div>
            <div style="display:flex;justify-content:space-between">
              <span style="color:#94a3b8">Rainfall</span>
              <span>${r.rainfallForecast}mm forecast</span>
            </div>
            <div style="display:flex;justify-content:space-between">
              <span style="color:#94a3b8">Updated</span>
              <span>${r.lastVerified}</span>
            </div>
            <div style="color:#64748b;font-size:11px;margin-top:4px;padding-top:4px;border-top:1px solid rgba(255,255,255,0.1)">Source: ${r.source}</div>
          </div>
        </div>`,
        { className: 'custom-popup' }
      ).addTo(roadsGroup);
    });

    // ── BRIDGES LAYER ──
    const bridgesGroup = L.layerGroup().addTo(map);
    bridges.forEach((b) => {
      const bridgeIcon = L.divIcon({
        className: 'truck-icon-custom',
        html: `<div style="font-size:22px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.6));cursor:pointer" title="${b.name}">🌉</div>`,
        iconSize: [28, 28], iconAnchor: [14, 14],
      });
      L.marker(b.latlng, { icon: bridgeIcon })
        .bindPopup(
          `<div style="font-family:Inter,sans-serif;min-width:200px">
            <div style="font-weight:700;font-size:13px;margin-bottom:6px">${b.name}</div>
            ${b.isSPOF ? '<div style="background:#ef444420;color:#ef4444;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:700;margin-bottom:8px">⚠ SINGLE POINT OF FAILURE</div>' : ''}
            <div style="font-size:12px;display:grid;gap:4px">
              <div style="display:flex;justify-content:space-between"><span style="color:#94a3b8">Status</span><span style="color:${statusColor(b.status)};font-weight:600">${b.status}</span></div>
              <div style="display:flex;justify-content:space-between"><span style="color:#94a3b8">Criticality</span><span style="color:#f97316;font-weight:600">${b.criticalityScore}%</span></div>
              <div style="display:flex;justify-content:space-between"><span style="color:#94a3b8">Load Capacity</span><span>${b.loadCapacity}</span></div>
              ${b.isSPOF ? `<div style="color:#ef4444;font-size:11px;margin-top:4px">Failure affects: ${b.affectedDistricts.join(', ')}</div>` : ''}
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
          background:${riskColor}22;
          border:2px solid ${riskColor}55;
          border-radius:50%;
          width:48px;height:48px;
          display:flex;align-items:center;justify-content:center;
          font-size:10px;font-weight:700;color:${riskColor};
          backdrop-filter:blur(4px);
          cursor:pointer;
        ">${d.isolationRisk}%</div>`,
        iconSize: [48, 48], iconAnchor: [24, 24],
      });
      L.marker(d.latlng, { icon: distIcon })
        .bindPopup(
          `<div style="font-family:Inter,sans-serif;min-width:210px">
            <div style="font-weight:700;font-size:13px;margin-bottom:8px">${d.name}</div>
            <div style="font-size:12px;display:grid;gap:4px">
              <div style="display:flex;justify-content:space-between"><span style="color:#94a3b8">Connectivity</span><span style="font-weight:600">${d.connectivity}%</span></div>
              <div style="display:flex;justify-content:space-between"><span style="color:#94a3b8">Isolation Risk</span><span style="font-weight:600;color:${riskColor}">${d.isolationRisk}%</span></div>
              <div style="display:flex;justify-content:space-between"><span style="color:#94a3b8">Alt. Routes</span><span>${d.alternativeRoutes}</span></div>
              <div style="display:flex;justify-content:space-between"><span style="color:#94a3b8">Supply (days)</span><span>${d.supplyDays}</span></div>
              <div style="display:flex;justify-content:space-between"><span style="color:#94a3b8">Weather Risk</span><span style="color:#f97316">${d.weatherRisk}</span></div>
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
          <div style="font-size:24px;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.6))">🚛</div>
          <div style="
            position:absolute;top:-8px;right:-8px;
            background:${riskC};color:white;
            border-radius:50%;width:16px;height:16px;
            font-size:8px;font-weight:700;
            display:flex;align-items:center;justify-content:center;
            border:1.5px solid #090f1c;
          ">${Math.round(v.routeRisk)}</div>
        </div>`,
        iconSize: [36, 36], iconAnchor: [18, 18],
      });
      const marker = L.marker(v.currentLocation, { icon: truckIcon })
        .bindPopup(
          `<div style="font-family:Inter,sans-serif;min-width:210px">
            <div style="font-weight:700;font-size:13px;margin-bottom:8px">Vehicle ${v.id}</div>
            <div style="font-size:12px;display:grid;gap:4px">
              <div style="display:flex;justify-content:space-between"><span style="color:#94a3b8">Driver</span><span>${v.driverName}</span></div>
              <div style="display:flex;justify-content:space-between"><span style="color:#94a3b8">Destination</span><span>${v.destination}</span></div>
              <div style="display:flex;justify-content:space-between"><span style="color:#94a3b8">Route Risk</span><span style="font-weight:600;color:${riskC}">${v.routeRisk}%</span></div>
              <div style="display:flex;justify-content:space-between"><span style="color:#94a3b8">ETA</span><span>${v.eta}</span></div>
              <div style="display:flex;justify-content:space-between"><span style="color:#94a3b8">Delay</span><span style="color:#f97316">${v.delayMinutes > 0 ? '+' + v.delayMinutes + ' min' : 'On time'}</span></div>
              <div style="display:flex;justify-content:space-between">
                <span style="color:#94a3b8">GPS Status</span>
                <span style="color:${v.telemetryFresh ? '#22c55e' : '#f97316'}">${v.telemetryFresh ? '● Fresh — ' + v.lastPingAt : '⚠ TELEMETRY UNAVAILABLE'}</span>
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

  const layerDefs: { id: LayerKey; label: string; icon: string }[] = [
    { id: 'roads', label: 'Roads', icon: '🛣️' },
    { id: 'bridges', label: 'Bridges', icon: '🌉' },
    { id: 'districts', label: 'Districts', icon: '🏘️' },
    { id: 'vehicles', label: 'Vehicles', icon: '🚛' },
    { id: 'incidents', label: 'Incidents', icon: '⚠️' },
    { id: 'weather', label: 'Weather Risk', icon: '🌧️' },
  ];

  return (
    <div className="flex h-full min-h-0">
      {/* Controls */}
      <div className="w-52 shrink-0 bg-[#090f1c] border-r border-white/[0.06] flex flex-col overflow-y-auto">
        <div className="px-4 py-3 border-b border-white/[0.06]">
          <h3 className="text-white text-sm font-semibold">Map Layers</h3>
        </div>
        <div className="p-4 space-y-2">
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
                layers[l.id] ? 'bg-orange-500 border-orange-500' : 'border-white/20 bg-transparent'
              )}>
                {layers[l.id] && <span className="text-white text-[10px] font-bold">✓</span>}
              </div>
              <span className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors">
                {l.icon} {l.label}
              </span>
            </label>
          ))}
        </div>

        {/* Legend */}
        <div className="px-4 py-3 border-t border-white/[0.06]">
          <div className="text-xs font-semibold text-slate-400 mb-3">Road Status</div>
          {[
            { color: '#22c55e', label: 'Open' },
            { color: '#eab308', label: 'Degraded' },
            { color: '#f97316', label: 'High Risk' },
            { color: '#ef4444', label: 'Blocked' },
            { color: '#6b7280', label: 'Unknown / Stale' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 mb-1.5">
              <div className="w-8 h-1.5 rounded-full" style={{ background: item.color }} />
              <span className="text-xs text-slate-500">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Active vehicles list */}
        <div className="px-4 py-3 border-t border-white/[0.06] flex-1">
          <div className="text-xs font-semibold text-slate-400 mb-3">Active Vehicles</div>
          <div className="space-y-2">
            {vehicles.map((v) => (
              <div key={v.id} className="text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">🚛 {v.id}</span>
                  <span className={clsx(
                    'text-[10px] font-bold',
                    v.routeRisk > 80 ? 'text-red-400' : v.routeRisk > 60 ? 'text-orange-400' : 'text-green-400'
                  )}>{v.routeRisk}%</span>
                </div>
                <div className="text-slate-500 text-[10px]">{v.destination}</div>
                {!v.telemetryFresh && (
                  <div className="text-orange-400 text-[9px] font-semibold">⚠ TELEMETRY UNAVAILABLE</div>
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
