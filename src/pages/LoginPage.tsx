import { useState } from 'react';
import { Shield, Truck, Building2, AlertTriangle, ArrowRight, Sun, Moon } from 'lucide-react';
import clsx from 'clsx';
import { useAppStore } from '../store/useAppStore';
import { Logo } from '../components/ui/Logo';

const roles = [
  { id: 'Admin',                icon: <Shield size={16} />,       desc: 'Full platform access' },
  { id: 'District Authority',   icon: <Building2 size={16} />,    desc: 'District-level view' },
  { id: 'Logistics Operator',   icon: <Truck size={16} />,        desc: 'Fleet & shipment ops' },
  { id: 'Emergency Coordinator',icon: <AlertTriangle size={16} />,desc: 'Emergency response' },
];

export default function LoginPage() {
  const { login, theme, toggleTheme } = useAppStore();
  const [selectedRole, setSelectedRole] = useState('Admin');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      login(selectedRole);
      setLoading(false);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] flex items-center justify-center relative overflow-hidden transition-colors duration-300">

      {/* Top right theme toggle */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.1] text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm backdrop-blur-md hover:scale-105 transition-all"
        >
          {theme === 'dark' ? (
            <>
              <Sun size={14} className="text-amber-400" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon size={14} className="text-indigo-600" />
              <span>Dark Mode</span>
            </>
          )}
        </button>
      </div>

      {/* Background gradient blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-orange-500/[0.08] dark:bg-orange-600/[0.06] rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-red-500/[0.06] dark:bg-red-600/[0.05] rounded-full blur-[100px]" />
        <div className="absolute top-1/3 right-1/3 w-[300px] h-[300px] bg-blue-500/[0.05] dark:bg-blue-600/[0.04] rounded-full blur-[80px]" />
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
      </div>

      <div className="relative w-full max-w-md px-4 py-8">

        {/* Brand */}
        <div className="text-center mb-8">
          <Logo size="lg" className="justify-center mb-3" />
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">PurvaSaarthi</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1.5 leading-relaxed font-medium">
            NER Logistics Resilience & Cascade Intelligence
          </p>
        </div>

        {/* Login card */}
        <div className="bg-white/90 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] rounded-2xl p-7 shadow-xl dark:shadow-2xl backdrop-blur-md">

          <div className="mb-5">
            <h2 className="text-slate-900 dark:text-white font-semibold text-lg">Sign In</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Access the Operations Platform</p>
          </div>

          <div className="space-y-4 mb-5">
            <div>
              <label className="block text-slate-700 dark:text-slate-400 text-xs font-semibold mb-1.5">Email Address</label>
              <input
                type="email"
                defaultValue="admin@ner.gov.in"
                className="w-full bg-slate-50 dark:bg-white/[0.05] border border-slate-300 dark:border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-400 text-xs font-semibold mb-1.5">Password</label>
              <input
                type="password"
                defaultValue="password"
                className="w-full bg-slate-50 dark:bg-white/[0.05] border border-slate-300 dark:border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
              />
            </div>
          </div>

          {/* Role selector */}
          <div className="mb-6">
            <label className="block text-slate-700 dark:text-slate-400 text-xs font-semibold mb-2">Access Role</label>
            <div className="grid grid-cols-2 gap-2">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={clsx(
                    'flex items-center gap-2 px-3 py-2.5 rounded-lg border text-left transition-all duration-150',
                    selectedRole === role.id
                      ? 'bg-orange-50 border-orange-300 text-orange-700 dark:bg-orange-500/10 dark:border-orange-500/30 dark:text-orange-300 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-600 dark:bg-white/[0.03] dark:border-white/[0.06] dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20 hover:text-slate-900 dark:hover:text-slate-200'
                  )}
                >
                  <span className={selectedRole === role.id ? 'text-orange-600 dark:text-orange-400' : 'text-slate-500'}>
                    {role.icon}
                  </span>
                  <div>
                    <div className="text-xs font-semibold leading-tight">{role.id}</div>
                    <div className="text-[10px] opacity-75 leading-tight mt-0.5">{role.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-60 cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)' }}
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Access Operations Center</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>

        {/* Footer stats */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="pulse-dot green" />
            <span className="text-emerald-700 dark:text-green-400 text-xs font-semibold">All systems operational</span>
          </div>
          <div className="flex items-center justify-center gap-3 text-slate-500 dark:text-slate-500 text-xs">
            <span>24 Roads Monitored</span>
            <span>•</span>
            <span>18 Active Vehicles</span>
            <span>•</span>
            <span>12 Districts</span>
          </div>
          <p className="text-slate-400 dark:text-slate-600 text-[10px] mt-3">
            PurvaSaarthi MVP — Hackathon Prototype • NER Logistics Intelligence
          </p>
        </div>
      </div>
    </div>
  );
}
