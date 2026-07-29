import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles, Float } from '@react-three/drei';
import * as THREE from 'three';
import { audioEngine } from '../../lib/audioEngine';

interface MagicalTreeSceneProps {
  isLit: boolean;
  onLightDiya: () => void;
}

// Procedural Magical Glowing Tree
const MagicalTree = ({ isLit }: { isLit: boolean }) => {
  const treeGroup = useRef<THREE.Group>(null);
  const foliageRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    if (foliageRef.current) {
      foliageRef.current.rotation.y = Math.sin(time * 0.5) * 0.05;
      foliageRef.current.position.y = Math.sin(time * 0.8) * 0.05;
    }
    if (treeGroup.current && isLit) {
      treeGroup.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group ref={treeGroup} position={[0, -1.2, 0]}>
      {/* Trunk */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.2, 0.45, 2.4, 16]} />
        <meshStandardMaterial color="#451a03" roughness={0.8} />
      </mesh>

      {/* Foliage Clusters */}
      <group ref={foliageRef} position={[0, 2.5, 0]}>
        {[
          [0, 0.4, 0, 1.3],
          [-0.7, 0, 0.4, 0.9],
          [0.7, 0.1, -0.4, 1.0],
          [0, 0.8, -0.3, 0.8],
          [0.5, -0.2, 0.6, 0.85],
        ].map(([x, y, z, s], idx) => (
          <mesh key={idx} position={[x, y, z]}>
            <dodecahedronGeometry args={[s as number, 2]} />
            <meshStandardMaterial
              color={isLit ? '#fde047' : '#d97706'}
              emissive={isLit ? '#f59e0b' : '#78350f'}
              emissiveIntensity={isLit ? 1.8 : 0.6}
              roughness={0.2}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};

// Interactive 3D Diya (Lamp)
const InteractiveDiya = ({ isLit, onClick }: { isLit: boolean; onClick: () => void }) => {
  const diyaRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (diyaRef.current && isLit) {
      diyaRef.current.rotation.y = Math.sin(time * 2) * 0.05;
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    onClick();
  };

  return (
    <group
      ref={diyaRef}
      position={[0, -1.35, 1.5]}
      onClick={handleClick}
      onPointerOver={() => (document.body.style.cursor = 'pointer')}
      onPointerOut={() => (document.body.style.cursor = 'auto')}
    >
      {/* Brass Lamp Base */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.35, 0.25, 0.15, 24]} />
        <meshStandardMaterial color="#b45309" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Oil Pool */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.02, 24]} />
        <meshStandardMaterial color="#78350f" roughness={0.1} />
      </mesh>

      {/* Wick */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.12, 12]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* Flame when lit */}
      {isLit && (
        <group position={[0, 0.32, 0]}>
          <Float speed={5} rotationIntensity={0.2} floatIntensity={0.5}>
            <mesh>
              <coneGeometry args={[0.08, 0.3, 16]} />
              <meshStandardMaterial color="#fef08a" emissive="#f59e0b" emissiveIntensity={3} />
            </mesh>
          </Float>
          <pointLight intensity={5} color="#f59e0b" distance={8} />
        </group>
      )}
    </group>
  );
};

export const MagicalTreeScene: React.FC<MagicalTreeSceneProps> = ({ isLit, onLightDiya }) => {
  return (
    <div className="w-full h-[650px] relative rounded-3xl overflow-hidden border border-amber-500/30 bg-slate-950/90 shadow-2xl">
      <Canvas camera={{ position: [0, 0, 5.2], fov: 50 }}>
        <ambientLight intensity={isLit ? 1.2 : 0.4} />
        <directionalLight position={[0, 10, 5]} intensity={isLit ? 3 : 1} color="#fde047" />

        <MagicalTree isLit={isLit} />
        <InteractiveDiya isLit={isLit} onClick={onLightDiya} />

        {/* Floating Petals & Particles */}
        <Sparkles
          count={isLit ? 1000 : 300}
          scale={[10, 10, 10]}
          size={isLit ? 5 : 2.5}
          speed={isLit ? 0.8 : 0.3}
          color={isLit ? '#fef08a' : '#d97706'}
          opacity={0.85}
        />
      </Canvas>
    </div>
  );
};
