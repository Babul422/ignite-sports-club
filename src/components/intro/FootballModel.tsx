import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { createFootballTexture } from '../../utils/proceduralTextures';

interface FootballProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  glowIntensity?: number;
}

export const FootballModel: React.FC<FootballProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  glowIntensity = 1,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useMemo(() => createFootballTexture(), []);

  useFrame((_, delta) => {
    if (meshRef.current) {
      // Natural athletic forward tumble & spin
      meshRef.current.rotation.x += delta * 2.4;
      meshRef.current.rotation.y += delta * 2.8;
      meshRef.current.rotation.z += delta * 1.1;
    }
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhysicalMaterial
          map={texture}
          roughness={0.24}
          metalness={0.12}
          clearcoat={0.4}
          clearcoatRoughness={0.15}
          emissive={new THREE.Color('#287BFF')}
          emissiveIntensity={0.15 * glowIntensity}
        />
      </mesh>
    </group>
  );
};
