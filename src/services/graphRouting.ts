import { RouteOption, IntersectionSignal } from '../types';

export interface GraphNode {
  id: string;
  name: string;
  coords: [number, number];
}

export interface GraphEdge {
  id: string;
  name: string;
  from: string;
  to: string;
  distanceKm: number;
  baseMinutes: number;
  speedLimitKmh: number;
  congestion: 'clear' | 'moderate' | 'heavy' | 'jammed';
  isBlocked: boolean;
  blockReason?: string;
  reliabilityScore: number;
  intersections: string[];
}

// Metropolitan Landmarks & Nodes
export const METRO_NODES: Record<string, GraphNode> = {
  CENTRAL_DISPATCH_HQ: {
    id: 'CENTRAL_DISPATCH_HQ',
    name: 'Metropolitan Central Dispatch HQ',
    coords: [21.4674, 83.9808],
  },
  CIVIC_SQUARE: {
    id: 'CIVIC_SQUARE',
    name: 'Civic Center Chowk Junction',
    coords: [21.4720, 83.9720],
  },
  RIVER_BOULEVARD_SOUTH: {
    id: 'RIVER_BOULEVARD_SOUTH',
    name: 'Riverfront Boulevard & Ring Road West',
    coords: [21.4615, 83.9580],
  },
  EXPRESS_BRIDGE_EAST: {
    id: 'EXPRESS_BRIDGE_EAST',
    name: 'Expressway Bridge (East Span)',
    coords: [21.4750, 83.9350],
  },
  EXPRESS_BRIDGE_WEST: {
    id: 'EXPRESS_BRIDGE_WEST',
    name: 'Expressway Bridge (West Approach)',
    coords: [21.4870, 83.9020],
  },
  METRO_TOWN_CROSS: {
    id: 'METRO_TOWN_CROSS',
    name: 'Metro Town Square Junction',
    coords: [21.4985, 83.8820],
  },
  TRAUMA_CENTER_VIMSAR: {
    id: 'TRAUMA_CENTER_VIMSAR',
    name: 'Metropolitan Super Specialty Trauma Center',
    coords: [21.5033, 83.8716],
  },
  CAMPUS_BYPASS: {
    id: 'CAMPUS_BYPASS',
    name: 'West Sector University Parkway Bypass',
    coords: [21.4880, 83.8680],
  },
};

// High-density waypoints for smooth vehicle animation (over 20 points per corridor)
export const ROUTE_1_COORDS: [number, number][] = [
  [21.4674, 83.9808],
  [21.4690, 83.9770],
  [21.4710, 83.9735],
  [21.4720, 83.9720],
  [21.4735, 83.9610],
  [21.4745, 83.9480],
  [21.4750, 83.9350],
  [21.4770, 83.9270],
  [21.4790, 83.9210],
  [21.4810, 83.9180],
  [21.4840, 83.9110],
  [21.4870, 83.9020], // Roadblock bottleneck point
  [21.4905, 83.8960],
  [21.4940, 83.8900],
  [21.4965, 83.8855],
  [21.4985, 83.8820],
  [21.5005, 83.8780],
  [21.5020, 83.8745],
  [21.5033, 83.8716],
];

// Route 2: Dynamic Priority Green Corridor (via Riverfront Ring Boulevard)
export const ROUTE_2_COORDS: [number, number][] = [
  [21.4674, 83.9808],
  [21.4655, 83.9760],
  [21.4630, 83.9710],
  [21.4615, 83.9580],
  [21.4625, 83.9490],
  [21.4645, 83.9410],
  [21.4670, 83.9350],
  [21.4690, 83.9320],
  [21.4720, 83.9240],
  [21.4750, 83.9120],
  [21.4780, 83.8990],
  [21.4830, 83.8920],
  [21.4880, 83.8860],
  [21.4920, 83.8810],
  [21.4955, 83.8815],
  [21.4985, 83.8820],
  [21.5005, 83.8780],
  [21.5020, 83.8745],
  [21.5033, 83.8716],
];

