// ── TYPES ────────────────────────────────────────────────────────────────────

export type RoadStatus = 'OPEN' | 'DEGRADED' | 'HIGH_RISK' | 'BLOCKED' | 'UNKNOWN';
export type AlertSeverity = 'INFO' | 'WARNING' | 'HIGH' | 'CRITICAL' | 'EMERGENCY';
export type CommodityType = 'medicine' | 'food' | 'agri' | 'construction';
export type VehicleStatus = 'IN_TRANSIT' | 'DELAYED' | 'ARRIVED' | 'TELEMETRY_UNAVAILABLE' | 'IDLE';
export type DistrictStatus = 'ACCESSIBLE' | 'DEGRADED' | 'HIGH_RISK' | 'ISOLATED' | 'UNKNOWN';

export interface Road {
  id: string;
  name: string;
  status: RoadStatus;
  riskScore: number;
  disruptionProbability: number;
  confidence: number;
  terrainSlope: number;
  rainfallForecast: number;
  historicalLandslides: number;
  trafficLevel: 'LIGHT' | 'MODERATE' | 'HEAVY' | 'CONGESTED';
  bridgeDependency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  lastVerified: string;
  source: string;
  districtId: string;
  latlngs: [number, number][];
  isSPOF?: boolean;   // Single Point of Failure
  affectedDistricts?: string[];
  reasons: string[];
}

export interface Bridge {
  id: string;
  name: string;
  roadId: string;
  status: RoadStatus;
  criticalityScore: number;
  isSPOF: boolean;
  affectedDistricts: string[];
  loadCapacity: string;
  latlng: [number, number];
  lastVerified: string;
}

export interface District {
  id: string;
  name: string;
  status: DistrictStatus;
  connectivity: number;        // %
  isolationRisk: number;       // %
  alternativeRoutes: number;
  criticalCorridors: number;
  weatherRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  supplyDays: number;          // days of supply remaining
  latlng: [number, number];
  population: number;
  criticalRoadId?: string;     // Road whose failure triggers isolation
}

export interface Vehicle {
  id: string;
  plateNo: string;
  driverName: string;
  status: VehicleStatus;
  shipmentId: string;
  currentLocation: [number, number];
  routeName: string;
  destination: string;
  eta: string;
  originalEta: string;
  delayMinutes: number;
  routeRisk: number;
  lastPingAt: string;
  telemetryFresh: boolean;
  latlngs: [number, number][];  // route path for animation
  progress: number;             // 0–1
}

export interface Shipment {
  id: string;
  vehicleId: string;
  commodity: CommodityType;
  commodityLabel: string;
  priority: number;            // 0–100
  origin: string;
  destinationDistrictId: string;
  status: 'ON_TIME' | 'AT_RISK' | 'DELAYED' | 'DELIVERED';
  routeRisk: number;
  predictedDelay: number;      // hours
  eta: string;
  stockDaysRemaining: number;
  supplyShortageRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  lastSafeAction?: string;
  alternativeRoute?: string;
}

export interface Alert {
  id: string;
  severity: AlertSeverity;
  title: { en: string; hi: string; as: string; bn: string };
  body: { en: string; hi: string; as: string; bn: string };
  timestamp: string;
  districtId?: string;
  roadId?: string;
  shipmentId?: string;
  read: boolean;
  actionRequired: boolean;
}

export interface FieldReport {
  id: string;
  roadId: string;
  type: string;
  reporter: string;
  description: string;
  gps: [number, number];
  timestamp: string;
  confidence: number;
  status: 'PENDING' | 'VERIFIED' | 'CONFLICTED';
  photoUrl?: string;
}

export interface SupplyInventory {
  districtId: string;
  districtName: string;
  commodity: CommodityType;
  stockDays: number;
  risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}
