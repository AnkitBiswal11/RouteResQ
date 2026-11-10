import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Language,
  UserRole,
  EmergencyIncident,
  Ambulance,
  Hospital,
  RouteOption,
  GreenCorridor,
  IntersectionConflict,
  PublicTransitBus,
  SimulationState,
  TimelineEvent,
  EmergencyCategory,
  AmbulanceNotification,
} from '../types';
import { translations } from '../i18n/translations';
import {
  calculateRoutes,
  METRO_NODES,
  GREEN_CORRIDOR_INTERSECTIONS,
  ROUTE_1_COORDS,
  ROUTE_2_COORDS,
  VEHICLE_TRACKS,
  BUS_101_ROUTE,
  BUS_204_ROUTE,
  buildDispatchRoute,
} from '../services/graphRouting';
import {
  saveOfflineSOS,
  getPendingOfflineSOS,
  markOfflineSOSSynced,
  saveOfflineMapPack,
  getOfflineMapPacks,
  OfflineMapPack,
} from '../services/db';

interface RouteResQContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isOnline: boolean;
  toggleOfflineSimulation: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSosModalOpen: boolean;
  setIsSosModalOpen: (open: boolean) => void;
  isVoiceSosModalOpen: boolean;
  setIsVoiceSosModalOpen: (open: boolean) => void;
  isReportModalOpen: boolean;
  setIsReportModalOpen: (open: boolean) => void;
  activeAmbulanceNotification: AmbulanceNotification | null;
  dismissAmbulanceNotification: () => void;
  playEmergencyChime: () => void;

  // Domain Entities
  incidents: EmergencyIncident[];
  selectedIncident: EmergencyIncident | null;
  setSelectedIncidentId: (id: string | null) => void;
  ambulances: Ambulance[];
  selectedAmbulance: Ambulance | null;
  setSelectedAmbulanceId: (id: string | null) => void;
  hospitals: Hospital[];
  selectedHospital: Hospital | null;
  setSelectedHospitalId: (id: string | null) => void;

  // Routing & Corridor
  isRoadblocked: boolean;
  routes: RouteOption[];
  selectedRouteId: string;
  setSelectedRouteId: (id: string) => void;
  greenCorridor: GreenCorridor | null;
  approveGreenCorridor: () => void;
  rejectGreenCorridor: () => void;
  intersectionConflict: IntersectionConflict | null;
  publicBuses: PublicTransitBus[];

  // Simulation & Timeline
  simulationState: SimulationState;
  timelineEvents: TimelineEvent[];
  startSimulation: () => void;
  pauseSimulation: () => void;
  resumeSimulation: () => void;
  resetSimulation: () => void;
  stepSimulation: () => void;
  simulateRoadblock: () => void;
  simulateSecondAmbulanceConflict: () => void;

  // Offline Engine
  offlineQueueCount: number;
  syncOfflineQueue: () => Promise<number>;
  offlineMapPacks: OfflineMapPack[];
  downloadOfflineMap: (regionName: string) => Promise<void>;

  // Actions
  triggerSOS: (category: EmergencyCategory, locationName?: string, coords?: [number, number], notes?: string) => Promise<string>;
  triggerVoiceSOS: (spokenText: string) => Promise<string>;
  reportAccidentWithImage: (data: {
    title: string;
    location: string;
    category: EmergencyCategory;
    imageUrl: string;
    severity: string;
    notes: string;
    triggerRoadblock?: boolean;
  }) => Promise<string>;
  dispatchAmbulance: (ambulanceId: string, incidentId: string, hospitalId?: string) => void;
  announceSpeech: (text: string) => void;
}

const RouteResQContext = createContext<RouteResQContextType | undefined>(undefined);

const INITIAL_HOSPITALS: Hospital[] = [
  {
    id: 'HOSP_VIMSAR',
    name: 'VIMSAR Super Specialty Trauma Center',
    shortName: 'VIMSAR Trauma Center',
    coords: [21.5033, 83.8716],
    address: 'Metropolitan Campus, West Sector',
    traumaLevel: 'Level 1 Trauma',
    icuBedsAvailable: 14,
    icuBedsTotal: 40,
    emergencyBedsAvailable: 84,
    emergencyBedsTotal: 1050,
    oxygenReady: true,
    cathLabReady: true,
    distanceKm: 13.4,
    driveMinutes: 15,
    phone: '+91-663-2430768',
    imageUrl: '/src/assets/images/hospital_medical_center_1794236387782.jpg',
  },
  {
    id: 'HOSP_DHH',
    name: 'Central District Headquarters Hospital (DHH)',
    shortName: 'District HQ Hospital',
    coords: [21.4674, 83.9808],
    address: 'Civic Hospital Road, Downtown',
    traumaLevel: 'Level 2 Specialty',
    icuBedsAvailable: 6,
    icuBedsTotal: 18,
    emergencyBedsAvailable: 38,
    emergencyBedsTotal: 450,
    oxygenReady: true,
    cathLabReady: false,
    distanceKm: 0.8,
    driveMinutes: 3,
    phone: '+91-663-2400102',
    imageUrl: '/src/assets/images/trauma_er_hospital_1794236387800.jpg',
  },
  {
    id: 'HOSP_SANJIVANI',
    name: 'Sanjivani Multispecialty Hospital & Heart Institute',
    shortName: 'Sanjivani Heart Institute',
    coords: [21.4910, 83.9850],
    address: 'Expressway Junction, North Sector',
    traumaLevel: 'General District',
    icuBedsAvailable: 8,
    icuBedsTotal: 12,
    emergencyBedsAvailable: 22,
    emergencyBedsTotal: 180,
    oxygenReady: true,
    cathLabReady: true,
    distanceKm: 4.2,
    driveMinutes: 8,
    phone: '+91-663-2541200',
    imageUrl: '/src/assets/images/cardiac_medical_xray_1794236386597.jpg',
  },
];

