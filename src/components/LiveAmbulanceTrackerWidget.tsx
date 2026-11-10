import React, { useState } from 'react';
import {
  Ambulance,
  Compass,
  Navigation,
  Activity,
  MapPin,
  Clock,
  Radio,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { useRouteResQ } from '../context/RouteResQContext';

export const LiveAmbulanceTrackerWidget: React.FC = () => {
  const {
    ambulances,
    selectedAmbulanceId,
    setSelectedAmbulanceId,
    setActiveTab,
    activeTab,
    t,
  } = useRouteResQ();

  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // Find active moving ambulance or AMB-02
  const activeAmbulance =
    ambulances.find((a) => a.id === selectedAmbulanceId) ||
    ambulances.find((a) => a.status === 'en_route') ||
    ambulances[1];

  if (!activeAmbulance) return null;

  const isEnRoute = activeAmbulance.status === 'en_route';

  const handleOpenMap = () => {
    setSelectedAmbulanceId(activeAmbulance.id);
    setActiveTab('live_ops');
  };

  return (
    <div className="fixed bottom-4 right-4 z-[500] max-w-sm w-full select-none">
      <div className="bg-[#142D4F]/95 backdrop-blur-md border border-[#284873] shadow-2xl rounded-2xl overflow-hidden text-white transition-all">
        {/* Header Bar */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-4 py-2.5 bg-[#0f233f] hover:bg-[#163054] cursor-pointer flex items-center justify-between transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <span className={`w-2.5 h-2.5 rounded-full block ${isEnRoute ? 'bg-emerald-400 animate-ping' : 'bg-blue-400'}`} />
              <span className={`w-2.5 h-2.5 rounded-full absolute top-0 left-0 ${isEnRoute ? 'bg-emerald-400' : 'bg-blue-400'}`} />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-wide text-white">
                {activeAmbulance.callSign}
              </span>
              <span
                className={`text-[9px] font-mono font-extrabold px-2 py-0.5 rounded-full ${
                  isEnRoute
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-700 text-slate-300'
                }`}
              >
                {isEnRoute ? 'EN ROUTE' : 'AVAILABLE'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
              {activeAmbulance.speedKmh} km/h
            </span>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            )}
          </div>
        </div>

        {/* Collapsible Telemetry Details */}
        {isExpanded && (
          <div className="p-4 space-y-3 text-xs">
            {/* Live GPS Coordinates and Speed */}
            <div className="grid grid-cols-2 gap-2 bg-[#0c1c33] p-2.5 rounded-xl border border-slate-800 font-mono text-[11px]">
              <div>
                <span className="text-slate-400 block text-[9px] uppercase font-sans font-bold">
                  Live GPS
                </span>
                <span className="text-emerald-300 font-bold">
                  {activeAmbulance.currentCoords[0].toFixed(4)}°N,{' '}
                  {activeAmbulance.currentCoords[1].toFixed(4)}°E
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[9px] uppercase font-sans font-bold">
                  Speed / Heading
                </span>
                <span className="text-white font-bold">
                  {activeAmbulance.speedKmh} km/h · {activeAmbulance.heading}°
                </span>
              </div>
            </div>

            {/* Paramedic and Hospital Details */}
            <div className="space-y-1.5 text-slate-300 text-[11px]">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Driver / Paramedic:</span>
                <span className="font-semibold text-white">
                  {activeAmbulance.driverName}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Emergency Destination:</span>
                <span className="font-semibold text-[#2878E8] truncate max-w-[170px]">
                  VIMSAR Trauma Center
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Estimated Arrival:</span>
                <span className="font-bold text-amber-300">
                  ~{activeAmbulance.etaMinutes} mins
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Corridor Status:</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Green Wave Priority
                </span>
              </div>
            </div>

            {/* Action button to open full map */}
            {activeTab !== 'live_ops' && (
              <button
                onClick={handleOpenMap}
                className="w-full py-2 bg-[#2878E8] hover:bg-[#1a65cc] text-white rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.01]"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Track This Ambulance on Full Map</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
