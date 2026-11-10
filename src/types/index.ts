export type Language = 'en' | 'hi' | 'or';

export type UserRole = 
  | 'dispatcher'
  | 'traffic_authority'
  | 'paramedic'
  | 'citizen'
  | 'administrator';

export type EmergencyCategory = 
  | 'accident'
  | 'cardiac'
  | 'respiratory'
  | 'trauma';

export type EmergencyStatus = 
  | 'saved_locally'
  | 'sending'
  | 'received'
  | 'acknowledged'
  | 'reviewing'
  | 'assigned'
  | 'en_route'
  | 'arrived'
  | 'resolved';

export interface EmergencyIncident {
  id: string;
  category: EmergencyCategory;
  title: string;
  locationName: string;
  coordinates: [number, number];
  severity: 'critical' | 'high' | 'medium';
  status: EmergencyStatus;
  timestamp: number;
  assignedAmbulanceId?: string;
  assignedHospitalId?: string;
  callerName?: string;
  callerPhone?: string;
  notes?: string;
  isOfflineCreated?: boolean;
  synced?: boolean;
  corridorId?: string;
  routeId?: string;
  patientCondition?: string;
  imageUrl?: string;
}

export interface Ambulance {
  id: string;
  callSign: string;
  type: 'ALS' | 'BLS' | 'Neonatal';
  driverName: string;
  driverPhone: string;
  currentCoords: [number, number];
  heading: number;
  speedKmh: number;
  status: 'available' | 'dispatched' | 'en_route' | 'at_scene' | 'transporting' | 'arrived' | 'maintenance';
  assignedIncidentId?: string;
  destinationHospitalId?: string;
  etaMinutes: number;
  batteryOrFuel: number;
  equipment: string[];
  routeCoords?: [number, number][];
  routeIndex?: number;
}

export interface Hospital {
  id: string;
  name: string;
  shortName: string;
  coords: [number, number];
  address: string;
  traumaLevel: 'Level 1 Trauma' | 'Level 2 Specialty' | 'General District';
  icuBedsAvailable: number;
  icuBedsTotal: number;
  emergencyBedsAvailable: number;
  emergencyBedsTotal: number;
  oxygenReady: boolean;
  cathLabReady: boolean;
  distanceKm: number;
  driveMinutes: number;
  phone: string;
  imageUrl?: string;
}

export interface RouteOption {
  id: string;
  name: string;
  via: string;
  distanceKm: number;
  travelMinutes: number;
  congestion: 'clear' | 'moderate' | 'heavy' | 'jammed';
  reliabilityScore: number;
  coordinates: [number, number][];
  isRecommended: boolean;
  isBlocked?: boolean;
  blockedReason?: string;
  signalsCount: number;
}

export interface IntersectionSignal {
  id: string;
  name: string;
  coords: [number, number];
  status: 'normal_cycle' | 'green_override' | 'passed';
  signalTimerSeconds: number;
  cycleColor: 'green' | 'amber' | 'red';
}

export interface GreenCorridor {
  id: string;
  corridorCode: string;
  ambulanceId: string;
  incidentId: string;
  intersections: IntersectionSignal[];
  status: 'requested' | 'approved' | 'active' | 'cleared' | 'rejected';
  approvedBy?: string;
  timeSavedSeconds: number;
  activeIntersectionIndex: number;
}

export interface IntersectionConflict {
  id: string;
  intersectionName: string;
  coords: [number, number];
  ambulance1Id: string;
  ambulance1CallSign: string;
  ambulance1Severity: string;
  ambulance2Id: string;
  ambulance2CallSign: string;
  ambulance2Severity: string;
  winnerAmbulanceId: string;
  decisionReason: string;
  timestamp: string;
}

export interface PublicTransitBus {
  id: string;
  routeNumber: string;
  origin: string;
  destination: string;
  currentCoords: [number, number];
  status: 'on_route' | 'diverted' | 'delayed';
  passengerCount: number;
  delayMinutes: number;
  affectedByRoadblock: boolean;
  suggestedAlternativeRoute: string;
  routeCoords?: [number, number][];
  routeIndex?: number;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  detail: string;
  category: 'incident' | 'dispatch' | 'roadblock' | 'reroute' | 'corridor' | 'hospital' | 'network';
}

export interface AmbulanceNotification {
  id: string;
  ambulanceId: string;
  ambulanceCallSign: string;
  driverName: string;
  driverPhone: string;
  incidentId: string;
  incidentTitle: string;
  locationName: string;
  timestamp: number;
  etaMinutes: number;
  status: 'alerted' | 'acknowledged' | 'en_route';
}

export interface SimulationState {
  isActive: boolean;
  isPaused: boolean;
  currentStep: number;
  totalSteps: number;
  isRoadblocked: boolean;
  secondAmbulanceActive: boolean;
  isNetworkDown: boolean;
  corridorApproved: boolean;
  ambulanceProgress: number; // 0 to 100 percentage
}
