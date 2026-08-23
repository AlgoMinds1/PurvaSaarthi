import { useState } from 'react';
import { Shield, Truck, User, ArrowRight, ArrowLeft, Sun, Moon } from 'lucide-react';
import clsx from 'clsx';
import { useAppStore } from '../store/useAppStore';

const roles = [
  {
    id: 'Admin',
    name: 'Admin / Command Authority',
    email: 'admin@purvasaarthi.gov.in',
    icon: <Shield size={18} className="text-orange-500" />,
    desc: 'Command dashboard, GIS layers, cascade models & regional coordination',
  },
  {
    id: 'User',
    name: 'User / Consignee PWA',
    email: 'consignee.hospital@purvasaarthi.gov.in',
    icon: <User size={18} className="text-blue-500" />,
    desc: 'Track delivery dispatches, arrival countdowns, milestones & highway conditions',
  },
  {
    id: 'Truck Driver',
    name: 'Truck Driver Navigation PWA',
    email: 'driver.trk204@logistics.in',
    icon: <Truck size={18} className="text-emerald-500" />,
    desc: 'Turn-by-turn road tracking, hazard alerts, AI detours & safe layby shelters',
  },
];

export default function LoginPage() {
  const { login, goToLanding, theme, toggleTheme } = useAppStore();
  const [selectedRole, setSelectedRole] = useState('Admin');
  const [email, setEmail] = useState('admin@purvasaarthi.gov.in');
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    const targetRole = roles.find((r) => r.id === roleId);
    if (targetRole) {
      setEmail(targetRole.email);
    }
  };

  const handleLogin = (roleToLogin?: string) => {
    const role = roleToLogin ?? selectedRole;
    setLoading(true);
    setTimeout(() => {
      login(role);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] flex items-center justify-center relative overflow-hidden transition-colors duration-300 py-12">

      {/* Top Navigation Bar in Login */}
      <div className="absolute top-6 left-6 right-6 z-20 flex items-center justify-between pointer-events-none">
        <button
          onClick={goToLanding}
          className="pointer-events-auto flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.1] text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm backdrop-blur-md hover:scale-105 transition-all cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Back to Overview</span>
        </button>

        <button
          onClick={toggleTheme}
          className="pointer-events-auto flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.1] text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm backdrop-blur-md hover:scale-105 transition-all cursor-pointer"
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
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
      </div>

      {/* Main 2-Column Split Layout Container */}
      <div className="relative z-10 w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">

          {/* Left Column: Big Logo, Brand Name & Tagline */}
          {/* Left Column: Big Logo, Brand Name & Tagline */}
          <div className="lg:col-span-6 flex flex-col items-center text-center">
            
            {/* Big Emblem Logo */}
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-white dark:bg-white/[0.04] p-3.5 shadow-xl border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-md flex items-center justify-center mb-6 mx-auto">
              <img
                src="/logo.svg"
                alt="PurvaSaarthi Logo"
                className="w-full h-full object-contain drop-shadow-lg"
              />
            </div>

            {/* Brand Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-3 leading-tight">
              PurvaSaarthi
            </h1>

            {/* Tagline */}
            <p className="text-base sm:text-lg font-bold text-orange-600 dark:text-orange-400 mb-3 tracking-wide max-w-lg">
              NER Logistics Resilience &amp; Cascade Intelligence Platform
            </p>

            {/* Mission Statement */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg mb-8 font-normal">
              Predicting lifeline highway disruptions, eliminating cascading district isolation risks, and orchestrating dynamic proactive rerouting across 8 North-Eastern states.
            </p>

            {/* Value Pillars List */}
            <div className="space-y-2.5 w-full max-w-md hidden sm:block mx-auto text-left">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/70 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/[0.06] text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-2xs">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                <span>Multi-Hazard Landslide &amp; Weather Disruption AI</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/70 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/[0.06] text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-2xs">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0" />
                <span>Single Point of Failure (SPOF) Isolation Simulation</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/70 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/[0.06] text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-2xs">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                <span>Proactive Turnaround &amp; pgRouting Detour Engine</span>
              </div>
            </div>

          </div>

          {/* Right Column: Dedicated Login Card */}
          <div className="lg:col-span-6 w-full max-w-md mx-auto lg:max-w-none">
            <div className="bg-white/90 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] rounded-2xl p-6 sm:p-7 shadow-xl dark:shadow-2xl backdrop-blur-md">

              <div className="mb-5">
                <h2 className="text-slate-900 dark:text-white font-bold text-xl">Sign In to Platform</h2>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Select one of the 3 dedicated operational portals:</p>
              </div>

              {/* Role selector */}
              <div className="mb-5 space-y-2">
                <div className="text-slate-700 dark:text-slate-400 text-xs font-semibold">Select Login Portal</div>
                <div className="grid grid-cols-1 gap-2.5">
                  {roles.map((role) => {
                    const isSelected = selectedRole === role.id;
                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => handleRoleSelect(role.id)}
                        className={clsx(
                          'flex items-center gap-3.5 p-3 rounded-xl border text-left transition-all cursor-pointer group',
                          isSelected
                            ? 'bg-orange-50/90 border-orange-400 dark:bg-orange-500/15 dark:border-orange-500/40 shadow-xs'
                            : 'bg-slate-50 border-slate-200 dark:bg-white/[0.02] dark:border-white/[0.06] hover:border-slate-300 dark:hover:border-white/20'
                        )}
                      >
                        <div className={clsx(
                          'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors',
                          isSelected ? 'bg-white dark:bg-white/10 shadow-xs' : 'bg-slate-200/60 dark:bg-white/5'
                        )}>
                          {role.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">{role.name}</span>
                            {isSelected && (
                              <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">Active</span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">{role.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Credentials Inputs */}
              <div className="space-y-3.5 mb-5">
                <div>
                  <label className="block text-slate-700 dark:text-slate-400 text-xs font-semibold mb-1">Email / SSO Identifier</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-white/[0.05] border border-slate-300 dark:border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-400 text-xs font-semibold mb-1">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-white/[0.05] border border-slate-300 dark:border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  />
                </div>
              </div>

              <button
                onClick={() => handleLogin()}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-60 cursor-pointer active:scale-[0.99]"
                style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)' }}
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In as {selectedRole}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              {/* Status footer */}
              <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-white/[0.06] flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="pulse-dot green" /> Systems Operational
                </span>
                <span>NER Logistics Net</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
