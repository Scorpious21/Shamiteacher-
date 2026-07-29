import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface LoadingScreenProps {
  onLoaded: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoaded }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onLoaded, 400);
          return 100;
        }
        return prev + 4;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [onLoaded]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-6 text-center select-none">
      {/* Glowing Lotus Icon */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center animate-pulse">
          <Sparkles className="w-10 h-10 text-amber-400" />
        </div>
        <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-xl -z-10 animate-ping opacity-30"></div>
      </div>

      <h2 className="text-xl md:text-2xl font-bold text-amber-100 tracking-wider mb-2 font-serif">
        GURU PURNIMA TRIBUTE
      </h2>
      <p className="text-xs md:text-sm text-slate-400 max-w-md mb-8">
        Preparing 3D Cinematic Experience for Shami Teacher...
      </p>

      {/* Progress Bar */}
      <div className="w-64 md:w-80 h-2 bg-slate-900 border border-slate-800 rounded-full overflow-hidden p-0.5 shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-200 rounded-full transition-all duration-100 shadow-[0_0_12px_rgba(245,158,11,0.8)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-[11px] text-amber-400/80 font-mono mt-3">{progress}% Loaded</p>
    </div>
  );
};
