import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, Music } from 'lucide-react';
import { audioEngine } from '../lib/audioEngine';

export const AudioControls: React.FC = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const toggleAudio = () => {
    if (!isStarted) {
      audioEngine.startBGM();
      setIsStarted(true);
    }
    const muted = audioEngine.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="fixed top-5 right-5 z-50 flex items-center gap-3">
      <button
        id="btn-toggle-audio"
        onClick={toggleAudio}
        className="flex items-center gap-2.5 px-4 py-2 bg-slate-950/80 hover:bg-slate-900 border border-amber-500/30 hover:border-amber-400/60 rounded-full text-amber-200 text-xs font-semibold backdrop-blur-md shadow-2xl transition-all duration-300 group"
      >
        <Music className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span>{isMuted ? 'Unmute BGM' : 'Soft Indian Classical'}</span>
        {isMuted ? (
          <VolumeX className="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition-colors" />
        ) : (
          <Volume2 className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
        )}
      </button>
    </div>
  );
};
