import React from 'react';
import { ClassConstellationScene } from './3d/ClassConstellationScene';
import { Users, Sparkles } from 'lucide-react';

export const SectionConstellation: React.FC = () => {
  return (
    <section id="section-constellation" className="py-20 px-4 max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <Users className="w-4 h-4 text-amber-400" />
          SECTION 3
        </div>
        <h2 className="text-2xl md:text-4xl font-bold text-white font-serif tracking-wide">
          Our Class — 10 B
        </h2>
        <p className="text-base md:text-lg text-amber-200/90 max-w-2xl mx-auto italic font-serif">
          "Together we shine because you guided us."
        </p>
      </div>

      <ClassConstellationScene />
    </section>
  );
};
