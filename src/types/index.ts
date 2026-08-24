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

export interface DeliveryMilestone {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  status: 'completed' | 'current' | 'upcoming';
  location?: string;
  note?: string;
}

export interface CommodityItem {
  id: string;
  name: string;
  quantity: string;
  category: string;
  tempControlled?: boolean;
  tempRange?: string;
  batchNumber?: string;
}

export interface DriverWaypoint {
  id: string;
  instruction: string;
  distanceRemaining: string;
  roadName: string;
  hazard?: string;
  isReroutedSegment?: boolean;
}

export interface SafeLayby {
  id: string;
  name: string;
  distanceKm: number;
  capacityTrucks: number;
  amenities: string[];
  latlng: [number, number];
}

export interface Vehicle {
  id: string;
  plateNo: string;
  driverName: string;
  driverPhone?: string;
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
  currentSpeed?: number;        // km/h
  speedLimit?: number;          // km/h
  currentElevation?: number;    // meters
  slopeGradient?: number;       // degrees
  nextTurn?: string;
  distanceToNextTurn?: string;
  isRerouted?: boolean;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  vehicleId: string;
  commodity: CommodityType;
  commodityLabel: string;
  priority: number;            // 0–100
  origin: string;
  originHub: string;
  destinationDistrictId: string;
  destinationFacility: string;
  status: 'ON_TIME' | 'AT_RISK' | 'DELAYED' | 'DELIVERED';
  routeRisk: number;
  predictedDelay: number;      // hours
  dispatchedDate: string;      // e.g. "23 Aug 2026"
  dispatchedTime: string;      // e.g. "08:30 AM"
  expectedDeliveryDate: string; // e.g. "23 Aug 2026"
  expectedDeliveryTime: string; // e.g. "06:15 PM"
  originalEtaTime: string;      // e.g. "04:10 PM"
  eta: string;
  stockDaysRemaining: number;
  supplyShortageRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  lastSafeAction?: string;
  alternativeRoute?: string;
  currentRoadName?: string;
  currentRoadCondition?: string;
  weatherRiskSummary?: string;
  rainfallMm?: number;
  consigneeName?: string;
  consigneeRole?: string;
  consigneePhone?: string;
  milestones: DeliveryMilestone[];
  items: CommodityItem[];
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

// ── RAG & AI COPILOT TYPES ──────────────────────────────────────────────────

export type RagCategory =
  | 'CORRIDOR'
  | 'BRIDGE'
  | 'DISTRICT'
  | 'COMMODITY'
  | 'DISASTER_SOP'
  | 'SAFE_LAYBY'
  | 'LIVE_TELEMETRY'
  | 'REGIONAL_OVERVIEW';

export interface RagKnowledgeChunk {
  id: string;
  title: string;
  category: RagCategory;
  stateOrRegion: string;
  highwayOrCorridor?: string;
  content: string;
  keywords: string[];
  sourceDocument?: string;
  section: string;
  authorityOrSource: string;
  lastUpdated: string;
}

export interface RagSourceCitation {
  id: string;
  title: string;
  category: RagCategory;
  sourceDocument: string;
  section: string;
  similarityScore: number;
  relevanceReason: string;
  snippet: string;
}

export interface RagChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  citations?: RagSourceCitation[];
  groundedInRag: boolean;
  isOutOfDomain?: boolean;
  modelUsed?: string;
  processingTimeMs?: number;
}

export interface RagEngineConfig {
  apiKey?: string;
  provider: 'local-rag' | 'gemini' | 'openai';
  modelName?: string;
  strictGrounding: boolean;
  confidenceThreshold: number;
}

export interface RagQueryResponse {
  answer: string;
  citations: RagSourceCitation[];
  isOutOfDomain: boolean;
  groundedInRag: boolean;
  confidenceScore: number;
  modelUsed: string;
  processingTimeMs: number;
}