// Route 3: West Sector University Parkway Bypass (via Ring Road Bridge & Parkway)
export const ROUTE_3_COORDS: [number, number][] = [
  [21.4674, 83.9808],
  [21.4655, 83.9760],
  [21.4630, 83.9710],
  [21.4615, 83.9580],
  [21.4645, 83.9410], // Enters Southern Bridge 2 (Ring Road Bridge)
  [21.4670, 83.9350], // On Bridge 2
  [21.4720, 83.9240], // On Bridge 2
  [21.4780, 83.8990], // Exits Bridge 2
  [21.4830, 83.8920], // West Ring Road Link
  [21.4850, 83.8780], // University Parkway Approach
  [21.4880, 83.8680], // University Parkway Bypass Road
  [21.4920, 83.8675],
  [21.4960, 83.8670],
  [21.5000, 83.8690],
  [21.5033, 83.8716], // VIMSAR Super Specialty Trauma Center
];

// Continuous dynamic movement loops for all active ambulances
export const VEHICLE_TRACKS: Record<string, [number, number][]> = {
  'AMB-01': [
    [21.4920, 83.9250],
    [21.4945, 83.9290],
    [21.4975, 83.9340],
    [21.4950, 83.9400],
    [21.4910, 83.9360],
    [21.4880, 83.9300],
    [21.4900, 83.9260],
  ],
  'AMB-02': ROUTE_2_COORDS,
  'AMB-03': [
    [21.4680, 83.9480],
    [21.4700, 83.9530],
    [21.4730, 83.9580],
    [21.4750, 83.9520],
    [21.4725, 83.9470],
    [21.4695, 83.9460],
  ],
  'AMB-04': [
    [21.5033, 83.8716],
    [21.5015, 83.8760],
    [21.4985, 83.8820],
    [21.4940, 83.8800],
    [21.4970, 83.8740],
    [21.5010, 83.8720],
  ],
  'AMB-05': [
    [21.4550, 83.9550],
    [21.4585, 83.9600],
    [21.4615, 83.9580],
    [21.4635, 83.9510],
    [21.4590, 83.9480],
    [21.4560, 83.9510],
  ],
  'AMB-06': [
    [21.4780, 83.9580],
    [21.4815, 83.9630],
    [21.4845, 83.9610],
    [21.4820, 83.9540],
    [21.4795, 83.9530],
  ],
  'BUS-101': [
    [21.4780, 83.9250],
    [21.4805, 83.9200],
    [21.4835, 83.9130],
    [21.4865, 83.9060],
    [21.4895, 83.9000],
    [21.4870, 83.9080],
    [21.4830, 83.9170],
    [21.4800, 83.9230],
  ],
  'BUS-204': [
    [21.4920, 83.9400],
    [21.4895, 83.9450],
    [21.4855, 83.9480],
    [21.4815, 83.9430],
    [21.4845, 83.9380],
    [21.4890, 83.9370],
  ],
  'BUS-308': [
    [21.4625, 83.9490],
    [21.4645, 83.9410],
    [21.4670, 83.9350],
    [21.4690, 83.9320],
    [21.4665, 83.9400],
    [21.4640, 83.9460],
  ],
  'BUS-412': [
    [21.4880, 83.8680],
    [21.4920, 83.8675],
    [21.4960, 83.8670],
    [21.5000, 83.8690],
    [21.4950, 83.8680],
    [21.4900, 83.8678],
  ],
};

export const GREEN_CORRIDOR_INTERSECTIONS: IntersectionSignal[] = [
  {
    id: 'SIG_RING_01',
    name: 'Signal 101 — Riverfront Expressway South Junction',
    coords: [21.4615, 83.9580],
    status: 'normal_cycle',
    signalTimerSeconds: 45,
    cycleColor: 'green',
  },
  {
    id: 'SIG_RING_02',
    name: 'Signal 102 — River Boulevard Central Cross',
    coords: [21.4690, 83.9320],
    status: 'normal_cycle',
    signalTimerSeconds: 30,
    cycleColor: 'green',
  },
  {
    id: 'SIG_TOWN_03',
    name: 'Signal 103 — Metro Town Square (Key Conflict Zone)',
    coords: [21.4985, 83.8820],
    status: 'normal_cycle',
    signalTimerSeconds: 50,
    cycleColor: 'green',
  },
  {
    id: 'SIG_TRAUMA_04',
    name: 'Signal 104 — Medical Trauma Bay Express Gate',
    coords: [21.5020, 83.8735],
    status: 'normal_cycle',
    signalTimerSeconds: 20,
    cycleColor: 'green',
  },
];

