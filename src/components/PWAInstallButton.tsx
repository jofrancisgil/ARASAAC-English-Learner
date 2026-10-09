import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Sparkles, X } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 rounded-full bg-teal-500 hover:bg-teal-600 text-white px-3 py-1.5 text-xs font-medium shadow-sm transition active:scale-95"
        title="Install app for offline classroom usage"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 text-teal-800 hover:bg-teal-100 px-3 py-1.5 text-xs font-medium transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Add to iPad / iPhone</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-teal-100">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-800">Install for Classroom iPad / iPhone</h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="rounded-full p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                To use this app offline with students on an iPad or iPhone:
              </p>
              <ol className="mt-2.5 text-xs text-slate-700 space-y-2 list-decimal list-inside bg-slate-50 p-3 rounded-xl border border-slate-100">
                <li>Tap the <strong>Share</strong> button in Safari's top/bottom toolbar.</li>
                <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
                <li>Tap <strong>Add</strong> in the top right.</li>
              </ol>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-xl bg-teal-600 py-2.5 text-xs font-semibold text-white hover:bg-teal-700 transition"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
