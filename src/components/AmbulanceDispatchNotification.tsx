import React, { useEffect } from 'react';
import {
  Bell,
  Ambulance,
  MapPin,
  Clock,
  Phone,
  Radio,
  CheckCircle2,
  X,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { useRouteResQ } from '../context/RouteResQContext';

export const AmbulanceDispatchNotification: React.FC = () => {
  const {
    activeAmbulanceNotification,
    dismissAmbulanceNotification,
    setActiveTab,
    setSelectedAmbulanceId,
    t,
  } = useRouteResQ();

  // Auto-dismiss after 20 seconds if user doesn't interact
  useEffect(() => {
    if (!activeAmbulanceNotification) return;
    const timer = setTimeout(() => {
      dismissAmbulanceNotification();
    }, 20000);
    return () => clearTimeout(timer);
  }, [activeAmbulanceNotification, dismissAmbulanceNotification]);

  if (!activeAmbulanceNotification) return null;

  const handleTrackLive = () => {
    setSelectedAmbulanceId(activeAmbulanceNotification.ambulanceId);
    setActiveTab('live_ops');
    dismissAmbulanceNotification();
  };

  return (
    <div className="fixed top-20 right-4 sm:right-8 z-[9990] max-w-md w-full animate-in slide-in-from-top-4 duration-300">
      <div className="bg-[#142D4F] border-2 border-emerald-500/80 rounded-2xl shadow-2xl overflow-hidden text-white p-4">
        {/* Top Header Badge */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#284873]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-emerald-400" />
              {t('ambulanceAlertTitle')}
            </span>
          </div>

          <button
            onClick={dismissAmbulanceNotification}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
            title="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex gap-3 items-start">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shrink-0 shadow-lg">
            <Ambulance className="w-6 h-6 animate-pulse" />
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-sm font-black text-white truncate">
                {activeAmbulanceNotification.ambulanceCallSign}
              </h4>
              <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40 shrink-0">
                MDT ACKNOWLEDGED
              </span>
            </div>

            <p className="text-xs text-slate-300 font-medium truncate flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>{activeAmbulanceNotification.locationName}</span>
            </p>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300 pt-1">
              <div className="flex items-center gap-1 text-slate-400">
                <Phone className="w-3 h-3 text-emerald-400" />
                <span className="text-white font-semibold">{activeAmbulanceNotification.driverName}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400 justify-end">
                <Clock className="w-3 h-3 text-amber-400" />
                <span className="text-amber-300 font-bold">ETA: ~{activeAmbulanceNotification.etaMinutes} min</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-3 pt-2.5 border-t border-[#284873] flex items-center justify-between gap-3">
          <span className="text-[10px] text-slate-400 font-medium">
            Signal Green Wave priority active
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTrackLive}
              className="px-3 py-1.5 bg-[#2878E8] hover:bg-[#1a65cc] text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer hover:scale-105"
            >
              <span>{t('trackAmbulanceBtn')}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
