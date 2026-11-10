import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  Mic,
  Wifi,
  WifiOff,
  Clock,
  ArrowRight,
  Globe,
  Radio,
  ChevronRight,
  Heart,
  ChevronDown,
  Navigation,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { useRouteResQ } from '../context/RouteResQContext';
import { RouteResQLogo } from './RouteResQLogo';
import { Language } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

export const Navbar: React.FC = () => {
  const {
    language,
    setLanguage,
    t,
    isOnline,
    toggleOfflineSimulation,
    activeTab,
    setActiveTab,
    setIsSosModalOpen,
    setIsVoiceSosModalOpen,
    setIsReportModalOpen,
    offlineQueueCount,
    syncOfflineQueue,
  } = useRouteResQ();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZone: 'Asia/Kolkata',
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const isLanding = activeTab === 'landing';

  const languageLabels: Record<Language, { label: string; flag: string; native: string }> = {
    en: { label: 'English', flag: '🇬🇧', native: 'Global' },
    hi: { label: 'हिन्दी', flag: '🇮🇳', native: 'Hindi' },
    or: { label: 'ଓଡ଼ିଆ', flag: '🇮🇳', native: 'Odia' },
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-[0_2px_12px_rgba(20,45,79,0.06)] px-4 lg:px-8 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Lockup */}
        <div className="flex items-center gap-5 shrink-0">
          <button
            onClick={() => setActiveTab('landing')}
            className="flex items-center text-left hover:opacity-90 transition-opacity cursor-pointer group"
          >
            <RouteResQLogo
              size={38}
              subtitle={isLanding ? t('appCategory') : 'EMERGENCY TRANSIT AI'}
            />
          </button>

          {/* Subtitle location badge in Command Center */}
          {!isLanding && (
            <div className="hidden xl:flex flex-col pl-4 border-l border-slate-200 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-[#142D4F]">
                  {t('cityLabel')}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  {t('liveGridStatus')}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5 font-medium mt-0.5 font-mono">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>Unified Metropolitan Control · {currentTime} IST</span>
              </div>
            </div>
          )}
        </div>

        {/* Center Navigation Links (on Landing Page) */}
        {isLanding ? (
          <nav className="hidden lg:flex items-center gap-6 text-sm font-bold text-slate-700">
            <button
              onClick={() => setActiveTab('landing')}
              className="hover:text-[#2878E8] transition-colors cursor-pointer py-1"
            >
              {t('capabilities')}
            </button>
            <button
              onClick={() => setActiveTab('live_ops')}
              className="hover:text-[#2878E8] transition-colors cursor-pointer py-1 flex items-center gap-1"
            >
              <Navigation className="w-3.5 h-3.5 text-[#2878E8]" />
              <span>{t('liveOperations')}</span>
            </button>
            <button
              onClick={() => setActiveTab('intelligence')}
              className="hover:text-[#2878E8] transition-colors cursor-pointer py-1"
            >
              {t('aiTriage')}
            </button>
            <button
              onClick={() => setActiveTab('remote_guardian')}
              className="hover:text-[#2878E8] transition-colors flex items-center gap-1.5 cursor-pointer py-1"
            >
              <span>{t('remoteGuardian')}</span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                {t('familySos')}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className="hover:text-[#2878E8] transition-colors cursor-pointer py-1"
            >
              {t('analytics')}
            </button>
          </nav>
        ) : (
          /* Center Badges on Command Center */
          <div className="hidden md:flex items-center gap-2.5 text-xs">
            {/* Cloud Sync / Offline simulation indicator */}
            <button
              onClick={toggleOfflineSimulation}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-bold transition cursor-pointer shadow-sm ${
                isOnline
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                  : 'bg-amber-100 border-amber-300 text-amber-900 font-black animate-pulse'
              }`}
              title="Click to toggle offline network simulation"
            >
              {isOnline ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t('onlineMode')}</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-700" />
                  <span>Offline ({offlineQueueCount} queued)</span>
                </>
              )}
            </button>

            {/* 1-Tap SOS in top bar */}
            <button
              onClick={() => setIsSosModalOpen(true)}
              className="flex items-center gap-1.5 bg-[#F00016] hover:bg-[#d60014] text-white px-3.5 py-1.5 rounded-full font-black text-xs shadow-md transition hover:scale-105 active:scale-95 cursor-pointer emergency-beacon-pulse"
            >
              <AlertCircle className="w-3.5 h-3.5 fill-white text-[#F00016]" />
              <span>{t('oneTapSos')}</span>
            </button>

            {/* Voice SOS with dedicated modal */}
            <button
              onClick={() => setIsVoiceSosModalOpen(true)}
              className="flex items-center gap-1.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-800 px-3 py-1.5 rounded-full font-extrabold text-xs shadow-sm transition hover:bg-slate-50 cursor-pointer hover:scale-105"
            >
              <Mic className="w-3.5 h-3.5 text-rose-600" />
              <span>{t('voiceSos')}</span>
            </button>

            {/* Family Remote SOS */}
            <button
              onClick={() => setActiveTab('remote_guardian')}
              className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 px-3 py-1.5 rounded-full font-bold text-xs transition cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
              <span>{t('remoteSos')}</span>
            </button>

            {/* Critical Incident Alert Button */}
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs font-mono transition cursor-pointer"
              title="Upload accident image or report new road incident"
            >
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
              <span>1 Critical / 2 Active</span>
            </button>
          </div>
        )}

        {/* Right Actions: Language Selector, Install PWA, SOS, Command Center */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition cursor-pointer shadow-sm hover:border-blue-300"
            >
              <span className="text-sm">{languageLabels[language].flag}</span>
              <span>{languageLabels[language].label}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 p-1.5 space-y-1">
                {(['en', 'hi', 'or'] as Language[]).map((lang) => {
                  const isSelected = language === lang;
                  return (
                    <button
                      key={lang}
                      onClick={() => {
                        setLanguage(lang);
                        setIsLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-bold rounded-xl transition flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50 text-[#2878E8]'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{languageLabels[lang].flag}</span>
                        <div>
                          <div className="font-extrabold">{languageLabels[lang].label}</div>
                          <div className="text-[10px] text-slate-400">{languageLabels[lang].native}</div>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#2878E8]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <PWAInstallButton className="hidden sm:inline-flex" />

          {/* Primary Action Button */}
          {isLanding ? (
            <>
              {/* Emergency 1-Tap SOS Button */}
              <button
                onClick={() => setIsSosModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 bg-[#F00016] hover:bg-[#d60014] text-white px-4 py-2 rounded-xl text-xs font-black shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer emergency-beacon-pulse"
              >
                <AlertCircle className="w-4 h-4 fill-white text-[#F00016]" />
                <span>{t('oneTapSos')}</span>
              </button>

              {/* Launch Command Center Button */}
              <button
                onClick={() => setActiveTab('overview')}
                className="flex items-center gap-2 bg-[#142D4F] hover:bg-[#1a3861] text-white px-4 py-2 rounded-xl text-xs font-black shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>{t('launchCommandCenter')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            /* Return to Landing Button */
            <button
              onClick={() => setActiveTab('landing')}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition cursor-pointer"
            >
              <span>{t('backToLanding')}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
