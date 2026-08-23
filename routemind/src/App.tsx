import { useEffect } from 'react';
import './index.css';
import { useAppStore } from './store/useAppStore';
import LoginPage from './pages/LoginPage';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import CommandCenter from './pages/CommandCenter';
import LiveMap from './pages/LiveMap';
import RoadIntelligence from './pages/RoadIntelligence';
import SupplyAtRisk from './pages/SupplyAtRisk';
import DistrictIntelligence from './pages/DistrictIntelligence';
import AlertCenter from './pages/AlertCenter';
import VehicleTracking from './pages/VehicleTracking';
import { RerouteModal } from './components/ui/RerouteModal';

function AppShell() {
  const { activeView, theme } = useAppStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const views: Record<string, React.ReactNode> = {
    command: <CommandCenter />,
    map: <LiveMap />,
    roads: <RoadIntelligence />,
    supply: <SupplyAtRisk />,
    districts: <DistrictIntelligence />,
    alerts: <AlertCenter />,
    vehicles: <VehicleTracking />,
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-base)] text-[var(--text-primary)]">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar />
        <main className="flex-1 min-h-0 overflow-hidden bg-[var(--bg-main)]">
          {views[activeView] ?? <CommandCenter />}
        </main>
      </div>
      <RerouteModal />
    </div>
  );
}

export default function App() {
  const { isLoggedIn, theme } = useAppStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return isLoggedIn ? <AppShell /> : <LoginPage />;
}
