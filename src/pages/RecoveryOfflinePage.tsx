import React, { useState, useEffect } from 'react';
import {
  HardDriveDownload,
  WifiOff,
  Wifi,
  Radio,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Download,
  Database,
  ShieldCheck,
  FileText,
  MapPin,
  Trash2,
} from 'lucide-react';
import { useRouteResQ } from '../context/RouteResQContext';
import { getPendingOfflineSOS, deleteOfflineSOS } from '../services/db';
import { EmergencyIncident } from '../types';

export const RecoveryOfflinePage: React.FC = () => {
  const {
    t,
    isOnline,
    toggleOfflineSimulation,
    syncOfflineQueue,
    offlineQueueCount,
    offlineMapPacks,
    downloadOfflineMap,
  } = useRouteResQ();

  const [pendingQueue, setPendingQueue] = useState<EmergencyIncident[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [downloadingPack, setDownloadingPack] = useState(false);

  const loadQueue = async () => {
    const items = await getPendingOfflineSOS();
    setPendingQueue(items);
  };

  useEffect(() => {
    loadQueue();
  }, [offlineQueueCount]);

  const handleManualSync = async () => {
    if (!isOnline) return;
    setIsSyncing(true);
    await syncOfflineQueue();
    await loadQueue();
    setIsSyncing(false);
  };

  const handleDownloadSector = async (sectorName: string) => {
    setDownloadingPack(true);
    await downloadOfflineMap(sectorName);
    setDownloadingPack(false);
  };

  const handleDeleteItem = async (id: string) => {
    await deleteOfflineSOS(id);
    await loadQueue();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-50 text-amber-700">
            <HardDriveDownload className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-[#142D4F]">
              Offline Recovery & IndexedDB Synchronization Hub
            </h2>
            <p className="text-xs text-slate-500">
              Zero-connectivity emergency fallback, local data store, and cloud synchronization
            </p>
          </div>
        </div>

        {/* Network Toggle Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleOfflineSimulation}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
              isOnline
                ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                : 'bg-amber-500 text-white border-amber-600 font-extrabold shadow-sm'
            }`}
          >
            {isOnline ? (
              <>
                <Wifi className="w-4 h-4 text-emerald-600" />
                <span>Simulate Offline Disconnect</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-white animate-pulse" />
                <span>Restore Network Connection</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN (7 cols): Offline Queue Inspector */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-extrabold text-[#142D4F]">
                  IndexedDB Offline Emergency Queue
                </h3>
                <p className="text-xs text-slate-500">
                  Requests captured during offline sessions stored in local device database
                </p>
              </div>

              <button
                onClick={handleManualSync}
                disabled={!isOnline || isSyncing || pendingQueue.length === 0}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-[#2878E8] text-white hover:bg-[#1f66cb] disabled:opacity-40 transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync Pending Requests'}</span>
              </button>
            </div>

            {pendingQueue.length === 0 ? (
              <div className="py-10 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <h4 className="text-sm font-bold text-slate-800">Local Queue Empty</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  All emergency records are synchronized with the central Metropolitan command center. Cut network above and tap 1-Tap SOS to test local queuing.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingQueue.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-amber-900">{item.id}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-200 text-amber-900">
                          LOCAL STORE
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-slate-400 hover:text-red-600 transition"
                        title="Delete from local queue"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 className="font-bold text-slate-900">{item.title}</h4>
                    <p className="text-slate-600 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.locationName}</span>
                    </p>

                    <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between text-[11px] font-mono text-slate-500">
                      <span>Saved: {new Date(item.timestamp).toLocaleTimeString()}</span>
                      <span className="font-bold text-amber-800">
                        Pending Online Cloud Transmission
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN (5 cols): Offline Map Packs & PWA Status */}
        <div className="lg:col-span-5 space-y-4">
          {/* Offline Map Packs */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-[#142D4F]">
                Offline Map Data Packages
              </h3>
              <span className="text-xs font-mono text-slate-500">Local Vector Cache</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Pre-download road geometry, hospital coordinates, and bridge corridors for the metropolitan grid to enable full offline route calculation without active cellular internet.
            </p>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-slate-800">Metropolitan Core & Trauma Sector</h4>
                  <p className="text-[11px] text-slate-500">14.2 MB · 240 Road Segments · 18 Medical Bays</p>
                </div>
                <button
                  onClick={() => handleDownloadSector('Metropolitan Core & Trauma')}
                  disabled={downloadingPack}
                  className="px-3 py-1.5 rounded-lg bg-[#2878E8] text-white font-bold text-xs hover:bg-[#1f66cb] transition flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-slate-800">Burla - Hirakud Reservoir Ring</h4>
                  <p className="text-[11px] text-slate-500">9.8 MB · 160 Road Segments · 8 Facilities</p>
                </div>
                <button
                  onClick={() => handleDownloadSector('Burla - Hirakud Ring')}
                  disabled={downloadingPack}
                  className="px-3 py-1.5 rounded-lg bg-[#2878E8] text-white font-bold text-xs hover:bg-[#1f66cb] transition flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {offlineMapPacks.length > 0 && (
              <div className="pt-2 text-[11px] font-mono text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                ✓ {offlineMapPacks.length} Sector Package(s) cached in IndexedDB.
              </div>
            )}
          </div>

          {/* PWA Compliance Checklist */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              PWA Architecture Verification
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Service Worker Registration</span>
                <span className="font-bold text-emerald-700 font-mono">Active (Workbox)</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Web App Manifest</span>
                <span className="font-bold text-emerald-700 font-mono">Valid (Standalone)</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">IndexedDB Persistence</span>
                <span className="font-bold text-emerald-700 font-mono">Connected</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Background Sync / Foreground Fallback</span>
                <span className="font-bold text-emerald-700 font-mono">Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
