import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles, Line } from '@react-three/drei';
import * as THREE from 'three';

// 3D Constellation forming "10 B"
const Constellation10B = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(time * 0.2) * 0.08;
    }
  });

  // Key star points for "1"
  const points1: [number, number, number][] = [
    [-2.2, 1.2, 0],
    [-1.8, 1.6, 0],
    [-1.8, -1.2, 0],
  ];

  // Key star points for "0"
  const points0: [number, number, number][] = [
    [-0.8, 1.4, 0],
    [0.1, 1.4, 0],
    [0.3, 0.2, 0],
    [0.3, -0.8, 0],
    [0.1, -1.4, 0],
    [-0.8, -1.4, 0],
    [-1.0, -0.8, 0],
    [-1.0, 0.2, 0],
    [-0.8, 1.4, 0],
  ];

  // Key star points for "B"
  const pointsB: [number, number, number][] = [
    [1.2, -1.4, 0],
    [1.2, 1.4, 0],
    [2.1, 1.2, 0],
    [2.2, 0.4, 0],
    [1.2, 0.1, 0],
    [2.3, -0.2, 0],
    [2.2, -1.2, 0],
    [1.2, -1.4, 0],
  ];

  const allPoints = [...points1, ...points0, ...pointsB];

  return (
    <group ref={groupRef}>
      {/* Animated Glowing Lines */}
      <Line points={points1} color="#fef08a" lineWidth={3} />
      <Line points={points0} color="#f59e0b" lineWidth={3} />
      <Line points={pointsB} color="#fde047" lineWidth={3} />

      {/* Bright Star Nodes at Vertices */}
      {allPoints.map((pt, idx) => (
        <group key={idx} position={pt}>
          <mesh>
            <sphereGeometry args={[0.09, 12, 12]} />
            <meshStandardMaterial color="#fef08a" emissive="#f59e0b" emissiveIntensity={2.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

export const ClassConstellationScene: React.FC = () => {
  return (
    <div className="w-full h-[500px] relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-950/90 shadow-2xl">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 0, 2]} intensity={2} color="#fef08a" />

        <Constellation10B />

        {/* Fireflies & Starry Background */}
        <Sparkles count={1200} scale={[15, 12, 10]} size={2.5} speed={0.2} color="#ffffff" opacity={0.7} />
        <Sparkles count={200} scale={[10, 8, 8]} size={5} speed={0.6} color="#f59e0b" opacity={0.9} />
      </Canvas>
    </div>
  );
};
