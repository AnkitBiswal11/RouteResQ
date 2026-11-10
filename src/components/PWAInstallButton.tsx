import React, { useState } from 'react';
import { Download, Check, X } from 'lucide-react';
import { usePWAInstall } from './usePWAInstall';

export const PWAInstallButton: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running standalone
  if (isInstalled) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-md border border-emerald-200 ${className}`}>
        <Check className="w-3.5 h-3.5" />
        Installed PWA
      </span>
    );
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`inline-flex items-center gap-1.5 rounded-lg bg-[#2878E8] px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#1a66d1] transition-colors whitespace-nowrap shrink-0 ${className}`}
        title="Install RouteResQ for offline access"
      >
        <Download className="w-3.5 h-3.5" />
        Install App
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 ${className}`}
        >
          <Download className="w-3.5 h-3.5" />
          Install iOS
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Install RouteResQ on iOS</h3>
                <button onClick={() => setShowIOSGuide(false)} className="text-slate-400 hover:text-slate-700">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-600">
                1. Tap the <strong>Share</strong> button at the bottom of Safari.<br />
                2. Scroll down and choose <strong>Add to Home Screen</strong>.<br />
                3. Open RouteResQ for offline emergency SOS without cellular data.
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-lg bg-slate-100 py-2 text-xs font-bold text-slate-800 hover:bg-slate-200"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback desktop indicator/guide
  return null;
};
