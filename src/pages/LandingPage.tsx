import React from 'react';
import {
  ArrowRight,
  AlertCircle,
  Mic,
  MapPin,
  CheckCircle2,
  Sparkles,
  Zap,
  Radio,
  Building2,
  HardDriveDownload,
  ShieldCheck,
  BrainCircuit,
  Heart,
  ChevronRight,
  Ambulance,
  PhoneCall,
  Share2,
} from 'lucide-react';
import { useRouteResQ } from '../context/RouteResQContext';
import IMAGES from '../assets/imageAssets';

export const LandingPage: React.FC = () => {
  const {
    t,
    setActiveTab,
    setIsSosModalOpen,
    setIsVoiceSosModalOpen,
    offlineQueueCount,
  } = useRouteResQ();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#142D4F]">
      {/* 1. Top Emergency Coral/Pink Banner matching image_89056152.png */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5">
        <div className="bg-[#FFF1F2] border border-[#FECDD3] rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:border-[#FDA4AF] transition-colors">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#F00016] text-white flex items-center justify-center shrink-0 shadow-md">
              <AlertCircle className="w-5 h-5 fill-white text-[#F00016]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black uppercase tracking-wider text-[#9F1239]">
                  ONE-TOUCH EMERGENCY SOS
                </span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#E11D48] text-white tracking-wide">
                  1-TAP AUTO DISPATCH
                </span>
              </div>
              <p className="text-xs font-medium text-slate-700 mt-0.5">
                Having difficulty using this device or in shock? Tap here for instant 1-touch ambulance dispatch with live GPS.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSosModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-black px-5 py-3 rounded-xl shadow-md transition hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
          >
            <AlertCircle className="w-4 h-4 fill-white text-[#E11D48]" />
            <span>Emergency 1-Tap SOS</span>
          </button>
        </div>
      </div>

      {/* 2. Hero Section matching image_89056152.png */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Blue pill chip */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#EFF6FF] text-[#2878E8] border border-[#BFDBFE] rounded-full text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-[#2878E8]" />
              <span>AI-POWERED DYNAMIC TRANSIT & EMERGENCY RE-ROUTING</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#142D4F] tracking-tight leading-[1.08]">
              Every Second Counts.
              <br />
              Every Route Matters.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl font-medium">
              Next-generation emergency mobility intelligence system providing dynamic graph routing, automated roadblock detours, and multi-factor ambulance dispatch.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => setActiveTab('overview')}
                className="flex items-center gap-2 bg-[#2878E8] hover:bg-[#1a65cc] text-white px-6 py-3.5 rounded-xl font-extrabold text-sm shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Launch Command Center</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsVoiceSosModalOpen(true)}
                className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 hover:border-slate-300 px-5 py-3.5 rounded-xl font-extrabold text-sm transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
              >
                <Mic className="w-4 h-4 text-red-600 animate-pulse" />
                <span>{t('voiceSos')}</span>
              </button>
            </div>

            {/* 3 Metric Cards matching image_89056152.png */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm hover:border-blue-300 transition-colors">
                <div className="text-lg font-black text-[#142D4F]">A* & Dijkstra</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Dynamic Edge Weights</div>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm hover:border-emerald-300 transition-colors">
                <div className="text-lg font-black text-emerald-700">&lt; 8.5 min</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Average Urban ETA</div>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm hover:border-blue-300 transition-colors">
                <div className="text-lg font-black text-[#2878E8]">3 Languages</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">English, Hindi, Odia</div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Card matching image_89056152.png */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 group">
              {/* Photo */}
              <img
                src="/src/assets/images/hero_emergency_ambulance_1794234760581.jpg"
                alt="RouteResQ Advanced Life Support Priority Ambulance"
                className="w-full h-96 object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />

              {/* Top pill badge matching screenshot */}
              <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-mono font-bold px-3 py-1 rounded-full border border-white/20">
                Active Priority Vehicle · ALS Alpha-1
              </div>

              {/* Bottom Telemetry Card matching screenshot */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-extrabold text-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Priority Green Corridor Active</span>
                  </div>
                  <span className="text-xs font-mono font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    ETA: 8.5 MIN (-3.8 MIN SAVED)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      ORIGIN STATION
                    </span>
                    <span className="font-bold text-slate-800">Budharaja Sector Depot</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      TRAUMA DESTINATION
                    </span>
                    <span className="font-bold text-[#2878E8]">VIMSAR Trauma Center</span>
                  </div>
                </div>

                {/* Roadblock notice card */}
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-[11px] font-medium">
                  <span className="text-amber-900 font-semibold flex items-center gap-1">
                    ⚠️ Railway Gate Jam on Main Stn Road
                  </span>
                  <span className="font-extrabold text-emerald-700">Rerouted via Ring Road</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Remote Guardian Banner matching user reference image_645dc8c6.png */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white rounded-3xl border border-rose-200/80 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Column: Visual Photo Panel with Badges and Quote (5 cols) */}
          <div className="lg:col-span-5 relative min-h-[380px] lg:min-h-[460px] bg-slate-900 flex flex-col justify-between p-6 overflow-hidden">
            {/* Background Photo */}
            <img
              src={IMAGES.elderlyCarePortrait}
              alt="Elderly care and paramedic support"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            {/* Gradient Scrim for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/40 to-black/30" />

            {/* Top Badge */}
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 bg-[#E11D48] text-white text-[11px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-md">
                <Heart className="w-3.5 h-3.5 fill-white text-white" />
                REMOTE GUARDIAN NETWORK
              </span>
            </div>

            {/* Bottom Quote & Dispatch Badge */}
            <div className="relative z-10 space-y-3 mt-auto">
              <div className="inline-flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-[#13A878] animate-pulse" />
                <span>Direct Metropolitan Emergency Dispatch</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white leading-tight drop-shadow">
                &ldquo;Distance won&apos;t delay care for your parents back home.&rdquo;
              </h3>

              <p className="text-xs text-slate-200 leading-relaxed font-medium drop-shadow">
                Over 40% of emergency calls come from children working outside the city. We coordinate ALS dispatch, neighbor keys, and hospital admissions on your behalf.
              </p>
            </div>
          </div>

          {/* Right Column: Information, Features & Actions (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full">
                <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
                LIVING AWAY FROM HOME?
              </span>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#142D4F] tracking-tight leading-tight">
                Remote Emergency Care for Your Elderly Parents &amp; Relatives
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Working in another city, metropolitan tech hub, or abroad? If your parents or family back home fall ill or suffer an accident, you can immediately dispatch a fully equipped ALS ambulance to their exact doorstep with one tap.
              </p>
            </div>

            {/* 3 Feature Cards matching screenshot */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* Card 1 */}
              <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-2 hover:border-rose-200 hover:bg-rose-50/30 transition">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <Ambulance className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-black text-slate-900 leading-snug">
                  Doorstep ALS Dispatch
                </h4>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Oxygen, ventilator &amp; paramedic assigned within 45s.
                </p>
              </div>

              {/* Card 2 */}
              <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-2 hover:border-emerald-200 hover:bg-emerald-50/30 transition">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-black text-slate-900 leading-snug">
                  Direct Paramedic Patch
                </h4>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Direct phone call with onboard crew to explain medical history.
                </p>
              </div>

              {/* Card 3 */}
              <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-2 hover:border-blue-200 hover:bg-blue-50/30 transition">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#2878E8] flex items-center justify-center">
                  <Share2 className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-black text-slate-900 leading-snug">
                  Family WhatsApp Link
                </h4>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Real-time live map tracking shared with all family members.
                </p>
              </div>
            </div>

            {/* Action Buttons matching screenshot */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setActiveTab('remote_guardian')}
                className="flex items-center gap-2 bg-[#E11D48] hover:bg-[#BE123C] text-white px-5 sm:px-6 py-3.5 rounded-xl font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-white text-white" />
                <span>Dispatch Ambulance for Relative</span>
              </button>

              <button
                onClick={() => setActiveTab('remote_guardian')}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-5 sm:px-6 py-3.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all hover:bg-slate-200/80 cursor-pointer group"
              >
                <span>Open Remote Guardian Console</span>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Global Capabilities Grid */}
      <section className="bg-white border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-extrabold text-[#2878E8] uppercase tracking-wider">
              ENTERPRISE PLATFORM
            </span>
            <h2 className="text-3xl font-black text-[#142D4F] mt-1.5">
              Intelligent Emergency Transit Infrastructure
            </h2>
            <p className="text-sm text-slate-500 mt-2 font-medium">
              Deployed across municipal command centers, traffic authorities, and hospital trauma divisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 hover:border-[#2878E8] hover:shadow-md transition group">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#2878E8] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-[#142D4F]">
                Live Dynamic Operations Map
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mt-2">
                Full-vector Leaflet map with real-time moving ambulance telemetry, traffic signal pre-emption overlays, and automatic detour calculation.
              </p>
              <button
                onClick={() => setActiveTab('live_ops')}
                className="mt-4 text-xs font-extrabold text-[#2878E8] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Open Operations Map</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Card 2 */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 hover:border-red-400 hover:shadow-md transition group">
              <div className="w-12 h-12 rounded-xl bg-red-100 text-[#F00016] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-[#142D4F]">
                1-Touch Emergency SOS
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mt-2">
                High-contrast triage categories with visual imagery, automatic GPS acquisition, multilingual voice recognition, and direct cellular 112 backup.
              </p>
              <button
                onClick={() => setIsSosModalOpen(true)}
                className="mt-4 text-xs font-extrabold text-[#F00016] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Test Emergency SOS</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Card 3 */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 hover:border-emerald-400 hover:shadow-md transition group">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <HardDriveDownload className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-[#142D4F]">
                Offline-First IndexedDB Engine
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mt-2">
                PWA caching and local browser database queueing ensure zero data loss during network blackouts, with automatic cloud sync upon reconnection.
              </p>
              <button
                onClick={() => setActiveTab('recovery')}
                className="mt-4 text-xs font-extrabold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Inspect Offline Store ({offlineQueueCount})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Bottom Right SOS Button matching image_89056152.png */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsSosModalOpen(true)}
          className="flex items-center gap-2 bg-[#E11D48] hover:bg-[#BE123C] text-white px-6 py-3.5 rounded-full font-black text-sm shadow-2xl emergency-beacon-pulse cursor-pointer border-2 border-white hover:scale-105 active:scale-95 transition-all"
        >
          <AlertCircle className="w-5 h-5 fill-white text-[#E11D48]" />
          <span>1-TAP EMERGENCY SOS</span>
        </button>
      </div>
    </div>
  );
};
