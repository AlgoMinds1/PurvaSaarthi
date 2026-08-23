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
}

const getInitialTheme = (): ThemeMode => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('routemind-theme');
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
        localStorage.setItem('routemind-theme', nextTheme);
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
      localStorage.setItem('routemind-theme', theme);
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
  login: (role) => set({ isLoggedIn: true, userRole: role }),
  logout: () => set({ isLoggedIn: false, userRole: 'Admin' }),

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
}));
