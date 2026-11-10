import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useRouteResQ } from '../context/RouteResQContext';
import {
  Layers,
  Crosshair,
  Maximize2,
  AlertTriangle,
  Ambulance as AmbulanceIcon,
  Building2,
  Zap,
  Info,
  CheckCircle,
  Pause,
  Play,
  RotateCw,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
} from 'lucide-react';
import IMAGES from '../assets/imageAssets';

export const LeafletCityMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const polylinesLayerRef = useRef<L.LayerGroup | null>(null);

  const {
    t,
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
    selectedRouteId,
    setSelectedRouteId,
    simulationState,
    startSimulation,
    pauseSimulation,
    resumeSimulation,
    stepSimulation,
    greenCorridor,
    intersectionConflict,
    publicBuses,
    isRoadblocked,
    simulateRoadblock,
  } = useRouteResQ();

  // Layer toggles
  const [showAmbulances, setShowAmbulances] = useState(true);
  const [showHospitals, setShowHospitals] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);
  const [showRoadblocks, setShowRoadblocks] = useState(true);
  const [showBuses, setShowBuses] = useState(true);

  // Guidance card collapsed state
  const [guidanceExpanded, setGuidanceExpanded] = useState(true);

  // Initialize Leaflet Map once
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Centered around metropolitan river corridor
    const map = L.map(mapContainerRef.current, {
      center: [21.482, 83.922],
      zoom: 13,
      zoomControl: false,
    });

    // Clean OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors | RouteResQ Global Transit AI',
      maxZoom: 18,
    }).addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);

    const polylinesLayer = L.layerGroup().addTo(map);
    const markersLayer = L.layerGroup().addTo(map);

    markersLayerRef.current = markersLayer;
    polylinesLayerRef.current = polylinesLayer;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers & Polylines whenever entities update
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || !polylinesLayerRef.current) return;

    const markersLayer = markersLayerRef.current;
    const polylinesLayer = polylinesLayerRef.current;

    markersLayer.clearLayers();
    polylinesLayer.clearLayers();

    // 1. Draw Route Polylines matching screenshot
    routes.forEach((route) => {
      const isPriorityActive =
        route.id === selectedRouteId ||
        (isRoadblocked ? route.id === 'route_ringroad' : route.id === 'route_expressway');

      if (route.isBlocked) {
        // Red dashed blocked road
        L.polyline(route.coordinates, {
          color: '#F00016',
          weight: 5,
          opacity: 0.85,
          dashArray: '8, 8',
        })
          .bindTooltip(`⛔ Blocked Arterial: ${route.name} (Avoided by AI Routing)`, { sticky: true })
          .addTo(polylinesLayer);
      } else if (isPriorityActive) {
        // Active Priority Green Corridor with Emerald Glow
        L.polyline(route.coordinates, {
          color: '#13A878',
          weight: 12,
          opacity: 0.3,
        }).addTo(polylinesLayer);

        L.polyline(route.coordinates, {
          color: '#13A878',
          weight: 5.5,
          opacity: 0.95,
        })
          .bindTooltip(`★ Priority Corridor (Safest & Fastest): ${route.name}`, { sticky: true })
          .addTo(polylinesLayer);
      } else {
        // Alternative Route in Orange
        L.polyline(route.coordinates, {
          color: '#F2A51A',
          weight: 4,
          opacity: 0.75,
          dashArray: '5, 6',
        })
          .bindTooltip(`Alternative Bridge Route: ${route.name}`, { sticky: true })
          .addTo(polylinesLayer);
      }
    });

    // Draw active custom dispatch path if present for newly dispatched ambulances
    ambulances.forEach((amb) => {
      if (amb.status === 'en_route' && amb.routeCoords && amb.routeCoords.length > 1 && amb.id !== 'AMB-02') {
        L.polyline(amb.routeCoords, {
          color: '#13A878',
          weight: 8,
          opacity: 0.3,
        }).addTo(polylinesLayer);

        L.polyline(amb.routeCoords, {
          color: '#13A878',
          weight: 4.5,
          opacity: 0.9,
          dashArray: '6, 6',
        })
          .bindTooltip(`Active Dispatch Route: ${amb.callSign}`, { sticky: true })
          .addTo(polylinesLayer);
      }
    });

    // 2. Ambulances with real vehicle pictures & callsign badge
    if (showAmbulances) {
      ambulances.forEach((amb) => {
        const isResponding = amb.status === 'en_route';
        const isSelected = selectedAmbulance?.id === amb.id;

        const ambIcon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: `
            <div style="cursor: pointer; display: flex; flex-direction: column; align-items: center; filter: drop-shadow(0 3px 6px rgba(0,0,0,0.3));">
              <div style="background: ${isResponding ? '#142D4F' : '#2878E8'}; border: 2px solid #FFFFFF; border-radius: 8px; padding: 2px 5px; display: flex; align-items: center; gap: 4px; box-shadow: ${isSelected ? '0 0 0 3px #13A878' : 'none'};">
                <img src="${IMAGES.ambulanceVehicleIcon}" style="width: 18px; height: 18px; object-fit: contain;" alt="ambulance" />
                <span style="color: #FFFFFF; font-size: 10px; font-weight: 800; font-family: monospace;">${amb.callSign.split(' ')[0]}</span>
                ${isResponding ? '<span style="width: 6px; height: 6px; border-radius: 9999px; background: #13A878; animation: pulse 1s infinite;"></span>' : ''}
              </div>
            </div>
          `,
          iconSize: [64, 30],
          iconAnchor: [32, 15],
        });

        const m = L.marker(amb.currentCoords, { icon: ambIcon }).addTo(markersLayer);
        m.on('click', () => setSelectedAmbulanceId(amb.id));
        m.bindTooltip(`<strong>${amb.callSign}</strong> (${amb.type})<br/>Driver: ${amb.driverName}<br/>Speed: ${amb.speedKmh} km/h`, { direction: 'top' });
      });
    }

    // 3. City Public Transit Buses with vehicle picture
    if (showBuses) {
      publicBuses.forEach((bus) => {
        const busIcon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: `
            <div style="background: #F59E0B; border: 2px solid #FFFFFF; border-radius: 8px; padding: 2px 5px; display: flex; align-items: center; gap: 3px; box-shadow: 0 3px 6px rgba(0,0,0,0.25);">
              <img src="${IMAGES.transitBusMarker}" style="width: 17px; height: 17px; object-fit: contain;" alt="bus" />
              <span style="color: #1e293b; font-size: 9px; font-weight: 800; font-family: monospace;">${bus.routeNumber.split(' ')[1] || 'BUS'}</span>
            </div>
          `,
          iconSize: [52, 26],
          iconAnchor: [26, 13],
        });

        L.marker(bus.currentCoords, { icon: busIcon })
          .addTo(markersLayer)
          .bindTooltip(`<strong>${bus.routeNumber}</strong><br/>Route: ${bus.origin} → ${bus.destination}<br/>Capacity: ${bus.passengerCount} pax`, { direction: 'top' });
      });
    }

    // 4. Incidents (Red alert markers)
    if (showIncidents) {
      incidents.forEach((inc) => {
        const incidentIcon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: `
            <div style="position: relative; width: 34px; height: 34px; cursor: pointer;">
              <div style="position: absolute; inset: 0; background: #F00016; border-radius: 9999px; opacity: 0.35; animation: ping 1.4s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
              <div style="position: relative; width: 34px; height: 34px; background: #F00016; border: 2.5px solid #FFFFFF; border-radius: 9999px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 8px rgba(0,0,0,0.35);">
                <span style="color: white; font-size: 15px; font-weight: 900;">!</span>
              </div>
            </div>
          `,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
        });

        const m = L.marker(inc.coordinates, { icon: incidentIcon }).addTo(markersLayer);
        m.on('click', () => setSelectedIncidentId(inc.id));
        m.bindTooltip(`<strong>${inc.title}</strong><br/>${inc.locationName}`, { direction: 'top' });
      });
    }

    // 5. Hospitals (Purple badges with building picture/icon)
    if (showHospitals) {
      hospitals.forEach((hosp) => {
        const hospIcon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: `
            <div style="background: #6366F1; border: 2px solid #FFFFFF; border-radius: 8px; padding: 2px 6px; display: flex; align-items: center; gap: 3px; box-shadow: 0 3px 6px rgba(0,0,0,0.25); cursor: pointer;">
              <span style="color: #FFFFFF; font-weight: 900; font-size: 11px;">H</span>
              <span style="color: #FFFFFF; font-size: 9px; font-weight: 700; white-space: nowrap;">${hosp.shortName.split(',')[0]}</span>
            </div>
          `,
          iconSize: [70, 24],
          iconAnchor: [35, 12],
        });

        const m = L.marker(hosp.coords, { icon: hospIcon }).addTo(markersLayer);
        m.on('click', () => setSelectedHospitalId(hosp.id));
        m.bindTooltip(`<strong>${hosp.name}</strong><br/>ICU Beds Ready: ${hosp.icuBedsAvailable}/${hosp.icuBedsTotal}`, { direction: 'top' });
      });
    }

    // 6. Roadblock Barrier Marker
    if (showRoadblocks && isRoadblocked) {
      const roadblockIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="background: #F00016; border: 2.5px solid #FFFFFF; border-radius: 8px; padding: 4px 8px; display: flex; align-items: center; gap: 5px; color: white; font-weight: 800; font-size: 10px; box-shadow: 0 4px 12px rgba(240,0,22,0.5); white-space: nowrap;">
            <span>⛔ ROAD CLOSED (COLLISION)</span>
          </div>
        `,
        iconSize: [160, 26],
        iconAnchor: [80, 13],
      });

      L.marker([21.4870, 83.9020], { icon: roadblockIcon })
        .addTo(markersLayer)
        .bindTooltip('Expressway West Approach: Multi-vehicle collision, blocked lanes', { permanent: true, direction: 'bottom' });
    }
  }, [
    ambulances,
    publicBuses,
    incidents,
    hospitals,
    routes,
    isRoadblocked,
    showAmbulances,
    showHospitals,
    showIncidents,
    showRoadblocks,
    showBuses,
    selectedAmbulance,
  ]);

  const recenterMap = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([21.482, 83.922], 13);
    }
  };

  const currentUnit = selectedAmbulance || ambulances[1] || ambulances[0];
  const isEnRoute = currentUnit.status === 'en_route';

  return (
    <div className="relative w-full h-[640px] md:h-[700px] rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm bg-slate-100">
      {/* Map DOM Element */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* TOP FLOATING TOOLBAR matching screenshot image_4975cb37.png */}
      <div className="absolute top-3 left-3 right-3 z-[450] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left cluster: Grid Title + Simulation controls + Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
          {/* Live Operations Grid pill */}
          <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-full px-3.5 py-1.5 shadow-md flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#13A878] animate-pulse" />
            <div>
              <div className="text-xs font-extrabold text-[#142D4F] leading-none">
                Live Operations Grid
              </div>
              <div className="text-[10px] text-slate-500 font-medium leading-none mt-0.5">
                Metropolitan Emergency Area
              </div>
            </div>

            {/* Pause / Play button */}
            <button
              onClick={simulationState.isActive && !simulationState.isPaused ? pauseSimulation : resumeSimulation}
              className="ml-1 bg-amber-100 hover:bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 transition cursor-pointer"
            >
              {simulationState.isActive && !simulationState.isPaused ? (
                <>
                  <Pause className="w-2.5 h-2.5" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-2.5 h-2.5 fill-current" />
                  <span>Resume</span>
                </>
              )}
            </button>

            {/* Tick button */}
            <button
              onClick={stepSimulation}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 transition cursor-pointer"
            >
              <RotateCw className="w-2.5 h-2.5" />
              <span>Tick</span>
            </button>
          </div>

          {/* Interactive Layer Category Pills */}
          <div className="hidden md:flex items-center gap-1.5 bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-full p-1 shadow-md text-[11px] font-bold">
            {/* Ambulances */}
            <button
              onClick={() => setShowAmbulances(!showAmbulances)}
              className={`px-3 py-1 rounded-full flex items-center gap-1.5 transition cursor-pointer ${
                showAmbulances
                  ? 'bg-[#2878E8] text-white shadow-xs'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <img src={IMAGES.ambulanceVehicleIcon} className="w-3.5 h-3.5 object-contain" alt="" />
              <span>Ambulances ({ambulances.length})</span>
            </button>

            {/* Hospitals */}
            <button
              onClick={() => setShowHospitals(!showHospitals)}
              className={`px-3 py-1 rounded-full flex items-center gap-1.5 transition cursor-pointer ${
                showHospitals
                  ? 'bg-[#142D4F] text-white shadow-xs'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <Building2 className="w-3 h-3" />
              <span>Hospitals ({hospitals.length})</span>
            </button>

            {/* Incidents */}
            <button
              onClick={() => setShowIncidents(!showIncidents)}
              className={`px-3 py-1 rounded-full flex items-center gap-1.5 transition cursor-pointer ${
                showIncidents
                  ? 'bg-[#F00016] text-white shadow-xs'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              <span>Incidents ({incidents.length})</span>
            </button>

            {/* Roadblocks */}
            <button
              onClick={() => setShowRoadblocks(!showRoadblocks)}
              className={`px-3 py-1 rounded-full flex items-center gap-1.5 transition cursor-pointer ${
                showRoadblocks
                  ? 'bg-rose-900 text-white shadow-xs'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <Zap className="w-3 h-3" />
              <span>Roadblocks ({isRoadblocked ? 1 : 0})</span>
            </button>

            {/* Transit Buses */}
            <button
              onClick={() => setShowBuses(!showBuses)}
              className={`px-3 py-1 rounded-full flex items-center gap-1.5 transition cursor-pointer ${
                showBuses
                  ? 'bg-[#F59E0B] text-white shadow-xs'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <img src={IMAGES.transitBusMarker} className="w-3.5 h-3.5 object-contain" alt="" />
              <span>Transit</span>
            </button>
          </div>
        </div>

        {/* Right cluster: Corridors & Blockades pill + Manage */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-full px-3.5 py-1.5 shadow-md flex items-center gap-3 text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1.5 text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-[#13A878]" />
              {greenCorridor && greenCorridor.status === 'approved' ? '1 Active Corridor' : '0 Active Corridors'}
            </span>

            <span className="text-slate-300">|</span>

            <span className="flex items-center gap-1.5 text-amber-700">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              {isRoadblocked ? '1 Blockade' : '0 Blockades'}
            </span>

            <button
              onClick={simulateRoadblock}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-2 py-0.5 rounded text-[10px] font-extrabold transition cursor-pointer"
            >
              Manage
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM-LEFT FLOATING TELEMETRY CARD matching screenshot image_4975cb37.png */}
      <div className="absolute bottom-4 left-4 z-[450] bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-4 shadow-xl max-w-sm w-full sm:w-80">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#13A878] animate-pulse" />
            <h3 className="text-xs font-extrabold text-[#142D4F]">
              Telemetry: {currentUnit.callSign}
            </h3>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-blue-50 text-[#2878E8] border border-blue-200">
              {currentUnit.id}
            </span>
          </div>

          <span className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded ${
            isEnRoute
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 animate-pulse'
              : 'bg-slate-100 text-slate-700 border border-slate-200'
          }`}>
            {isEnRoute ? 'EN ROUTE' : 'AVAILABLE'}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-3 pt-1 text-center font-mono">
          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 block font-sans font-semibold">Speed</span>
            <span className="text-sm font-extrabold text-slate-900">
              {currentUnit.speedKmh} km/h
            </span>
          </div>

          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 block font-sans font-semibold">Corridor</span>
            <span className={`text-xs font-extrabold ${
              isEnRoute ? 'text-emerald-600' : 'text-slate-700'
            }`}>
              {isEnRoute ? 'Active Priority' : 'Standby'}
            </span>
          </div>

          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 block font-sans font-semibold">ETA to Goal</span>
            <span className="text-xs font-extrabold text-[#F00016]">
              {isEnRoute ? `${currentUnit.etaMinutes} min` : 'Scene'}
            </span>
          </div>
        </div>
      </div>

      {/* BOTTOM-CENTER FLOATING OPERATIONAL LEGEND matching screenshot */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[450] hidden lg:flex items-center gap-4 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-full px-4 py-2 shadow-lg text-[11px] font-bold text-slate-700">
        <span className="text-xs font-extrabold text-[#142D4F] pr-1 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-[#2878E8]" />
          Operational Network Legend
        </span>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-1.5 rounded-full bg-[#13A878]" />
          <span>Priority Emergency Route</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-1.5 rounded-full bg-[#F2A51A]" />
          <span>Alternative Route</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-1.5 rounded-full bg-[#F00016]" />
          <span>Closed / Blocked Road</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2878E8]" />
          <span>Live Ambulance</span>
        </div>
      </div>

      {/* BOTTOM-RIGHT FLOATING PRIORITY CORRIDOR GUIDANCE matching screenshot image_4975cb37.png */}
      <div className="absolute bottom-4 right-4 z-[450] bg-[#142D4F] text-white border border-slate-700 rounded-2xl shadow-2xl max-w-sm w-full sm:w-84 overflow-hidden">
        {/* Header bar */}
        <div
          onClick={() => setGuidanceExpanded(!guidanceExpanded)}
          className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 transition border-b border-slate-800"
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#13A878] animate-pulse" />
            <h4 className="text-xs font-extrabold text-white">Priority Corridor Guidance</h4>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-[#13A878] border border-emerald-500/40">
              12.1 km · 15.2m ETA
            </span>
            {guidanceExpanded ? (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            )}
          </div>
        </div>

        {/* 5 Numbered Steps */}
        {guidanceExpanded && (
          <div className="p-3 space-y-2 text-[11px] max-h-56 overflow-y-auto">
            {/* Step 1 */}
            <div className="flex items-start gap-2 p-2 rounded-lg bg-slate-800/60 border border-slate-700/80">
              <span className="text-xs font-mono font-bold text-[#2878E8] shrink-0">#1</span>
              <p className="text-slate-200 leading-snug">
                🚨 Emergency Priority Route Engaged: Siren & clearance corridor active.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-2 p-2 rounded-lg bg-slate-800/40 border border-slate-700/60">
              <span className="text-xs font-mono font-bold text-slate-400 shrink-0">#2</span>
              <p className="text-slate-300 leading-snug">
                Head towards Central Expressway along Metro Campus Internal Road (0.8 km).
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-2 p-2 rounded-lg bg-slate-800/40 border border-slate-700/60">
              <span className="text-xs font-mono font-bold text-slate-400 shrink-0">#3</span>
              <p className="text-slate-300 leading-snug">
                Continue through City Junction onto Metropolitan Expressway (4.8 km).
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex items-start gap-2 p-2 rounded-lg bg-slate-800/40 border border-slate-700/60">
              <span className="text-xs font-mono font-bold text-slate-400 shrink-0">#4</span>
              <p className="text-slate-300 leading-snug">
                Continue through Grand River Bridge West approach (3.4 km).
              </p>
            </div>

            {/* Step 5 */}
            <div className="flex items-start gap-2 p-2 rounded-lg bg-slate-800/40 border border-slate-700/60">
              <span className="text-xs font-mono font-bold text-slate-400 shrink-0">#5</span>
              <p className="text-slate-300 leading-snug">
                Arrive at destination: Metropolitan Central Station via Station Link Road.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
