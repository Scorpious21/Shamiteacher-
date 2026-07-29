import React, { useState } from 'react';
import { ScienceUniverseScene } from './3d/ScienceUniverseScene';
import { Orbit, X, Sparkles, Quote } from 'lucide-react';

export const SectionUniverse: React.FC = () => {
  const [selectedQuote, setSelectedQuote] = useState<{ name: string; quote: string } | null>(null);

  const handleSelectQuote = (name: string, quote: string) => {
    setSelectedQuote({ name, quote });
  };

  return (
    <section id="section-universe" className="py-20 px-4 max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <Orbit className="w-4 h-4 text-amber-400" />
          SECTION 2
        </div>
        <h2 className="text-2xl md:text-4xl font-bold text-white font-serif tracking-wide">
          Science Universe
        </h2>
        <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto">
          Explore the interactive floating models of scientific discovery. Click on any model to unlock its wisdom.
        </p>
      </div>

      <ScienceUniverseScene onSelectQuote={handleSelectQuote} />

      {/* Glass Quote Dialog Modal */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative bg-slate-900/90 border border-amber-500/40 rounded-3xl p-8 max-w-md w-full text-center shadow-[0_0_50px_rgba(245,158,11,0.2)]">
            <button
              onClick={() => setSelectedQuote(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Quote className="w-6 h-6" />
            </div>

            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              {selectedQuote.name}
            </span>

            <blockquote className="text-lg md:text-xl font-serif text-white italic mt-3 mb-6">
              "{selectedQuote.quote}"
            </blockquote>

            <p className="text-xs text-amber-200/80">
              Inspiring future innovators — Shami Teacher
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
