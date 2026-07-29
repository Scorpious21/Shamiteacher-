import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// Procedural 3D Atom
const AtomMesh = ({ position }: { position: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);
  const ring1 = useRef<THREE.Group>(null);
  const ring2 = useRef<THREE.Group>(null);
  const ring3 = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.3;
    if (ring1.current) ring1.current.rotation.z += delta * 1.5;
    if (ring2.current) ring2.current.rotation.x += delta * 1.2;
    if (ring3.current) ring3.current.rotation.y += delta * 1.8;
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Nucleus */}
      <mesh>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={1.5} />
      </mesh>

      {/* Electron Orbit 1 */}
      <group ref={ring1} rotation={[0.5, 0, 0]}>
        <mesh>
          <torusGeometry args={[0.8, 0.02, 16, 32]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={1} />
        </mesh>
        <mesh position={[0.8, 0, 0]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color="#e0f2fe" emissive="#38bdf8" emissiveIntensity={2} />
        </mesh>
      </group>

      {/* Electron Orbit 2 */}
      <group ref={ring2} rotation={[-0.5, 0.8, 0]}>
        <mesh>
          <torusGeometry args={[0.85, 0.02, 16, 32]} />
          <meshStandardMaterial color="#a855f7" emissive="#7e22ce" emissiveIntensity={1} />
        </mesh>
        <mesh position={[0, 0.85, 0]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color="#f3e8ff" emissive="#c084fc" emissiveIntensity={2} />
        </mesh>
      </group>

      {/* Electron Orbit 3 */}
      <group ref={ring3} rotation={[0, -0.8, 0.8]}>
        <mesh>
          <torusGeometry args={[0.9, 0.02, 16, 32]} />
          <meshStandardMaterial color="#34d399" emissive="#059669" emissiveIntensity={1} />
        </mesh>
        <mesh position={[0, -0.9, 0]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color="#ecfdf5" emissive="#34d399" emissiveIntensity={2} />
        </mesh>
      </group>
    </group>
  );
};

// Procedural 3D DNA Double Helix
const DNAMesh = ({ position }: { position: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.4;
  });

  const basePairs = 10;
  return (
    <group ref={groupRef} position={position}>
      {Array.from({ length: basePairs }).map((_, i) => {
        const y = (i - basePairs / 2) * 0.22;
        const angle = i * 0.5;
        const radius = 0.5;
        const x1 = Math.cos(angle) * radius;
        const z1 = Math.sin(angle) * radius;
        const x2 = -x1;
        const z2 = -z1;

        return (
          <group key={i} position={[0, y, 0]}>
            {/* Strand 1 Sphere */}
            <mesh position={[x1, 0, z1]}>
              <sphereGeometry args={[0.09, 12, 12]} />
              <meshStandardMaterial color="#f43f5e" emissive="#be123c" emissiveIntensity={1.2} />
            </mesh>
            {/* Strand 2 Sphere */}
            <mesh position={[x2, 0, z2]}>
              <sphereGeometry args={[0.09, 12, 12]} />
              <meshStandardMaterial color="#06b6d4" emissive="#0e7490" emissiveIntensity={1.2} />
            </mesh>
            {/* Connecting rung */}
            <mesh position={[0, 0, 0]} rotation={[0, -angle, 0]}>
              <boxGeometry args={[radius * 2, 0.03, 0.03]} />
              <meshStandardMaterial color="#fef08a" emissive="#eab308" emissiveIntensity={0.8} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

// Procedural 3D Molecule
const MoleculeMesh = ({ position }: { position: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.x += delta * 0.2;
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial color="#e11d48" emissive="#be123c" emissiveIntensity={1} />
      </mesh>
      {[
        [0.6, 0.4, 0],
        [-0.6, 0.4, 0],
        [0, -0.6, 0.5],
      ].map((pos, i) => (
        <group key={i}>
          <mesh position={pos as [number, number, number]}>
            <sphereGeometry args={[0.2, 12, 12]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={1} />
          </mesh>
          {/* Bond cylinder */}
          <line>
            <bufferGeometry attach="geometry" {...new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(...pos)])} />
            <lineBasicMaterial attach="material" color="#cbd5e1" linewidth={2} />
          </line>
        </group>
      ))}
    </group>
  );
};

// Procedural 3D Ringed Planet
const PlanetMesh = ({ position }: { position: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.2;
  });

  return (
    <group ref={groupRef} position={position} rotation={[0.4, 0, 0.2]}>
      <mesh>
        <sphereGeometry args={[0.5, 24, 24]} />
        <meshStandardMaterial color="#f59e0b" emissive="#b45309" emissiveIntensity={0.6} roughness={0.3} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.65, 0.95, 32]} />
        <meshStandardMaterial color="#fde047" emissive="#ca8a04" emissiveIntensity={0.8} side={THREE.DoubleSide} transparent opacity={0.85} />
      </mesh>
    </group>
  );
};

// Procedural 3D Laboratory Flask
const FlaskMesh = ({ position }: { position: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.25;
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Glass Body */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.1, 0.45, 0.7, 16]} />
        <meshPhysicalMaterial color="#38bdf8" transmission={0.9} roughness={0.1} thickness={0.3} transparent opacity={0.6} />
      </mesh>
      {/* Liquid inside */}
      <mesh position={[0, -0.25, 0]}>
        <cylinderGeometry args={[0.1, 0.4, 0.35, 16]} />
        <meshStandardMaterial color="#a855f7" emissive="#7e22ce" emissiveIntensity={1.2} />
      </mesh>
    </group>
  );
};

// Glowing Winding Pathway
const WindingPath = () => {
  const points: THREE.Vector3[] = [];
  for (let i = -8; i <= 8; i += 0.5) {
    points.push(new THREE.Vector3(Math.sin(i * 0.8) * 1.8, -1, -i));
  }
  const curve = new THREE.CatmullRomCurve3(points);

  return (
    <mesh>
      <tubeGeometry args={[curve, 64, 0.12, 12, false]} />
      <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={1.8} />
    </mesh>
  );
};

export const SciencePathwayScene: React.FC = () => {
  return (
    <div className="w-full h-[550px] relative">
      <Canvas camera={{ position: [0, 1, 6], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 8, 5]} intensity={2} color="#fef08a" />
        <pointLight position={[0, 0, 0]} intensity={2} color="#f59e0b" />

        <WindingPath />

        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
          <AtomMesh position={[-2.2, 1.2, 1]} />
        </Float>
        <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.6}>
          <DNAMesh position={[2.2, 0.8, 0]} />
        </Float>
        <Float speed={2.2} rotationIntensity={0.6} floatIntensity={0.7}>
          <MoleculeMesh position={[-1.8, -0.5, -2]} />
        </Float>
        <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
          <PlanetMesh position={[2.0, -0.8, -3]} />
        </Float>
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
          <FlaskMesh position={[0, 1.6, -2]} />
        </Float>

        <Sparkles count={250} scale={[10, 8, 12]} size={3} speed={0.5} color="#fef08a" />
      </Canvas>
    </div>
  );
};
