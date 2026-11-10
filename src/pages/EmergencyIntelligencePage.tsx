import React, { useState } from 'react';
import {
  BrainCircuit,
  Eye,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  ShieldAlert,
  Camera,
  Upload,
  Zap,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useRouteResQ } from '../context/RouteResQContext';

export const EmergencyIntelligencePage: React.FC = () => {
  const {
    t,
    isRoadblocked,
    simulateRoadblock,
    routes,
    setActiveTab,
    setIsReportModalOpen,
  } = useRouteResQ();

  const [analyzingImage, setAnalyzingImage] = useState(false);
  const [detectionResult, setDetectionResult] = useState<{
    type: string;
    location: string;
    severity: string;
    confidence: number;
    detectedObstacles: string[];
    suggestedAction: string;
  } | null>({
    type: 'Multi-Vehicle Collision with Barrier Displacement',
    location: 'Central Expressway Span (West Approach), Metropolitan Grid',
    severity: 'High (Lane Blockage)',
    confidence: 96.8,
    detectedObstacles: ['3 Lanes Obstructed', 'Emergency Cones Deployed', 'Traffic Gridlock Risk'],
    suggestedAction: 'Reroute all incoming ambulances via Riverfront Ring Road Corridor immediately.',
  });

  const handleSimulateAnalysis = () => {
    setAnalyzingImage(true);
    setTimeout(() => {
      setAnalyzingImage(false);
      setDetectionResult({
        type: 'Multi-Vehicle Collision with Barrier Displacement',
        location: 'Central Expressway Span (West Approach), Metropolitan Grid',
        severity: 'High (Lane Blockage)',
        confidence: 97.4,
        detectedObstacles: ['3 Lanes Obstructed', 'Emergency Cones Deployed', 'Traffic Gridlock Risk'],
        suggestedAction: 'Reroute all incoming ambulances via Riverfront Ring Road Corridor immediately.',
      });
    }, 1200);
  };

  const riskZones = [
    {
      sector: 'NH53 Mahanadi Bridge West',
      riskScore: isRoadblocked ? 98 : 34,
      status: isRoadblocked ? 'CRITICAL DISRUPTION' : 'NORMAL FLOW',
      volatility: 'High',
      confidence: 96,
    },
    {
      sector: 'Modipara Chowk Junction',
      riskScore: 62,
      status: 'MODERATE PEAK CONGESTION',
      volatility: 'Medium',
      confidence: 89,
    },
    {
      sector: 'Burla Town Square (VSSUT Junction)',
      riskScore: isRoadblocked ? 78 : 28,
      status: isRoadblocked ? 'ELEVATED TRAFFIC' : 'CLEAR',
      volatility: 'Low',
      confidence: 92,
    },
    {
      sector: 'Mahanadi Riverfront Ring Road',
      riskScore: 18,
      status: 'OPTIMAL GREEN CORRIDOR',
      volatility: 'Low',
      confidence: 94,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-blue-50 text-[#2878E8]">
            <BrainCircuit className="w-5 h-5 text-[#2878E8]" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-[#142D4F]">
              AI-Powered Emergency & Traffic Intelligence
            </h2>
            <p className="text-xs text-slate-500">
              Multimodal accident detection, predictive traffic forecasting, and road reliability modeling
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold bg-blue-50 text-blue-800 px-2.5 py-1 rounded-md border border-blue-200">
            MODEL: GEMINI VISION 2.5
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN (7 cols): AI Accident Detection & Vision Analysis */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#2878E8]" />
                <h3 className="text-sm font-extrabold text-[#142D4F]">
                  Traffic Camera / Citizen Incident Vision Feed
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(true)}
                  className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-red-600" />
                  <span>Upload Accident Image</span>
                </button>
                <button
                  type="button"
                  onClick={handleSimulateAnalysis}
                  disabled={analyzingImage}
                  className="text-xs font-bold text-[#2878E8] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#2878E8]" />
                  <span>{analyzingImage ? 'Analyzing...' : 'Run Vision Inference'}</span>
                </button>
              </div>
            </div>

            {/* Incident Image Viewport */}
            <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-inner max-h-72 bg-slate-900">
              <img
                src="/src/assets/images/accident_road_incident_1794234760608.jpg"
                alt="Traffic camera road accident scene"
                className="w-full h-full object-cover object-center"
              />

              <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span>CAM-04: NH53 MAHANADI WEST SPAN</span>
              </div>

              {detectionResult && (
                <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-sm text-slate-800 p-3 rounded-lg border border-slate-200 text-xs shadow-md">
                  <div className="flex items-center justify-between font-bold text-red-700 mb-1">
                    <span>{detectionResult.type}</span>
                    <span className="font-mono">{detectionResult.confidence}% Confidence</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Location: <strong>{detectionResult.location}</strong>
                  </p>
                </div>
              )}
            </div>

            {/* Inference Actions */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Verification Status:</span>
                <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  VERIFIED BY DISPATCH CONTROLLER
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {detectionResult?.suggestedAction}
              </p>

              {!isRoadblocked ? (
                <button
                  onClick={simulateRoadblock}
                  className="w-full py-2.5 bg-[#F00016] hover:bg-[#d60014] text-white font-extrabold text-xs rounded-lg shadow-sm transition"
                >
                  Confirm Obstruction & Trigger Dynamic Reroute
                </button>
              ) : (
                <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
                  <span>Dynamic Alternative Active via Mahanadi Ring Road</span>
                  <button
                    onClick={() => setActiveTab('live_ops')}
                    className="underline text-emerald-900"
                  >
                    View on Map
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (5 cols): Predictive Congestion Risk Zones */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-[#142D4F]">
                Predictive Traffic Risk Sectors
              </h3>
              <span className="text-xs font-mono text-slate-500">Metropolitan Grid</span>
            </div>

            <div className="space-y-3">
              {riskZones.map((zone, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>{zone.sector}</span>
                    <span
                      className={`font-mono ${
                        zone.riskScore > 75
                          ? 'text-red-600'
                          : zone.riskScore > 40
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                      }`}
                    >
                      Risk: {zone.riskScore}/100
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full ${
                        zone.riskScore > 75
                          ? 'bg-red-500'
                          : zone.riskScore > 40
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${zone.riskScore}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mt-2">
                    <span>{zone.status}</span>
                    <span>Confidence: {zone.confidence}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Disclaimers & Safety Protocol */}
          <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-slate-700 space-y-1.5">
            <h4 className="font-extrabold text-[#142D4F] flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-[#2878E8]" />
              Human-in-the-Loop Safeguard
            </h4>
            <p className="text-[11px] leading-relaxed text-slate-600">
              RouteResQ strictly uses AI predictions to recommend routes and notify dispatchers. No road closure or traffic signal change is imposed without dispatcher oversight or authorized traffic authority confirmation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
