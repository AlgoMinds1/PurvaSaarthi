import {
  ArrowRight, Shield, Route, Truck, Building2, User,
  Sparkles, CloudRain, Navigation, CheckCircle2,
  Sun, Moon
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Logo } from '../components/ui/Logo';

export default function LandingPage() {
  const { goToLogin, login, theme, toggleTheme } = useAppStore();

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-300 flex flex-col selection:bg-orange-500 selection:text-white">
      
      {/* ── TOP NAVIGATION ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-[#090f1c]/80 border-b border-slate-200/80 dark:border-white/[0.08] transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Logo size="sm" withText />
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#capabilities" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">Capabilities</a>
            <a href="#coverage" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">NER Network</a>
            <a href="#architecture" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">Architecture</a>
            <a href="#roles" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">Operational Roles</a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-white/[0.1] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-colors cursor-pointer"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            <button
              onClick={goToLogin}
              className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md hover:shadow-lg shadow-orange-500/25 flex items-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <span>Sign In</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO SECTION ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32">
        {/* Background Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-orange-500/20 to-amber-500/10 dark:from-orange-500/15 dark:to-red-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            
            {/* Government / Initiative Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/25 text-orange-700 dark:text-orange-400 text-xs font-bold mb-6 tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>NORTH EAST REGIONAL LOGISTICS RESILIENCE INITIATIVE</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15] mb-6">
              Predictive Logistics Resilience for <span className="gradient-text-orange">North East India</span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-10 font-normal">
              PurvaSaarthi anticipates highway corridor disruptions, halts cascading district isolation bottlenecks, and orchestrates dynamic proactive rerouting across 8 North-Eastern states.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={goToLogin}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-base shadow-xl shadow-orange-500/30 flex items-center justify-center gap-3 transition-all cursor-pointer group active:scale-95"
              >
                <span>Launch Operations Platform</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => login('Admin')}
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-white dark:bg-white/[0.05] hover:bg-slate-50 dark:hover:bg-white/[0.08] text-slate-900 dark:text-white border border-slate-200 dark:border-white/[0.1] font-bold text-base shadow-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer active:scale-95"
              >
                <Sparkles size={17} className="text-orange-500" />
                <span>Instant Demo Access</span>
              </button>
            </div>

          </div>

          {/* ── HERO PLATFORM PREVIEW CARD ──────────────────────────────────── */}
          <div className="mt-14 relative max-w-5xl mx-auto">
            <div className="glass-card rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-white/[0.1] shadow-2xl overflow-hidden">
              
              {/* Preview Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200/80 dark:border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400 ml-2">purvasaarthi.gov.in/command</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    LIVE OPS
                  </span>
                </div>
              </div>

              {/* Grid Preview inside Hero */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.04]">
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold text-orange-600 dark:text-orange-400">
                    <Route size={16} />
                    <span>Single Point of Failure (SPOF)</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white mb-1">NH-06 Meghalaya Corridor</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Disruption Probability: <span className="text-red-500 font-bold">91%</span> (Rainfall + Slope Hazard)
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.04]">
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold text-blue-600 dark:text-blue-400">
                    <Truck size={16} />
                    <span>Fleet Reroute Coordination</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white mb-1">Vehicle TRK-204 (Medicine #104)</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Alternative Path: <span className="text-emerald-500 font-bold">Guwahati → Nagaon (+42 min)</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.04]">
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold text-purple-600 dark:text-purple-400">
                    <Building2 size={16} />
                    <span>Downstream District Stock</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white mb-1">District X Hospital Depots</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Protected Reserve: <span className="text-amber-500 font-bold">1.7 Days Remaining</span>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ── KEY METRICS RIBBON ────────────────────────────────────────────── */}
      <section id="coverage" className="py-12 bg-slate-50 dark:bg-[#070c17] border-y border-slate-200 dark:border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            
            <div className="p-4">
              <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-1">8 States</div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Complete North East Coverage</div>
            </div>

            <div className="p-4">
              <div className="text-3xl sm:text-4xl font-black text-orange-500 mb-1">24+ Corridors</div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Critical Highways & River Crossings</div>
            </div>

            <div className="p-4">
              <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-1">&lt; 15 min</div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Early Action Turnaround Window</div>
            </div>

            <div className="p-4">
              <div className="text-3xl sm:text-4xl font-black text-emerald-500 mb-1">100% Sync</div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Offline-First Field Verification</div>
            </div>

          </div>
        </div>
      </section>

      {/* ── CORE CAPABILITIES ─────────────────────────────────────────────── */}
      <section id="capabilities" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-orange-500 tracking-wider uppercase mb-2">Core Intelligence Loop</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Built Specifically for the Geography of the North East
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Pillar 1 */}
            <div className="glass-card p-7 rounded-2xl border border-slate-200 dark:border-white/[0.08] hover:border-orange-500/40 transition-all duration-300 shadow-sm flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5">
                <CloudRain size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2.5">
                Multi-Hazard Disruption Forecasting
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed flex-1">
                Fuses real-time precipitation forecast data, terrain slope gradient models, and historical landslide points to predict corridor vulnerability hours before blockage occurs.
              </p>
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/[0.06] text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-500" />
                <span>IMD precipitation & slope angles</span>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="glass-card p-7 rounded-2xl border border-slate-200 dark:border-white/[0.08] hover:border-orange-500/40 transition-all duration-300 shadow-sm flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-5">
                <Building2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2.5">
                Single Point of Failure (SPOF) Isolation
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed flex-1">
                Connected-components graph intelligence maps how road closures cascade to isolate hospitals, food grain reserves, and fuel storage in vulnerable hill districts.
              </p>
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/[0.06] text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-500" />
                <span>District stock depletion projections</span>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="glass-card p-7 rounded-2xl border border-slate-200 dark:border-white/[0.08] hover:border-orange-500/40 transition-all duration-300 shadow-sm flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5">
                <Navigation size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2.5">
                Dynamic Proactive Rerouting
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed flex-1">
                Calculates compliant, safe alternative routes with live GPS fleet redirection, driver SMS/multilingual dispatching, and last safe turnaround milestone tracking.
              </p>
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/[0.06] text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-500" />
                <span>pgRouting weighted road graphs</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── OPERATIONAL ROLES ─────────────────────────────────────────────── */}
      <section id="roles" className="py-16 bg-slate-50 dark:bg-[#070c17] border-y border-slate-200 dark:border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-orange-500 tracking-wider uppercase mb-2">Designed For Key Stakeholders</h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Tailored Workflows Across The Chain of Command
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            
            <div
              onClick={() => login('Admin')}
              className="p-5 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] hover:border-orange-500/50 transition-all cursor-pointer text-center group"
            >
              <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400 flex items-center justify-center mx-auto mb-3.5 group-hover:scale-105 transition-transform">
                <Shield size={22} />
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white mb-1">1. Admin Portal</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-3">State & district command, AI disruption models, reroute authorizations & critical supply depots.</div>
              <span className="text-xs font-bold text-orange-600 dark:text-orange-400 inline-flex items-center gap-1">
                Enter as Admin <ArrowRight size={12} />
              </span>
            </div>

            <div
              onClick={() => login('User')}
              className="p-5 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] hover:border-orange-500/50 transition-all cursor-pointer text-center group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-3.5 group-hover:scale-105 transition-transform">
                <User size={22} />
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white mb-1">2. User / Citizen Portal</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-3">Public highway advisory, live corridor status, weather warning alerts & district accessibility.</div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 inline-flex items-center gap-1">
                Enter as User <ArrowRight size={12} />
              </span>
            </div>

            <div
              onClick={() => login('Truck Driver')}
              className="p-5 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] hover:border-orange-500/50 transition-all cursor-pointer text-center group"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3.5 group-hover:scale-105 transition-transform">
                <Truck size={22} />
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white mb-1">3. Truck Driver Portal</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-3">Assigned vehicle telemetry (TRK-204), turn-by-turn detour guidance & safe layby turnaround points.</div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1">
                Enter as Truck Driver <ArrowRight size={12} />
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* ── CALL TO ACTION ────────────────────────────────────────────────── */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="glass-card p-10 sm:p-14 rounded-3xl border border-slate-200 dark:border-white/[0.1] shadow-xl bg-gradient-to-b from-orange-500/10 via-transparent to-transparent">
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
              Secure Resilient Supply Lifelines Today
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto mb-8">
              Access the live GIS operations room, simulate hazard scenarios, and protect critical commodities across North East India.
            </p>

            <button
              onClick={goToLogin}
              className="px-8 py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-base shadow-xl shadow-orange-500/30 inline-flex items-center gap-3 transition-all cursor-pointer active:scale-95"
            >
              <span>Access PurvaSaarthi Dashboard</span>
              <ArrowRight size={18} />
            </button>

          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="mt-auto py-8 border-t border-slate-200 dark:border-white/[0.08] text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Logo size="sm" withText={false} />
            <span className="font-semibold text-slate-700 dark:text-slate-300">PurvaSaarthi</span>
            <span>— North East Regional Logistics Resilience Platform</span>
          </div>
          <div className="flex items-center gap-6">
            <span>Built for MoDNER / NEC Hackathon</span>
            <button onClick={goToLogin} className="hover:text-orange-500 transition-colors cursor-pointer">
              Login
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
