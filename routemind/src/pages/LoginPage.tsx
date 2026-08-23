import { useState } from 'react';
import { Shield, Truck, Building2, AlertTriangle, ArrowRight, Radio } from 'lucide-react';
import clsx from 'clsx';
import { useAppStore } from '../store/useAppStore';

const roles = [
  { id: 'Admin',                icon: <Shield size={16} />,       desc: 'Full platform access' },
  { id: 'District Authority',   icon: <Building2 size={16} />,    desc: 'District-level view' },
  { id: 'Logistics Operator',   icon: <Truck size={16} />,        desc: 'Fleet & shipment ops' },
  { id: 'Emergency Coordinator',icon: <AlertTriangle size={16} />,desc: 'Emergency response' },
];

export default function LoginPage() {
  const { login } = useAppStore();
  const [selectedRole, setSelectedRole] = useState('Admin');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      login(selectedRole);
      setLoading(false);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-[#070d16] flex items-center justify-center relative overflow-hidden">

      {/* Background gradient blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-orange-600/[0.06] rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-red-600/[0.05] rounded-full blur-[100px]" />
        <div className="absolute top-1/3 right-1/3 w-[300px] h-[300px] bg-blue-600/[0.04] rounded-full blur-[80px]" />
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
      </div>

      <div className="relative w-full max-w-md px-4">

        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
            <svg viewBox="0 0 40 40" fill="none" className="w-full h-full drop-shadow-2xl">
              <path d="M20 4L34 12V28L20 36L6 28V12L20 4Z"
                fill="url(#loginGrad)" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
              <path d="M20 10L28 14.5V23.5L20 28L12 23.5V14.5L20 10Z" fill="rgba(255,255,255,0.1)"/>
              <circle cx="20" cy="19" r="4" fill="white" fillOpacity="0.9"/>
              <defs>
                <linearGradient id="loginGrad" x1="6" y1="4" x2="34" y2="36">
                  <stop offset="0%" stopColor="#f97316"/>
                  <stop offset="100%" stopColor="#ef4444"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">RouteMind</h1>
          <p className="text-slate-500 text-sm mt-1.5 leading-relaxed">
            NER Logistics Resilience & Cascade Intelligence
          </p>
        </div>

        {/* Login card */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-7 backdrop-blur-sm">

          <div className="mb-5">
            <h2 className="text-white font-semibold text-lg">Sign In</h2>
            <p className="text-slate-500 text-sm mt-0.5">Access the Operations Platform</p>
          </div>

          <div className="space-y-4 mb-5">
            <div>
              <label className="block text-slate-400 text-xs font-medium mb-1.5">Email Address</label>
              <input
                type="email"
                defaultValue="admin@ner.gov.in"
                className="w-full bg-white/[0.05] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:bg-white/[0.07] transition-all"
              />
            </div>
            <div>
              <label className="block text-slate-400 text-xs font-medium mb-1.5">Password</label>
              <input
                type="password"
                defaultValue="password"
                className="w-full bg-white/[0.05] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:bg-white/[0.07] transition-all"
              />
            </div>
          </div>

          {/* Role selector */}
          <div className="mb-6">
            <label className="block text-slate-400 text-xs font-medium mb-2">Access Role</label>
            <div className="grid grid-cols-2 gap-2">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={clsx(
                    'flex items-center gap-2 px-3 py-2.5 rounded-lg border text-left transition-all duration-150',
                    selectedRole === role.id
                      ? 'bg-orange-500/10 border-orange-500/30 text-orange-300'
                      : 'bg-white/[0.03] border-white/[0.06] text-slate-400 hover:border-white/20 hover:text-slate-300'
                  )}
                >
                  <span className={selectedRole === role.id ? 'text-orange-400' : 'text-slate-500'}>
                    {role.icon}
                  </span>
                  <div>
                    <div className="text-xs font-semibold leading-tight">{role.id}</div>
                    <div className="text-[10px] opacity-60 leading-tight mt-0.5">{role.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 disabled:opacity-60"
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
        <div className="mt-5 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-2">
            <span className="pulse-dot green" />
            <span className="text-green-400 text-xs font-medium">All systems operational</span>
          </div>
          <div className="flex items-center justify-center gap-3 text-slate-600 text-xs">
            <span>24 Roads Monitored</span>
            <span>•</span>
            <span>18 Active Vehicles</span>
            <span>•</span>
            <span>12 Districts</span>
          </div>
          <p className="text-slate-700 text-[10px] mt-3">
            RouteMind MVP — Hackathon Prototype • NER Logistics Intelligence
          </p>
        </div>
      </div>
    </div>
  );
}
