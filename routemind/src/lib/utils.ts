import { type RoadStatus, type AlertSeverity } from '../types';
import clsx from 'clsx';

export function statusColor(status: RoadStatus): string {
  return {
    OPEN: '#22c55e',
    DEGRADED: '#eab308',
    HIGH_RISK: '#f97316',
    BLOCKED: '#ef4444',
    UNKNOWN: '#6b7280',
  }[status] ?? '#6b7280';
}

export function statusLabel(status: RoadStatus): string {
  return {
    OPEN: 'Open',
    DEGRADED: 'Degraded',
    HIGH_RISK: 'High Risk',
    BLOCKED: 'Blocked',
    UNKNOWN: 'Unknown',
  }[status] ?? status;
}

export function riskClass(score: number): string {
  if (score >= 81) return 'critical';
  if (score >= 61) return 'high';
  if (score >= 31) return 'medium';
  return 'low';
}

export function riskLabel(score: number): string {
  if (score >= 81) return 'CRITICAL';
  if (score >= 61) return 'HIGH';
  if (score >= 31) return 'MEDIUM';
  return 'LOW';
}

export function severityBg(sev: AlertSeverity): string {
  return clsx({
    'bg-red-500/10 border border-red-500/20': sev === 'EMERGENCY',
    'bg-orange-500/10 border border-orange-500/20': sev === 'CRITICAL',
    'bg-yellow-500/10 border border-yellow-500/20': sev === 'HIGH',
    'bg-blue-500/10 border border-blue-500/20': sev === 'WARNING',
    'bg-slate-500/10 border border-slate-500/20': sev === 'INFO',
  });
}

export function commodityEmoji(c: string): string {
  return { medicine: '💊', food: '🌾', agri: '🚜', construction: '🏗️' }[c] ?? '📦';
}

export function priorityColor(p: number): string {
  if (p >= 90) return 'text-red-400';
  if (p >= 70) return 'text-orange-400';
  if (p >= 50) return 'text-yellow-400';
  return 'text-slate-400';
}
