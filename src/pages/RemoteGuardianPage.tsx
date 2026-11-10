import React, { useState } from 'react';
import {
  ShieldAlert,
  Heart,
  UserCheck,
  MapPin,
  Phone,
  Send,
  CheckCircle2,
  Share2,
  Copy,
  ArrowRight,
  User,
  Activity,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useRouteResQ } from '../context/RouteResQContext';
import { EmergencyCategory } from '../types';
import IMAGES from '../assets/imageAssets';

export const RemoteGuardianPage: React.FC = () => {
  const {
    t,
    triggerSOS,
    ambulances,
    setActiveTab,
    selectedAmbulance,
    setSelectedAmbulanceId,
  } = useRouteResQ();

  // Requester Info (Outside town)
  const [requesterName, setRequesterName] = useState('Ankit Biswal');
  const [requesterLocation, setRequesterLocation] = useState('Bengaluru, Karnataka (Living Away)');
  const [requesterPhone, setRequesterPhone] = useState('+91 98765 43210');

  // Relative in City
  const [relativeName, setRelativeName] = useState('Prakash Biswal');
  const [relationship, setRelationship] = useState('Father (ବାପା)');
  const [relativePhone, setRelativePhone] = useState('+91 94370 12345');
  const [neighborhood, setNeighborhood] = useState('Central Urban Sector');
  const [relativeAddress, setRelativeAddress] = useState('Plot 42, Near Central Temple, Metropolitan Area');
  const [emergencyReason, setEmergencyReason] = useState('Sudden Acute Chest Pain & Heavy Sweating');

  // Medical condition chips
  const [selectedConditions, setSelectedConditions] = useState<string[]>([
    'Hypertension',
    'Type 2 Diabetes',
  ]);

  const medicalConditionOptions = [
    'Hypertension',
    'Type 2 Diabetes',
    'Heart Patient (Stent/Bypass)',
    'Bedridden / Low Mobility',
    'Asthma / Low SPO2',
    'Previous Stroke',
    'Wheelchair Dependent',
  ];

  const toggleCondition = (condition: string) => {
    setSelectedConditions((prev) =>
      prev.includes(condition)
        ? prev.filter((c) => c !== condition)
        : [...prev, condition]
    );
  };

  // Active Dispatches
  const [activeDispatch, setActiveDispatch] = useState<{
    id: string;
    code: string;
    relativeName: string;
    age: string;
    emergency: string;
    address: string;
    relativePhone: string;
    requester: string;
    status: 'ARRIVED AT HOSPITAL' | 'AMBULANCE EN ROUTE' | 'DISPATCHED';
    ambulanceName: string;
    speed: string;
    hospital: string;
    eta: string;
  }>({
    id: 'RG-8801',
    code: 'RG-8801',
    relativeName: 'Prakash Biswal (Father, 64y)',
    age: '64y',
    emergency: 'Sudden Acute Chest Pain & Heavy Sweating',
    address: 'Plot 42, Near Central Temple, Metropolitan Area',
    relativePhone: '+91 94370 12345',
    requester: 'Ankit Biswal (Bengaluru)',
    status: 'ARRIVED AT HOSPITAL',
    ambulanceName: 'Trauma ResQ-2',
    speed: '48 km/h · Priority Green Corridor',
    hospital: 'Metropolitan Super Specialty Trauma Center',
    eta: '0 min',
  });

  const [callModalOpen, setCallModalOpen] = useState(false);
  const [shareToast, setShareToast] = useState(false);

  // Quick presets
  const handleSelectPreset = (presetName: string, category: EmergencyCategory, reason: string) => {
    setEmergencyReason(reason);
    if (presetName.includes('Father')) {
      setRelativeName('Prakash Biswal');
      setRelationship('Father (ବାପା)');
      setSelectedConditions(['Hypertension', 'Heart Patient (Stent/Bypass)']);
    } else if (presetName.includes('Mother')) {
      setRelativeName('Kalyani Biswal');
      setRelationship('Mother (ମା)');
      setSelectedConditions(['Type 2 Diabetes', 'Bedridden / Low Mobility']);
    } else {
      setRelativeName('Bipin Biswal');
      setRelationship('Grandparent (ଜେଜେବାପା)');
      setSelectedConditions(['Asthma / Low SPO2', 'Wheelchair Dependent']);
    }
  };

  const handleTriggerEmergency = async () => {
    const id = await triggerSOS(
      'cardiac',
      relativeAddress,
      [21.4720, 83.9720],
      `Remote Guardian: ${emergencyReason} for ${relativeName} (${relationship}). Conditions: ${selectedConditions.join(', ')}`
    );

    setActiveDispatch({
      id,
      code: `RG-${id.slice(-4)}`,
      relativeName: `${relativeName} (${relationship})`,
      age: '64y',
      emergency: emergencyReason,
      address: relativeAddress,
      relativePhone,
      requester: `${requesterName} (${requesterLocation.split(',')[0]})`,
      status: 'AMBULANCE EN ROUTE',
      ambulanceName: 'Trauma ResQ-2',
      speed: '58 km/h · Dynamic Corridor Active',
      hospital: 'Metropolitan Super Specialty Trauma Center',
      eta: '4.5 min',
    });
  };

  const handleShareLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/?track=${activeDispatch.code}`);
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2500);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner exactly matching screenshot */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <h2 className="text-base font-extrabold text-[#142D4F]">
              Remote Guardian: Out-of-Town Relative Emergency Care
            </h2>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-pink-100 text-[#F00016] border border-pink-200 flex items-center gap-1">
              <Heart className="w-3 h-3 fill-[#F00016]" />
              Family Remote SOS
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-600">
          Living outside town? Dispatch emergency medical care, specialized ALS ambulances, and monitor real-time arrival for family and elderly relatives back home.
        </p>

        {/* Green Verified Banner */}
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg text-emerald-800 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Priority Home Emergency Coordination Active</span>
        </div>
      </div>

      {/* Quick Family Emergency Presets */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-sm space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 pb-1">
          <span className="flex items-center gap-1.5 text-[#2878E8]">
            <Activity className="w-3.5 h-3.5" />
            QUICK FAMILY EMERGENCY PRESETS
          </span>
          <span className="text-slate-400 font-normal text-[11px]">1-click autofill</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => handleSelectPreset('Father', 'cardiac', 'Sudden Acute Chest Pain & Heavy Sweating')}
            className="p-3 bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 rounded-xl text-left transition cursor-pointer group"
          >
            <div className="font-extrabold text-xs text-slate-900 group-hover:text-[#2878E8]">
              Elderly Father · Cardiac
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Central Sector · Chest Pain</div>
          </button>

          <button
            onClick={() => handleSelectPreset('Mother', 'trauma', 'Severe Slip, Fall and Bone Fracture')}
            className="p-3 bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 rounded-xl text-left transition cursor-pointer group"
          >
            <div className="font-extrabold text-xs text-slate-900 group-hover:text-[#2878E8]">
              Mother · Severe Fall
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">North Sector · Fracture</div>
          </button>

          <button
            onClick={() => handleSelectPreset('Grandparent', 'respiratory', 'Sudden SPO2 Drop & Acute Dyspnea')}
            className="p-3 bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 rounded-xl text-left transition cursor-pointer group"
          >
            <div className="font-extrabold text-xs text-slate-900 group-hover:text-[#2878E8]">
              Grandparent · Oxygen Drop
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">South Sector · Respiratory</div>
          </button>
        </div>
      </div>

      {/* Main 2-Column Form and Live Dispatches */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Form (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Card 1: Your Contact Info */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#2878E8]" />
                Your Contact Info (Remote Requester)
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#2878E8] border border-blue-200">
                You (Outside Town)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">Your Full Name</label>
                <input
                  type="text"
                  value={requesterName}
                  onChange={(e) => setRequesterName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:border-[#2878E8]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">Where You Live Right Now</label>
                <input
                  type="text"
                  value={requesterLocation}
                  onChange={(e) => setRequesterLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:border-[#2878E8]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">Your Mobile Phone</label>
                <input
                  type="text"
                  value={requesterPhone}
                  onChange={(e) => setRequesterPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:border-[#2878E8]"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Relative Details */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-[#F00016]" />
                Relative Details in Metro City
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-[#F00016] border border-red-200">
                Target in Metro City
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">Relative's Name</label>
                <input
                  type="text"
                  value={relativeName}
                  onChange={(e) => setRelativeName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:border-[#2878E8]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">Relationship</label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:border-[#2878E8]"
                >
                  <option value="Father (ବାପା)">Father (ବାପା / पिता)</option>
                  <option value="Mother (ମା)">Mother (ମା / माता)</option>
                  <option value="Grandparent (ଜେଜେବାପା)">Grandparent (ଜେଜେବାପା / दादा)</option>
                  <option value="Spouse (ସ୍ୱାମୀ/ସ୍ତ୍ରୀ)">Spouse (ସ୍ୱାମୀ/ସ୍ତ୍ରୀ)</option>
                  <option value="Child (ପୁଅ/ଝିଅ)">Child (ପୁଅ/ଝିଅ)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">Relative's Phone</label>
                <input
                  type="text"
                  value={relativePhone}
                  onChange={(e) => setRelativePhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:border-[#2878E8]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">Metro Neighborhood</label>
                <select
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:border-[#2878E8]"
                >
                  <option value="Central Urban Sector">Central Urban Sector</option>
                  <option value="North Residential Sector">North Residential Sector</option>
                  <option value="East Riverfront Boulevard">East Riverfront Boulevard</option>
                  <option value="West Medical University Campus">West Medical University Campus</option>
                  <option value="South Transit Depot">South Transit Depot</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">Home Address / Landmark</label>
                <input
                  type="text"
                  value={relativeAddress}
                  onChange={(e) => setRelativeAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:border-[#2878E8]"
                />
              </div>
            </div>
          </div>

          {/* Card 3: What Emergency Happened */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-sm space-y-2">
            <label className="text-xs font-extrabold text-slate-900 block">
              What Emergency Happened to Your Relative?
            </label>
            <input
              type="text"
              value={emergencyReason}
              onChange={(e) => setEmergencyReason(e.target.value)}
              placeholder="e.g. Sudden severe chest pain, breathing difficulty, or slip and fall"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 font-semibold text-xs focus:outline-none focus:border-[#2878E8]"
            />
          </div>

          {/* Card 4: Medical Conditions (Alerts Paramedics) */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-sm space-y-3">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
              SELECT RELATIVE'S MEDICAL CONDITIONS (ALERTS PARAMEDICS):
            </span>

            <div className="flex flex-wrap gap-2">
              {medicalConditionOptions.map((cond) => {
                const isActive = selectedConditions.includes(cond);
                return (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => toggleCondition(cond)}
                    className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition cursor-pointer border ${
                      isActive
                        ? 'bg-[#F00016] text-white border-[#F00016] shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                    }`}
                  >
                    {cond}
                  </button>
                );
              })}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleTriggerEmergency}
                className="w-full py-3 bg-[#F00016] hover:bg-[#d60014] text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Trigger Remote Emergency Care for Family</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Active Remote Family Dispatches matching image_19431d20.png */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-extrabold text-[#142D4F] flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#F00016]" />
                Active Remote Family Dispatches
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-100 text-[#F00016] border border-pink-200">
                1 Active
              </span>
            </div>

            {/* Active Dispatch Outer Card */}
            <div className="border border-red-200 bg-red-50/20 rounded-xl p-4 space-y-3.5 shadow-sm">
              {/* Header Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-extrabold bg-[#F00016] text-white px-2 py-0.5 rounded">
                    {activeDispatch.code}
                  </span>
                  <h4 className="text-xs font-extrabold text-slate-900 truncate max-w-[160px]">
                    {activeDispatch.relativeName}
                  </h4>
                </div>

                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {activeDispatch.status}
                </span>
              </div>

              {/* Emergency Summary */}
              <div>
                <div className="text-xs font-extrabold text-slate-900">
                  {activeDispatch.emergency}
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-[#F00016] shrink-0" />
                  <span className="truncate">{activeDispatch.address}</span>
                </div>
              </div>

              {/* Phones and Requester Row */}
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-400 block">Relative:</span>
                  <span className="font-bold text-slate-800">{activeDispatch.relativePhone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Requester:</span>
                  <span className="font-bold text-slate-800 truncate block">{activeDispatch.requester}</span>
                </div>
              </div>

              {/* Paramedic Card with Real Image */}
              <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3">
                <img
                  src={IMAGES.paramedicMedicPhoto}
                  alt="Onboard Paramedic"
                  className="w-14 h-14 rounded-lg object-cover shadow-sm shrink-0 border border-slate-200"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-extrabold text-slate-900 truncate">
                      {activeDispatch.ambulanceName}
                    </div>
                    <span className="text-[10px] font-mono font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      ETA: {activeDispatch.eta}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 truncate">
                    Speed: <strong className="text-slate-800">{activeDispatch.speed}</strong>
                  </div>
                  <div className="text-[10px] text-blue-700 font-medium truncate mt-0.5">
                    Hospital: {activeDispatch.hospital}
                  </div>
                </div>
              </div>

              {/* Dual Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setCallModalOpen(true)}
                  className="py-2.5 px-3 bg-[#142D4F] hover:bg-[#1a3861] text-white text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Onboard Paramedic</span>
                </button>

                <button
                  type="button"
                  onClick={handleShareLink}
                  className="py-2.5 px-3 bg-[#13A878] hover:bg-[#0f8c63] text-white text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Family Link</span>
                </button>
              </div>

              {/* Map Route Link */}
              <button
                type="button"
                onClick={() => setActiveTab('live_ops')}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 border border-slate-200 cursor-pointer"
              >
                <span>View Live Route on Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Paramedic Call Modal */}
      {callModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4 border border-slate-100">
            <div className="relative w-20 h-20 mx-auto">
              <img
                src={IMAGES.paramedicMedicPhoto}
                alt="Onboard Paramedic"
                className="w-20 h-20 rounded-full object-cover border-4 border-[#13A878] shadow-md"
              />
              <span className="absolute bottom-0 right-0 w-5 h-5 bg-[#13A878] border-2 border-white rounded-full flex items-center justify-center">
                <span className="w-2 h-2 bg-white rounded-full animate-ping" />
              </span>
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Connected to Trauma ResQ-2
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Senior Paramedic Sarah J. Onboard
              </p>
              <p className="text-xs font-mono font-bold text-emerald-600 mt-0.5">
                Direct Line: +91 94370 21980
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl text-left text-xs text-slate-600 border border-slate-200 space-y-1">
              <div className="font-bold text-slate-800">Telemetry Status:</div>
              <div>• Patient oxygen & vitals monitored live</div>
              <div>• Priority green corridor enabled to Trauma Center</div>
              <div>• Doctor team on standby at emergency receiving bay</div>
            </div>

            <button
              onClick={() => setCallModalOpen(false)}
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
            >
              End Call
            </button>
          </div>
        </div>
      )}

      {/* Share Toast */}
      {shareToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#142D4F] text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold border border-slate-700 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#13A878]" />
          <span>Tracking link copied to clipboard for WhatsApp/SMS!</span>
        </div>
      )}
    </div>
  );
};
