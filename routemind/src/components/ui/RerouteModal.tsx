import { X, Clock, CheckCircle } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export function RerouteModal() {
  const { rerouteModalOpen, closeRerouteModal } = useAppStore();
  if (!rerouteModalOpen) return null;

  return (
    <div className="modal-overlay" onClick={closeRerouteModal}>
      <div
        className="bg-[#0d1b2a] border border-white/[0.08] rounded-2xl w-full max-w-xl shadow-2xl animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <h3 className="text-white font-bold text-base">🔀 AI Route Recommendation</h3>
          <button onClick={closeRerouteModal} className="text-slate-500 hover:text-slate-300 transition-colors p-1 rounded-lg hover:bg-white/[0.05]">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Shipment info */}
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl px-4 py-3">
            <div className="text-orange-300 font-bold text-sm">💊 Shipment #104 — Medicine — CRITICAL</div>
            <div className="text-slate-400 text-xs mt-0.5">Guwahati Central Depot → District X</div>
          </div>

          {/* Route comparison */}
          <div className="grid grid-cols-2 gap-3">
            {/* Current route */}
            <div className="bg-red-500/[0.07] border border-red-500/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300">Current Route A</span>
                <span className="text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded">91% RISK</span>
              </div>
              <div className="space-y-1.5 text-xs text-slate-400 mb-3">
                <div className="flex justify-between"><span>Distance</span><span>182 km</span></div>
                <div className="flex justify-between"><span>Normal ETA</span><span>4h 10m</span></div>
                <div className="flex justify-between"><span>Status</span><span className="text-red-400 font-semibold">HIGH RISK</span></div>
              </div>
              <div className="space-y-1 text-[10px] text-red-400">
                <div>⚠ Heavy rainfall forecast</div>
                <div>⚠ Landslide susceptibility</div>
                <div>⚠ Bridge dependency critical</div>
              </div>
            </div>

            {/* Recommended route */}
            <div className="bg-green-500/[0.06] border border-green-500/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white">Route B — RECOMMENDED</span>
                <span className="text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30 px-1.5 py-0.5 rounded">24% RISK</span>
              </div>
              <div className="space-y-1.5 text-xs text-slate-400 mb-3">
                <div className="flex justify-between"><span>Distance</span><span>207 km</span></div>
                <div className="flex justify-between"><span>ETA</span><span>6h 10m</span></div>
                <div className="flex justify-between"><span>Delay</span><span className="text-orange-400 font-semibold">+2h</span></div>
              </div>
              <div className="space-y-1 text-[10px] text-green-400">
                <div>✓ Lower terrain risk</div>
                <div>✓ Avoids damaged section</div>
                <div>✓ Vehicle compatible</div>
              </div>
            </div>
          </div>

          {/* Last safe action */}
          <div className="flex items-center gap-3 bg-yellow-500/[0.08] border border-yellow-500/20 rounded-xl px-4 py-3">
            <Clock size={18} className="text-yellow-400 shrink-0" />
            <div>
              <div className="text-yellow-400 font-bold text-xs">Last Safe Dispatch Window</div>
              <div className="text-white font-black text-lg leading-tight">BEFORE 4:30 PM</div>
              <div className="text-slate-400 text-xs mt-0.5">After this, disruption probability rises significantly</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/[0.06]">
          <button
            onClick={closeRerouteModal}
            className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 border border-white/[0.08] rounded-lg hover:bg-white/[0.05] transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              closeRerouteModal();
              // In production: dispatch reroute action
            }}
            className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white rounded-lg transition-all"
            style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}
          >
            <CheckCircle size={16} />
            Accept Route B — Reroute Now
          </button>
        </div>
      </div>
    </div>
  );
}
