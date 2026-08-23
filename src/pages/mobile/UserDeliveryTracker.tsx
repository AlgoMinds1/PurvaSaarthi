import { useState, useMemo } from 'react';
import {
  Package, Clock, ShieldCheck, Phone,
  ChevronRight, RefreshCw, Layers, Sparkles, CheckCircle2,
  Search, AlertOctagon, Share2, Plus, QrCode, X,
  Compass, Zap, ThermometerSnowflake, ChevronDown, Check, AlertTriangle, Globe, LogOut
} from 'lucide-react';
import clsx from 'clsx';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAppStore } from '../../store/useAppStore';
import { vehicles, roads, routeAPPath, routeBPath } from '../../data/mockData';
import type { Shipment, Vehicle, CommodityType } from '../../types';
import { translations } from '../../utils/translations';

// Leaflet custom icons for mobile map
const truckIcon = L.divIcon({
  className: 'custom-truck-pin',
  html: `<div style="background: linear-gradient(135deg, #f97316, #ea580c); color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.35), 0 4px 12px rgba(0,0,0,0.35);"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg></div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

const originIcon = L.divIcon({
  className: 'custom-origin-pin',
  html: `<div style="background: #3b82f6; color: white; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.25); border: 2px solid white;"><span style="font-size: 11px; font-weight: 800;">A</span></div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 13],
});

const destIcon = L.divIcon({
  className: 'custom-dest-pin',
  html: `<div style="background: #10b981; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.25); border: 2px solid white;"><span style="font-size: 12px; font-weight: 800;">B</span></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const hazardIcon = L.divIcon({
  className: 'custom-hazard-pin',
  html: `<div style="background: #ef4444; color: white; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.4); animation: pulse 1.5s infinite;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg></div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 13],
});

const COMMODITY_ICONS: Record<CommodityType, string> = {
  medicine: '💊',
  food: '🍞',
  agri: '🌾',
  construction: '⚡',
};

const COMMODITY_PRESETS = [
  { type: 'medicine' as CommodityType, label: 'Anti-Venom & Rabies Immunoglobulins', defaultQty: '120 Vials', icon: '💊' },
  { type: 'medicine' as CommodityType, label: 'Medical Oxygen Cylinders (B-Type)', defaultQty: '40 Cylinders', icon: '🫁' },
  { type: 'medicine' as CommodityType, label: 'Cold-Chain Vaccine Batch', defaultQty: '300 Doses', icon: '🧪' },
  { type: 'construction' as CommodityType, label: 'High-Octane Hospital Diesel Resupply', defaultQty: '1,500 Liters', icon: '⛽' },
  { type: 'medicine' as CommodityType, label: 'Emergency Universal Blood Units', defaultQty: '25 Pints', icon: '🩸' },
  { type: 'food' as CommodityType, label: 'Water Purification Tablets & Relief Kits', defaultQty: '800 Sachets', icon: '📦' },
];

const DESTINATIONS = [
  { id: 'dist-x', name: 'District X Civil Hospital & Central ICU', region: 'Shillong Bypass Corridor' },
  { id: 'dist-y', name: 'Barapani Emergency Triage Center', region: 'Ri-Bhoi Hill Sector' },
  { id: 'dist-z', name: 'Disaster Relief Camp Alpha', region: 'Upper Brahmaputra Basin' },
  { id: 'dist-w', name: 'District Health Sub-centre #3', region: 'Silchar Mountain Sector' },
];