export function calculateRoutes(isRoadblocked: boolean): RouteOption[] {
  const route1: RouteOption = {
    id: 'route_expressway',
    name: 'Metropolitan 4-Lane Arterial (Direct)',
    via: 'via Expressway Bridge Span',
    distanceKm: 11.8,
    travelMinutes: isRoadblocked ? 42 : 14,
    congestion: isRoadblocked ? 'jammed' : 'clear',
    reliabilityScore: isRoadblocked ? 12 : 94,
    coordinates: ROUTE_1_COORDS,
    isRecommended: !isRoadblocked,
    isBlocked: isRoadblocked,
    blockedReason: isRoadblocked ? 'Multi-vehicle collision & lane barrier blockage on Expressway West' : undefined,
    signalsCount: 5,
  };

  const route2: RouteOption = {
    id: 'route_ringroad',
    name: 'Riverfront Ring Boulevard (Priority Green Corridor)',
    via: 'via Riverfront Expressway & West Sector Link',
    distanceKm: 13.4,
    travelMinutes: 15,
    congestion: 'clear',
    reliabilityScore: 92,
    coordinates: ROUTE_2_COORDS,
    isRecommended: isRoadblocked,
    signalsCount: 4,
  };

  const route3: RouteOption = {
    id: 'route_bypass',
    name: 'West Sector University Parkway Bypass',
    via: 'via Campus Link Avenue',
    distanceKm: 14.9,
    travelMinutes: 19,
    congestion: 'moderate',
    reliabilityScore: 84,
    coordinates: ROUTE_3_COORDS,
    isRecommended: false,
    signalsCount: 6,
  };

  return [route1, route2, route3];
}

// Sequential road routes for public transit buses (continuous closed loops over bridges)
export const BUS_101_ROUTE: [number, number][] = [
  // Outward: East Central Station to West VIMSAR Trauma Center via Expressway Bridge 1
  [21.4674, 83.9808],
  [21.4710, 83.9735],
  [21.4735, 83.9610],
  [21.4750, 83.9350], // Enters Bridge 1 (NH-53 4-Lane Bridge)
  [21.4770, 83.9270], // On Bridge 1
  [21.4790, 83.9210], // On Bridge 1
  [21.4810, 83.9180], // On Bridge 1
  [21.4840, 83.9110], // On Bridge 1
  [21.4870, 83.9020], // Exits Bridge 1
  [21.4905, 83.8960], // West Approach
  [21.4940, 83.8900],
  [21.4985, 83.8820], // Metro Town Square
  [21.5005, 83.8780],
  [21.5033, 83.8716], // VIMSAR Trauma Center
  // Return: West VIMSAR Trauma Center back to East Central Station via Expressway Bridge 1
  [21.5005, 83.8780],
  [21.4985, 83.8820],
  [21.4940, 83.8900],
  [21.4905, 83.8960], // West Approach
  [21.4870, 83.9020], // Enters Bridge 1
  [21.4840, 83.9110], // On Bridge 1
  [21.4810, 83.9180], // On Bridge 1
  [21.4790, 83.9210], // On Bridge 1
  [21.4770, 83.9270], // On Bridge 1
  [21.4750, 83.9350], // Exits Bridge 1
  [21.4735, 83.9610],
  [21.4710, 83.9735],
];

export const BUS_204_ROUTE: [number, number][] = [
  // Outward: East Downtown Hub to West Riverfront Terminal via Ring Road Bridge 2
  [21.4674, 83.9808],
  [21.4655, 83.9760],
  [21.4630, 83.9710],
  [21.4615, 83.9580], // Riverfront Boulevard South
  [21.4645, 83.9410], // Enters Bridge 2 (Southern Ring Road Bridge)
  [21.4670, 83.9350], // On Bridge 2
  [21.4690, 83.9320], // On Bridge 2
  [21.4720, 83.9240], // On Bridge 2
  [21.4750, 83.9120], // On Bridge 2
  [21.4780, 83.8990], // Exits Bridge 2
  [21.4830, 83.8920], // West Riverfront Terminal
  // Return: West Riverfront Terminal back to East Downtown Hub via Ring Road Bridge 2
  [21.4780, 83.8990], // Enters Bridge 2
  [21.4750, 83.9120], // On Bridge 2
  [21.4720, 83.9240], // On Bridge 2
  [21.4690, 83.9320], // On Bridge 2
  [21.4670, 83.9350], // On Bridge 2
  [21.4645, 83.9410], // Exits Bridge 2
  [21.4615, 83.9580],
  [21.4630, 83.9710],
  [21.4655, 83.9760],
];

