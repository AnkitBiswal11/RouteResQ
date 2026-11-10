import React from 'react';
import {
  Bus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Users,
  Navigation,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useRouteResQ } from '../context/RouteResQContext';

export const TransitOptimizationPage: React.FC = () => {
  const {
    t,
    publicBuses,
    isRoadblocked,
    simulateRoadblock,
    setActiveTab,
  } = useRouteResQ();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-yellow-50 text-yellow-700">
            <Bus className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-[#142D4F]">
              Public Transit Network & Dynamic Bus Rerouting
            </h2>
            <p className="text-xs text-slate-500">
              Coordinating city transit lines around emergency corridors to prevent gridlock and passenger delays
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold bg-yellow-50 text-yellow-900 px-3 py-1.5 rounded-lg border border-yellow-200">
          TRANSIT FLEET: {publicBuses.length} ACTIVE LINES
        </span>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN (7 cols): Active Bus Fleet & Roadblock Impact */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-[#142D4F]">
                Metropolitan Transit Fleet Telemetry
              </h3>
              <span className="text-xs font-mono text-slate-500">Live GPS Stream</span>
            </div>

            <div className="space-y-3">
              {publicBuses.map((bus) => (
                <div
                  key={bus.id}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    bus.affectedByRoadblock
                      ? 'border-orange-300 bg-orange-50/30'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2.5 rounded-xl shrink-0 ${
                          bus.affectedByRoadblock
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-yellow-50 text-yellow-700'
                        }`}
                      >
                        <Bus className="w-5 h-5" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-extrabold text-slate-900">{bus.routeNumber}</h4>
                          <span
                            className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                              bus.status === 'diverted'
                                ? 'bg-orange-200 text-orange-900'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {bus.status.toUpperCase()}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 mt-1">
                          Route: <strong>{bus.origin}</strong> → <strong>{bus.destination}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-mono font-bold text-slate-700 flex items-center gap-1 justify-end">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>{bus.passengerCount} Passengers</span>
                      </div>
                      <div className="text-[11px] font-mono text-orange-700 font-bold mt-0.5">
                        {bus.delayMinutes > 0 ? `+${bus.delayMinutes}m delay` : 'On Schedule'}
                      </div>
                    </div>
                  </div>

                  {/* Alternative Route Description */}
                  <div className="mt-3 pt-3 border-t border-slate-100 text-xs">
                    <span className="text-slate-500 block text-[11px] font-bold">
                      Dynamic Transit Guidance:
                    </span>
                    <p
                      className={`text-xs mt-0.5 ${
                        bus.affectedByRoadblock ? 'text-orange-950 font-bold' : 'text-slate-700'
                      }`}
                    >
                      {bus.suggestedAlternativeRoute}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (5 cols): Transit Coordination Protocol */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-[#142D4F] pb-3 border-b border-slate-100">
              Emergency-Transit Conflict Policy
            </h3>

            <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  No Forced Dangerous Swerves
                </span>
                <p className="text-slate-600 text-[11px]">
                  Buses are pre-emptively routed away from the active emergency corridor 3 minutes before the ambulance approaches an intersection, eliminating abrupt braking or illegal maneuvers.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#2878E8]" />
                  Passenger Delay Mitigation
                </span>
                <p className="text-slate-600 text-[11px]">
                  Average diversion delay per bus is held to under 12 minutes while saving over 8 minutes of critical clinical time for Advanced Life Support ambulances.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setActiveTab('live_ops')}
                className="w-full py-2.5 bg-[#142D4F] text-white text-xs font-bold rounded-lg hover:bg-[#1a3861] transition flex items-center justify-center gap-1.5"
              >
                <span>View Buses on Live Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