export default function UserDeliveryTracker() {
  const {
    shipmentsList,
    selectedShipmentId,
    setSelectedShipmentId,
    placeUserOrder,
    isDriverRerouted,
    logout,
    language,
    setLanguage,
  } = useAppStore();

  const t = translations[language === 'hi' ? 'hi' : 'en'];

  const [activeTab, setActiveTab] = useState<'track' | 'orders' | 'hazards' | 'sos'>('track');
  const [searchQuery, setSearchQuery] = useState('');
  const [mapExpanded, setMapExpanded] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showWaybillModal, setShowWaybillModal] = useState(false);

  // New Order Form State
  const [selectedPreset, setSelectedPreset] = useState(COMMODITY_PRESETS[0]);
  const [customItemName, setCustomItemName] = useState('');
  const [selectedDest, setSelectedDest] = useState(DESTINATIONS[0]);
  const [orderUrgency, setOrderUrgency] = useState<'CRITICAL' | 'HIGH' | 'STANDARD'>('CRITICAL');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  // Find active shipment
  const currentShipment: Shipment = useMemo(() => {
    return (
      shipmentsList.find((s) => s.id === selectedShipmentId) ||
      shipmentsList[0]
    );
  }, [shipmentsList, selectedShipmentId]);

  // Linked vehicle
  const currentVehicle: Vehicle | undefined = useMemo(() => {
    return vehicles.find((v) => v.id === currentShipment?.vehicleId) || vehicles[0];
  }, [currentShipment]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingOrder(true);

    setTimeout(() => {
      const priorityVal = orderUrgency === 'CRITICAL' ? 100 : orderUrgency === 'HIGH' ? 85 : 65;
      const itemName = customItemName.trim() || selectedPreset.label;

      const newShipment = placeUserOrder({
        commodity: selectedPreset.type,
        commodityLabel: itemName,
        destinationFacility: selectedDest.name,
        destinationDistrictId: selectedDest.id,
        priority: priorityVal,
        items: [
          {
            id: `item-${Date.now()}`,
            name: itemName,
            quantity: selectedPreset.defaultQty,
            category: selectedPreset.type,
            tempControlled: selectedPreset.type === 'medicine',
            tempRange: selectedPreset.type === 'medicine' ? '2°C - 8°C' : undefined,
            batchNumber: `BAT-${Math.floor(1000 + Math.random() * 9000)}`,
          },
        ],
        consigneeName: 'Dr. Anamika Das (Consignee)',
        consigneePhone: '+91 94350 44912',
      });

      setIsSubmittingOrder(false);
      setShowOrderModal(false);
      setSelectedShipmentId(newShipment.id);
      setActiveTab('track');
      showToast(`✨ Requisition #${newShipment.id} created & live tracking active!`);
    }, 600);
  };

  return (
    <div className="flex-1 flex flex-col bg-[var(--bg-base)] text-[var(--text-primary)] min-h-0 overflow-y-auto relative selection:bg-orange-500 selection:text-white">
      
      {/* ── TOAST NOTIFICATION ── */}
      {toastMessage && (
        <div className="fixed top-14 left-4 right-4 z-50 flex justify-center pointer-events-none animate-bounce">
          <div className="bg-slate-900/95 dark:bg-orange-600 text-white text-xs font-semibold px-4 py-2.5 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-2 backdrop-blur-md">
            <Sparkles size={14} className="text-amber-300" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* ── TOP CLEAN APP HEADER (ParvaRoute Operator) ── */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#0b1322]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-white/[0.08] px-3 sm:px-4 py-2 sm:py-2.5 shrink-0 transition-colors">
        <div className="flex items-center justify-between gap-1.5 sm:gap-2">
          
          {/* Logo & Brand Name */}
          <div className="flex items-center gap-2 min-w-0 shrink">
            <img
              src="/logo.svg"
              alt="PurvaSaarthi Logo"
              className="w-8 h-8 sm:w-9 sm:h-9 object-contain shrink-0"
            />
            <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white shrink-0">
              PurvaSaarthi
            </span>
          </div>

          {/* Desktop Navigation Tabs */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-white/[0.05] p-1 rounded-xl border border-slate-200 dark:border-white/[0.08]">
            {[
              { id: 'track', label: t.tabLiveTrack, icon: <Package size={14} /> },
              { id: 'orders', label: t.tabMyOrders, icon: <Layers size={14} /> },
              { id: 'hazards', label: t.tabHazards, icon: <AlertTriangle size={14} /> },
              { id: 'sos', label: t.tabSos, icon: <Phone size={14} /> },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={clsx(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer',
                    isActive
                      ? 'bg-orange-500 text-white shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/[0.05]'
                  )}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Actions: + Create, Language & RM Profile Avatar */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <button
              onClick={() => setShowOrderModal(true)}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#ff6200] hover:bg-orange-600 active:scale-95 text-white text-[11px] sm:text-xs font-semibold shadow-xs shadow-orange-500/20 transition-all cursor-pointer shrink-0"
            >
              <Plus size={13} strokeWidth={2.5} />
              <span>{t.create}</span>
            </button>

            <div className="relative flex items-center gap-0.5 sm:gap-1 px-2 py-1.5 rounded-xl border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px] sm:text-xs font-medium text-slate-700 dark:text-slate-200 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all cursor-pointer shrink-0">
              <Globe size={13} className="text-slate-600 dark:text-slate-400 shrink-0" />
              <span className="font-semibold text-[11px] sm:text-xs text-slate-800 dark:text-slate-200 uppercase">{language === 'hi' ? 'HI' : 'EN'}</span>
              <ChevronDown size={12} className="text-slate-500 dark:text-slate-400 shrink-0" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                title="Select language"
              >
                <option value="en">English (EN)</option>
                <option value="hi">हिंदी (HI)</option>
              </select>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold text-[11px] sm:text-xs border border-red-200 dark:border-red-500/25 transition-all cursor-pointer shrink-0 shadow-2xs"
              title="Log Out & Return to Login"
            >
              <LogOut size={12} />
              <span>Log Out</span>
            </button>
          </div>
        </div>

      </header>

      {/* ── TAB 1: LIVE TRACKING (RESPONSIVE GRID) ── */}
      {activeTab === 'track' && (
        <div className="w-full max-w-6xl mx-auto p-3.5 sm:p-6 pb-24 md:pb-8">
          <div className="md:grid md:grid-cols-12 md:gap-6 space-y-4 md:space-y-0">

            {/* Left Column (col-span-5): Hero Order Status Card, Selector Chips, Cargo Manifest */}
            <div className="md:col-span-5 space-y-4">
              {/* 1. HERO ORDER STATUS CARD */}
              <div className="rounded-2xl p-4 bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-white border border-slate-200/90 dark:border-slate-800 shadow-sm dark:shadow-lg relative overflow-hidden transition-colors">
                {/* Background ambient lighting */}
                <div className="absolute top-0 right-0 w-36 h-36 bg-orange-500/5 dark:bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

                {/* Header: Commodity title + Status badge */}
                <div className="flex items-start justify-between gap-2 mb-3 relative z-10">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 font-mono mb-1">
                      <span>#{currentShipment.trackingNumber}</span>
                      <span>•</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                        {t.live}
                      </span>
                    </div>
                    <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-tight truncate">
                      {currentShipment.commodityLabel}
                    </h2>
                  </div>

                  {/* Waybill QR button */}
                  <button
                    onClick={() => setShowWaybillModal(true)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-800 dark:text-white text-[10px] font-bold border border-slate-200 dark:border-white/10 shrink-0 cursor-pointer transition-colors"
                    title="View Waybill & Pass"
                  >
                    <QrCode size={12} />
                    <span>{t.pass}</span>
                  </button>
                </div>

                {/* Route Progress Visual Bar */}
                <div className="mb-3.5 relative z-10">
                  <div className="flex items-center justify-between text-[10px] text-slate-600 dark:text-slate-400 font-semibold mb-1.5">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      {currentShipment.origin.replace(' Central Depot', '')}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                      {currentShipment.destinationFacility.split('&')[0]}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200/60 dark:border-transparent">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 via-orange-500 to-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: currentShipment.status === 'ON_TIME' ? '72%' : '56%' }}
                    />
                  </div>
                </div>

                {/* 3 Core Metric SVGs Grid */}
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.05] border border-slate-200/80 dark:border-white/[0.08] text-center relative z-10">
                  <div>
                    <div className="flex items-center justify-center gap-1 text-slate-500 dark:text-slate-400 text-[9px] font-bold mb-0.5">
                      <Clock size={11} className="text-emerald-600 dark:text-emerald-400" />
                      <span>{t.eta}</span>
                    </div>
                    <div className="text-xs font-black text-emerald-600 dark:text-emerald-400">{currentShipment.expectedDeliveryTime}</div>
                    <div className="text-[8px] text-slate-500 dark:text-slate-400 font-mono">{t.today}</div>
                  </div>

                  <div className="border-x border-slate-200 dark:border-white/10 px-1">
                    <div className="flex items-center justify-center gap-1 text-slate-500 dark:text-slate-400 text-[9px] font-bold mb-0.5">
                      <ShieldCheck size={11} className="text-orange-600 dark:text-orange-400" />
                      <span>{t.corridor}</span>
                    </div>
                    <div className="text-xs font-black text-slate-900 dark:text-white truncate">
                      {isDriverRerouted || currentShipment.routeRisk < 30 ? 'NH-106 (Safe)' : 'NH-27'}
                    </div>
                    <div className="text-[8px] text-orange-600 dark:text-orange-300 font-bold">
                      {isDriverRerouted || currentShipment.routeRisk < 30 ? t.detourActive : t.monitored}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-center gap-1 text-slate-500 dark:text-slate-400 text-[9px] font-bold mb-0.5">
                      <Zap size={11} className="text-amber-600 dark:text-amber-400" />
                      <span>{t.priority}</span>
                    </div>
                    <div className="text-xs font-black text-amber-600 dark:text-amber-300">{currentShipment.priority}/100</div>
                    <div className="text-[8px] text-slate-500 dark:text-slate-400">{t.stockRemaining} {currentShipment.stockDaysRemaining}d</div>
                  </div>
                </div>

                {/* Quick Actions Row */}
                <div className="flex items-center gap-2 mt-3 relative z-10 pt-2 border-t border-slate-100 dark:border-white/10">
                  <a
                    href={`tel:${currentVehicle?.driverPhone || '+919845211094'}`}
                    className="flex-1 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all shadow-xs"
                  >
                    <Phone size={13} />
                    <span>{t.callDriver} ({currentVehicle?.driverName?.split(' ')[0] || 'Rahul'})</span>
                  </a>

                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText?.(window.location.href);
                      showToast(`🔗 ${t.shareLinkCopied}`);
                    }}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white border border-slate-200 dark:border-transparent text-[11px] font-bold transition-all shrink-0 cursor-pointer"
                    title="Share Tracking"
                  >
                    <Share2 size={13} />
                  </button>
                </div>
              </div>

              {/* Horizontal Order Quick Selector Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                {shipmentsList.map((s) => {
                  const isSelected = s.id === currentShipment.id;
                  const icon = COMMODITY_ICONS[s.commodity] || '📦';
                  return (
                    <button
                      key={s.id}
                      onClick={() => {
                        setSelectedShipmentId(s.id);
                        if (activeTab !== 'track') setActiveTab('track');
                      }}
                      className={clsx(
                        'px-2.5 py-1.5 rounded-xl text-[10px] sm:text-[11px] font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer flex items-center gap-1.5 border shadow-2xs',
                        isSelected
                          ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 dark:bg-[#0b1322] dark:text-slate-300 dark:border-white/[0.08] dark:hover:bg-white/[0.05]'
                      )}
                    >
                      <span>{icon}</span>
                      <span>{s.id}</span>
                      <span className={clsx(
                        'w-1.5 h-1.5 rounded-full',
                        isSelected ? 'bg-white' : s.status === 'ON_TIME' ? 'bg-emerald-500' : s.status === 'AT_RISK' ? 'bg-amber-500' : 'bg-red-500'
                      )} />
                    </button>
                  );
                })}
              </div>

              {/* 4. CARGO MANIFEST (CLEAN ACCORDION SUMMARY) */}
              <div className="bg-white dark:bg-[#0b1322] rounded-2xl p-3.5 border border-slate-200 dark:border-white/[0.08] shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Package size={13} className="text-blue-500" />
                    <span>{t.cargoItems} ({currentShipment.items.length})</span>
                  </span>
                  {currentShipment.items.some((i) => i.tempControlled) && (
                    <span className="text-[9px] font-bold text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-500/10 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                      <ThermometerSnowflake size={10} />
                      <span>{t.coldChain}</span>
                    </span>
                  )}
                </div>

                <div className="space-y-1.5">
                  {currentShipment.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-2 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.05] flex items-center justify-between text-xs"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="font-bold text-slate-900 dark:text-white truncate text-[11px]">{item.name}</div>
                        <div className="text-[9px] text-slate-400">{t.batch} #{item.batchNumber || 'NER-STD'}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">{item.quantity}</div>
                        {item.tempRange && <div className="text-[9px] text-blue-500 font-semibold">{item.tempRange}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column (col-span-7): Live Corridor Map, Milestones */}
            <div className="md:col-span-7 space-y-4">
              {/* 2. LIVE CORRIDOR MAP (CLEAN EMBED) */}
              <div className="bg-white dark:bg-[#0b1322] rounded-2xl border border-slate-200 dark:border-white/[0.08] overflow-hidden shadow-xs">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-white/[0.06] flex items-center justify-between bg-slate-50/70 dark:bg-white/[0.02]">
                  <div className="flex items-center gap-1.5">
                    <Compass size={14} className="text-orange-500" />
                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">{t.liveHighwayCorridor}</span>
                  </div>
                  
                  <button
                    onClick={() => setMapExpanded(!mapExpanded)}
                    className="text-[10px] font-bold text-orange-600 dark:text-orange-400 flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>{mapExpanded ? t.shrink : t.expand}</span>
                    <ChevronDown size={12} className={clsx('transition-transform', mapExpanded && 'rotate-180')} />
                  </button>
                </div>

                <div className={clsx('w-full relative transition-all duration-300', mapExpanded ? 'h-80 md:h-[450px]' : 'h-48 md:h-[320px]')}>
                  <MapContainer
                    center={currentVehicle?.currentLocation || [25.96, 91.88]}
                    zoom={9}
                    scrollWheelZoom={false}
                    style={{ width: '100%', height: '100%' }}
                    className="z-10"
                  >
                    <TileLayer
                      attribution='&copy; CARTO'
                      url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    />

                    {/* Primary route */}
                    <Polyline
                      positions={routeAPPath}
                      color="#ef4444"
                      weight={3.5}
                      dashArray="5, 5"
                      opacity={0.7}
                    />

                    {/* Safe Detour route */}
                    <Polyline
                      positions={routeBPath}
                      color="#10b981"
                      weight={4.5}
                      opacity={0.9}
                    />

                    {/* Origin */}
                    <Marker position={[26.14, 91.74]} icon={originIcon}>
                      <Popup><span className="text-xs font-bold">Guwahati Hub</span></Popup>
                    </Marker>

                    {/* Destination */}
                    <Marker position={[25.57, 91.88]} icon={destIcon}>
                      <Popup><span className="text-xs font-bold">{currentShipment.destinationFacility}</span></Popup>
                    </Marker>

                    {/* Hazard point */}
                    <Marker position={[25.85, 91.88]} icon={hazardIcon}>
                      <Popup><span className="text-xs font-bold text-red-600">Landslide Alert (NH-27)</span></Popup>
                    </Marker>

                    {/* Vehicle */}
                    {currentVehicle && (
                      <Marker position={currentVehicle.currentLocation} icon={truckIcon}>
                        <Popup>
                          <span className="text-xs font-bold">{currentVehicle.id} • {currentVehicle.driverName}</span>
                        </Popup>
                      </Marker>
                    )}
                  </MapContainer>

                  {/* Floating mini status badge on map */}
                  <div className="absolute bottom-2 left-2 right-2 z-[400] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-white/[0.1] flex items-center justify-between text-[9px] font-bold text-slate-700 dark:text-slate-300 shadow-sm">
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck size={12} />
                      <span>{t.detourActive} (NH-106)</span>
                    </span>
                    <span className="font-mono text-slate-500 dark:text-slate-400">
                      {t.speed}: <strong className="text-slate-900 dark:text-white">{currentVehicle?.currentSpeed || 44} km/h</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. ORDER MILESTONES (MINIMAL SVG STEPPER) */}
              <div className="bg-white dark:bg-[#0b1322] rounded-2xl p-3.5 border border-slate-200 dark:border-white/[0.08] shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <RefreshCw size={13} className="text-orange-500 animate-spin" style={{ animationDuration: '8s' }} />
                    <span>{t.trackingMilestones}</span>
                  </h3>
                  <span className="text-[9px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    {t.activeStep}
                  </span>
                </div>

                <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-white/[0.08]">
                  {currentShipment.milestones.map((m) => {
                    const isDone = m.status === 'completed';
                    const isCurrent = m.status === 'current';

                    return (
                      <div key={m.id} className="relative flex items-start gap-2.5 pl-0.5">
                        {/* SVG Step Circle */}
                        <div className={clsx(
                          'w-5 h-5 rounded-full flex items-center justify-center shrink-0 z-10 text-[10px] font-bold shadow-xs',
                          isDone
                            ? 'bg-emerald-500 text-white'
                            : isCurrent
                            ? 'bg-orange-500 text-white ring-3 ring-orange-500/25'
                            : 'bg-slate-100 dark:bg-white/[0.06] text-slate-400'
                        )}>
                          {isDone ? <Check size={11} strokeWidth={3} /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                        </div>

                        {/* Step Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className={clsx(
                              'text-[11px] font-bold truncate',
                              isCurrent ? 'text-orange-600 dark:text-orange-400' : 'text-slate-800 dark:text-slate-200'
                            )}>
                              {m.title}
                            </span>
                            <span className="text-[9px] font-mono text-slate-400 shrink-0">{m.timestamp}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                            {m.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── TAB 2: MY ORDERS / ALL SHIPMENTS (CLEAN LIST WITH + PLACE ORDER CTA) ── */}
      {activeTab === 'orders' && (
        <div className="w-full max-w-4xl mx-auto p-3.5 sm:p-6 space-y-3 pb-24 md:pb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-black text-slate-900 dark:text-white">{t.yourRequisitions}</h2>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">{t.manageConsignments}</p>
            </div>
            <button
              onClick={() => setShowOrderModal(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-orange-500 text-white font-bold text-xs shadow-sm hover:bg-orange-600 transition-all cursor-pointer"
            >
              <Plus size={13} strokeWidth={3} />
              <span>{t.newOrder}</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white placeholder-slate-400 outline-none"
            />
          </div>

          {/* Orders list */}
          <div className="space-y-2">
            {shipmentsList
              .filter(
                (s) =>
                  s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  s.commodityLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  s.destinationFacility.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((s) => {
                const isCurrent = s.id === currentShipment.id;
                const icon = COMMODITY_ICONS[s.commodity] || '📦';
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSelectedShipmentId(s.id);
                      setActiveTab('track');
                    }}
                    className={clsx(
                      'w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2.5',
                      isCurrent
                        ? 'bg-orange-50/80 dark:bg-orange-500/10 border-orange-400 dark:border-orange-500/40 shadow-xs ring-1 ring-orange-500/20'
                        : 'bg-white dark:bg-[#0b1322] border-slate-200/80 dark:border-white/[0.06] hover:border-slate-300'
                    )}
                  >
                    <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/[0.05] flex items-center justify-center text-lg shrink-0">
                      {icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400">
                          {s.id}
                        </span>
                        <span className={clsx(
                          'text-[8px] font-extrabold px-1.5 py-0.2 rounded uppercase',
                          s.status === 'ON_TIME' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300' :
                          'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300'
                        )}>
                          {s.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {s.commodityLabel}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        → {s.destinationFacility}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-[10px] font-mono font-bold text-slate-900 dark:text-white">
                        {s.expectedDeliveryTime}
                      </div>
                      <div className="text-[9px] text-slate-400">{t.eta}</div>
                    </div>

                    <ChevronRight size={14} className="text-slate-400 shrink-0" />
                  </button>
                );
              })}
          </div>
        </div>
      )}

      {/* ── TAB 3: HAZARDS & TERRAIN ── */}
      {activeTab === 'hazards' && (
        <div className="w-full max-w-4xl mx-auto p-3.5 sm:p-6 space-y-3 pb-24 md:pb-8 text-xs">
          <div>
            <h2 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">{t.corridorRoadHazards}</h2>
            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">{t.hazardsSubtitle}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {roads.map((r) => (
              <div
                key={r.id}
                className="p-3.5 rounded-2xl bg-white dark:bg-[#0b1322] border border-slate-200 dark:border-white/[0.08] shadow-xs"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">{r.name.split('—')[0]}</span>
                  <span className={clsx(
                    'text-[9px] font-bold px-2 py-0.5 rounded-full',
                    r.status === 'BLOCKED' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' :
                    r.status === 'HIGH_RISK' ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400' :
                    'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                  )}>
                    {r.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-600 dark:text-slate-400 mb-1.5">
                  <div>Risk: <strong className="text-slate-900 dark:text-white">{r.disruptionProbability}%</strong></div>
                  <div>Rain: <strong className="text-slate-900 dark:text-white">{r.rainfallForecast}mm</strong></div>
                </div>

                <div className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-white/[0.02] p-2 rounded-lg">
                  {r.reasons[0]}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 4: SOS EMERGENCY DESK ── */}
      {activeTab === 'sos' && (
        <div className="w-full max-w-4xl mx-auto p-3.5 sm:p-6 space-y-4 pb-24 md:pb-8 text-xs">
          <div>
            <h2 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">{t.emergencyLifeline}</h2>
            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">{t.sosSubtitle}</p>
          </div>

          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 space-y-2.5">
            <div className="flex items-center gap-2 font-bold text-red-700 dark:text-red-400 text-xs sm:text-sm">
              <AlertOctagon size={16} />
              <span>{t.sosAlertTitle}</span>
            </div>
            <p className="text-[11px] text-red-900/80 dark:text-red-200/90 leading-relaxed">
              {t.sosAlertDesc}
            </p>
            <a
              href="tel:1070"
              className="w-full sm:w-auto inline-flex px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <Phone size={13} />
              <span>{t.callSeocBtn}</span>
            </a>
          </div>

          <div className="bg-white dark:bg-[#0b1322] p-4 rounded-2xl border border-slate-200 dark:border-white/[0.08] space-y-2.5">
            <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">{t.directHelplines}</span>
            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-white/5 text-xs">
              <span>{t.logisticsControl}</span>
              <a href="tel:18003459090" className="font-mono font-bold text-orange-600 dark:text-orange-400">1800-345-9090</a>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-white/5 text-xs">
              <span>{t.healthServices}</span>
              <a href="tel:03612260033" className="font-mono font-bold text-blue-600 dark:text-blue-400">0361-2260033</a>
            </div>
            <div className="flex justify-between items-center py-2 text-xs">
              <span>{t.highwayHelpline}</span>
              <a href="tel:1033" className="font-mono font-bold text-slate-700 dark:text-slate-300">1033</a>
            </div>
          </div>
        </div>
      )}

      {/* ── BOTTOM TAB NAVIGATION BAR (CLEAN & SLEEK - MOBILE ONLY) ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-[#090f1c]/95 backdrop-blur-lg border-t border-slate-200/80 dark:border-white/[0.08] px-3 py-1.5 flex items-center justify-around select-none md:hidden">
        {[
          { id: 'track', label: t.tabLiveTrack, icon: <Package size={17} /> },
          { id: 'orders', label: t.tabMyOrders, icon: <Layers size={17} /> },
          { id: 'hazards', label: t.tabHazards, icon: <AlertTriangle size={17} /> },
          { id: 'sos', label: t.tabSos, icon: <Phone size={17} /> },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={clsx(
                'flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all cursor-pointer',
                isActive
                  ? 'text-orange-600 dark:text-orange-400 font-extrabold scale-105'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              )}
            >
              {tab.icon}
              <span className="text-[9px] tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* ── PLACE ORDER / REQUISITION MODAL ── */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#0d1627] text-slate-900 dark:text-white rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl p-4 sm:p-5 max-h-[88vh] overflow-y-auto">
            
            <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-slate-100 dark:border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-md">
                  <Package size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-black">{t.createRequisition}</h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">{t.requisitionDesc}</p>
                </div>
              </div>

              <button
                onClick={() => setShowOrderModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-3.5 text-xs">
              
              {/* 1. Category Presets */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t.itemCategory}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {COMMODITY_PRESETS.map((preset) => {
                    const isSelected = selectedPreset.type === preset.type;
                    return (
                      <button
                        type="button"
                        key={preset.type}
                        onClick={() => setSelectedPreset(preset)}
                        className={clsx(
                          'p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between',
                          isSelected
                            ? 'bg-orange-50 dark:bg-orange-500/15 border-orange-500 text-orange-950 dark:text-orange-100 ring-2 ring-orange-500/20'
                            : 'bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.08] hover:border-slate-300'
                        )}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-base">{preset.icon}</span>
                          {isSelected && <Check size={13} className="text-orange-500 font-bold" />}
                        </div>
                        <div className="text-[11px] font-extrabold leading-tight">{preset.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Custom Item Specification */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.selectItem}
                </label>
                <input
                  type="text"
                  placeholder={selectedPreset.label}
                  value={customItemName}
                  onChange={(e) => setCustomItemName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-xs outline-none focus:border-orange-500"
                />
              </div>

              {/* 3. Destination Facility */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.destinationFacility}
                </label>
                <select
                  value={selectedDest.id}
                  onChange={(e) => {
                    const found = DESTINATIONS.find((d) => d.id === e.target.value);
                    if (found) setSelectedDest(found);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-xs font-semibold outline-none cursor-pointer"
                >
                  {DESTINATIONS.map((d) => (
                    <option key={d.id} value={d.id} className="bg-white dark:bg-slate-900">
                      {d.name} ({d.region})
                    </option>
                  ))}
                </select>
              </div>

              {/* 4. Priority Level */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t.priorityLevel}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'CRITICAL', label: '🚨 Lifeline SOS', desc: 'Max Priority 100' },
                    { id: 'HIGH', label: '⚡ Urgent', desc: 'Priority 85' },
                    { id: 'STANDARD', label: '📦 Standard', desc: 'Priority 65' },
                  ].map((p) => {
                    const isSelected = orderUrgency === p.id;
                    return (
                      <button
                        type="button"
                        key={p.id}
                        onClick={() => setOrderUrgency(p.id as any)}
                        className={clsx(
                          'p-2 rounded-xl border text-center transition-all cursor-pointer',
                          isSelected
                            ? 'bg-slate-900 text-white dark:bg-orange-500 border-slate-900 dark:border-orange-500 font-bold shadow-xs'
                            : 'bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-slate-400'
                        )}
                      >
                        <div className="text-[10px] font-black">{p.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmittingOrder}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs shadow-md shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
                >
                  {isSubmittingOrder ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>{t.submitting}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={15} />
                      <span>{t.submitOrder}</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ── DIGITAL WAYBILL QR POPUP MODAL ── */}
      {showWaybillModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-xs bg-white dark:bg-[#0d1627] text-slate-900 dark:text-white rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl p-5 text-center relative">
            <button
              onClick={() => setShowWaybillModal(false)}
              className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="w-12 h-12 mx-auto rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/25 mb-3">
              <QrCode size={24} />
            </div>

            <h3 className="text-sm font-black mb-0.5">{t.pass}</h3>
            <p className="text-[10px] text-slate-500 font-mono">#{currentShipment.trackingNumber}</p>

            {/* Mock QR SVG representation */}
            <div className="my-4 p-3 rounded-2xl bg-slate-100 dark:bg-white p-4 mx-auto w-44 h-44 flex flex-col items-center justify-center border border-slate-200">
              <div className="w-full h-full bg-slate-900 rounded-lg flex items-center justify-center text-white text-xs font-mono p-2">
                <QrCode size={110} className="text-white" />
              </div>
            </div>

            <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
              Present at highway checkpost or destination hospital gate for contactless scan.
            </div>

            <button
              onClick={() => setShowWaybillModal(false)}
              className="mt-4 w-full py-2 rounded-xl bg-slate-900 dark:bg-white/10 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
