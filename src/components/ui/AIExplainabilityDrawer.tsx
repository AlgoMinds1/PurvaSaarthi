import React from 'react';
import { 
  X, 
  Brain, 
  Database, 
  Clock, 
  ShieldCheck
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { roads, shipments, districts } from '../../data/mockData';

export const AIExplainabilityDrawer: React.FC = () => {
  const { explainabilityDrawerOpen, explainTarget, closeExplainabilityDrawer } = useAppStore();

  if (!explainabilityDrawerOpen || !explainTarget) return null;

  let title = '';
  let subtitle = '';
  let riskScore = 89;
  let confidence = 87;
  let freshness = '8 minutes ago';
  let source = 'Open-Meteo API + GSI Hazard Layer + Field Officer #42';
  let factors: { name: string; weight: string; impact: 'HIGH' | 'MEDIUM' | 'LOW'; detail: string }[] = [];
  let recommendation = '';

  if (explainTarget.type === 'road') {
    const road = roads.find((r) => r.id === explainTarget.id) || roads[0];
    title = `Corridor Risk: ${road.name}`;
    subtitle = `Infrastructure Segment ID: ${road.id}`;
    riskScore = road.disruptionProbability;
    confidence = road.confidence;
    freshness = road.lastVerified;
    source = road.source;
    recommendation = road.disruptionProbability > 70 
      ? 'Restrict heavy freight vehicle traffic and enact proactive rerouting via NH-106 Bypass.'
      : 'Maintain normal monitoring with hourly telemetry refreshes.';
    factors = [
      { name: 'Precipitation Intensity', weight: '35%', impact: 'HIGH', detail: `Forecasted rainfall of ${road.rainfallForecast}mm exceeds historical landslide threshold.` },
      { name: 'Terrain Gradient', weight: '25%', impact: 'HIGH', detail: `Steep slope gradient of ${road.terrainSlope}° increases slope instability during saturation.` },
      { name: 'Historical Disruption Count', weight: '20%', impact: 'MEDIUM', detail: `${road.historicalLandslides} historical disruption events recorded over past 3 monsoon seasons.` },
      { name: 'Verified Field Officer Report', weight: '20%', impact: 'HIGH', detail: `Geo-tagged report confirmed active mudslide and surface erosion.` },
    ];
  } else if (explainTarget.type === 'shipment') {
    const shipment = shipments.find((s) => s.id === explainTarget.id) || shipments[0];
    title = `Supply-at-Risk: Shipment #${shipment.trackingNumber}`;
    subtitle = `Commodity: ${shipment.commodityLabel} (Destination: ${shipment.destinationFacility})`;
    riskScore = shipment.routeRisk;
    confidence = 88;
    freshness = '5 minutes ago';
    source = 'PostGIS Route Analysis + Warehouse Inventory Relational Join';
    recommendation = `Reroute vehicle immediately before ${shipment.lastSafeAction || '04:30 PM'} to prevent warehouse stockout.`;
    factors = [
      { name: 'Primary Route Vulnerability', weight: '40%', impact: 'HIGH', detail: `Primary route ${shipment.currentRoadName || 'NH-27'} is operating at ${shipment.routeRisk}% disruption risk.` },
      { name: 'Local Warehouse Reserve', weight: '30%', impact: 'HIGH', detail: `Destination warehouse has only ${shipment.stockDaysRemaining} days of stock remaining.` },
      { name: 'Expected Delivery Offset', weight: '20%', impact: 'MEDIUM', detail: `Predicted delay of ${shipment.predictedDelay} hours threatens continuous supply continuity.` },
      { name: 'Commodity Urgency Weight', weight: '10%', impact: 'HIGH', detail: `Priority score ${shipment.priority}/100 assigned due to temperature-sensitive medicine requirements.` },
    ];
  } else {
    const district = districts.find((d) => d.id === explainTarget.id) || districts[0];
    title = `District Vulnerability: ${district.name}`;
    subtitle = `Regional Connectivity Score: ${district.connectivity}%`;
    riskScore = district.isolationRisk;
    confidence = 91;
    freshness = '3 minutes ago';
    source = 'pgRouting Connected Components + Open-Meteo Weather Aggregator';
    recommendation = `Prepare emergency relief stock buffers and position road clearing heavy machinery at primary bridge approach.`;
    factors = [
      { name: 'Single Corridor Dependency', weight: '40%', impact: 'HIGH', detail: `Primary access depends on high-risk corridor ${district.criticalRoadId || 'NH-27'}.` },
      { name: 'Alternative Route Availability', weight: '30%', impact: 'HIGH', detail: `Only ${district.alternativeRoutes} alternative bypass corridor currently available.` },
      { name: 'Severe Weather Exposure', weight: '20%', impact: 'MEDIUM', detail: `District weather risk categorized as ${district.weatherRisk}.` },
      { name: 'Essential Supply Inventory', weight: '10%', impact: 'MEDIUM', detail: `Average supply reserve standing at ${district.supplyDays} days.` },
    ];
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 dark:bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg h-full overflow-y-auto bg-white dark:bg-[#0b1322] border-l border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-100 shadow-2xl p-6 space-y-6 transition-colors">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 dark:border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30">
              <Brain className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-purple-600 dark:text-purple-400">
                AI Explainability & Data Trust Layer
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1">{title}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
            </div>
          </div>

          <button
            onClick={closeExplainabilityDrawer}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/[0.06] dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* AI Score & Confidence Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-xl border border-red-200 dark:border-red-500/30 bg-red-50/80 dark:bg-red-500/10 space-y-1">
            <span className="text-xs font-semibold text-red-700 dark:text-red-400">AI Risk Score</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-red-600 dark:text-red-500">{riskScore}%</span>
              <span className="text-xs text-red-700 dark:text-red-400 font-bold uppercase">Disruption</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/80 dark:bg-emerald-500/10 space-y-1">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Model Confidence</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{confidence}%</span>
              <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold">Verified</span>
            </div>
          </div>
        </div>

        {/* Data Trust & Freshness Header */}
        <div className="rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.03] p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
            <Database className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            <span>Data Trust & Lineage Metadata</span>
          </div>

          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/[0.06] pb-1.5">
              <span>Primary Source</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{source}</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/[0.06] pb-1.5">
              <span>Data Freshness</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {freshness}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Schema Trust Standard</span>
              <span className="font-semibold text-cyan-600 dark:text-cyan-400">NOT NULL Constraint Enforced</span>
            </div>
          </div>
        </div>

        {/* Contributing Factor Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Contributing Risk Factors & Weights
            </h3>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">Hybrid Rule + Scikit-Learn Model</span>
          </div>

          <div className="space-y-2">
            {factors.map((factor, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50/70 dark:bg-white/[0.02] space-y-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{factor.name}</span>
                  <span className="text-xs font-bold text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-500/20">
                    Weight: {factor.weight}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{factor.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Decision Engine Recommendation */}
        <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-500/30 bg-amber-50/80 dark:bg-amber-500/10 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400">
            <ShieldCheck className="h-4 w-4" />
            <span>Recommended Actionable Intervention</span>
          </div>
          <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed font-medium">{recommendation}</p>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-white/[0.08]">
          <button
            onClick={closeExplainabilityDrawer}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.09] text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 transition-colors cursor-pointer"
          >
            Close AI Explainability View
          </button>
        </div>
      </div>
    </div>
  );
};
