import React from 'react';
import {
  LayoutDashboard,
  Navigation,
  BrainCircuit,
  Ambulance as AmbulanceIcon,
  HardDriveDownload,
  ShieldAlert,
  BarChart3,
  Settings as SettingsIcon,
  AlertCircle,
  Radio,
  Bus,
  Sparkles,
  HeartHandshake,
} from 'lucide-react';
import { useRouteResQ } from '../context/RouteResQContext';
import { RouteResQLogo } from './RouteResQLogo';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    t,
    incidents,
    ambulances,
    isRoadblocked,
    offlineQueueCount,
    simulationState,
    setIsSosModalOpen,
  } = useRouteResQ();

  const coreNavItems = [
    {
      id: 'overview',
      label: t('navOverview'),
      icon: LayoutDashboard,
      badge: undefined,
    },
    {
      id: 'live_ops',
      label: t('navLiveOps'),
      icon: Navigation,
      badge: simulationState.isActive ? 'LIVE' : undefined,
      badgeColor: 'bg-emerald-500 text-white animate-pulse',
    },
    {
      id: 'dispatch',
      label: t('navDispatch'),
      icon: AmbulanceIcon,
      badge: '2 Active',
      badgeColor: 'bg-[#2878E8] text-white font-mono',
    },
    {
      id: 'transit',
      label: t('navTransit'),
      icon: Bus,
    },
  ];

  const intelligenceNavItems = [
    {
      id: 'intelligence',
      label: t('navIntelligence'),
      icon: BrainCircuit,
    },
    {
      id: 'recovery',
      label: t('navRecovery'),
      icon: HardDriveDownload,
      badge: offlineQueueCount > 0 ? `${offlineQueueCount}` : undefined,
      badgeColor: 'bg-amber-500 text-white',
    },
  ];

  const citizenNavItems = [
    {
      id: 'remote_guardian',
      label: t('navRemoteGuardian'),
      icon: ShieldAlert,
      badge: t('familySos'),
      badgeColor: 'bg-[#E11D48] text-white',
    },
    {
      id: 'analytics',
      label: t('navAnalytics'),
      icon: BarChart3,
    },
    {
      id: 'settings',
      label: t('navSettings'),
      icon: SettingsIcon,
    },
  ];

  const availableAmbulances = ambulances.filter((a) => a.status === 'available').length;

  return (
    <aside className="w-64 bg-[#142D4F] text-slate-200 flex flex-col shrink-0 select-none border-r border-[#1a3861] shadow-2xl transition-colors">
      {/* Top Brand Logo inside Sidebar */}
      <div className="p-4 border-b border-[#1f426e]">
        <button
          onClick={() => setActiveTab('landing')}
          className="flex items-center text-left hover:opacity-90 transition-opacity cursor-pointer group"
        >
          <RouteResQLogo size={36} subtitle="EMERGENCY TRANSIT AI" />
        </button>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {/* Tier 1: Core Operations */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
            {t('navOverview').toUpperCase()} &amp; OPERATIONS
          </div>
          <nav className="space-y-1">
            {coreNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#2878E8] text-white shadow-md'
                      : 'text-slate-300 hover:bg-[#1a3861] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-700 text-slate-200'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tier 2: Emergency AI & Offline Resilience */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
            EMERGENCY AI &amp; OFFLINE
          </div>
          <nav className="space-y-1">
            {intelligenceNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#2878E8] text-white shadow-md'
                      : 'text-slate-300 hover:bg-[#1a3861] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tier 3: Citizen & Family Care */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
            CITIZEN &amp; FAMILY CARE
          </div>
          <nav className="space-y-1">
            {citizenNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#2878E8] text-white shadow-md'
                      : 'text-slate-300 hover:bg-[#1a3861] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Status Card & Big Red SOS Button */}
      <div className="p-3 bg-[#0d213b] border-t border-[#1f426e] m-3 rounded-2xl text-xs space-y-3">
        <div>
          <div className="flex items-center justify-between text-slate-300 mb-1">
            <span className="font-extrabold flex items-center gap-1.5 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              SECTOR GRID LIVE
            </span>
            <span className="text-[10px] font-mono text-slate-400">CAD-01</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1 text-slate-300 border-t border-slate-800">
            <div>
              <span className="text-slate-400 block">Ambulances</span>
              <strong className="text-white">{availableAmbulances}/{ambulances.length} Ready</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Corridors</span>
              <strong className="text-emerald-400">Priority A*</strong>
            </div>
          </div>
        </div>

        {/* Big Red SOS Button */}
        <button
          onClick={() => setIsSosModalOpen(true)}
          className="w-full py-2.5 px-3 bg-[#F00016] hover:bg-[#d60014] text-white font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition hover:scale-105 active:scale-95 cursor-pointer emergency-beacon-pulse"
        >
          <AlertCircle className="w-4 h-4 fill-white text-[#F00016]" />
          <span>{t('oneTapSos').toUpperCase()}</span>
        </button>

        <div className="text-[10px] text-slate-400 pt-1 flex items-center justify-between font-mono">
          <span>Response Engine</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Optimal
          </span>
        </div>
      </div>
    </aside>
  );
};
