import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, Html } from '@react-three/drei';
import * as THREE from 'three';
import { audioEngine } from '../../lib/audioEngine';

interface InteractiveObjectProps {
  position: [number, number, number];
  name: string;
  quote: string;
  color: string;
  children: React.ReactNode;
  onSelectQuote: (name: string, quote: string) => void;
}

const InteractiveModel: React.FC<InteractiveObjectProps> = ({
  position,
  name,
  quote,
  color,
  children,
  onSelectQuote,
}) => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    audioEngine.playClick();
    onSelectQuote(name, quote);
  };

  return (
    <group
      ref={meshRef}
      position={position}
      onClick={handleClick}
      onPointerOver={() => (document.body.style.cursor = 'pointer')}
      onPointerOut={() => (document.body.style.cursor = 'auto')}
    >
      <Float speed={2} rotationIntensity={0.6} floatIntensity={0.8}>
        {children}
        <Html distanceFactor={10} position={[0, -0.8, 0]}>
          <div className="bg-slate-950/80 text-amber-200 border border-amber-500/40 text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap shadow-lg backdrop-blur pointer-events-none">
            {name}
          </div>
        </Html>
      </Float>
    </group>
  );
};

// Procedural Solar System Model
const SolarSystemMesh = () => (
  <group>
    {/* Sun */}
    <mesh>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshStandardMaterial color="#fef08a" emissive="#f59e0b" emissiveIntensity={2} />
    </mesh>
    {/* Orbiting planet 1 */}
    <mesh position={[0.6, 0, 0]}>
      <sphereGeometry args={[0.08, 12, 12]} />
      <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={1} />
    </mesh>
    {/* Orbiting planet 2 */}
    <mesh position={[-0.9, 0.1, 0.2]}>
      <sphereGeometry args={[0.12, 12, 12]} />
      <meshStandardMaterial color="#f43f5e" emissive="#be123c" emissiveIntensity={1} />
    </mesh>
  </group>
);

// Procedural Earth Sphere
const EarthMesh = () => (
  <mesh>
    <sphereGeometry args={[0.4, 20, 20]} />
    <meshStandardMaterial color="#0284c7" emissive="#0369a1" emissiveIntensity={0.8} roughness={0.3} />
  </mesh>
);

// Procedural Rocket
const RocketMesh = () => (
  <group rotation={[0, 0, -0.4]}>
    {/* Main Body */}
    <mesh position={[0, 0, 0]}>
      <cylinderGeometry args={[0.08, 0.12, 0.7, 12]} />
      <meshStandardMaterial color="#f8fafc" emissive="#e2e8f0" emissiveIntensity={0.5} />
    </mesh>
    {/* Nose Cone */}
    <mesh position={[0, 0.45, 0]}>
      <coneGeometry args={[0.08, 0.25, 12]} />
      <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={1} />
    </mesh>
    {/* Flame exhaust */}
    <mesh position={[0, -0.45, 0]}>
      <coneGeometry args={[0.06, 0.2, 12]} />
      <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={2} />
    </mesh>
  </group>
);

// Procedural Microscope
const MicroscopeMesh = () => (
  <group>
    {/* Base */}
    <mesh position={[0, -0.3, 0]}>
      <boxGeometry args={[0.4, 0.08, 0.4]} />
      <meshStandardMaterial color="#475569" />
    </mesh>
    {/* Arm */}
    <mesh position={[0.12, 0, 0]}>
      <cylinderGeometry args={[0.04, 0.04, 0.5, 12]} />
      <meshStandardMaterial color="#94a3b8" />
    </mesh>
    {/* Eyepiece Tube */}
    <mesh position={[0.02, 0.2, 0]} rotation={[0, 0, -0.3]}>
      <cylinderGeometry args={[0.05, 0.05, 0.35, 12]} />
      <meshStandardMaterial color="#f59e0b" emissive="#b45309" emissiveIntensity={0.8} />
    </mesh>
  </group>
);

interface ScienceUniverseSceneProps {
  onSelectQuote: (name: string, quote: string) => void;
}

export const ScienceUniverseScene: React.FC<ScienceUniverseSceneProps> = ({ onSelectQuote }) => {
  const QUOTES = [
    "Curiosity begins with questions.",
    "Science inspires discovery.",
    "Knowledge changes the future.",
    "A great teacher lights every mind.",
  ];

  return (
    <div className="w-full h-[580px] relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-950/80 shadow-2xl">
      <Canvas camera={{ position: [0, 0, 5.5], fov: 50 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={2} color="#fef08a" />
        <pointLight position={[0, 0, 0]} intensity={2.5} color="#f59e0b" />

        {/* Floating Universe Models */}
        <InteractiveModel
          position={[-2.2, 1.2, 0]}
          name="Solar System"
          quote={QUOTES[0]}
          color="#f59e0b"
          onSelectQuote={onSelectQuote}
        >
          <SolarSystemMesh />
        </InteractiveModel>

        <InteractiveModel
          position={[2.2, 1.3, 0]}
          name="Earth & Nature"
          quote={QUOTES[1]}
          color="#38bdf8"
          onSelectQuote={onSelectQuote}
        >
          <EarthMesh />
        </InteractiveModel>

        <InteractiveModel
          position={[-2.4, -1.1, 0]}
          name="Rocket Science"
          quote={QUOTES[2]}
          color="#ef4444"
          onSelectQuote={onSelectQuote}
        >
          <RocketMesh />
        </InteractiveModel>

        <InteractiveModel
          position={[2.3, -1.0, 0]}
          name="Microscope"
          quote={QUOTES[3]}
          color="#a855f7"
          onSelectQuote={onSelectQuote}
        >
          <MicroscopeMesh />
        </InteractiveModel>

        <Sparkles count={350} scale={[12, 10, 10]} size={3.5} speed={0.4} color="#fde047" opacity={0.8} />
      </Canvas>
    </div>
  );
};
