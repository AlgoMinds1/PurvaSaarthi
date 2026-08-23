import { create } from 'zustand';
import type { Alert } from '../types';
import { alerts as initialAlerts } from '../data/mockData';

export type AppView =
  | 'command'
  | 'map'
  | 'roads'
  | 'supply'
  | 'districts'
  | 'alerts'
  | 'vehicles';

export type ThemeMode = 'dark' | 'light';

interface AppState {
  // Theme
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (t: ThemeMode) => void;

  // Auth
  isLoggedIn: boolean;
  userRole: string;
  authFlowState: 'landing' | 'login';
  goToLogin: () => void;
  goToLanding: () => void;
  login: (role: string) => void;
  logout: () => void;

  // Navigation
  activeView: AppView;
  setView: (v: AppView) => void;

  // Emergency mode
  emergencyMode: boolean;
  toggleEmergency: () => void;

  // Alerts
  alerts: Alert[];
  markAlertRead: (id: string) => void;
  unreadCount: number;

  // Language
  language: 'en' | 'hi' | 'as' | 'bn';
  setLanguage: (l: 'en' | 'hi' | 'as' | 'bn') => void;

  // Reroute modal
  rerouteModalOpen: boolean;
  openRerouteModal: () => void;
  closeRerouteModal: () => void;

  // Vehicle Tracking on Map
  selectedVehicleId: string | null;
  trackVehicleOnMap: (id: string) => void;
  clearSelectedVehicle: () => void;

  // Consignee / User Delivery Tracking PWA
  selectedShipmentId: string;
  setSelectedShipmentId: (id: string) => void;

  // Driver Navigation & Rerouting PWA
  isDriverRerouted: boolean;
  driverTripStatus: 'IN_TRANSIT' | 'REROUTED' | 'ARRIVED' | 'DELIVERED';
  acceptDriverReroute: () => void;
  setDriverTripStatus: (st: 'IN_TRANSIT' | 'REROUTED' | 'ARRIVED' | 'DELIVERED') => void;

  // Mobile Simulator / Viewport Mode for Desktop
  mobilePreviewMode: 'phone' | 'fullscreen';
  toggleMobilePreviewMode: () => void;

  // Offline Simulation for Field/Driver PWA
  isOffline: boolean;
  toggleOffline: () => void;
  offlineQueue: { id: string; timestamp: string; title: string }[];
  addOfflineAction: (title: string) => void;
  syncOfflineQueue: () => void;

  // Cascading Disruption Simulation
  cascadeModalOpen: boolean;
  simulatedRoadId: string | null;
  cascadeStep: number;
  openCascadeModal: () => void;
  closeCascadeModal: () => void;
  setSimulatedRoadId: (id: string | null) => void;
  setCascadeStep: (step: number) => void;
  resetCascadeSimulation: () => void;

  // AI Explainability & Data Trust Drawer
  explainabilityDrawerOpen: boolean;
  explainTarget: { type: 'road' | 'shipment' | 'district'; id: string } | null;
  openExplainabilityDrawer: (type: 'road' | 'shipment' | 'district', id: string) => void;
  closeExplainabilityDrawer: () => void;
}

const getInitialTheme = (): ThemeMode => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('purvasaarthi-theme');
    if (saved === 'light' || saved === 'dark') return saved;
  }
  return 'light'; // Default to light or dual theme
};

