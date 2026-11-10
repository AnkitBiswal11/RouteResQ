import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Zap,
  ArrowRight,
  ShieldCheck,
  Radio,
  CheckCircle2,
  AlertTriangle,
  WifiOff,
  Wifi,
} from 'lucide-react';
import { useRouteResQ } from '../context/RouteResQContext';

export const SimulationBar: React.FC = () => {
  const {
    t,
    simulationState,
    startSimulation,
    pauseSimulation,
    resumeSimulation,
    resetSimulation,
    stepSimulation,
    simulateRoadblock,
    simulateSecondAmbulanceConflict,
    toggleOfflineSimulation,
    isOnline,
    greenCorridor,
    approveGreenCorridor,
  } = useRouteResQ();

  const steps = [
    'Emergency Reported',
    'Ambulance Dispatched',
    'NH53 Roadblock Occurs',
    'Dynamic Route & Corridor',
    'Burla Conflict Arbitrated',
    'Approaching VIMSAR',
    'Patient Delivered',
  ];

  return (
    <div className="bg-white border-b border-slate-200/90 px-4 py-2.5 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Scenario Title and Stepper */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#142D4F]">
              Live Emergency Scenario:
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            <span>Metropolitan Incident Lifecycle</span>
            <span className="text-slate-300">·</span>
            <span className="font-bold text-[#2878E8]">
              Step {simulationState.currentStep} of {simulationState.totalSteps}:{' '}
              {steps[Math.max(0, simulationState.currentStep - 1)] || 'Ready'}
            </span>
          </div>
        </div>

        {/* Center: Live Progress Bar */}
        <div className="flex-1 max-w-xs hidden xl:block mx-2">
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
            <div
              className="bg-[#2878E8] h-full transition-all duration-500 ease-out"
              style={{
                width: `${(simulationState.currentStep / simulationState.totalSteps) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Right: Interactive Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* 1-Click Start / Pause / Resume */}
          {!simulationState.isActive && simulationState.currentStep === 0 ? (
            <button
              onClick={startSimulation}
              className="flex items-center gap-1.5 bg-[#13A878] hover:bg-[#0f8c63] text-white text-xs font-extrabold px-3.5 py-1.5 rounded-md shadow-sm transition whitespace-nowrap cursor-pointer"
              title="Run complete automated demo"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{t('startScenario')}</span>
            </button>
          ) : simulationState.isPaused ? (
            <button
              onClick={resumeSimulation}
              className="flex items-center gap-1.5 bg-[#2878E8] hover:bg-[#1f66cb] text-white text-xs font-bold px-3 py-1.5 rounded-md shadow-sm transition whitespace-nowrap"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{t('resumeSimulation')}</span>
            </button>
          ) : (
            <button
              onClick={pauseSimulation}
              className="flex items-center gap-1.5 bg-slate-700 hover:bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-md shadow-sm transition whitespace-nowrap"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>{t('pauseSimulation')}</span>
            </button>
          )}

          {/* Next Step Manual Advance */}
          <button
            onClick={stepSimulation}
            disabled={simulationState.currentStep >= simulationState.totalSteps}
            className="flex items-center gap-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded-md border border-slate-300 transition disabled:opacity-40"
          >
            <span>{t('advanceTick')}</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          {/* Trigger Roadblock Button */}
          <button
            onClick={simulateRoadblock}
            className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-md border transition whitespace-nowrap ${
              simulationState.isRoadblocked
                ? 'bg-red-50 text-red-700 border-red-300'
                : 'bg-white hover:bg-red-50 text-red-600 border-slate-300 hover:border-red-300'
            }`}
            title="Block NH53 Mahanadi Bridge to demonstrate instant dynamic rerouting"
          >
            <Zap className="w-3 h-3 text-red-600" />
            <span>{t('simulateRoadblock')}</span>
          </button>

          {/* Corridor Approval Quick Action (if requested) */}
          {greenCorridor && greenCorridor.status === 'requested' && (
            <button
              onClick={approveGreenCorridor}
              className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition whitespace-nowrap animate-bounce"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Approve Corridor</span>
            </button>
          )}

          {/* 2nd Ambulance Conflict Button */}
          <button
            onClick={simulateSecondAmbulanceConflict}
            className="hidden sm:flex items-center gap-1 text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 px-2.5 py-1.5 rounded-md border border-slate-300 transition whitespace-nowrap"
            title="Trigger multi-ambulance intersection conflict resolution"
          >
            <span>{t('simulateConflict')}</span>
          </button>

          {/* Offline Test Toggle */}
          <button
            onClick={toggleOfflineSimulation}
            className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-md border transition whitespace-nowrap ${
              !isOnline
                ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
            }`}
            title="Simulate network failure to test local IndexedDB SOS queue"
          >
            {!isOnline ? <WifiOff className="w-3 h-3 text-amber-700" /> : <Wifi className="w-3 h-3 text-slate-500" />}
            <span>{!isOnline ? 'Restore Online' : 'Cut Network'}</span>
          </button>

          {/* Reset Scenario */}
          <button
            onClick={resetSimulation}
            className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-2 py-1.5 rounded-md transition"
            title="Reset scenario to baseline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('resetSimulation')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
