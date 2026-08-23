import React, { useState } from 'react';
import { 
  Zap, 
  AlertTriangle, 
  ArrowRight, 
  ShieldAlert, 
  CheckCircle2, 
  RotateCcw, 
  X, 
  TrendingUp, 
  HeartPulse, 
  MapPin 
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { roads, districts, shipments } from '../../data/mockData';

export const CascadeSimulator: React.FC = () => {
  const { cascadeModalOpen, closeCascadeModal, openRerouteModal, startMapSimulation } = useAppStore();
  const [selectedRoadId, setSelectedRoadId] = useState<string>('road-a');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  if (!cascadeModalOpen) return null;

  const targetRoad = roads.find((r) => r.id === selectedRoadId) || roads[0];
  const affectedDistrict = districts.find((d) => d.id === targetRoad.districtId) || districts[0];
  const affectedShipment = shipments.find((s) => s.destinationDistrictId === affectedDistrict.id) || shipments[0];

  const steps = [
    {
      title: 'Infrastructure Disruption',
      icon: AlertTriangle,
      badgeColor: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30',
      description: `Primary corridor ${targetRoad.name} suffers structural collapse due to heavy precipitation (${targetRoad.rainfallForecast}mm) & slope gradient (${targetRoad.terrainSlope}°).`,
      metrics: [
        { label: 'Corridor Status', value: 'BLOCKED', color: 'text-red-600 dark:text-red-500' },
        { label: 'Disruption Probability', value: `${targetRoad.disruptionProbability}%`, color: 'text-red-600 dark:text-red-400' },
        { label: 'SPOF Bottleneck', value: targetRoad.isSPOF ? 'CRITICAL' : 'MODERATE', color: 'text-amber-600 dark:text-amber-400' },
      ],
    },
    {
      title: 'Traffic Rerouting & Secondary Congestion',
      icon: TrendingUp,
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30',
      description: `Traffic shifts heavily onto secondary route NH-106 Bypass. Traffic density increases by 340%, elevating risk from 24% to 89%.`,
      metrics: [
        { label: 'Bypass Load', value: '+340%', color: 'text-amber-600 dark:text-amber-400' },
        { label: 'Secondary Risk', value: '89% HIGH', color: 'text-amber-600 dark:text-amber-500' },
        { label: 'Expected Delay', value: '+2h 45m', color: 'text-orange-600 dark:text-orange-400' },
      ],
    },
    {
      title: 'District Isolation Vulnerability',
      icon: MapPin,
      badgeColor: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500/30',
      description: `${affectedDistrict.name} loses primary highway access. Regional connectivity drops sharply, raising isolation vulnerability score.`,
      metrics: [
        { label: 'Connectivity', value: '41%', color: 'text-red-600 dark:text-red-400', prev: '72%' },
        { label: 'Isolation Risk', value: '87%', color: 'text-red-600 dark:text-red-500', prev: '24%' },
        { label: 'Alt Routes Left', value: '1 Corridor', color: 'text-amber-600 dark:text-amber-400' },
      ],
    },
    {
      title: 'Essential Commodity Shortage Risk',
      icon: HeartPulse,
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/20 dark:text-purple-400 dark:border-purple-500/30',
      description: `Shipment #${affectedShipment.trackingNumber} (${affectedShipment.commodityLabel}) delayed past local warehouse stock threshold.`,
      metrics: [
        { label: 'Commodity', value: affectedShipment.commodityLabel, color: 'text-purple-600 dark:text-purple-400' },
        { label: 'Local Reserve', value: `${affectedShipment.stockDaysRemaining} Days`, color: 'text-red-600 dark:text-red-400' },
        { label: 'Shortage Risk', value: 'CRITICAL', color: 'text-red-600 dark:text-red-500' },
      ],
    },
    {
      title: 'Actionable Decision & Dispatch Window',
      icon: ShieldAlert,
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30',
      description: `Decision Engine calculates Last Safe Action Window. Proactive rerouting required before precipitation peak.`,
      metrics: [
        { label: 'Dispatch Window', value: 'Before 4:30 PM', color: 'text-emerald-600 dark:text-emerald-400' },
        { label: 'Time Remaining', value: '1h 22m', color: 'text-cyan-600 dark:text-cyan-400' },
        { label: 'Recommended Alt', value: 'NH-106 Safe Detour', color: 'text-emerald-600 dark:text-emerald-400' },
      ],
    },
  ];

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleRunFullSimulation = () => {
    setIsSimulating(true);
    setCurrentStep(0);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < steps.length) {
        setCurrentStep(step);
      } else {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 1200);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsSimulating(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0b1322] text-slate-900 dark:text-slate-100 shadow-2xl transition-colors">
        
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 dark:border-white/[0.08] bg-white/95 dark:bg-[#0b1322]/95 px-6 py-4 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-red-500/20 text-amber-500 border border-amber-500/30 shadow-inner">
              <Zap className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Cascading Disruption Simulator</h2>
                <span className="rounded-full bg-amber-50 dark:bg-amber-500/20 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30">
                  Decision Intelligence USP
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Predict domino failures across infrastructure, districts, and essential commodity reserves
              </p>
            </div>
          </div>

          <button
            onClick={closeCascadeModal}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/[0.06] dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Corridor Selection & Controls */}
          <div className="bg-slate-50 dark:bg-white/[0.03] rounded-xl p-4 border border-slate-200 dark:border-white/[0.06] space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Select Initial Vulnerable Corridor / Infrastructure Node
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex-1 min-w-0">
                <select
                  value={selectedRoadId}
                  onChange={(e) => {
                    setSelectedRoadId(e.target.value);
                    handleReset();
                  }}
                  disabled={isSimulating}
                  className="w-full h-11 rounded-lg bg-white dark:bg-[#121c30] border border-slate-300 dark:border-white/10 px-3.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-2xs cursor-pointer"
                >
                  {roads.map((road) => (
                    <option key={road.id} value={road.id}>
                      {road.name} — {road.isSPOF ? '⚠️ SPOF Bottleneck' : `Risk: ${road.disruptionProbability}%`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => startMapSimulation(selectedRoadId)}
                  className="h-11 px-5 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-red-600 text-sm font-bold text-white shadow-md shadow-amber-500/20 hover:from-amber-600 hover:to-red-700 transition-all cursor-pointer whitespace-nowrap"
                >
                  <Zap className="h-4 w-4 shrink-0" />
                  <span>Simulate Live On Map</span>
                </button>

                <button
                  onClick={handleReset}
                  title="Reset simulation state"
                  className="h-11 w-11 flex items-center justify-center rounded-lg bg-white dark:bg-white/[0.05] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors border border-slate-200 dark:border-white/10 cursor-pointer shadow-2xs shrink-0"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Stepper Header */}
          <div className="grid grid-cols-5 gap-2">
            {steps.map((step, idx) => {
              const isActive = idx === currentStep;
              const isPassed = idx < currentStep;
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentStep(idx)}
                  className={`flex flex-col items-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/20 text-slate-900 dark:text-white shadow-xs font-bold'
                      : isPassed
                      ? 'bg-slate-50 dark:bg-white/[0.04] border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-slate-300 font-medium'
                      : 'bg-white dark:bg-white/[0.01] border-slate-200/70 dark:border-white/[0.04] text-slate-400 dark:text-slate-500'
                  }`}
                >
                  <div
                    className={`h-7 w-7 rounded-full flex items-center justify-center mb-1 text-xs font-bold ${
                      isActive
                        ? 'bg-amber-500 text-white shadow-xs'
                        : isPassed
                        ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {isPassed ? <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> : idx + 1}
                  </div>
                  <span className="text-[10px] font-semibold line-clamp-1">{step.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Stage Display Panel */}
          <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-slate-50/70 dark:bg-white/[0.02] p-6 space-y-5 relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl border ${steps[currentStep].badgeColor}`}>
                  {React.createElement(steps[currentStep].icon, { className: 'h-6 w-6' })}
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Cascade Failure Stage {currentStep + 1} of {steps.length}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{steps[currentStep].title}</h3>
                </div>
              </div>

              <span className={`px-3 py-1 text-xs font-bold rounded-full border ${steps[currentStep].badgeColor}`}>
                Step {currentStep + 1} Active
              </span>
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-[#121c30]/80 p-4 rounded-xl border border-slate-200 dark:border-white/[0.08] shadow-xs">
              {steps[currentStep].description}
            </p>

            {/* Metrics Impact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {steps[currentStep].metrics.map((metric, idx) => (
                <div key={idx} className="bg-white dark:bg-[#121c30]/90 p-4 rounded-xl border border-slate-200 dark:border-white/[0.08] shadow-xs space-y-1">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{metric.label}</span>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-xl font-bold ${metric.color}`}>{metric.value}</span>
                    {metric.prev && <span className="text-xs text-slate-400 dark:text-slate-500 line-through">was {metric.prev}</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Step Navigation Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-white/[0.08]">
              <button
                onClick={() => setCurrentStep((p) => Math.max(0, p - 1))}
                disabled={currentStep === 0}
                className="px-4 py-2 rounded-lg bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-40 transition-colors cursor-pointer shadow-2xs"
              >
                Previous Stage
              </button>

              {currentStep < steps.length - 1 ? (
                <button
                  onClick={handleNextStep}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold transition-colors shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  <span>Propagate To Stage {currentStep + 2}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    closeCascadeModal();
                    openRerouteModal();
                  }}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold hover:from-emerald-600 hover:to-teal-700 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
                >
                  <ShieldAlert className="h-4 w-4" />
                  <span>Execute Safe Detour Action</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
