import { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import clsx from 'clsx';
import { 
  Route, Landmark, Building2, Truck, AlertTriangle, CloudRain, Check, 
  Navigation, X, Crosshair, Zap, Play, Pause, ArrowRight, ShieldAlert,
  RotateCcw, CheckCircle2
} from 'lucide-react';
import { roads, bridges, vehicles, districts } from '../data/mockData';
import { useAppStore } from '../store/useAppStore';
import { statusColor } from '../lib/utils';

type LayerKey = 'roads' | 'bridges' | 'districts' | 'vehicles' | 'incidents' | 'weather';

const simStages = [
  {
    step: 0,
    title: 'Stage 1: Infrastructure Disruption',
    badge: 'STAGE 1 / 5',
    headline: 'Corridor Structural Collapse',
    desc: 'Primary corridor NH-27 suffers structural landslide collapse due to 87mm precipitation & 32° slope gradient. Corridor status shifts to BLOCKED (94% Disruption Risk).',
    metrics: [
      { l: 'Corridor Status', v: 'BLOCKED (94%)', c: 'text-red-600 dark:text-red-400' },
      { l: 'Precipitation', v: '87 mm Critical', c: 'text-red-600 dark:text-red-400' },
      { l: 'SPOF Bottleneck', v: 'Bridge B-17', c: 'text-amber-600 dark:text-amber-400' },
    ],
    focusCoords: [25.8, 92.0] as [number, number],
    zoom: 9,
  },
  {
    step: 1,
    title: 'Stage 2: Secondary Traffic Surge',
    badge: 'STAGE 2 / 5',
    headline: 'NH-106 Bypass Congestion Spike',
    desc: 'Freight volume diverts onto NH-106 Shillong Bypass. Traffic load spikes by +340%, elevating secondary corridor disruption risk from 24% to 89%.',
    metrics: [
      { l: 'Bypass Traffic', v: '+340% Surge', c: 'text-amber-600 dark:text-amber-400' },
      { l: 'Secondary Risk', v: '89% HIGH', c: 'text-orange-600 dark:text-orange-400' },
      { l: 'Transit Delay', v: '+2h 45m', c: 'text-red-600 dark:text-red-400' },
    ],
    focusCoords: [25.85, 92.1] as [number, number],
    zoom: 9,
  },
  {
    step: 2,
    title: 'Stage 3: District Isolation Risk',
    badge: 'STAGE 3 / 5',
    headline: 'District X Transit Severed',
    desc: 'District X (Silchar / Barak Valley) primary transit link is severed. District isolation vulnerability index spikes from 24% to 87%.',
    metrics: [
      { l: 'Connectivity', v: '41% (Severed)', c: 'text-red-600 dark:text-red-400' },
      { l: 'Isolation Risk', v: '87% CRITICAL', c: 'text-red-600 dark:text-red-500' },
      { l: 'Alt Passages', v: '1 Remaining', c: 'text-amber-600 dark:text-amber-400' },
    ],
    focusCoords: [24.83, 92.78] as [number, number],
    zoom: 8.5,
  },
  {
    step: 3,
    title: 'Stage 4: Essential Commodity Depletion',
    badge: 'STAGE 4 / 5',
    headline: 'Critical Medicine Stockout Threat',
    desc: 'Shipment #104 (Life-Saving Vaccines & IV Fluids) on vehicle TRK-204 is stranded. Destination hospital local inventory depleted to 1.7 days buffer.',
    metrics: [
      { l: 'Consignment', v: 'Medicines (#104)', c: 'text-purple-600 dark:text-purple-400' },
      { l: 'Local Reserve', v: '1.7 Days Left', c: 'text-red-600 dark:text-red-500' },
      { l: 'Stockout Alarm', v: 'CRITICAL', c: 'text-red-600 dark:text-red-500' },
    ],
    focusCoords: [25.9, 91.85] as [number, number],
    zoom: 9.5,
  },
  {
    step: 4,
    title: 'Stage 5: Autonomous Dispatch & Safe Window',
    badge: 'STAGE 5 / 5',
    headline: 'AI Safe Detour Trajectory Calculated',
    desc: 'PurvaSaarthi Decision Engine calculates optimal bypass trajectory. Last safe dispatch window is BEFORE 16:30 hrs prior to flash flood crest.',
    metrics: [
      { l: 'Safe Window', v: 'Before 4:30 PM', c: 'text-emerald-600 dark:text-emerald-400' },
      { l: 'Time Remaining', v: '1h 22m', c: 'text-cyan-600 dark:text-cyan-400' },
      { l: 'Action', v: 'Reroute Ready', c: 'text-emerald-600 dark:text-emerald-400' },
    ],
    focusCoords: [25.8, 92.2] as [number, number],
    zoom: 8.5,
  },
];

export default function LiveMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const layerGroups = useRef<Record<LayerKey, L.LayerGroup>>({} as Record<LayerKey, L.LayerGroup>);
  const simLayerGroup = useRef<L.LayerGroup | null>(null);
  const vehicleMarkers = useRef<Record<string, L.Marker>>({});

  const { 
    selectedVehicleId, 
    clearSelectedVehicle,
    isSimulatingOnMap,
    cascadeStep,
    setCascadeStep,
    stopMapSimulation,
    openRerouteModal,
  } = useAppStore();

  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const [layers, setLayers] = useState<Record<LayerKey, boolean>>({
    roads: true, bridges: true, districts: true,
    vehicles: true, incidents: true, weather: false,
  });

  const focusVehicle = useCallback((vehicleId: string) => {
    const map = mapInstance.current;
    const v = vehicles.find((item) => item.id === vehicleId);
    if (!map || !v) return;

    // Ensure vehicles layer is on
    const vGroup = layerGroups.current.vehicles;
    if (vGroup && !map.hasLayer(vGroup)) {
      map.addLayer(vGroup);
      setLayers((prev) => ({ ...prev, vehicles: true }));
    }

    map.flyTo(v.currentLocation, 12, { duration: 1.2 });
    setTimeout(() => {
      vehicleMarkers.current[vehicleId]?.openPopup();
    }, 700);
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [26.05, 92.8],
      zoom: 8,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);

    // Expose window helper for popup buttons
    (window as any).openExplainDrawer = (type: 'road' | 'shipment' | 'district', id: string) => {
      useAppStore.getState().openExplainabilityDrawer(type, id);
    };

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
            <button onclick="window.openExplainDrawer('road', '${r.id}')" style="margin-top:8px;width:100%;background:#8b5cf6;color:white;border:none;padding:6px 10px;border-radius:6px;font-weight:700;font-size:11px;cursor:pointer">Explain AI Risk Weights</button>
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
              <button onclick="window.openExplainDrawer('road', '${b.roadId}')" style="margin-top:8px;width:100%;background:#8b5cf6;color:white;border:none;padding:6px 10px;border-radius:6px;font-weight:700;font-size:11px;cursor:pointer">Explain AI Risk Weights</button>
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
            <div style="font-weight:700;font-size:14px;margin-bottom:4px">${d.name}</div>
            <div style="font-size:11px;opacity:0.7;margin-bottom:8px">Population: ${d.population.toLocaleString()}</div>
            <div style="display:grid;gap:4px;font-size:12px">
              <div style="display:flex;justify-content:space-between"><span>Isolation Risk</span><span style="font-weight:700;color:${riskColor}">${d.isolationRisk}%</span></div>
              <div style="display:flex;justify-content:space-between"><span>Supply Days</span><span style="font-weight:600;color:${d.supplyDays < 3 ? '#ef4444' : '#22c55e'}">${d.supplyDays} days</span></div>
              <div style="display:flex;justify-content:space-between"><span>Alt Routes</span><span>${d.alternativeRoutes}</span></div>
              <div style="display:flex;justify-content:space-between"><span>Weather Risk</span><span>${d.weatherRisk}</span></div>
              <button onclick="window.openExplainDrawer('district', '${d.id}')" style="margin-top:8px;width:100%;background:#8b5cf6;color:white;border:none;padding:6px 10px;border-radius:6px;font-weight:700;font-size:11px;cursor:pointer">Explain AI Risk Weights</button>
            </div>
          </div>`
        ).addTo(districtsGroup);
    });

    // ── VEHICLES LAYER ──
    const vehiclesGroup = L.layerGroup().addTo(map);
    vehicles.forEach((v) => {
      const isSelected = v.id === selectedVehicleId;
      const truckIcon = L.divIcon({
        className: 'truck-icon-custom',
        html: `<div style="
          width:${isSelected ? 32 : 24}px;
          height:${isSelected ? 32 : 24}px;
          background:${isSelected ? '#f97316' : '#0284c7'};
          border:2px solid white;
          border-radius:50%;
          display:flex;align-items:center;justify-content:center;
          color:white;
          box-shadow:0 2px 6px rgba(0,0,0,0.4);
          cursor:pointer;
          transition:all 0.2s;
        ">
          <svg width="${isSelected ? 16 : 12}" height="${isSelected ? 16 : 12}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
            <path d="M15 18H9"/>
            <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
            <circle cx="17" cy="18.5" r="2.5"/>
            <circle cx="7" cy="18.5" r="2.5"/>
          </svg>
        </div>`,
        iconSize: [isSelected ? 32 : 24, isSelected ? 32 : 24],
        iconAnchor: [isSelected ? 16 : 12, isSelected ? 16 : 12],
      });
      const marker = L.marker(v.currentLocation, { icon: truckIcon })
        .bindPopup(
          `<div style="min-width:200px">
            <div style="font-weight:700;font-size:13px;margin-bottom:2px">${v.id} — ${v.plateNo}</div>
            <div style="font-size:11px;opacity:0.7;margin-bottom:8px">Driver: ${v.driverName}</div>
            <div style="display:grid;gap:4px;font-size:12px">
              <div style="display:flex;justify-content:space-between"><span>Destination</span><span>${v.destination}</span></div>
              <div style="display:flex;justify-content:space-between"><span>Status</span><span style="font-weight:600;color:#22c55e">${v.status.replace('_',' ')}</span></div>
              <div style="display:flex;justify-content:space-between"><span>Route Risk</span><span style="font-weight:600;color:${v.routeRisk > 70 ? '#ef4444' : '#22c55e'}">${v.routeRisk}%</span></div>
              <div style="display:flex;justify-content:space-between"><span>ETA</span><span>${v.eta}</span></div>
              <div style="display:flex;justify-content:space-between"><span>Telemetry</span><span style="color:${v.telemetryFresh ? '#22c55e' : '#f97316'};font-weight:600">${v.telemetryFresh ? 'Live GPS (3s)' : 'Stale'}</span></div>
              <button onclick="window.openExplainDrawer('shipment', 'SHIP-104')" style="margin-top:8px;width:100%;background:#8b5cf6;color:white;border:none;padding:6px 10px;border-radius:6px;font-weight:700;font-size:11px;cursor:pointer">Explain AI Risk Weights</button>
            </div>
          </div>`
        ).addTo(vehiclesGroup);
      vehicleMarkers.current[v.id] = marker;
    });

    // ── INCIDENTS LAYER ──
    const incidentsGroup = L.layerGroup().addTo(map);
    const incidentZones = [
      { center: [25.75, 92.52] as [number, number], radius: 18000, label: 'Dima Hasao Heavy Precip Zone (87mm)' },
      { center: [25.40, 92.65] as [number, number], radius: 14000, label: 'Haflong Monsoon Risk Belt' },
    ];
    incidentZones.forEach((z) => {
      L.circle(z.center, {
        radius: z.radius,
        color: '#ef4444',
        fillColor: '#ef4444',
        fillOpacity: 0.15,
        weight: 2,
        dashArray: '5,5',
      }).bindPopup(`<div style="font-size:12px;font-weight:700;color:#ef4444">${z.label}</div>`).addTo(incidentsGroup);
    });

    // ── WEATHER LAYER ──
    const weatherGroup = L.layerGroup();
    incidentZones.forEach((z) => {
      L.circle(z.center, {
        radius: z.radius * 1.5,
        color: '#3b82f6',
        fillColor: '#3b82f6',
        fillOpacity: 0.1,
        weight: 1,
      }).bindPopup(`<div style="font-size:12px;color:#3b82f6">Rainfall: 87mm forecast next 24h</div>`).addTo(weatherGroup);
    });

    // ── SIMULATION LAYER ──
    const simGroup = L.layerGroup().addTo(map);
    simLayerGroup.current = simGroup;

    layerGroups.current = {
      roads: roadsGroup,
      bridges: bridgesGroup,
      districts: districtsGroup,
      vehicles: vehiclesGroup,
      incidents: incidentsGroup,
      weather: weatherGroup,
    };

    mapInstance.current = map;
  }, []);

  // Handle layer toggles
  const toggleLayer = (k: LayerKey) => {
    const map = mapInstance.current;
    if (!map) return;
    const group = layerGroups.current[k];
    if (!group) return;
    if (layers[k]) {
      map.removeLayer(group);
    } else {
      map.addLayer(group);
    }
    setLayers((prev) => ({ ...prev, [k]: !prev[k] }));
  };

  // Real-time Map Cascade Simulation Updates
  useEffect(() => {
    const map = mapInstance.current;
    const simGroup = simLayerGroup.current;
    if (!map || !simGroup) return;

    simGroup.clearLayers();

    if (!isSimulatingOnMap) return;

    const currentStage = simStages[cascadeStep] || simStages[0];

    // Smoothly fly map to focus area
    map.flyTo(currentStage.focusCoords, currentStage.zoom, { duration: 1.0 });

    // Stage 1: Collapse on NH-27
    const nh27 = roads[0];
    if (nh27) {
      L.polyline(nh27.latlngs, {
        color: '#ef4444',
        weight: 6,
        opacity: 1,
      }).addTo(simGroup);

      const alertIcon = L.divIcon({
        className: 'truck-icon-custom',
        html: `<div style="background:#ef4444;border:3px solid white;color:white;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 0 15px #ef4444;animation:ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });
      L.marker([25.8, 91.9], { icon: alertIcon })
        .bindPopup(`<div style="font-weight:bold;color:#ef4444;font-size:12px">🚨 NH-27 COLLAPSE ZONE<br/><span style="color:#0f172a;font-weight:normal">Landslide 87mm Rain · BLOCKED</span></div>`)
        .addTo(simGroup)
        .openPopup();
    }

    // Stage 2: Secondary Congestion on NH-106
    if (cascadeStep >= 1) {
      const nh106 = roads[1];
      if (nh106) {
        L.polyline(nh106.latlngs, {
          color: '#f97316',
          weight: 5,
          opacity: 0.9,
          dashArray: '8,6',
        }).addTo(simGroup);

        const surgeIcon = L.divIcon({
          className: 'truck-icon-custom',
          html: `<div style="background:#f97316;border:2px solid white;color:white;padding:3px 8px;border-radius:12px;font-size:10px;font-weight:bold;box-shadow:0 2px 8px rgba(0,0,0,0.3);white-space:nowrap">+340% TRAFFIC SURGE (89% Risk)</div>`,
          iconSize: [120, 24],
          iconAnchor: [60, 12],
        });
        L.marker([26.01, 92.11], { icon: surgeIcon }).addTo(simGroup);
      }
    }

    // Stage 3: District X Isolation Zone
    if (cascadeStep >= 2) {
      L.circle([24.83, 92.78], {
        radius: 26000,
        color: '#dc2626',
        fillColor: '#ef4444',
        fillOpacity: 0.25,
        weight: 3,
        dashArray: '6,6',
      }).addTo(simGroup);

      const distAlertIcon = L.divIcon({
        className: 'truck-icon-custom',
        html: `<div style="background:#b91c1c;border:2px solid white;color:white;padding:4px 10px;border-radius:14px;font-size:11px;font-weight:bold;box-shadow:0 0 12px #ef4444;white-space:nowrap">🚨 DISTRICT X ISOLATION RISK: 87%</div>`,
        iconSize: [180, 26],
        iconAnchor: [90, 13],
      });
      L.marker([24.83, 92.78], { icon: distAlertIcon }).addTo(simGroup);
    }

    // Stage 4: Stressed Medicine Convoy
    if (cascadeStep >= 3) {
      const medIcon = L.divIcon({
        className: 'truck-icon-custom',
        html: `<div style="background:#7c3aed;border:2px solid white;color:white;padding:4px 10px;border-radius:14px;font-size:10px;font-weight:bold;box-shadow:0 0 14px #7c3aed;white-space:nowrap">⚠️ TRK-204 (Vaccines) · Stockout in 1.7 Days</div>`,
        iconSize: [190, 26],
        iconAnchor: [95, 13],
      });
      L.marker([25.9, 91.85], { icon: medIcon }).addTo(simGroup);
    }

    // Stage 5: Recommended AI Safe Detour
    if (cascadeStep >= 4) {
      const safePath = [
        [26.14, 91.74],
        [26.01, 92.11],
        [25.57, 91.88],
        [25.3, 92.2],
        [24.83, 92.78],
      ] as [number, number][];

      L.polyline(safePath, {
        color: '#10b981',
        weight: 5,
        opacity: 0.95,
      }).addTo(simGroup);

      const safeBeacon = L.divIcon({
        className: 'truck-icon-custom',
        html: `<div style="background:#059669;border:2px solid white;color:white;padding:4px 12px;border-radius:16px;font-size:11px;font-weight:bold;box-shadow:0 0 16px #10b981;white-space:nowrap">✅ SAFE DETOUR WINDOW: Before 4:30 PM</div>`,
        iconSize: [210, 28],
        iconAnchor: [105, 14],
      });
      L.marker([25.57, 91.88], { icon: safeBeacon }).addTo(simGroup);
    }

  }, [isSimulatingOnMap, cascadeStep]);

  // Auto-play simulation timer
  useEffect(() => {
    if (!isSimulatingOnMap || !isAutoPlaying) return;

    const timer = setInterval(() => {
      setCascadeStep((cascadeStep + 1) % simStages.length);
    }, 3800);

    return () => clearInterval(timer);
  }, [isSimulatingOnMap, isAutoPlaying, cascadeStep, setCascadeStep]);

  const currentStage = simStages[cascadeStep] || simStages[0];
  const trackedVehicle = vehicles.find((v) => v.id === selectedVehicleId);

  return (
    <div className="flex h-full min-h-0 bg-slate-100 dark:bg-[#070c18] transition-colors duration-200">
      
      {/* Left-side Layer & Fleet Drawer (Hidden during fullscreen live simulation) */}
      <div className={clsx(
        'w-64 shrink-0 bg-white dark:bg-[#090f1c] border-r border-slate-200 dark:border-white/[0.06] flex flex-col transition-all duration-300',
        isSimulatingOnMap && 'hidden md:flex'
      )}>
        {/* Layer Controls Header */}
        <div className="p-4 border-b border-slate-200 dark:border-white/[0.06]">
          <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">Map Layers</div>
          <div className="grid grid-cols-2 gap-2">
            {(['roads', 'bridges', 'districts', 'vehicles', 'incidents', 'weather'] as LayerKey[]).map((k) => (
              <button
                key={k}
                onClick={() => toggleLayer(k)}
                className={clsx(
                  'flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize cursor-pointer border',
                  layers[k]
                    ? 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-white/[0.08] dark:text-white dark:border-white/10'
                    : 'bg-slate-50 text-slate-400 border-slate-200 dark:bg-white/[0.02] dark:text-slate-500 dark:border-white/[0.04]'
                )}
              >
                <span>{k}</span>
                {layers[k] && <Check size={12} className="text-orange-500" />}
              </button>
            ))}
          </div>
        </div>

        {/* Active Fleet List */}
        <div className="flex-1 min-h-0 flex flex-col p-4 overflow-y-auto">
          <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">Active Fleet ({vehicles.length})</div>
          <div className="space-y-1.5 flex-1 min-h-0">
            {vehicles.map((v) => {
              const isSelected = v.id === selectedVehicleId;
              return (
                <button
                  key={v.id}
                  onClick={() => focusVehicle(v.id)}
                  className={clsx(
                    'w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer text-xs',
                    isSelected
                      ? 'bg-orange-50 text-orange-950 border-orange-300 dark:bg-orange-500/10 dark:text-white dark:border-orange-500/30 ring-1 ring-orange-500/30'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 dark:bg-white/[0.03] dark:hover:bg-white/[0.06] dark:border-white/[0.05]'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Truck size={13} className={isSelected ? 'text-orange-500' : 'text-slate-500'} />
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
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 min-h-0 relative">
        
        {/* Real-Time Tracking Floating Header HUD (Normal Mode) */}
        {!isSimulatingOnMap && trackedVehicle && (
          <div className="absolute top-4 left-4 right-4 z-[1000] animate-fade-up pointer-events-none">
            <div className="bg-white/95 dark:bg-slate-950/95 backdrop-blur-md text-slate-900 dark:text-white rounded-xl p-3 px-4 shadow-xl border border-slate-200 dark:border-white/10 flex items-center justify-between pointer-events-auto max-w-2xl mx-auto">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-orange-500 flex items-center justify-center text-white shrink-0">
                  <Navigation size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{trackedVehicle.id} — {trackedVehicle.plateNo}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      LIVE GPS
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 flex items-center gap-2">
                    <span>Driver: <b>{trackedVehicle.driverName}</b></span>
                    <span>·</span>
                    <span>Dest: <b>{trackedVehicle.destination}</b></span>
                    <span>·</span>
                    <span className="text-orange-600 dark:text-orange-400 font-semibold">Route Risk: {trackedVehicle.routeRisk}%</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => focusVehicle(trackedVehicle.id)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-800 dark:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Center map on vehicle"
                >
                  <Crosshair size={13} />
                  <span>Center Pin</span>
                </button>
                <button
                  onClick={clearSelectedVehicle}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-500 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer"
                  title="Close vehicle focus"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── REAL-TIME CASCADE SIMULATION FLOATING HUD ── */}
        {isSimulatingOnMap && (
          <div className="absolute bottom-5 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 z-[1000] max-w-3xl w-full animate-fade-up">
            <div className="bg-white/95 dark:bg-[#0b1322]/95 backdrop-blur-xl rounded-2xl border border-slate-200/90 dark:border-white/10 shadow-2xl p-4 sm:p-5 space-y-3.5 text-slate-900 dark:text-slate-100">
              
              {/* Top HUD Controls Bar */}
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/[0.08] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center text-white shadow-xs">
                    <Zap size={16} className="animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                        Live Cascade Failure Simulation
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30">
                        {currentStage.badge}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      Simulating real-time domino disruptions on North East GIS corridors
                    </div>
                  </div>
                </div>

                {/* Step indicator pills */}
                <div className="flex items-center gap-1.5">
                  <div className="hidden sm:flex items-center gap-1 mr-2">
                    {simStages.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCascadeStep(idx)}
                        className={clsx(
                          'w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center transition-all cursor-pointer',
                          cascadeStep === idx
                            ? 'bg-amber-500 text-white shadow-xs scale-110'
                            : cascadeStep > idx
                            ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30'
                            : 'bg-slate-100 dark:bg-white/[0.05] text-slate-400 border border-slate-200 dark:border-white/[0.05]'
                        )}
                        title={s.title}
                      >
                        {cascadeStep > idx ? <Check size={10} /> : idx + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.08] dark:hover:bg-white/[0.12] text-slate-700 dark:text-slate-300 transition-colors cursor-pointer shadow-2xs"
                    title={isAutoPlaying ? 'Pause Auto Sequence' : 'Play Auto Sequence'}
                  >
                    {isAutoPlaying ? <Pause size={14} className="text-amber-500" /> : <Play size={14} />}
                  </button>

                  <button
                    onClick={stopMapSimulation}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-600 dark:bg-white/[0.08] dark:hover:bg-red-500/20 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer shadow-2xs"
                    title="Exit Live Simulation"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Stage Description & Headline */}
              <div className="space-y-1.5">
                <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span>{currentStage.headline}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium bg-slate-50 dark:bg-white/[0.03] p-3 rounded-xl border border-slate-200/80 dark:border-white/[0.06]">
                  {currentStage.desc}
                </p>
              </div>

              {/* Real-Time Metrics Row */}
              <div className="grid grid-cols-3 gap-2.5">
                {currentStage.metrics.map((m, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-white dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.06] shadow-2xs">
                    <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">{m.l}</div>
                    <div className={clsx('text-xs sm:text-sm font-bold mt-0.5 truncate', m.c)}>{m.v}</div>
                  </div>
                ))}
              </div>

              {/* Bottom Nav Action Bar */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-white/[0.06]">
                <button
                  onClick={() => setCascadeStep(Math.max(0, cascadeStep - 1))}
                  disabled={cascadeStep === 0}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors disabled:opacity-40 cursor-pointer shadow-2xs"
                >
                  Previous Stage
                </button>

                {cascadeStep < simStages.length - 1 ? (
                  <button
                    onClick={() => setCascadeStep(cascadeStep + 1)}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <span>Propagate To Stage {cascadeStep + 2}</span>
                    <ArrowRight size={13} />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      stopMapSimulation();
                      openRerouteModal();
                    }}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
                  >
                    <ShieldAlert size={14} />
                    <span>Execute Safe Detour Action</span>
                  </button>
                )}
              </div>

            </div>
          </div>
        )}

        <div ref={mapRef} className="w-full h-full" />
      </div>
    </div>
  );
}
