import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { createBasketballTexture } from '../../utils/proceduralTextures';

interface BasketballProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  glowIntensity?: number;
}

export const BasketballModel: React.FC<BasketballProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  glowIntensity = 1,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useMemo(() => createBasketballTexture(), []);

  useFrame((_, delta) => {
    if (meshRef.current) {
      // Classic backspin and rotational arc
      meshRef.current.rotation.x += delta * 2.6;
      meshRef.current.rotation.y += delta * 2.9;
      meshRef.current.rotation.z += delta * 0.8;
    }
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <sphereGeometry args={[1.04, 64, 64]} />
        <meshPhysicalMaterial
          map={texture}
          roughness={0.48}
          metalness={0.06}
          clearcoat={0.2}
          clearcoatRoughness={0.25}
          emissive={new THREE.Color('#ff4500')}
          emissiveIntensity={0.08 * glowIntensity}
        />
      </mesh>
    </group>
  );
};
