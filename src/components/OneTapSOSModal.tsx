import React, { useState, useEffect } from 'react';
import {
  X,
  AlertCircle,
  MapPin,
  Ambulance,
  Phone,
  CheckCircle2,
  Heart,
  Wind,
  Flame,
  Car,
  WifiOff,
} from 'lucide-react';
import { useRouteResQ } from '../context/RouteResQContext';
import { EmergencyCategory, EmergencyStatus } from '../types';

export const OneTapSOSModal: React.FC = () => {
  const {
    isSosModalOpen,
    setIsSosModalOpen,
    t,
    triggerSOS,
    isOnline,
    setActiveTab,
  } = useRouteResQ();

  const [selectedCategory, setSelectedCategory] = useState<EmergencyCategory>('accident');
  const [coords, setCoords] = useState<[number, number]>([21.4720, 83.9720]);
  const [locationName, setLocationName] = useState<string>('Near Central Avenue / Civic Expressway Link');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedIncidentId, setSubmittedIncidentId] = useState<string | null>(null);

  // Auto-detect GPS
  useEffect(() => {
    if (isSosModalOpen) {
      if (typeof window !== 'undefined' && 'geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setCoords([pos.coords.latitude, pos.coords.longitude]);
          },
          () => {},
          { timeout: 4000 }
        );
      }
    }
  }, [isSosModalOpen]);

  if (!isSosModalOpen) return null;

  // The 4 authentic picture categories matching image_b32d492f.png
  const categories = [
    {
      id: 'accident' as EmergencyCategory,
      title: 'Road Accident',
      subHindiOdia: 'गाड़ी दुर्घटना / ଗାଡ଼ି ଦୁର୍ଘଟଣା',
      image: '/src/assets/images/accident_road_incident_1794234760608.jpg',
      icon: Car,
      iconBg: 'bg-[#F00016]',
    },
    {
      id: 'cardiac' as EmergencyCategory,
      title: 'Chest Pain / Heart',
      subHindiOdia: 'दिल का दौरा / ଛାତି ଯନ୍ତ୍ରଣା',
      image: '/src/assets/images/cardiac_medical_xray_1794236386597.jpg',
      icon: Heart,
      iconBg: 'bg-[#E11D48]',
    },
    {
      id: 'respiratory' as EmergencyCategory,
      title: 'Cannot Breathe',
      subHindiOdia: 'सांस लेने में दिक्कत / ନିଶ୍ୱାସ କଷ୍ଟ',
      image: '/src/assets/images/respiratory_breathing_aid_1794236385283.jpg',
      icon: Wind,
      iconBg: 'bg-[#EA580C]',
    },
    {
      id: 'trauma' as EmergencyCategory,
      title: 'Severe Trauma / Fire',
      subHindiOdia: 'गंभीर चोट / ଗୁରୁତର ଆଘାତ',
      image: '/src/assets/images/trauma_er_hospital_1794236387800.jpg',
      icon: Flame,
      iconBg: 'bg-[#7C3AED]',
    },
  ];

  const handleDispatchNow = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const id = await triggerSOS(
        selectedCategory,
        locationName,
        coords,
        `1-Touch Emergency Dispatch Trigger: ${selectedCategory.toUpperCase()}`
      );
      setSubmittedIncidentId(id);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubmittedIncidentId(null);
    setIsSosModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-6 transition-all">
        {/* Header Bar matching image_b32d492f.png */}
        <div className="bg-[#EF4444] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-wide uppercase">
                ONE-TOUCH EMERGENCY SOS
              </h2>
              <p className="text-xs text-rose-100 font-medium">
                Instant Emergency Assistance for Everyone
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/20 transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {!submittedIncidentId ? (
            <>
              {/* Category Selection Header */}
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="text-sm font-black text-slate-900">
                  1. Tap your emergency type:
                </span>
                <span className="text-slate-400 font-medium">Choose one</span>
              </div>

              {/* 4 Picture Cards Grid matching image_b32d492f.png */}
              <div className="grid grid-cols-2 gap-3.5">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.id;

                  return (
                    <div
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all group ${
                        isSelected
                          ? 'border-[#EF4444] ring-4 ring-rose-200 shadow-lg scale-[1.02]'
                          : 'border-slate-200 hover:border-slate-300 opacity-90 hover:opacity-100'
                      }`}
                    >
                      {/* Photo Background */}
                      <div className="h-28 w-full bg-slate-900 overflow-hidden">
                        <img
                          src={cat.image}
                          alt={cat.title}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      {/* Scrim overlay with texts */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 flex flex-col justify-end text-white">
                        {/* Circle Icon top right */}
                        <div className={`absolute top-2.5 right-2.5 p-1.5 rounded-full ${cat.iconBg} text-white shadow-md`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>

                        <h4 className="text-xs font-black leading-tight text-white drop-shadow">
                          {cat.title}
                        </h4>
                        <p className="text-[10px] text-slate-300 font-medium mt-0.5 drop-shadow leading-tight">
                          {cat.subHindiOdia}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Auto-detected GPS location box matching image_b32d492f.png */}
              <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl p-4 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#2878E8] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-black text-[#1E40AF] tracking-wider block">
                    AUTO-DETECTED GPS LOCATION
                  </span>
                  <p className="text-xs font-extrabold text-slate-800 mt-0.5">
                    {locationName}
                  </p>
                </div>
              </div>

              {/* Big Red/Coral Button matching image_b32d492f.png */}
              <button
                onClick={handleDispatchNow}
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-[#F87171] to-[#EF4444] hover:from-[#EF4444] hover:to-[#DC2626] text-white rounded-2xl font-black text-sm shadow-xl hover:shadow-2xl transition-all flex flex-col items-center justify-center gap-1 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="flex items-center gap-2">
                  <Ambulance className="w-5 h-5" />
                  <span className="text-base tracking-wide">DISPATCH AMBULANCE NOW</span>
                </div>
                <span className="text-[11px] font-bold text-rose-100">
                  तुरंत एम्बुलेंस भेजें · ଆମ୍ବୁଲାନ୍ସ ପଠାନ୍ତୁ
                </span>
              </button>

              {/* Footer text link */}
              <div className="text-center pt-1">
                <span className="text-xs text-slate-500 font-medium inline-flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#2878E8]" />
                  Connected directly to Emergency Dispatch Hub
                </span>
              </div>
            </>
          ) : (
            /* Post-Dispatch State */
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900">
                  Ambulance Dispatched!
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-1">
                  Incident ID: {submittedIncidentId}
                </p>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-left space-y-2 text-xs">
                <div className="flex justify-between font-bold text-slate-700">
                  <span>Assigned Unit:</span>
                  <span className="text-[#2878E8] font-black">Trauma ResQ-2 (AMB-02)</span>
                </div>
                <div className="flex justify-between font-bold text-slate-700">
                  <span>Priority Corridor:</span>
                  <span className="text-emerald-700 font-black">Signals Overridden (Green Wave)</span>
                </div>
                <div className="flex justify-between font-bold text-slate-700">
                  <span>Estimated Arrival:</span>
                  <span className="text-rose-600 font-black">6.4 mins (-4.2m saved)</span>
                </div>
              </div>

              <button
                onClick={() => {
                  handleClose();
                  setActiveTab('live_ops');
                }}
                className="w-full py-3.5 bg-[#142D4F] hover:bg-[#1f426e] text-white rounded-xl font-extrabold text-xs shadow-md transition"
              >
                Track Live Moving Ambulance on Map →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
