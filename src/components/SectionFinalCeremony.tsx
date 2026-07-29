import React, { useState } from 'react';
import { MagicalTreeScene } from './3d/MagicalTreeScene';
import { Flame, Sparkles, Heart } from 'lucide-react';
import { audioEngine } from '../lib/audioEngine';

export const SectionFinalCeremony: React.FC = () => {
  const [isLit, setIsLit] = useState(false);

  const handleLightDiya = () => {
    if (!isLit) {
      setIsLit(true);
      audioEngine.playDiyaSound();
      setTimeout(() => {
        audioEngine.playTempleBell();
      }, 200);
    }
  };

  return (
    <section id="section-final" className="py-20 px-4 max-w-6xl mx-auto space-y-8 text-center relative">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <Flame className="w-4 h-4 text-amber-400" />
          FINAL TRIBUTE CEREMONY
        </div>
        <h2 className="text-2xl md:text-4xl font-bold text-white font-serif tracking-wide">
          Lighting the Diya of Gratitude
        </h2>
        <p className="text-xs md:text-sm text-slate-400 max-w-lg mx-auto">
          {isLit
            ? 'The sacred flame is lit. May the light of knowledge guide us forever.'
            : 'Click on the Diya below to light the sacred flame and offer our tribute.'}
        </p>
      </div>

      <div className="relative">
        <MagicalTreeScene isLit={isLit} onLightDiya={handleLightDiya} />

        {/* Floating Prompt when not lit */}
        {!isLit && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-none">
            <button
              onClick={handleLightDiya}
              className="pointer-events-auto flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs md:text-sm rounded-full shadow-[0_0_30px_rgba(245,158,11,0.8)] border border-amber-200 animate-bounce cursor-pointer transition-all"
            >
              <Flame className="w-4 h-4 text-slate-950" />
              Tap to Light the Diya
            </button>
          </div>
        )}
      </div>

      {/* Cinematic Display Overlay when Lit */}
      {isLit && (
        <div className="bg-gradient-to-r from-amber-950/80 via-slate-900/90 to-amber-950/80 border border-amber-500/50 rounded-3xl p-8 md:p-12 shadow-[0_0_60px_rgba(245,158,11,0.3)] space-y-4 animate-fade-in backdrop-blur-md">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-amber-400" />
            HAPPY GURU PURNIMA
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white font-serif tracking-wide">
            Thank You <span className="text-amber-300">Shami Teacher</span>
          </h1>

          <p className="text-base md:text-xl text-amber-200/90 font-serif italic max-w-2xl mx-auto">
            "For inspiring us, guiding us, and helping us grow every day."
          </p>

          <p className="text-sm md:text-base text-amber-400 font-bold flex items-center justify-center gap-1.5 pt-2">
            — Class 10B <Heart className="w-4 h-4 text-red-500 fill-red-500 inline" />
          </p>
        </div>
      )}
    </section>
  );
};
