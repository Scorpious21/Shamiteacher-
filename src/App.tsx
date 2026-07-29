import React, { useState } from 'react';
import { HeroLotusScene } from './components/3d/HeroLotusScene';
import { HeroOverlay } from './components/HeroOverlay';
import { SectionJourney } from './components/SectionJourney';
import { SectionUniverse } from './components/SectionUniverse';
import { SectionConstellation } from './components/SectionConstellation';
import { SectionAppreciation } from './components/SectionAppreciation';
import { SectionFinalCeremony } from './components/SectionFinalCeremony';
import { AudioControls } from './components/AudioControls';
import { LoadingScreen } from './components/LoadingScreen';

export function App() {
  const [isLoading, setIsLoading] = useState(true);

  const scrollToSection1 = () => {
    const el = document.getElementById('section-journey');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950">
      {isLoading && <LoadingScreen onLoaded={() => setIsLoading(false)} />}

      <AudioControls />

      {/* Hero 3D Section */}
      <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <HeroLotusScene />
        <HeroOverlay onBeginJourney={scrollToSection1} />
      </div>

      {/* Main Experience Content */}
      <main className="relative z-10 space-y-12 pb-24">
        <SectionJourney />
        <SectionUniverse />
        <SectionConstellation />
        <SectionAppreciation />
        <SectionFinalCeremony />
      </main>
    </div>
  );
}

export default App;