const INITIAL_AMBULANCES: Ambulance[] = [
  {
    id: 'AMB-01',
    callSign: 'AMB-01 (Rapid Response)',
    type: 'ALS',
    driverName: 'Sujit Pradhan',
    driverPhone: '+91 94371 88201',
    currentCoords: [21.4980, 83.9620], // Budharaja / Ainthapali Road (Solid East Ground)
    heading: 280,
    speedKmh: 0,
    status: 'available',
    etaMinutes: 14,
    batteryOrFuel: 92,
    equipment: ['Ventilator', 'Defibrillator', 'Cardiac Monitor', 'Advanced Airway', 'Oxygen Pack'],
  },
  {
    id: 'AMB-02',
    callSign: 'Trauma ResQ-2 (AMB-02)',
    type: 'ALS',
    driverName: 'Manas Sahu',
    driverPhone: '+91 98610 44321',
    currentCoords: ROUTE_2_COORDS[0],
    heading: 90,
    speedKmh: 58,
    status: 'en_route',
    assignedIncidentId: 'INC-101',
    destinationHospitalId: 'HOSP_VIMSAR',
    etaMinutes: 8.5,
    batteryOrFuel: 85,
    equipment: ['Mobile ICU', 'AED', 'Splints', 'Oxygen Cylinder'],
    routeCoords: ROUTE_2_COORDS,
    routeIndex: 0,
  },
  {
    id: 'AMB-03',
    callSign: 'AMB-03 (City Unit)',
    type: 'BLS',
    driverName: 'Rakesh Barik',
    driverPhone: '+91 99382 11984',
    currentCoords: [21.4700, 83.9600], // Riverfront East Avenue (Solid East Ground)
    heading: 210,
    speedKmh: 0,
    status: 'available',
    etaMinutes: 20,
    batteryOrFuel: 78,
    equipment: ['Ventilator', 'Multipara Monitor', 'Syringe Pumps'],
  },
  {
    id: 'AMB-04',
    callSign: 'AMB-04 (Express Unit)',
    type: 'ALS',
    driverName: 'Alok Mishra',
    driverPhone: '+91 94390 55123',
    currentCoords: [21.5033, 83.8716], // VIMSAR Trauma Campus (Solid West Ground)
    heading: 180,
    speedKmh: 0,
    status: 'available',
    etaMinutes: 22,
    batteryOrFuel: 96,
    equipment: ['Neonatal Incubator', 'Pediatric Ventilator', 'Infusion Pump'],
  },
  {
    id: 'AMB-05',
    callSign: 'AMB-05 (Downtown Unit)',
    type: 'BLS',
    driverName: 'Bikash Jena',
    driverPhone: '+91 98611 22890',
    currentCoords: [21.4580, 83.9680], // Dhanupali Sector Hub (Solid East Ground)
    heading: 45,
    speedKmh: 0,
    status: 'available',
    etaMinutes: 16,
    batteryOrFuel: 88,
    equipment: ['First Responder Kit', 'AED', 'Oxygen Cylinder'],
  },
  {
    id: 'AMB-06',
    callSign: 'AMB-06 (Mobile ICU)',
    type: 'Neonatal',
    driverName: 'Dipti Ranjan',
    driverPhone: '+91 94372 33419',
    currentCoords: [21.4820, 83.9720], // Modipara Central Hub (Solid East Ground)
    heading: 120,
    speedKmh: 0,
    status: 'available',
    etaMinutes: 19,
    batteryOrFuel: 94,
    equipment: ['Incubator', 'Pediatric ICU', 'Blood Warmer'],
  },
];

const INITIAL_BUSES: PublicTransitBus[] = [
  {
    id: 'BUS-101',
    routeNumber: 'Route 12 (City Center — Medical District)',
    origin: 'Central Station Terminal',
    destination: 'Trauma Center Main Gate',
    currentCoords: BUS_101_ROUTE[0],
    status: 'on_route',
    passengerCount: 46,
    delayMinutes: 0,
    affectedByRoadblock: false,
    suggestedAlternativeRoute: 'Normal routing via Expressway',
    routeCoords: BUS_101_ROUTE,
    routeIndex: 0,
  },
  {
    id: 'BUS-204',
    routeNumber: 'Route 07 (North Hub — West River Boulevard)',
    origin: 'North Commerce Park',
    destination: 'Riverfront Terminal',
    currentCoords: BUS_204_ROUTE[0],
    status: 'on_route',
    passengerCount: 38,
    delayMinutes: 0,
    affectedByRoadblock: false,
    suggestedAlternativeRoute: 'Normal routing via Bypass',
    routeCoords: BUS_204_ROUTE,
    routeIndex: 0,
  },
];