export const useAppStore = create<AppState>((set) => ({
  theme: getInitialTheme(),
  toggleTheme: () =>
    set((s) => {
      const nextTheme = s.theme === 'dark' ? 'light' : 'dark';
      if (typeof window !== 'undefined') {
        localStorage.setItem('purvasaarthi-theme', nextTheme);
        if (nextTheme === 'dark') {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light');
        } else {
          document.documentElement.classList.add('light');
          document.documentElement.classList.remove('dark');
        }
      }
      return { theme: nextTheme };
    }),
  setTheme: (theme) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('purvasaarthi-theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      }
    }
    set({ theme });
  },

  isLoggedIn: false,
  userRole: 'Admin',
  authFlowState: 'landing',
  goToLogin: () => set({ authFlowState: 'login' }),
  goToLanding: () => set({ authFlowState: 'landing' }),
  login: (role) => {
    let defaultView: AppView = 'command';
    let defaultVehicle: string | null = null;
    if (role === 'User') {
      defaultView = 'map';
    } else if (role === 'Truck Driver') {
      defaultView = 'vehicles';
      defaultVehicle = 'TRK-204';
    }
    set({
      isLoggedIn: true,
      userRole: role,
      activeView: defaultView,
      selectedVehicleId: defaultVehicle,
    });
  },
  logout: () => set({ isLoggedIn: false, authFlowState: 'landing', userRole: 'Admin', selectedVehicleId: null }),

  activeView: 'command',
  setView: (v) => set({ activeView: v }),

  emergencyMode: false,
  toggleEmergency: () => set((s) => ({ emergencyMode: !s.emergencyMode })),

  alerts: initialAlerts,
  markAlertRead: (id) =>
    set((s) => ({
      alerts: s.alerts.map((a) => (a.id === id ? { ...a, read: true } : a)),
      unreadCount: s.alerts.filter((a) => !a.read && a.id !== id).length,
    })),
  unreadCount: initialAlerts.filter((a) => !a.read).length,

  language: 'en',
  setLanguage: (l) => set({ language: l }),

  rerouteModalOpen: false,
  openRerouteModal: () => set({ rerouteModalOpen: true }),
  closeRerouteModal: () => set({ rerouteModalOpen: false }),

  selectedVehicleId: null,
  trackVehicleOnMap: (id) => set({ selectedVehicleId: id, activeView: 'map' }),
  clearSelectedVehicle: () => set({ selectedVehicleId: null }),

  // User delivery tracking
  selectedShipmentId: 'SHIP-104',
  setSelectedShipmentId: (id) => set({ selectedShipmentId: id }),

  // Driver navigation state
  isDriverRerouted: false,
  driverTripStatus: 'IN_TRANSIT',
  acceptDriverReroute: () =>
    set((s) => {
      const newAlert: Alert = {
        id: `ALT-REROUTE-${Date.now()}`,
        severity: 'INFO',
        title: {
          en: 'Driver TRK-204 Accepted Safe Detour via NH-106',
          hi: 'चालक TRK-204 ने NH-106 से सुरक्षित मार्ग स्वीकार किया',
          as: 'চালক TRK-204 এ NH-106 ৰে সুৰক্ষিত পথ গ্ৰহণ কৰিলে',
          bn: 'চালক TRK-204 NH-106 দিয়ে নিরাপদ পথ গ্রহণ করেছে',
        },
        body: {
          en: 'Vehicle TRK-204 (Shipment #104 - Critical Medicines) has transitioned to NH-106 Bypass. Disruption risk reduced from 91% to 24%. Destination ETA adjusted to 6:15 PM.',
          hi: 'वाहन TRK-204 ने NH-106 बाईपास का रुख किया है। जोखिम 91% से घटकर 24% हो गया।',
          as: 'যানবাহন TRK-204 NH-106 বাইপাছলৈ স্থানান্তৰিত হৈছে।',
          bn: 'যানবাহন TRK-204 NH-106 বাইপাসে স্থানান্তরিত হয়েছে।',
        },
        timestamp: 'Just now',
        districtId: 'dist-x',
        shipmentId: 'SHIP-104',
        read: false,
        actionRequired: false,
      };
      return {
        isDriverRerouted: true,
        driverTripStatus: 'REROUTED',
        alerts: [newAlert, ...s.alerts],
        unreadCount: s.unreadCount + 1,
      };
    }),
  setDriverTripStatus: (driverTripStatus) => set({ driverTripStatus }),

  // Mobile preview mode for desktop users
  mobilePreviewMode: 'phone',
  toggleMobilePreviewMode: () =>
    set((s) => ({ mobilePreviewMode: s.mobilePreviewMode === 'phone' ? 'fullscreen' : 'phone' })),

  // Offline simulation
  isOffline: false,
  toggleOffline: () => set((s) => ({ isOffline: !s.isOffline })),
  offlineQueue: [],
  addOfflineAction: (title) =>
    set((s) => ({
      offlineQueue: [
        ...s.offlineQueue,
        { id: `OFF-${Date.now()}`, timestamp: new Date().toLocaleTimeString(), title },
      ],
    })),
  syncOfflineQueue: () => set({ offlineQueue: [] }),

  // Cascade simulation state
  cascadeModalOpen: false,
  simulatedRoadId: 'road-nh27',
  cascadeStep: 0,
  openCascadeModal: () => set({ cascadeModalOpen: true }),
  closeCascadeModal: () => set({ cascadeModalOpen: false }),
  setSimulatedRoadId: (id) => set({ simulatedRoadId: id }),
  setCascadeStep: (step) => set({ cascadeStep: step }),
  resetCascadeSimulation: () => set({ cascadeStep: 0, simulatedRoadId: 'road-nh27' }),

  // Explainability drawer state
  explainabilityDrawerOpen: false,
  explainTarget: null,
  openExplainabilityDrawer: (type, id) =>
    set({ explainabilityDrawerOpen: true, explainTarget: { type, id } }),
  closeExplainabilityDrawer: () =>
    set({ explainabilityDrawerOpen: false, explainTarget: null }),
}));

