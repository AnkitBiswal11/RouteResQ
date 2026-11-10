import React, { useState } from 'react';
import {
  Ambulance as AmbulanceIcon,
  CheckCircle2,
  Send,
  MapPin,
  Clock,
  ShieldCheck,
  AlertCircle,
  Radio,
  Phone,
  ArrowRight,
  BatteryCharging,
} from 'lucide-react';
import { useRouteResQ } from '../context/RouteResQContext';

export const SmartDispatchPage: React.FC = () => {
  const {
    t,
    ambulances,
    incidents,
    selectedIncident,
    setSelectedIncidentId,
    dispatchAmbulance,
    hospitals,
    setActiveTab,
  } = useRouteResQ();

  const availableUnits = ambulances.filter((a) => a.status === 'available');
  const [selectedAmbulanceToDispatch, setSelectedAmbulanceToDispatch] = useState<string>(
    availableUnits[0]?.id || 'AMB-01'
  );
  const [targetHospitalId, setTargetHospitalId] = useState<string>('HOSP_VIMSAR');

  const activeUnassignedIncident = incidents.find((i) => !i.assignedAmbulanceId) || incidents[0];

  const handleConfirmDispatch = (ambId: string) => {
    if (!activeUnassignedIncident) return;
    dispatchAmbulance(ambId, activeUnassignedIncident.id, targetHospitalId);
    setActiveTab('live_ops');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-extrabold text-[#142D4F]">
            Smart Ambulance Dispatch & Fleet Management
          </h2>
          <p className="text-xs text-slate-500">
            Intelligent triage matching, shortest ETA calculation, and green corridor linkage
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200">
            Fleet: {ambulances.filter((a) => a.status === 'available').length} Available / {ambulances.length} Total
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN (7 cols): Available Fleet Units */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-[#142D4F]">
                Metropolitan Emergency Response Fleet
              </h3>
              <span className="text-xs text-slate-500 font-mono">Triage Algorithm Active</span>
            </div>

            <div className="space-y-3">
              {ambulances.map((amb) => {
                const isAvailable = amb.status === 'available';
                const isEnRoute = amb.status === 'en_route';

                return (
                  <div
                    key={amb.id}
                    onClick={() => setSelectedAmbulanceToDispatch(amb.id)}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      selectedAmbulanceToDispatch === amb.id
                        ? 'border-[#2878E8] bg-blue-50/20 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2.5 rounded-xl shrink-0 ${
                            isAvailable
                              ? 'bg-blue-50 text-[#2878E8]'
                              : 'bg-emerald-50 text-emerald-700'
                          }`}
                        >
                          <AmbulanceIcon className="w-5 h-5" />
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-extrabold text-slate-900">{amb.callSign}</h4>
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                              {amb.type} CLASS
                            </span>
                            <span
                              className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                                isAvailable
                                  ? 'bg-slate-100 text-slate-700'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {amb.status.toUpperCase()}
                            </span>
                          </div>

                          <p className="text-xs text-slate-500 mt-1">
                            Driver: <strong>{amb.driverName}</strong> ({amb.driverPhone})
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-xs font-mono font-bold text-slate-700 flex items-center gap-1 justify-end">
                          <BatteryCharging className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{amb.batteryOrFuel}% Power</span>
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                          ETA: {amb.etaMinutes} mins
                        </div>
                      </div>
                    </div>

                    {/* Equipment Details */}
                    <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5 text-[10px] font-mono text-slate-600">
                      {amb.equipment.map((item, idx) => (
                        <span key={idx} className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {item}
                        </span>
                      ))}
                    </div>

                    {/* Action */}
                    <div className="mt-3 pt-2 flex items-center justify-end">
                      {isAvailable ? (
                        <button
                          onClick={() => handleConfirmDispatch(amb.id)}
                          className="flex items-center gap-1.5 bg-[#2878E8] hover:bg-[#1f66cb] text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Dispatch This Unit</span>
                        </button>
                      ) : (
                        <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                          <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                          En Route to Scene / Hospital
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (5 cols): Active Incident to Assign */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-[#142D4F]">
                Pending Emergency Assignment
              </h3>
              <span className="text-xs font-mono text-rose-600 font-bold">CODE RED</span>
            </div>

            {activeUnassignedIncident ? (
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-red-50/50 border border-red-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-red-700">
                      {activeUnassignedIncident.id}
                    </span>
                    <span className="font-bold text-slate-500">
                      {new Date(activeUnassignedIncident.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900">
                    {activeUnassignedIncident.title}
                  </h4>
                  <p className="text-slate-600 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#2878E8]" />
                    <span>{activeUnassignedIncident.locationName}</span>
                  </p>
                  {activeUnassignedIncident.patientCondition && (
                    <p className="text-slate-700 bg-white p-2 rounded-md border border-red-100 text-[11px]">
                      <strong>Triage Notes:</strong> {activeUnassignedIncident.patientCondition}
                    </p>
                  )}
                </div>

                {/* Destination Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Target Trauma Facility
                  </label>
                  <select
                    value={targetHospitalId}
                    onChange={(e) => setTargetHospitalId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-bold text-slate-800"
                  >
                    {hospitals.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name} ({h.traumaLevel}) — {h.icuBedsAvailable} ICU beds ready
                      </option>
                    ))}
                  </select>
                </div>

                {/* Top Recommended Unit Callout */}
                {(() => {
                  const targetUnit = ambulances.find((a) => a.id === selectedAmbulanceToDispatch) || ambulances[0];
                  return (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1.5">
                      <span className="text-[10px] font-mono font-bold uppercase text-emerald-800">
                        Selected Unit for Dispatch
                      </span>
                      <div className="text-xs font-bold text-emerald-950">
                        {targetUnit?.callSign} ({targetUnit?.type}) — {targetUnit?.etaMinutes} mins ETA
                      </div>
                      <p className="text-[11px] text-emerald-900 leading-tight">
                        Driver {targetUnit?.driverName}. Equipped with: {targetUnit?.equipment.slice(0, 3).join(', ')}.
                      </p>
                    </div>
                  );
                })()}

                <button
                  onClick={() => handleConfirmDispatch(selectedAmbulanceToDispatch)}
                  className="w-full py-3 bg-[#2878E8] hover:bg-[#1f66cb] text-white font-extrabold text-xs rounded-xl shadow-md transition"
                >
                  Confirm Dispatch & Initiate Green Corridor
                </button>
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-slate-500">
                All active emergencies have assigned ambulance units.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
