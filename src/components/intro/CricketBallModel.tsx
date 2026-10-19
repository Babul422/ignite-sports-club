import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { createCricketSeamTexture } from '../../utils/proceduralTextures';

interface CricketBallProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  glowIntensity?: number;
}

export const CricketBallModel: React.FC<CricketBallProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  glowIntensity = 1,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const seamTexture = useMemo(() => createCricketSeamTexture(), []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      // Authentic seam-aligned gyro spin
      groupRef.current.rotation.x += delta * 3.6;
      groupRef.current.rotation.y += delta * 1.8;
      groupRef.current.rotation.z += delta * 2.6;
    }
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <group ref={groupRef}>
        {/* Glossy Lacquered Oxblood Leather Shell */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.9, 64, 64]} />
          <meshPhysicalMaterial
            color="#7a0512"
            roughness={0.16}
            metalness={0.08}
            clearcoat={1.0}
            clearcoatRoughness={0.08}
            emissive={new THREE.Color('#380006')}
            emissiveIntensity={0.25 * glowIntensity}
          />
        </mesh>

        {/* Raised Equatorial Stitched Seam Band */}
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.92, 0.92, 0.14, 64]} />
          <meshStandardMaterial
            map={seamTexture}
            roughness={0.32}
            metalness={0.04}
          />
        </mesh>

        {/* High-tension stitch cord edges */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.918, 0.022, 16, 64]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        {/* Subtle electric-green energy ring highlight when charging */}
        {glowIntensity > 1.2 && (
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.94, 0.015, 12, 48]} />
            <meshBasicMaterial color="#62C7FF" transparent opacity={0.7} />
          </mesh>
        )}
      </group>
    </group>
  );
};
