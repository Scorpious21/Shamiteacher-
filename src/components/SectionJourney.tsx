import React from 'react';
import { SciencePathwayScene } from './3d/SciencePathwayScene';
import { Sparkles, Compass } from 'lucide-react';

export const SectionJourney: React.FC = () => {
  return (
    <section id="section-journey" className="py-20 px-4 max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <Compass className="w-4 h-4 text-amber-400" />
          SECTION 1
        </div>
        <h2 className="text-2xl md:text-4xl font-bold text-white font-serif tracking-wide">
          Journey of Knowledge
        </h2>
        <p className="text-sm md:text-base text-amber-200/90 max-w-2xl mx-auto italic">
          "Every lesson you taught became another step toward knowledge."
        </p>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-4 shadow-2xl overflow-hidden">
        <SciencePathwayScene />
      </div>
    </section>
  );
};
