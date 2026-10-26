import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface FuturisticTunnelProps {
  progress: number; // 0 to 1
  reducedMotion?: boolean;
}

export const FuturisticTunnel: React.FC<FuturisticTunnelProps> = ({
  progress,
  reducedMotion = false,
}) => {
  const tunnelGroupRef = useRef<THREE.Group>(null);

  // Portal arch frames down the corridor
  const arches = [-22, -18, -14, -10, -6, -2, 2, 6, 10, 14, 18];

  useFrame(() => {
    if (!tunnelGroupRef.current || reducedMotion) return;
    tunnelGroupRef.current.position.z = THREE.MathUtils.lerp(2, -2, progress);
  });

  return (
    <group ref={tunnelGroupRef}>
      {/* 1. Reflective Wet Arena Gloss Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.4, 0]} receiveShadow>
        <planeGeometry args={[14, 60]} />
        <meshStandardMaterial
          color="#060A16"
          roughness={0.14}
          metalness={0.88}
        />
      </mesh>

      {/* Floor Guide Lines (Electric Blue Neon Lines on Floor) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2.4, -2.38, 0]}>
        <planeGeometry args={[0.08, 60]} />
        <meshBasicMaterial color="#287BFF" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2.4, -2.38, 0]}>
        <planeGeometry args={[0.08, 60]} />
        <meshBasicMaterial color="#287BFF" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.38, 0]}>
        <planeGeometry args={[0.04, 60]} />
        <meshBasicMaterial color="#8B5CF6" transparent opacity={0.6} />
      </mesh>

      {/* 2. Ceiling Structure with Continuous Neon Light Strips */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 2.8, 0]}>
        <planeGeometry args={[14, 60]} />
        <meshStandardMaterial color="#050814" roughness={0.6} metalness={0.5} />
      </mesh>

      {/* Overhead Central Neon Strip Lights */}
      <mesh position={[-0.8, 2.76, 0]}>
        <boxGeometry args={[0.12, 0.05, 60]} />
        <meshBasicMaterial color="#62C7FF" />
      </mesh>
      <mesh position={[0.8, 2.76, 0]}>
        <boxGeometry args={[0.12, 0.05, 60]} />
        <meshBasicMaterial color="#62C7FF" />
      </mesh>
      <mesh position={[0, 2.77, 0]}>
        <boxGeometry args={[0.2, 0.04, 60]} />
        <meshBasicMaterial color="#287BFF" />
      </mesh>

      {/* 3. Left Wall */}
      <mesh position={[-3.8, 0.2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[60, 5.6]} />
        <meshStandardMaterial color="#080C1B" roughness={0.4} metalness={0.7} />
      </mesh>

      {/* 4. Right Wall */}
      <mesh position={[3.8, 0.2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[60, 5.6]} />
        <meshStandardMaterial color="#080C1B" roughness={0.4} metalness={0.7} />
      </mesh>

      {/* 5. Architectural Portals / Rib Arches */}
      {arches.map((zPos) => (
        <group key={zPos} position={[0, 0, zPos]}>
          {/* Left Column Rib */}
          <mesh position={[-3.65, 0.2, 0]}>
            <boxGeometry args={[0.25, 5.2, 0.35]} />
            <meshStandardMaterial color="#0c142c" roughness={0.3} metalness={0.8} />
          </mesh>
          {/* Left Neon Edge */}
          <mesh position={[-3.5, 0.2, 0]}>
            <boxGeometry args={[0.04, 5.1, 0.04]} />
            <meshBasicMaterial color="#8B5CF6" />
          </mesh>

          {/* Right Column Rib */}
          <mesh position={[3.65, 0.2, 0]}>
            <boxGeometry args={[0.25, 5.2, 0.35]} />
            <meshStandardMaterial color="#0c142c" roughness={0.3} metalness={0.8} />
          </mesh>
          {/* Right Neon Edge */}
          <mesh position={[3.5, 0.2, 0]}>
            <boxGeometry args={[0.04, 5.1, 0.04]} />
            <meshBasicMaterial color="#8B5CF6" />
          </mesh>

          {/* Overhead Transverse Beam */}
          <mesh position={[0, 2.7, 0]}>
            <boxGeometry args={[7.3, 0.22, 0.35]} />
            <meshStandardMaterial color="#0c142c" roughness={0.3} metalness={0.8} />
          </mesh>

          {/* Transverse Overhead Neon Tube */}
          <mesh position={[0, 2.58, 0]}>
            <boxGeometry args={[6.8, 0.05, 0.05]} />
            <meshBasicMaterial color="#287BFF" />
          </mesh>
        </group>
      ))}

      {/* Dynamic Tunnel Point Lights illuminating the corridor */}
      <pointLight position={[0, 1.8, 2]} color="#287BFF" intensity={18} distance={20} decay={2} />
      <pointLight position={[0, 1.8, -8]} color="#8B5CF6" intensity={14} distance={22} decay={2} />
      <pointLight position={[0, -1.8, 0]} color="#62C7FF" intensity={12} distance={15} decay={2} />
    </group>
  );
};