// Bridge 1: NH-53 4-Lane Expressway Bridge (Fastest / Closest Route)
const BRIDGE_1_CROSSING: [number, number][] = [
  [21.4750, 83.9350], // East Bridge Abutment
  [21.4770, 83.9270], // Span 1
  [21.4790, 83.9210], // Span 2
  [21.4810, 83.9180], // Span 3
  [21.4840, 83.9110], // Span 4
  [21.4870, 83.9020], // West Bridge Abutment
  [21.4905, 83.8960], // West Approach
];

// Bridge 2: Riverfront Ring Road 4-Lane Bridge (Safest Corridor & Detour)
const BRIDGE_2_CROSSING: [number, number][] = [
  [21.4645, 83.9410], // East Bridge Abutment
  [21.4670, 83.9350], // Span 1
  [21.4690, 83.9320], // Span 2
  [21.4720, 83.9240], // Span 3
  [21.4750, 83.9120], // Span 4
  [21.4780, 83.8990], // West Bridge Abutment
  [21.4830, 83.8920], // West Ring Road Link
];

export function buildDispatchRoute(
  ambulanceId: string,
  startCoords: [number, number],
  incidentCoords: [number, number],
  hospitalCoords: [number, number],
  isRoadblocked: boolean
): [number, number][] {
  // Scenario unit AMB-02 adheres to certified simulation corridor
  if (ambulanceId === 'AMB-02') {
    return isRoadblocked ? ROUTE_2_COORDS : ROUTE_1_COORDS;
  }

  // Check if destination is across the river on the West bank (VIMSAR Trauma Center: lng < 83.895)
  const crossesRiver = hospitalCoords[1] < 83.895 || incidentCoords[1] < 83.895;

  if (crossesRiver) {
    if (isRoadblocked) {
      // SAFEST ROUTE: Route via Bridge 2 (Riverfront Ring Road 4-Lane Bridge) to bypass blockage
      const eastApproach: [number, number][] = [
        startCoords,
        [21.4820, 83.9720],
        incidentCoords,
        [21.4720, 83.9720],
        [21.4655, 83.9760],
        [21.4615, 83.9580],
      ];

      const westRun: [number, number][] = [
        [21.4880, 83.8860],
        [21.4920, 83.8810],
        [21.4985, 83.8820],
        [21.5005, 83.8780],
        hospitalCoords,
      ];

      return dedupeCoords([...eastApproach, ...BRIDGE_2_CROSSING, ...westRun]);
    } else {
      // CLOSEST & FASTEST ROUTE: Route via Bridge 1 (NH-53 Expressway 4-Lane Bridge)
      const eastApproach: [number, number][] = [
        startCoords,
        [21.4880, 83.9650],
        incidentCoords,
        [21.4735, 83.9610],
        [21.4745, 83.9480],
      ];

      const westRun: [number, number][] = [
        [21.4940, 83.8900],
        [21.4985, 83.8820],
        [21.5005, 83.8780],
        hospitalCoords,
      ];

      return dedupeCoords([...eastApproach, ...BRIDGE_1_CROSSING, ...westRun]);
    }
  }

  // Intratown East routing: 100% on East bank roadways
  const intraEastPath: [number, number][] = [
    startCoords,
    [21.4820, 83.9720],
    incidentCoords,
    [21.4720, 83.9720],
    hospitalCoords,
  ];

  return dedupeCoords(intraEastPath);
}

function dedupeCoords(points: [number, number][]): [number, number][] {
  const result: [number, number][] = [];
  for (const pt of points) {
    if (result.length === 0) {
      result.push(pt);
      continue;
    }
    const last = result[result.length - 1];
    const dist = Math.hypot(pt[0] - last[0], pt[1] - last[1]);
    if (dist > 0.0005) {
      result.push(pt);
    }
  }
  return result;
}

