import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-500/95 text-white px-3.5 py-2 text-xs font-semibold shadow-lg backdrop-blur-sm transition-all animate-bounce">
      <WifiOff className="w-4 h-4" />
      <span>Offline Mode active — All cached ARASAAC pictograms and student profiles work offline!</span>
    </div>
  );
};
