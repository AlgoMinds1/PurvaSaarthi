import { useState } from 'react';
import clsx from 'clsx';
import { ArrowRight, Clock } from 'lucide-react';
import { shipments, supplyInventory, districts } from '../data/mockData';
import { commodityEmoji } from '../lib/utils';
import { useAppStore } from '../store/useAppStore';
import type { CommodityType } from '../types';

const PRIORITY_LABELS: Record<number, string> = {
  100: 'CRITICAL', 90: 'HIGH', 60: 'MEDIUM', 40: 'LOW',
};

function SupplyShortageBar({ days }: { days: number }) {
  const max = 7;
  const pct = Math.min((days / max) * 100, 100);
  const color = days <= 2 ? '#ef4444' : days <= 3 ? '#f97316' : days <= 5 ? '#eab308' : '#22c55e';
  return (
    <div>
      <div className="flex items-center justify-between text-[10px] mb-1">
        <span className="text-slate-500 dark:text-slate-400">Stock Remaining</span>
        <span className="font-bold" style={{ color }}>{days.toFixed(1)} days</span>
      </div>
      <div className="w-full bg-slate-200 dark:bg-white/[0.06] rounded-full h-1.5">
        <div className="h-1.5 rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

function ShipmentCard({ s }: { s: typeof shipments[0] }) {
  const { openRerouteModal } = useAppStore();
  const dist = districts.find(d => d.id === s.destinationDistrictId);
  const isAtRisk = s.status === 'AT_RISK' || s.status === 'DELAYED';

  return (
    <div className={clsx(
      'glass-card p-5 rounded-xl border transition-all duration-200 hover:shadow-md animate-fade-up',
      'border-slate-200/80 dark:border-white/[0.07]',
      s.supplyShortageRisk === 'CRITICAL' && 'border-red-300 dark:border-red-500/25 bg-red-50/40 dark:bg-red-500/[0.03]',
      s.supplyShortageRisk === 'HIGH' && 'border-orange-300 dark:border-orange-500/20 bg-orange-50/40 dark:bg-orange-500/[0.03]',
    )}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{commodityEmoji(s.commodity)}</span>
          <div>
            <div className="text-slate-900 dark:text-white font-bold text-sm">{s.commodityLabel}</div>
            <div className="text-slate-500 dark:text-slate-400 text-xs mt-0.5 font-medium">Shipment {s.id} · {s.origin}</div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className={clsx(
            'text-[10px] font-bold px-2 py-0.5 rounded border',
            s.supplyShortageRisk === 'CRITICAL' ? 'bg-red-100 text-red-800 border-red-300 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30' :
            s.supplyShortageRisk === 'HIGH' ? 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-500/15 dark:text-orange-400 dark:border-orange-500/25' :
            'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-green-500/15 dark:text-green-400 dark:border-green-500/20'
          )}>
            {s.supplyShortageRisk} RISK
          </span>
          <span className={clsx(
            'text-[10px] font-semibold',
            PRIORITY_LABELS[s.priority] === 'CRITICAL' ? 'text-red-600 dark:text-red-400' :
            PRIORITY_LABELS[s.priority] === 'HIGH' ? 'text-orange-600 dark:text-orange-400' :
            'text-slate-500 dark:text-slate-400'
          )}>
            Priority: {PRIORITY_LABELS[s.priority] ?? s.priority}
          </span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-2.5 mb-4">
        <div className="bg-slate-50 dark:bg-white/[0.04] border border-slate-200/60 dark:border-transparent rounded-lg px-3 py-2">
          <div className="text-slate-500 dark:text-slate-400 text-[10px] mb-0.5">Destination</div>
          <div className="text-slate-900 dark:text-white text-xs font-semibold">{dist?.name.split('—')[0].trim() ?? 'Unknown'}</div>
        </div>
        <div className="bg-slate-50 dark:bg-white/[0.04] border border-slate-200/60 dark:border-transparent rounded-lg px-3 py-2">
          <div className="text-slate-500 dark:text-slate-400 text-[10px] mb-0.5">Route Risk</div>
          <div className={clsx(
            'text-xs font-bold',
            s.routeRisk > 80 ? 'text-red-600 dark:text-red-400' : s.routeRisk > 60 ? 'text-orange-600 dark:text-orange-400' : 'text-emerald-600 dark:text-green-400'
          )}>{s.routeRisk}%</div>
        </div>
        <div className="bg-slate-50 dark:bg-white/[0.04] border border-slate-200/60 dark:border-transparent rounded-lg px-3 py-2">
          <div className="text-slate-500 dark:text-slate-400 text-[10px] mb-0.5">Delay</div>
          <div className={clsx('text-xs font-bold', s.predictedDelay > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-emerald-600 dark:text-green-400')}>
            {s.predictedDelay > 0 ? `+${s.predictedDelay}h` : 'On time'}
          </div>
        </div>
      </div>

      {/* Supply bar */}
      <div className="mb-4">
        <SupplyShortageBar days={s.stockDaysRemaining} />
      </div>

      {/* Supply intelligence */}
      {isAtRisk && (
        <div className="bg-orange-50/80 dark:bg-orange-500/[0.08] border border-orange-200 dark:border-orange-500/15 rounded-lg px-3 py-2.5 mb-3">
          <div className="text-xs font-bold text-orange-800 dark:text-orange-300 mb-1.5">WHY IS SUPPLY AT RISK?</div>
          <div className="space-y-1 text-xs text-slate-700 dark:text-slate-400 font-medium">
            <div>• Current stock: <span className="text-orange-700 dark:text-orange-300 font-semibold">{s.stockDaysRemaining} days</span></div>
            <div>• Expected delivery delay: <span className="text-orange-700 dark:text-orange-300 font-semibold">+{s.predictedDelay}h</span></div>
            <div>• Route risk: <span className="text-red-600 dark:text-red-400 font-semibold">{s.routeRisk}% — HIGH</span></div>
            {s.alternativeRoute && (
              <div>• Alternative route: <span className="text-emerald-700 dark:text-green-400 font-semibold">{s.alternativeRoute}</span></div>
            )}
          </div>
        </div>
      )}

      {/* Last safe action */}
      {s.lastSafeAction && (
        <div className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-500/[0.08] border border-yellow-200 dark:border-yellow-500/15 rounded-lg px-3 py-2 mb-3">
          <Clock size={13} className="text-yellow-700 dark:text-yellow-400 shrink-0" />
          <div className="text-xs">
            <span className="text-yellow-800 dark:text-yellow-400 font-bold">Last Safe Action: </span>
            <span className="text-slate-700 dark:text-slate-300 font-medium">{s.lastSafeAction}</span>
          </div>
        </div>
      )}

      {/* Actions */}
      {isAtRisk && (
        <div className="flex gap-2">
          <button
            onClick={openRerouteModal}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-white shadow-xs hover:shadow transition-all cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)' }}
          >
            <ArrowRight size={12} /> Reroute Now
          </button>
          <button className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.08] border border-slate-300/80 dark:border-white/[0.08] transition-all cursor-pointer">
            View Impact
          </button>
        </div>
      )}
    </div>
  );
}

export default function SupplyAtRisk() {
  const [filter, setFilter] = useState<'all' | CommodityType>('all');

  const filtered = filter === 'all'
    ? shipments
    : shipments.filter(s => s.commodity === filter);

  return (
    <div className="flex h-full min-h-0 overflow-y-auto transition-colors duration-200">
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Tabs */}
        <div className="flex items-center gap-2 mb-5">
          {[
            { id: 'all', label: 'All Commodities' },
            { id: 'medicine', label: '💊 Medicine' },
            { id: 'food', label: '🌾 Food' },
            { id: 'agri', label: '🚜 Agricultural' },
            { id: 'construction', label: '🏗️ Construction' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id as any)}
              className={clsx(
                'px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer',
                filter === t.id
                  ? 'bg-orange-100 text-orange-800 border border-orange-300 dark:bg-orange-500/20 dark:text-orange-300 dark:border-orange-500/30'
                  : 'text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/[0.06] hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-white/20'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {filtered.map(s => <ShipmentCard key={s.id} s={s} />)}
        </div>
      </div>

      {/* District stock panel */}
      <div className="w-72 shrink-0 bg-white dark:bg-[#090f1c] border-l border-slate-200 dark:border-white/[0.06] p-4 overflow-y-auto">
        <div className="text-sm font-semibold text-slate-900 dark:text-white mb-4">📊 District Stock Coverage</div>
        <div className="space-y-3">
          {supplyInventory.map((inv) => (
            <div key={`${inv.districtId}-${inv.commodity}`} className="glass-card px-3 py-3 rounded-xl border border-slate-200/80 dark:border-white/[0.07]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-slate-800 dark:text-slate-300 font-semibold">
                  {commodityEmoji(inv.commodity)} {inv.districtName.split('—')[0].trim()}
                </span>
                <span className={clsx(
                  'text-[10px] font-bold',
                  inv.risk === 'CRITICAL' ? 'text-red-600 dark:text-red-400' :
                  inv.risk === 'HIGH' ? 'text-orange-600 dark:text-orange-400' :
                  inv.risk === 'MEDIUM' ? 'text-yellow-700 dark:text-yellow-400' :
                  'text-emerald-700 dark:text-green-400'
                )}>{inv.risk}</span>
              </div>
              <SupplyShortageBar days={inv.stockDays} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
