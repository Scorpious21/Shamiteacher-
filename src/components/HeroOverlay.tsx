import React from 'react';
import { ArrowDown, Sparkles } from 'lucide-react';
import { audioEngine } from '../lib/audioEngine';

interface HeroOverlayProps {
  onBeginJourney: () => void;
}

export const HeroOverlay: React.FC<HeroOverlayProps> = ({ onBeginJourney }) => {
  const handleClick = () => {
    audioEngine.playClick();
    onBeginJourney();
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 z-10 pointer-events-none">
      <div className="space-y-6 max-w-4xl pointer-events-auto backdrop-blur-xs p-6 rounded-3xl">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs md:text-sm font-semibold tracking-widest uppercase shadow-lg">
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
          HAPPY GURU PURNIMA
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight font-serif">
          To Our Respected <br />
          <span className="bg-gradient-to-r from-amber-300 via-amber-100 to-amber-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(245,158,11,0.6)]">
            Shami Teacher
          </span>
        </h1>

        <p className="text-base md:text-xl text-amber-200/90 max-w-2xl mx-auto italic font-light">
          "The light of knowledge shines forever."
        </p>

        <div className="pt-6">
          <button
            id="btn-begin-journey"
            onClick={handleClick}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500/80 to-amber-600/80 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm md:text-base rounded-full shadow-[0_0_30px_rgba(245,158,11,0.5)] border border-amber-300/60 backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Begin Journey</span>
            <ArrowDown className="w-5 h-5 text-slate-950 group-hover:translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
