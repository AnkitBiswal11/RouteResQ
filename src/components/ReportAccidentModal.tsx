import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Camera,
  AlertTriangle,
  CheckCircle2,
  BrainCircuit,
  MapPin,
  Sparkles,
  Zap,
  ShieldCheck,
  Send,
  Image as ImageIcon,
} from 'lucide-react';
import { useRouteResQ } from '../context/RouteResQContext';
import { EmergencyCategory } from '../types';
import IMAGES from '../assets/imageAssets';

export const ReportAccidentModal: React.FC = () => {
  const {
    isReportModalOpen,
    setIsReportModalOpen,
    reportAccidentWithImage,
    setActiveTab,
  } = useRouteResQ();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedImage, setSelectedImage] = useState<string>(IMAGES.accidentRoadIncident);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(true);

  // Form fields
  const [incidentTitle, setIncidentTitle] = useState('Multi-Vehicle Collision with Barrier Displacement');
  const [locationName, setLocationName] = useState('Expressway Span (West Approach), Metropolitan Grid');
  const [category, setCategory] = useState<EmergencyCategory>('accident');
  const [triggerRoadblock, setTriggerRoadblock] = useState(true);
  const [notes, setNotes] = useState('Two private vehicles collided with road divider. Oil leak and 2 lanes blocked.');

  // AI Vision findings
  const [visionFindings, setVisionFindings] = useState({
    severity: 'CRITICAL (Priority 1)',
    confidence: 97.4,
    detectedHazards: ['2 Blocked Traffic Lanes', 'Debris & Fluid Hazard', 'Secondary Crash Risk'],
    recommendation: 'Immediate ALS ambulance dispatch & dynamic Riverfront Ring Road corridor detour.',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!isReportModalOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const resultStr = event.target.result as string;
          setSelectedImage(resultStr);
          runVisionScan(resultStr, file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const runVisionScan = (imgSrc: string, label = 'Custom Upload') => {
    setIsScanning(true);
    setScanComplete(false);

    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
      if (imgSrc.includes('cardiac')) {
        setIncidentTitle('Severe Medical Emergency — Cardiac Triage');
        setCategory('cardiac');
        setTriggerRoadblock(false);
        setVisionFindings({
          severity: 'CRITICAL (Code Red)',
          confidence: 98.9,
          detectedHazards: ['Patient in Acute Distress', 'Defibrillator Required'],
          recommendation: 'Immediate ALS Ambulance with Mobile ICU & direct Trauma Bay bed reserve.',
        });
      } else {
        setIncidentTitle('Multi-Vehicle Collision with Road Barrier Breach');
        setCategory('accident');
        setTriggerRoadblock(true);
        setVisionFindings({
          severity: 'HIGH / CRITICAL',
          confidence: 97.8,
          detectedHazards: ['Lane Obstruction', 'Impact Damage', 'High Gridlock Potential'],
          recommendation: 'Reroute incoming traffic via Riverfront Boulevard. Engage Green Corridor.',
        });
      }
    }, 1100);
  };

  const handleSelectPreset = (presetImg: string, title: string, cat: EmergencyCategory, blockRoad: boolean) => {
    setSelectedImage(presetImg);
    setIncidentTitle(title);
    setCategory(cat);
    setTriggerRoadblock(blockRoad);
    runVisionScan(presetImg, title);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await reportAccidentWithImage({
        title: incidentTitle,
        location: locationName,
        category,
        imageUrl: selectedImage,
        severity: visionFindings.severity,
        notes: `${notes} [AI Vision Verified: ${visionFindings.confidence}% confidence. Hazards: ${visionFindings.detectedHazards.join(', ')}]`,
        triggerRoadblock,
      });

      setSubmitting(false);
      setSubmittedSuccess(true);

      setTimeout(() => {
        setSubmittedSuccess(false);
        setIsReportModalOpen(false);
        setActiveTab('live_ops');
      }, 1500);
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 animate-scale-up">
        {/* Header */}
        <div className="bg-[#142D4F] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-red-600/20 border border-red-500/40 text-red-400">
              <Camera className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-base font-extrabold flex items-center gap-2">
                Report Road Incident & Upload Evidence
                <span className="text-[10px] font-mono font-bold bg-[#13A878] text-white px-2 py-0.5 rounded-full">
                  AI VISION CAD
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                Upload or capture accident scene photo for automated obstacle detection & emergency rerouting
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsReportModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {submittedSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-lg font-black text-slate-900">Incident Successfully Broadcast to Grid!</h4>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Command Center received the image evidence. Emergency Priority Route & Green Corridor have been activated. Opening Live Operations Map...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
            {/* Top row: Image Dropzone & Preview + Presets */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Left Photo Box (7 cols) */}
              <div className="md:col-span-7 space-y-2">
                <label className="font-extrabold text-slate-800 flex items-center justify-between">
                  <span>Accident Photo / Evidence:</span>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[#2878E8] hover:underline flex items-center gap-1 font-bold cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Browse Photo
                  </button>
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {/* Image Container with scanning effect */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative h-48 w-full rounded-xl overflow-hidden border-2 border-dashed border-slate-300 hover:border-[#2878E8] transition group cursor-pointer bg-slate-900 flex items-center justify-center"
                >
                  <img
                    src={selectedImage}
                    alt="Accident scene"
                    className="w-full h-full object-cover group-hover:scale-102 transition duration-300"
                  />

                  {/* Laser Scan Animation Overlay */}
                  {isScanning && (
                    <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none flex flex-col justify-start">
                      <div className="w-full h-1 bg-emerald-400 shadow-[0_0_15px_#10B981] animate-pulse" />
                      <div className="absolute top-2 left-2 bg-black/70 text-emerald-400 px-2 py-0.5 rounded font-mono text-[10px] flex items-center gap-1">
                        <BrainCircuit className="w-3 h-3 animate-spin" />
                        Scanning Image Features...
                      </div>
                    </div>
                  )}

                  {!isScanning && (
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 pointer-events-none">
                      <Camera className="w-3 h-3" />
                      Tap to Replace
                    </div>
                  )}
                </div>

                {/* 1-Click Sample Presets */}
                <div className="pt-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                    Quick Sample Presets for Demo:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        handleSelectPreset(
                          IMAGES.accidentRoadIncident,
                          'Multi-Vehicle Highway Collision',
                          'accident',
                          true
                        )
                      }
                      className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold border border-slate-300 transition cursor-pointer"
                    >
                      💥 Expressway Crash
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleSelectPreset(
                          IMAGES.cardiacMedicalXray,
                          'Acute Cardiac Collapse at Crossroad',
                          'cardiac',
                          false
                        )
                      }
                      className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold border border-slate-300 transition cursor-pointer"
                    >
                      ❤️ Cardiac Event
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleSelectPreset(
                          IMAGES.traumaErHospital,
                          'Severe Pedestrian Trauma',
                          'trauma',
                          false
                        )
                      }
                      className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold border border-slate-300 transition cursor-pointer"
                    >
                      🚨 Severe Trauma
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Vision Analysis Box (5 cols) */}
              <div className="md:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                    <span className="font-extrabold text-[#142D4F] flex items-center gap-1.5">
                      <BrainCircuit className="w-4 h-4 text-[#2878E8]" />
                      Vision AI Detection
                    </span>
                    <span className="font-mono text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                      {visionFindings.confidence}% MATCH
                    </span>
                  </div>

                  <div className="mt-2 space-y-2">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Estimated Severity:</span>
                      <span className="font-mono font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200 inline-block mt-0.5">
                        {visionFindings.severity}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px]">Detected Road Obstacles:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {visionFindings.detectedHazards.map((h, i) => (
                          <span
                            key={i}
                            className="bg-white border border-slate-300 text-slate-700 text-[10px] font-semibold px-1.5 py-0.5 rounded"
                          >
                            ⚠️ {h}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px]">Action Plan:</span>
                      <p className="text-[11px] text-slate-700 font-medium leading-tight mt-0.5">
                        {visionFindings.recommendation}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-2 rounded-lg border border-blue-200 text-[10px] text-blue-900 font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>GPS metadata auto-extracted from photo</span>
                </div>
              </div>
            </div>

            {/* Input fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-100">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Incident Title / Headline:
                </label>
                <input
                  type="text"
                  value={incidentTitle}
                  onChange={(e) => setIncidentTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-semibold text-slate-900 focus:outline-none focus:border-[#2878E8]"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Incident Location:
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-red-600 absolute left-2.5 top-3" />
                  <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg py-2 pl-8 pr-2 font-semibold text-slate-900 focus:outline-none focus:border-[#2878E8]"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Roadblock Toggle & Details */}
            <div className="p-3 bg-red-50/60 border border-red-200 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <div>
                  <span className="font-extrabold text-slate-900 block">
                    Trigger Automatic Road Closure & Green Corridor Detour
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Instantly notifies incoming ambulances and detours traffic via Riverfront Ring Road
                  </span>
                </div>
              </div>

              <input
                type="checkbox"
                checked={triggerRoadblock}
                onChange={(e) => setTriggerRoadblock(e.target.checked)}
                className="w-4 h-4 rounded text-red-600 focus:ring-0 cursor-pointer"
              />
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsReportModalOpen(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-bold rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 bg-[#F00016] hover:bg-[#d60014] text-white font-black rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <span>Publishing to CAD Grid...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Broadcast Incident & Dispatch Ambulance</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
