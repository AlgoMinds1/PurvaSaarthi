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
  const { cascadeModalOpen, closeCascadeModal, openRerouteModal } = useAppStore();
  const [selectedRoadId, setSelectedRoadId] = useState<string>('road-nh27');
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
      badgeColor: 'bg-red-500/20 text-red-500 border-red-500/30',
      description: `Primary corridor ${targetRoad.name} suffers structural collapse due to heavy precipitation (87mm) & slope gradient (${targetRoad.terrainSlope}°).`,
      metrics: [
        { label: 'Corridor Status', value: 'BLOCKED', color: 'text-red-500' },
        { label: 'Disruption Probability', value: '94%', color: 'text-red-400' },
        { label: 'SPOF Bottleneck', value: targetRoad.isSPOF ? 'CRITICAL' : 'MODERATE', color: 'text-amber-400' },
      ],
    },
    {
      title: 'Traffic Rerouting & Secondary Congestion',
      icon: TrendingUp,
      badgeColor: 'bg-amber-500/20 text-amber-500 border-amber-500/30',
      description: `Traffic shifts heavily onto secondary route NH-106 Bypass. Traffic density increases by 340%, elevating risk from 24% to 89%.`,
      metrics: [
        { label: 'Bypass Load', value: '+340%', color: 'text-amber-400' },
        { label: 'Secondary Risk', value: '89% HIGH', color: 'text-amber-500' },
        { label: 'Expected Delay', value: '+2h 45m', color: 'text-orange-400' },
      ],
    },
    {
      title: 'District Isolation Vulnerability',
      icon: MapPin,
      badgeColor: 'bg-orange-500/20 text-orange-500 border-orange-500/30',
      description: `${affectedDistrict.name} loses primary highway access. Regional connectivity drops sharply, raising isolation vulnerability score.`,
      metrics: [
        { label: 'Connectivity', value: '41%', color: 'text-red-400', prev: '72%' },
        { label: 'Isolation Risk', value: '87%', color: 'text-red-500', prev: '24%' },
        { label: 'Alt Routes Left', value: '1 Corridor', color: 'text-amber-400' },
      ],
    },
    {
      title: 'Essential Commodity Shortage Risk',
      icon: HeartPulse,
      badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      description: `Shipment #${affectedShipment.trackingNumber} (${affectedShipment.commodityLabel}) delayed past local warehouse stock threshold.`,
      metrics: [
        { label: 'Commodity', value: affectedShipment.commodityLabel, color: 'text-purple-400' },
        { label: 'Local Reserve', value: `${affectedShipment.stockDaysRemaining} Days`, color: 'text-red-400' },
        { label: 'Shortage Risk', value: 'CRITICAL', color: 'text-red-500' },
      ],
    },
    {
      title: 'Actionable Decision & Dispatch Window',
      icon: ShieldAlert,
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      description: `Decision Engine calculates Last Safe Action Window. Proactive rerouting required before precipitation peak.`,
      metrics: [
        { label: 'Dispatch Window', value: 'Before 4:30 PM', color: 'text-emerald-400' },
        { label: 'Time Remaining', value: '1h 22m', color: 'text-cyan-400' },
        { label: 'Recommended Alt', value: 'NH-106 Safe Detour', color: 'text-emerald-400' },
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-700/60 bg-slate-900 text-slate-100 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 bg-slate-900/95 px-6 py-4 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-red-500/20 text-amber-400 border border-amber-500/30 shadow-inner">
              <Zap className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-100">Cascading Disruption Simulator</h2>
                <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-semibold text-amber-400 border border-amber-500/30">
                  Decision Intelligence USP
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Predict domino failures across infrastructure, districts, and essential commodity reserves
              </p>
            </div>
          </div>

          <button
            onClick={closeCascadeModal}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Corridor Selection & Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-800/40 rounded-xl p-4 border border-slate-800">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Select Initial Vulnerable Corridor / Infrastructure Node
              </label>
              <select
                value={selectedRoadId}
                onChange={(e) => {
                  setSelectedRoadId(e.target.value);
                  handleReset();
                }}
                disabled={isSimulating}
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              >
                {roads.map((road) => (
                  <option key={road.id} value={road.id}>
                    {road.name} — {road.isSPOF ? '⚠️ SPOF Bottleneck' : `Risk: ${road.disruptionProbability}%`}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end gap-2">
              <button
                onClick={handleRunFullSimulation}
                disabled={isSimulating}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-red-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-amber-500/20 hover:from-amber-600 hover:to-red-700 transition-all disabled:opacity-50"
              >
                <Zap className="h-4 w-4" />
                {isSimulating ? 'Simulating...' : 'Run Auto Sequence'}
              </button>

              <button
                onClick={handleReset}
                title="Reset simulation state"
                className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors border border-slate-700"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
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
                  className={`flex flex-col items-center p-2.5 rounded-xl border text-center transition-all ${
                    isActive
                      ? 'bg-slate-800 border-amber-500/60 ring-2 ring-amber-500/20 text-slate-100 shadow-md'
                      : isPassed
                      ? 'bg-slate-800/60 border-slate-700 text-slate-300'
                      : 'bg-slate-900/40 border-slate-800 text-slate-500'
                  }`}
                >
                  <div
                    className={`h-7 w-7 rounded-full flex items-center justify-center mb-1 text-xs font-bold ${
                      isActive
                        ? 'bg-amber-500 text-slate-950'
                        : isPassed
                        ? 'bg-slate-700 text-slate-200'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {isPassed ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : idx + 1}
                  </div>
                  <span className="text-[10px] font-semibold line-clamp-1">{step.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Stage Display Panel */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-6 space-y-6 relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl border ${steps[currentStep].badgeColor}`}>
                  {React.createElement(steps[currentStep].icon, { className: 'h-6 w-6' })}
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Cascade Failure Stage {currentStep + 1} of {steps.length}
                  </span>
                  <h3 className="text-xl font-bold text-slate-100">{steps[currentStep].title}</h3>
                </div>
              </div>

              <span className={`px-3 py-1 text-xs font-bold rounded-full border ${steps[currentStep].badgeColor}`}>
                Step {currentStep + 1} Active
              </span>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              {steps[currentStep].description}
            </p>

            {/* Metrics Impact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {steps[currentStep].metrics.map((metric, idx) => (
                <div key={idx} className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-400">{metric.label}</span>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-xl font-bold ${metric.color}`}>{metric.value}</span>
                    {metric.prev && <span className="text-xs text-slate-500 line-through">was {metric.prev}</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Step Navigation Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                onClick={() => setCurrentStep((p) => Math.max(0, p - 1))}
                disabled={currentStep === 0}
                className="px-4 py-2 rounded-lg bg-slate-800 text-sm font-semibold text-slate-300 hover:bg-slate-700 disabled:opacity-40 transition-colors"
              >
                Previous Stage
              </button>

              {currentStep < steps.length - 1 ? (
                <button
                  onClick={handleNextStep}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
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
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/20"
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
