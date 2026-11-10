import React, { useState } from 'react';
import {
  ShieldAlert,
  Ambulance as AmbulanceIcon,
  Navigation,
  AlertTriangle,
  Building2,
  Plus,
  ArrowRight,
  MapPin,
  Clock,
  Radio,
  CheckCircle2,
  Heart,
  Car,
  Camera,
} from 'lucide-react';
import { useRouteResQ } from '../context/RouteResQContext';
import { EmergencyCategory } from '../types';

export const OverviewPage: React.FC = () => {
  const {
    t,
    incidents,
    selectedIncident,
    setSelectedIncidentId,
    ambulances,
    hospitals,
    selectedHospital,
    setSelectedHospitalId,
    isRoadblocked,
    greenCorridor,
    timelineEvents,
    setActiveTab,
    setIsSosModalOpen,
    setIsReportModalOpen,
  } = useRouteResQ();

  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredIncidents = incidents.filter((inc) => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'critical') return inc.severity === 'critical';
    return inc.category === filterCategory;
  });

  const availableAmbulancesCount = ambulances.filter((a) => a.status === 'available').length;
  const respondingCount = ambulances.filter((a) => a.status === 'en_route').length;

  return (
    <div className="space-y-6">
      {/* Top Header & Action Buttons matching image_fcd0a48e.png */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-[#142D4F] tracking-tight">
              Emergency Command Overview
            </h1>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Grid Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Real-time urban medical transit telemetry, active triage board, and hospital bed synchronization.
          </p>
        </div>

        {/* 3 Action Buttons matching image_fcd0a48e.png */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setActiveTab('live_ops')}
            className="flex items-center gap-2 bg-[#2878E8] hover:bg-[#1f66cb] text-white px-4 py-2.5 rounded-xl text-xs font-extrabold shadow-sm transition hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <Navigation className="w-4 h-4" />
            <span>Open Live Operations Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-[#2878E8] border border-slate-200 hover:border-blue-300 px-4 py-2.5 rounded-xl text-xs font-extrabold shadow-sm transition hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
            title="Upload photo evidence of road accident"
          >
            <Camera className="w-4 h-4 text-[#2878E8]" />
            <span>Report Emergency / Upload Photo</span>
          </button>

          <button
            onClick={() => setActiveTab('dispatch')}
            className="flex items-center gap-1.5 bg-white hover:bg-emerald-50 text-emerald-700 border border-slate-200 hover:border-emerald-300 px-4 py-2.5 rounded-xl text-xs font-extrabold shadow-sm transition hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <AmbulanceIcon className="w-4 h-4 text-emerald-600" />
            <span>Smart Dispatch</span>
          </button>
        </div>
      </div>

      {/* 5 KPI Cards in a row matching image_fcd0a48e.png */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* KPI 1 */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              ACTIVE EMERGENCIES
            </span>
            <div className="p-1.5 rounded-lg bg-red-50 text-[#F00016]">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#142D4F] tabular-nums mt-1">
            {incidents.length}
          </div>
          <div className="text-[11px] font-bold text-red-600 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
            <span>1 Critical Cases</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              AVAILABLE UNITS
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <AmbulanceIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#142D4F] tabular-nums mt-1">
            {availableAmbulancesCount} <span className="text-base text-slate-400 font-bold">/ {ambulances.length}</span>
          </div>
          <div className="text-[11px] font-bold text-emerald-700 mt-1">
            Fleet Readiness: {Math.round((availableAmbulancesCount / ambulances.length) * 100)}%
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              RESPONDING EN ROUTE
            </span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-[#2878E8]">
              <Navigation className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#142D4F] tabular-nums mt-1">
            {respondingCount}
          </div>
          <div className="text-[11px] font-bold text-[#2878E8] mt-1">
            {respondingCount > 0 ? 'Green Corridors Active' : 'Corridors Standby'}
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              ROAD DISRUPTIONS
            </span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#142D4F] tabular-nums mt-1">
            {isRoadblocked ? 1 : 0}
          </div>
          <div className={`text-[11px] font-bold mt-1 ${isRoadblocked ? 'text-red-600' : 'text-slate-500'}`}>
            {isRoadblocked ? 'Detour Active via Ring Road' : 'Auto-Rerouted via A*'}
          </div>
        </div>

        {/* KPI 5 */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              HOSPITAL BEDS READY
            </span>
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#142D4F] tabular-nums mt-1">
            144
          </div>
          <div className="text-[11px] font-bold text-indigo-700 mt-1">
            28 ICU Beds Available
          </div>
        </div>
      </div>

      {/* Main Two-Column Viewport matching image_fcd0a48e.png */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN (7 cols): Active Emergency Incident Queue */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-red-50 text-red-600">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-[#142D4F]">
                  Active Emergency Incident Queue
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  {incidents.length} incidents awaiting or under transit
                </p>
              </div>
            </div>

            {/* Filter pills matching screenshot */}
            <div className="flex items-center gap-1 text-xs font-bold">
              {['all', 'critical', 'cardiac', 'accident'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1 rounded-full capitalize transition cursor-pointer ${
                    filterCategory === cat
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Cards with actual Photos matching image_fcd0a48e.png */}
          <div className="space-y-3.5">
            {filteredIncidents.map((incident) => {
              const isSelected = selectedIncident?.id === incident.id;
              return (
                <div
                  key={incident.id}
                  onClick={() => setSelectedIncidentId(incident.id)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#2878E8] bg-blue-50/20 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Thumbnail Photo */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-slate-200 relative">
                      <img
                        src={incident.imageUrl || '/src/assets/images/accident_road_incident_1794234760608.jpg'}
                        alt={incident.title}
                        className="w-full h-full object-cover object-center"
                      />
                      <div className="absolute bottom-1 right-1 p-1 rounded-md bg-red-600 text-white">
                        {incident.category === 'cardiac' ? (
                          <Heart className="w-3 h-3 fill-white" />
                        ) : (
                          <Car className="w-3 h-3" />
                        )}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-red-100 text-red-800 tracking-wide">
                            CRITICAL
                          </span>
                          <span className="font-mono font-bold text-slate-500">
                            {incident.id}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-400">
                          {new Date(incident.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <h4 className="text-sm font-black text-slate-900 mt-1 truncate">
                        {incident.title}
                      </h4>

                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{incident.locationName}</span>
                      </p>

                      <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                        {incident.notes}
                      </p>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2 text-xs">
                        <span className="text-slate-600 font-medium">
                          Unit: <strong className="text-slate-900">{incident.assignedAmbulanceId || 'Unassigned'}</strong> · <span className="text-emerald-700 font-bold">Triage in Progress</span>
                        </span>

                        {incident.assignedAmbulanceId ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveTab('live_ops');
                            }}
                            className="flex items-center gap-1 text-xs font-extrabold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg transition cursor-pointer"
                          >
                            <Navigation className="w-3.5 h-3.5" />
                            <span>Track Live Map →</span>
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveTab('dispatch');
                            }}
                            className="flex items-center gap-1 text-xs font-extrabold text-[#2878E8] bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg transition cursor-pointer"
                          >
                            <span>Smart Dispatch →</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN (5 cols): Hospital Emergency Readiness & Event Stream */}
        <div className="lg:col-span-5 space-y-5">
          {/* Hospital Readiness with Real Photos matching image_fcd0a48e.png */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-50 text-[#2878E8]">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#142D4F]">
                    Hospital Emergency Readiness
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Live trauma & ICU bed availability
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('settings')}
                className="text-xs font-bold text-[#2878E8] hover:underline cursor-pointer"
              >
                Manage
              </button>
            </div>

            <div className="space-y-3">
              {hospitals.map((hosp) => {
                const isSelected = selectedHospital?.id === hosp.id;
                return (
                  <div
                    key={hosp.id}
                    onClick={() => setSelectedHospitalId(hosp.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                      isSelected
                        ? 'border-[#2878E8] bg-blue-50/20 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    {/* Facility Photo Thumbnail */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                      <img
                        src={hosp.imageUrl || '/src/assets/images/hospital_medical_center_1794236387782.jpg'}
                        alt={hosp.name}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>

                    <div className="flex-1 min-w-0 text-xs">
                      <div className="flex items-center justify-between">
                        <h4 className="font-extrabold text-slate-900 truncate">{hosp.name}</h4>
                        <span className="text-[11px] font-bold text-[#2878E8] shrink-0 ml-1">
                          Select →
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{hosp.traumaLevel}</p>

                      <div className="flex items-center gap-3 font-mono font-bold mt-1 text-[11px]">
                        <span className="text-slate-700">
                          Beds: <strong className="text-emerald-700">{hosp.emergencyBedsAvailable}/{hosp.emergencyBedsTotal}</strong>
                        </span>
                        <span className="text-slate-300">·</span>
                        <span className="text-slate-700">
                          ICU: <strong className="text-indigo-700">{hosp.icuBedsAvailable}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Real-Time Event Stream matching image_fcd0a48e.png */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-600">
                Real-Time Event Stream
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
              {timelineEvents.map((evt) => (
                <div key={evt.id} className="text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-0.5">
                    <span className="font-extrabold text-slate-800">{evt.title}</span>
                    <span>{evt.timestamp}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{evt.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