export const RouteResQProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('routeresq_lang') as Language) || 'en';
  });

  const [userRole, setUserRole] = useState<UserRole>('dispatcher');
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [isSosModalOpen, setIsSosModalOpen] = useState<boolean>(false);
  const [isVoiceSosModalOpen, setIsVoiceSosModalOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [activeAmbulanceNotification, setActiveAmbulanceNotification] = useState<AmbulanceNotification | null>(null);

  const playEmergencyChime = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.setValueAtTime(587.33, now + 0.15);
      osc.frequency.setValueAtTime(880, now + 0.32);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
      osc.start(now);
      osc.stop(now + 0.55);
    } catch {
      // Audio autoplay policy graceful fallback
    }
  }, []);

  const dismissAmbulanceNotification = useCallback(() => {
    setActiveAmbulanceNotification(null);
  }, []);

  const [incidents, setIncidents] = useState<EmergencyIncident[]>([
    {
      id: 'INC-101',
      category: 'accident',
      title: 'Road Traffic Accident',
      locationName: 'Khetrajpur Station Approach, Central Avenue',
      coordinates: [21.4880, 83.9650],
      severity: 'critical',
      status: 'assigned',
      timestamp: Date.now() - 1000 * 60 * 12,
      assignedAmbulanceId: 'AMB-02',
      assignedHospitalId: 'HOSP_VIMSAR',
      notes: 'Two-wheeler and auto-rickshaw collision near railway gate. Multiple passengers thrown, one adult unconscious with active head bleed.',
      patientCondition: 'Active head trauma, severe hypotension (BP 85/50), immediate trauma surgical bay required',
      imageUrl: '/src/assets/images/accident_road_incident_1794234760608.jpg',
    },
    {
      id: 'INC-102',
      category: 'cardiac',
      title: 'Acute Cardiac Event',
      locationName: 'Laxmi Talkies Chowk, Marwari Para',
      coordinates: [21.4720, 83.9720],
      severity: 'critical',
      status: 'reviewing',
      timestamp: Date.now() - 1000 * 60 * 5,
      notes: 'Elderly patient (64y) sudden collapse with severe chest pain, diaphoresis, and labored breathing.',
      patientCondition: 'Suspected STEMI / Acute coronary syndrome. Continuous oxygen & ECG telemetry needed.',
      imageUrl: '/src/assets/images/cardiac_medical_xray_1794236386597.jpg',
      assignedHospitalId: 'HOSP_VIMSAR',
    },
  ]);

  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>('INC-101');
  const [ambulances, setAmbulances] = useState<Ambulance[]>(INITIAL_AMBULANCES);
  const [selectedAmbulanceId, setSelectedAmbulanceId] = useState<string | null>('AMB-02');
  const [hospitals] = useState<Hospital[]>(INITIAL_HOSPITALS);
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>('HOSP_VIMSAR');

  const [isRoadblocked, setIsRoadblocked] = useState<boolean>(false);
  const [selectedRouteId, setSelectedRouteId] = useState<string>('route_nh53');
  const [greenCorridor, setGreenCorridor] = useState<GreenCorridor | null>(null);
  const [intersectionConflict, setIntersectionConflict] = useState<IntersectionConflict | null>(null);
  const [publicBuses, setPublicBuses] = useState<PublicTransitBus[]>(INITIAL_BUSES);

  const [offlineQueueCount, setOfflineQueueCount] = useState<number>(0);
  const [offlineMapPacks, setOfflineMapPacks] = useState<OfflineMapPack[]>([]);

  const [simulationState, setSimulationState] = useState<SimulationState>({
    isActive: false,
    isPaused: false,
    currentStep: 0,
    totalSteps: 7,
    isRoadblocked: false,
    secondAmbulanceActive: false,
    isNetworkDown: false,
    corridorApproved: false,
    ambulanceProgress: 0,
  });

  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([
    {
      id: 'EVT-01',
      timestamp: '06:28:10 AM',
      title: 'System Initialized',
      detail: 'RouteResQ Metropolitan Emergency Mobility Network active on global grid.',
      category: 'incident',
    },
    {
      id: 'EVT-02',
      timestamp: '06:30:00 AM',
      title: 'Incident Received (INC-101)',
      detail: 'Road traffic collision reported at Khetrajpur Station approach. VIMSAR trauma triage notified.',
      category: 'incident',
    },
  ]);

  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update translation function
  const t = useCallback(
    (key: string): string => {
      const dict = translations[language] || translations.en;
      return dict[key] || translations.en[key] || key;
    },
    [language]
  );

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('routeresq_lang', lang);
  };

  // Synchronize offline count
  const refreshOfflineCount = useCallback(async () => {
    try {
      const pending = await getPendingOfflineSOS();
      setOfflineQueueCount(pending.length);
      const packs = await getOfflineMapPacks();
      setOfflineMapPacks(packs);
    } catch {
      // IndexedDB gracefully handles fallback
    }
  }, []);

  useEffect(() => {
    refreshOfflineCount();
  }, [refreshOfflineCount]);

  // Network listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      logTimeline('Network Restored', 'Central cloud connection re-established.', 'network');
    };
    const handleOffline = () => {
      setIsOnline(false);
      logTimeline('Network Offline', 'Switched to offline IndexedDB local cache mode.', 'network');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleOfflineSimulation = () => {
    setIsOnline((prev) => {
      const next = !prev;
      setSimulationState((s) => ({ ...s, isNetworkDown: !next }));
      if (!next) {
        logTimeline('Offline Simulation Enabled', 'Simulating remote communication blackout. SOS requests will be held in IndexedDB.', 'network');
      } else {
        logTimeline('Online Mode Restored', 'Reconnected to command center. Ready to synchronize queued requests.', 'network');
      }
      return next;
    });
  };

  // Helper to log timeline events
  const logTimeline = (title: string, detail: string, category: TimelineEvent['category']) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newEvent: TimelineEvent = {
      id: `EVT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: timeStr,
      title,
      detail,
      category,
    };
    setTimelineEvents((prev) => [newEvent, ...prev.slice(0, 40)]);
  };

  // Speech Announcement using browser Web Speech API
  const announceSpeech = useCallback(
    (text: string) => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = language === 'hi' ? 'hi-IN' : language === 'or' ? 'or-IN' : 'en-IN';
          utterance.rate = 1.0;
          window.speechSynthesis.speak(utterance);
        } catch {
          // Ignore if speech permission is restricted
        }
      }
    },
    [language]
  );

  // Recalculate routes based on roadblock status
  const routes = useMemo(() => {
    return calculateRoutes(isRoadblocked);
  }, [isRoadblocked]);

  // Selected entities
  const selectedIncident = useMemo(() => {
    return incidents.find((i) => i.id === selectedIncidentId) || incidents[0] || null;
  }, [incidents, selectedIncidentId]);

  const selectedAmbulance = useMemo(() => {
    return ambulances.find((a) => a.id === selectedAmbulanceId) || ambulances[0] || null;
  }, [ambulances, selectedAmbulanceId]);

  const selectedHospital = useMemo(() => {
    return hospitals.find((h) => h.id === selectedHospitalId) || hospitals[0] || null;
  }, [hospitals, selectedHospitalId]);

  // Trigger Emergency SOS
  const triggerSOS = async (
    category: EmergencyCategory,
    locationName = 'Near Central Expressway Span, Metropolitan Grid',
    coords: [number, number] = [21.4750, 83.9350],
    notes = 'One-tap emergency alert triggered'
  ): Promise<string> => {
    const id = `SOS-${Date.now().toString().slice(-6)}`;
    const categoryTitles: Record<EmergencyCategory, string> = {
      accident: 'Emergency: Severe Road Collision',
      cardiac: 'Emergency: Critical Cardiac Arrest',
      respiratory: 'Emergency: Acute Respiratory Distress',
      trauma: 'Emergency: Severe Trauma / Bleeding',
    };

    const newIncident: EmergencyIncident = {
      id,
      category,
      title: categoryTitles[category],
      locationName,
      coordinates: coords,
      severity: 'critical',
      status: isOnline ? 'received' : 'saved_locally',
      timestamp: Date.now(),
      isOfflineCreated: !isOnline,
      synced: isOnline,
      notes,
      assignedHospitalId: 'HOSP_VIMSAR',
    };

    if (!isOnline) {
      await saveOfflineSOS(newIncident);
      await refreshOfflineCount();
      logTimeline(`Offline SOS Created (${id})`, `Request stored in local IndexedDB. Not yet sent to command center.`, 'incident');
      announceSpeech('Emergency request saved locally on this device.');
    } else {
      setIncidents((prev) => [newIncident, ...prev]);
      setSelectedIncidentId(id);

      // Auto-assign and notify ambulance on terminal
      const assignedAmb = ambulances.find((a) => a.id === 'AMB-02') || ambulances.find((a) => a.status === 'available') || ambulances[0];
      if (assignedAmb) {
        const computedRoute = buildDispatchRoute(
          assignedAmb.id,
          assignedAmb.currentCoords,
          coords,
          [21.5033, 83.8716],
          isRoadblocked
        );

        setAmbulances((prev) =>
          prev.map((a) =>
            a.id === assignedAmb.id
              ? {
                  ...a,
                  status: 'en_route',
                  assignedIncidentId: id,
                  destinationHospitalId: 'HOSP_VIMSAR',
                  routeCoords: computedRoute,
                  routeIndex: 0,
                  currentCoords: computedRoute[0],
                  speedKmh: 58,
                  etaMinutes: Math.max(1, Math.round(computedRoute.length * 0.45 * 10) / 10),
                }
              : a
          )
        );

        setSelectedAmbulanceId(assignedAmb.id);
        playEmergencyChime();

        setActiveAmbulanceNotification({
          id: `NOTIF-${Date.now()}`,
          ambulanceId: assignedAmb.id,
          ambulanceCallSign: assignedAmb.callSign,
          driverName: assignedAmb.driverName,
          driverPhone: assignedAmb.driverPhone,
          incidentId: id,
          incidentTitle: newIncident.title,
          locationName,
          timestamp: Date.now(),
          etaMinutes: Math.max(1, Math.round(computedRoute.length * 0.45 * 10) / 10),
          status: 'en_route',
        });
      }

      logTimeline(`SOS Received & Dispatched (${id})`, `Ambulance ${assignedAmb?.callSign || 'unit'} notified on mobile terminal. En route to ${locationName}.`, 'dispatch');
      announceSpeech('Emergency SOS received. Ambulance notified and en route.');
    }

    return id;
  };

  // Voice SOS parsing
  const triggerVoiceSOS = async (spokenText: string): Promise<string> => {
    const lower = spokenText.toLowerCase();
    let cat: EmergencyCategory = 'accident';

    if (lower.includes('heart') || lower.includes('chest') || lower.includes('दिल') || lower.includes('ଛାତି') || lower.includes('stemi')) {
      cat = 'cardiac';
    } else if (lower.includes('breath') || lower.includes('oxygen') || lower.includes('सांस') || lower.includes('ଶ୍ୱାସ') || lower.includes('asthma')) {
      cat = 'respiratory';
    } else if (lower.includes('trauma') || lower.includes('blood') || lower.includes('fire') || lower.includes('रक्त') || lower.includes('burn') || lower.includes('ଜଳିବା')) {
      cat = 'trauma';
    }

    return triggerSOS(cat, 'Voice Captured: Metro Expressway Approach', [21.4880, 83.9650], `Voice Transcript: "${spokenText}"`);
  };

  // Report accident with image upload and computer vision metadata
  const reportAccidentWithImage = async (data: {
    title: string;
    location: string;
    category: EmergencyCategory;
    imageUrl: string;
    severity: string;
    notes: string;
    triggerRoadblock?: boolean;
  }): Promise<string> => {
    const id = `INC-${Date.now().toString().slice(-4)}`;
    const coords: [number, number] = [21.4870, 83.9020]; // Arterial bottleneck / collision site

    const newIncident: EmergencyIncident = {
      id,
      category: data.category,
      title: data.title,
      locationName: data.location,
      coordinates: coords,
      severity: 'critical',
      status: 'received',
      timestamp: Date.now(),
      isOfflineCreated: false,
      synced: true,
      notes: data.notes,
      assignedHospitalId: 'HOSP_VIMSAR',
      imageUrl: data.imageUrl,
    };

    setIncidents((prev) => [newIncident, ...prev]);
    setSelectedIncidentId(id);

    // Auto-notify ambulance
    const assignedAmb = ambulances.find((a) => a.id === 'AMB-02') || ambulances[0];
    if (assignedAmb) {
      const computedRoute = buildDispatchRoute(
        assignedAmb.id,
        assignedAmb.currentCoords,
        coords,
        [21.5033, 83.8716],
        data.triggerRoadblock || isRoadblocked
      );

      setAmbulances((prev) =>
        prev.map((a) =>
          a.id === assignedAmb.id
            ? {
                ...a,
                status: 'en_route',
                assignedIncidentId: id,
                destinationHospitalId: 'HOSP_VIMSAR',
                routeCoords: computedRoute,
                routeIndex: 0,
                currentCoords: computedRoute[0],
                speedKmh: 58,
                etaMinutes: Math.max(1, Math.round(computedRoute.length * 0.45 * 10) / 10),
              }
            : a
        )
      );

      playEmergencyChime();

      setActiveAmbulanceNotification({
        id: `NOTIF-${Date.now()}`,
        ambulanceId: assignedAmb.id,
        ambulanceCallSign: assignedAmb.callSign,
        driverName: assignedAmb.driverName,
        driverPhone: assignedAmb.driverPhone,
        incidentId: id,
        incidentTitle: data.title,
        locationName: data.location,
        timestamp: Date.now(),
        etaMinutes: Math.max(1, Math.round(computedRoute.length * 0.45 * 10) / 10),
        status: 'en_route',
      });
    }

    if (data.triggerRoadblock) {
      setIsRoadblocked(true);
      setSelectedRouteId('route_ringroad');
      logTimeline('Vision Alert: Roadblock Verified', `Accident photo confirmed barrier blockage at ${data.location}. Traffic detoured via Ring Road.`, 'roadblock');
    } else {
      logTimeline('Incident Photo Verified & Unit Dispatched', `${data.title} reported with image evidence at ${data.location}. Unit ${assignedAmb?.callSign} alerted.`, 'incident');
    }

    announceSpeech('Emergency incident reported. Ambulance notified and en route.');
    return id;
  };

  // Synchronize Offline Queue
  const syncOfflineQueue = async (): Promise<number> => {
    if (!isOnline) return 0;
    const pending = await getPendingOfflineSOS();
    if (pending.length === 0) return 0;

    for (const item of pending) {
      await markOfflineSOSSynced(item.id);
      setIncidents((prev) => {
        if (prev.some((p) => p.id === item.id)) return prev;
        return [{ ...item, synced: true, status: 'received' }, ...prev];
      });
      logTimeline(`Synced Offline SOS (${item.id})`, `Successfully transferred from IndexedDB to live server.`, 'network');
    }

    await refreshOfflineCount();
    announceSpeech(`Synchronized ${pending.length} queued emergency requests.`);
    return pending.length;
  };

  // Dispatch Ambulance
  const dispatchAmbulance = (ambulanceId: string, incidentId: string, hospitalId = 'HOSP_VIMSAR') => {
    const targetIncident = incidents.find((i) => i.id === incidentId);
    const targetHospital = hospitals.find((h) => h.id === hospitalId) || hospitals[0];
    const amb = ambulances.find((a) => a.id === ambulanceId);

    const startCoords: [number, number] = amb ? amb.currentCoords : [21.4920, 83.9250];
    const incidentCoords: [number, number] = targetIncident ? targetIncident.coordinates : [21.4880, 83.9650];
    const hospitalCoords: [number, number] = targetHospital ? targetHospital.coords : [21.5033, 83.8716];

    const computedRoute = buildDispatchRoute(
      ambulanceId,
      startCoords,
      incidentCoords,
      hospitalCoords,
      isRoadblocked
    );

    setAmbulances((prev) =>
      prev.map((a) => {
        if (a.id === ambulanceId) {
          return {
            ...a,
            status: 'en_route',
            assignedIncidentId: incidentId,
            destinationHospitalId: hospitalId,
            routeCoords: computedRoute,
            routeIndex: 0,
            currentCoords: computedRoute[0],
            speedKmh: 58,
            etaMinutes: Math.max(1, Math.round(computedRoute.length * 0.45 * 10) / 10),
          };
        }
        return a;
      })
    );

    setSelectedAmbulanceId(ambulanceId);
    setSelectedIncidentId(incidentId);

    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === incidentId) {
          return {
            ...inc,
            status: 'assigned',
            assignedAmbulanceId: ambulanceId,
            assignedHospitalId: hospitalId,
          };
        }
        return inc;
      })
    );

    // Play siren chime and notify
    playEmergencyChime();

    if (amb) {
      setActiveAmbulanceNotification({
        id: `NOTIF-${Date.now()}`,
        ambulanceId,
        ambulanceCallSign: amb.callSign,
        driverName: amb.driverName,
        driverPhone: amb.driverPhone,
        incidentId,
        incidentTitle: targetIncident?.title || 'Emergency Callout',
        locationName: targetIncident?.locationName || 'Metro Central Sector',
        timestamp: Date.now(),
        etaMinutes: Math.max(1, Math.round(computedRoute.length * 0.45 * 10) / 10),
        status: 'en_route',
      });
    }

    // Create Green Corridor
    const corridorId = `CORR-${Date.now().toString().slice(-4)}`;
    const newCorridor: GreenCorridor = {
      id: corridorId,
      corridorCode: 'GC-METRO-TRAUMA-01',
      ambulanceId,
      incidentId,
      intersections: GREEN_CORRIDOR_INTERSECTIONS,
      status: 'requested',
      timeSavedSeconds: 480, // ~8 minutes saved
      activeIntersectionIndex: 0,
    };
    setGreenCorridor(newCorridor);

    logTimeline(
      'Ambulance Dispatched & Driver Notified',
      `Unit ${amb?.callSign || ambulanceId} notified on MDT. Destination: ${targetHospital.name}. Priority corridor engaged.`,
      'dispatch'
    );
    announceSpeech('Ambulance dispatched. Driver notified.');
  };

  // Approve Green Corridor
  const approveGreenCorridor = () => {
    if (!greenCorridor) return;
    setGreenCorridor((prev) => (prev ? { ...prev, status: 'approved', approvedBy: 'Metropolitan Traffic Control Command' } : null));
    setSimulationState((s) => ({ ...s, corridorApproved: true }));
    logTimeline('Corridor Approved', 'Traffic authority granted green light priority across 4 signals.', 'corridor');
    announceSpeech('Emergency green corridor approved.');
  };

  const rejectGreenCorridor = () => {
    if (!greenCorridor) return;
    setGreenCorridor((prev) => (prev ? { ...prev, status: 'rejected' } : null));
    logTimeline('Corridor Modified', 'Manual signal timing maintained by local traffic post.', 'corridor');
  };

  // Simulate Roadblock Trigger
  const simulateRoadblock = useCallback(() => {
    setIsRoadblocked(true);
    setSelectedRouteId('route_ringroad'); // automatically pick the alternative green corridor
    setSimulationState((s) => ({ ...s, isRoadblocked: true }));

    // Dynamically update active ambulance route to bypass roadblock
    setAmbulances((prev) =>
      prev.map((amb) => {
        if (amb.status === 'en_route') {
          return {
            ...amb,
            routeCoords: ROUTE_2_COORDS,
            routeIndex: 0,
            currentCoords: ROUTE_2_COORDS[0],
            etaMinutes: Math.round(ROUTE_2_COORDS.length * 0.45 * 10) / 10,
          };
        }
        return amb;
      })
    );

    // Reroute public transit buses
    setPublicBuses((prev) =>
      prev.map((bus) => ({
        ...bus,
        status: 'diverted',
        delayMinutes: 12,
        affectedByRoadblock: true,
        suggestedAlternativeRoute: 'Diverted via Ring Road South Link to avoid expressway blockage',
      }))
    );

    logTimeline(
      'Roadblock Detected (Expressway Bridge)',
      'Accident blocking 3 lanes. Graph cost updated to infinity. Dynamic reroute engaged via Riverfront Ring Road.',
      'roadblock'
    );
    announceSpeech('Roadblock detected on Expressway. Automatic dynamic reroute activated.');
  }, [announceSpeech]);

  // Simulate Second Ambulance Conflict
  const simulateSecondAmbulanceConflict = useCallback(() => {
    const conflict: IntersectionConflict = {
      id: `CONF-${Date.now().toString().slice(-4)}`,
      intersectionName: 'Signal 103 — Metro Town Square Junction',
      coords: [21.4985, 83.8820],
      ambulance1Id: 'AMB-02',
      ambulance1CallSign: 'Trauma ResQ-2 (AMB-02)',
      ambulance1Severity: 'Critical (Severe Trauma / Bleed)',
      ambulance2Id: 'AMB-03',
      ambulance2CallSign: 'AMB-03 (City Unit)',
      ambulance2Severity: 'Moderate (Lower Limb Trauma)',
      winnerAmbulanceId: 'AMB-02',
      decisionReason:
        'AMB-02 granted immediate green priority: higher clinical severity (Code Red vs Code Amber) and 90-second closer ETA to VIMSAR Trauma bay.',
      timestamp: new Date().toLocaleTimeString(),
    };

    setIntersectionConflict(conflict);
    setSimulationState((s) => ({ ...s, secondAmbulanceActive: true }));

    logTimeline(
      'Intersection Conflict Resolved',
      `Signal 103 arbitration: Granted priority to ${conflict.ambulance1CallSign}. Reason: ${conflict.decisionReason}`,
      'corridor'
    );
    announceSpeech('Intersection conflict arbitrated. Priority granted to Trauma ResQ-2.');
  }, [announceSpeech]);

  // One-Click Metropolitan Scenario Execution
  const stepSimulation = useCallback(() => {
    setSimulationState((prev) => {
      const nextStep = prev.currentStep + 1;

      if (nextStep === 1) {
        // Step 1: Emergency reported
        logTimeline('Step 1: Emergency SOS Triggered', 'Critical cardiac emergency reported near Nelson Mandela Park.', 'incident');
        return { ...prev, currentStep: 1, isActive: true, isPaused: false };
      }
      if (nextStep === 2) {
        // Step 2: Ambulance recommended & dispatched
        dispatchAmbulance('AMB-02', 'INC-101', 'HOSP_VIMSAR');
        return { ...prev, currentStep: 2, ambulanceProgress: 15 };
      }
      if (nextStep === 3) {
        // Step 3: Roadblock on Expressway
        simulateRoadblock();
        return { ...prev, currentStep: 3, isRoadblocked: true, ambulanceProgress: 30 };
      }
      if (nextStep === 4) {
        // Step 4: Green Corridor approved
        approveGreenCorridor();
        return { ...prev, currentStep: 4, corridorApproved: true, ambulanceProgress: 50 };
      }
      if (nextStep === 5) {
        // Step 5: 2nd Ambulance Conflict
        simulateSecondAmbulanceConflict();
        return { ...prev, currentStep: 5, secondAmbulanceActive: true, ambulanceProgress: 70 };
      }
      if (nextStep === 6) {
        // Step 6: Approaching Trauma Center
        logTimeline('Step 6: Green Wave Cleared', 'Ambulance cleared all 4 signals. Speed sustained at 64 km/h.', 'corridor');
        return { ...prev, currentStep: 6, ambulanceProgress: 88 };
      }
      if (nextStep >= 7) {
        // Step 7: Hospital Arrival & Complete
        setIncidents((incList) =>
          incList.map((inc) => (inc.id === 'INC-101' ? { ...inc, status: 'arrived' } : inc))
        );
        logTimeline('Step 7: Arrived at Trauma Center', 'Patient transferred to Trauma resuscitation team. Response time: 14m 20s (8m saved).', 'hospital');
        announceSpeech('Ambulance safely arrived at Trauma center. Emergency response complete.');
        return { ...prev, currentStep: 7, ambulanceProgress: 100, isActive: false };
      }
      return prev;
    });
  }, [dispatchAmbulance, simulateRoadblock, approveGreenCorridor, simulateSecondAmbulanceConflict, announceSpeech]);

  const startSimulation = () => {
    resetSimulation();
    setSimulationState((s) => ({ ...s, isActive: true, isPaused: false }));
    logTimeline('Scenario Started', 'Beginning Metropolitan 1-Click Live Emergency Response Scenario.', 'incident');

    // Auto-advance simulation ticks every 4 seconds unless paused
    if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);
    simulationIntervalRef.current = setInterval(() => {
      stepSimulation();
    }, 4500);
  };

  const pauseSimulation = () => {
    if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);
    setSimulationState((s) => ({ ...s, isPaused: true }));
    logTimeline('Simulation Paused', 'Operations timer paused by operator.', 'incident');
  };

  const resumeSimulation = () => {
    setSimulationState((s) => ({ ...s, isPaused: false }));
    if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);
    simulationIntervalRef.current = setInterval(() => {
      stepSimulation();
    }, 4500);
    logTimeline('Simulation Resumed', 'Operations timer resumed.', 'incident');
  };

  const resetSimulation = () => {
    if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);
    setIsRoadblocked(false);
    setSelectedRouteId('route_nh53');
    setGreenCorridor(null);
    setIntersectionConflict(null);
    setPublicBuses(INITIAL_BUSES);
    setAmbulances(INITIAL_AMBULANCES);

    setSimulationState({
      isActive: false,
      isPaused: false,
      currentStep: 0,
      totalSteps: 7,
      isRoadblocked: false,
      secondAmbulanceActive: false,
      isNetworkDown: false,
      corridorApproved: false,
      ambulanceProgress: 0,
    });

    logTimeline('Simulation Reset', 'All entities reset to Metropolitan baseline readiness.', 'incident');
  };

  // Download Offline Map Pack
  const downloadOfflineMap = async (regionName: string) => {
    const pack: OfflineMapPack = {
      regionId: `MAP-${Date.now()}`,
      name: regionName,
      downloadedAt: Date.now(),
      sizeMb: 14.2,
      coordinates: {
        minLat: 21.44,
        maxLat: 21.53,
        minLng: 83.85,
        maxLng: 84.02,
      },
      emergencyFacilitiesCount: 18,
      roadSegmentsCount: 240,
    };
    await saveOfflineMapPack(pack);
    await refreshOfflineCount();
    logTimeline('Offline Map Cached', `Sector "${regionName}" stored in IndexedDB for disconnected routing.`, 'network');
    announceSpeech(`Offline map for ${regionName} saved to local storage.`);
  };

  // Live continuous moving vehicles animation strictly along route paths
  useEffect(() => {
    const moveTimer = setInterval(() => {
      // 1. Move Ambulances that are en_route strictly forward along their routes
      setAmbulances((prev) =>
        prev.map((a) => {
          // Available ambulances stay parked at base depots with zero speed
          if (a.status === 'available' || a.status === 'arrived') {
            return {
              ...a,
              speedKmh: 0,
            };
          }

          // Active en_route ambulance: strictly advances along routeCoords
          const track =
            a.routeCoords && a.routeCoords.length > 1
              ? a.routeCoords
              : isRoadblocked
              ? ROUTE_2_COORDS
              : ROUTE_1_COORDS;

          if (!track || track.length < 2) return a;

          const currentIndex = a.routeIndex ?? 0;
          const nextIndex = currentIndex + 1;

          if (nextIndex < track.length) {
            const currentPt = track[currentIndex];
            const nextPt = track[nextIndex];

            // Real bearing
            const deltaLat = nextPt[0] - currentPt[0];
            const deltaLng = nextPt[1] - currentPt[1];
            const headingRad = Math.atan2(deltaLng, deltaLat);
            const headingDeg = Math.round(((headingRad * 180) / Math.PI + 360) % 360);

            const remainingPts = track.length - 1 - nextIndex;
            const newEta = Math.max(0.2, Math.round(remainingPts * 0.45 * 10) / 10);
            const newSpeed = Math.floor(54 + Math.random() * 8);

            return {
              ...a,
              currentCoords: nextPt,
              routeIndex: nextIndex,
              heading: headingDeg,
              speedKmh: newSpeed,
              etaMinutes: newEta,
            };
          } else {
            // Reached destination
            return {
              ...a,
              currentCoords: track[track.length - 1],
              routeIndex: track.length - 1,
              speedKmh: 0,
              etaMinutes: 0,
              status: 'arrived',
            };
          }
        })
      );

      // 2. Move Public Transit Buses along their fixed scheduled routes
      setPublicBuses((prev) =>
        prev.map((bus) => {
          const track =
            bus.routeCoords && bus.routeCoords.length > 1
              ? bus.routeCoords
              : bus.id === 'BUS-101'
              ? BUS_101_ROUTE
              : BUS_204_ROUTE;

          if (!track || track.length < 2) return bus;

          const currentIndex = bus.routeIndex ?? 0;
          const nextIndex = (currentIndex + 1) % track.length;
          const newPos = track[nextIndex];

          return {
            ...bus,
            currentCoords: newPos,
            routeIndex: nextIndex,
          };
        })
      );
    }, 1500);

    return () => clearInterval(moveTimer);
  }, [isRoadblocked]);

  // Synchronize simulation step progress with ambulance positioning
  useEffect(() => {
    if (simulationState.ambulanceProgress > 0) {
      const activeCoords = isRoadblocked ? ROUTE_2_COORDS : calculateRoutes(false)[0].coordinates;
      const index = Math.min(
        Math.floor((simulationState.ambulanceProgress / 100) * (activeCoords.length - 1)),
        activeCoords.length - 1
      );
      const currentPos = activeCoords[index];

      setAmbulances((prev) =>
        prev.map((a) => {
          if (a.id === 'AMB-02') {
            return {
              ...a,
              status: 'en_route',
              currentCoords: currentPos,
              speedKmh: Math.floor(54 + Math.random() * 12),
              etaMinutes: Math.max(0.5, Math.round(15 * (1 - simulationState.ambulanceProgress / 100) * 10) / 10),
            };
          }
          return a;
        })
      );
    }
  }, [simulationState.ambulanceProgress, isRoadblocked]);

  return (
    <RouteResQContext.Provider
      value={{
        language,
        setLanguage,
        t,
        userRole,
        setUserRole,
        isOnline,
        toggleOfflineSimulation,
        activeTab,
        setActiveTab,
        isSosModalOpen,
        setIsSosModalOpen,
        isVoiceSosModalOpen,
        setIsVoiceSosModalOpen,
        isReportModalOpen,
        setIsReportModalOpen,
        activeAmbulanceNotification,
        dismissAmbulanceNotification,
        playEmergencyChime,
        reportAccidentWithImage,
        incidents,
        selectedIncident,
        setSelectedIncidentId,
        ambulances,
        selectedAmbulance,
        setSelectedAmbulanceId,
        hospitals,
        selectedHospital,
        setSelectedHospitalId,
        routes,
        isRoadblocked,
        selectedRouteId,
        setSelectedRouteId,
        greenCorridor,
        approveGreenCorridor,
        rejectGreenCorridor,
        intersectionConflict,
        publicBuses,
        simulationState,
        timelineEvents,
        startSimulation,
        pauseSimulation,
        resumeSimulation,
        resetSimulation,
        stepSimulation,
        simulateRoadblock,
        simulateSecondAmbulanceConflict,
        offlineQueueCount,
        syncOfflineQueue,
        offlineMapPacks,
        downloadOfflineMap,
        triggerSOS,
        triggerVoiceSOS,
        dispatchAmbulance,
        announceSpeech,
      }}
    >
      {children}
    </RouteResQContext.Provider>
  );
};

export const useRouteResQ = () => {
  const context = useContext(RouteResQContext);
  if (!context) {
    throw new Error('useRouteResQ must be used within a RouteResQProvider');
  }
  return context;
};
