import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// Procedural 3D Lotus Model with Blooming Petals
const BloomingLotus = () => {
  const lotusGroup = useRef<THREE.Group>(null);
  const petalsRef = useRef<THREE.Group[]>([]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Gentle floating rotation
    if (lotusGroup.current) {
      lotusGroup.current.rotation.y = time * 0.15;
      lotusGroup.current.position.y = Math.sin(time * 0.8) * 0.1;
    }

    // Blooming animation calculation (opening angle 0 -> max angle)
    const bloomProgress = Math.min(1, Math.max(0, (time - 0.5) * 0.4));
    petalsRef.current.forEach((group, idx) => {
      if (group) {
        const tier = Math.floor(idx / 8);
        const targetRotX = (0.5 + tier * 0.25) * bloomProgress;
        group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, targetRotX, 0.05);
      }
    });
  });

  // Generate 3 tiers of 8 petals each
  const petalTiers = [
    { count: 8, scale: [0.35, 0.9, 0.08], color: '#fdba74', emissive: '#f59e0b', emissiveInt: 0.3 },
    { count: 8, scale: [0.45, 1.2, 0.08], color: '#f472b6', emissive: '#db2777', emissiveInt: 0.2 },
    { count: 8, scale: [0.55, 1.5, 0.08], color: '#fb7185', emissive: '#e11d48', emissiveInt: 0.2 },
  ];

  let totalPetalIdx = 0;

  return (
    <group ref={lotusGroup} position={[0, -0.8, 0]}>
      {/* Central Glowing Stamen */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.35, 0.2, 0.3, 16]} />
        <meshStandardMaterial
          color="#fef08a"
          emissive="#eab308"
          emissiveIntensity={1.2}
          roughness={0.2}
        />
      </mesh>

      {/* Tiny golden stamen threads */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i / 24) * Math.PI * 2;
        const radius = 0.25 + (i % 2) * 0.08;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * radius, 0.45, Math.sin(angle) * radius]}
            rotation={[0.1, angle, 0]}
          >
            <cylinderGeometry args={[0.015, 0.01, 0.25, 8]} />
            <meshStandardMaterial color="#fef08a" emissive="#f59e0b" emissiveIntensity={1.5} />
          </mesh>
        );
      })}

      {/* Petals */}
      {petalTiers.map((tier, tierIdx) => {
        return Array.from({ length: tier.count }).map((_, pIdx) => {
          const currentIdx = totalPetalIdx++;
          const angle = (pIdx / tier.count) * Math.PI * 2 + (tierIdx * Math.PI) / 8;

          return (
            <group
              key={`${tierIdx}-${pIdx}`}
              rotation={[0, angle, 0]}
              position={[0, 0.15 + tierIdx * 0.05, 0]}
            >
              <group
                ref={(el) => {
                  if (el) petalsRef.current[currentIdx] = el;
                }}
              >
                {/* Petal Geometry */}
                <mesh position={[0, tier.scale[1] / 2, 0]}>
                  <sphereGeometry args={[tier.scale[0], 16, 16]} />
                  <meshPhysicalMaterial
                    color={tier.color}
                    emissive={tier.emissive}
                    emissiveIntensity={tier.emissiveInt}
                    roughness={0.2}
                    metalness={0.1}
                    transmission={0.4}
                    thickness={0.5}
                    clearcoat={0.8}
                  />
                </mesh>
              </group>
            </group>
          );
        });
      })}

      {/* Lotus Pad / Leaf at base */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.2, 32]} />
        <meshStandardMaterial color="#065f46" roughness={0.5} />
      </mesh>
    </group>
  );
};

// Golden Sunrise God Rays & Floating Particles
const GodRaysAndParticles = () => {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[0, 10, -5]} intensity={2.5} color="#fef08a" />
      <pointLight position={[0, 2, 0]} intensity={3} color="#f59e0b" distance={10} />

      {/* Golden Particle Swarm */}
      <Sparkles
        count={300}
        scale={[12, 8, 12]}
        size={4}
        speed={0.6}
        color="#fef08a"
        opacity={0.8}
      />
      <Sparkles
        count={150}
        scale={[8, 6, 8]}
        size={7}
        speed={0.4}
        color="#f59e0b"
        opacity={0.9}
      />
    </>
  );
};

export const HeroLotusScene: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 1.2, 4.5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <GodRaysAndParticles />
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
          <BloomingLotus />
        </Float>
      </Canvas>
    </div>
  );
};
