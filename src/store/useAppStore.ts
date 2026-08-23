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
}));
