import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface CentralEnergyCoreProps {
  active: boolean;
  intensity?: number;
  shockwaveScale?: number;
}

export const CentralEnergyCore: React.FC<CentralEnergyCoreProps> = ({
  active,
  intensity = 1,
  shockwaveScale = 0,
}) => {
  const outerCageRef = useRef<THREE.Mesh>(null);
  const innerCoreRef = useRef<THREE.Mesh>(null);
  const shockwaveRef = useRef<THREE.Mesh>(null);
  const shockwave2Ref = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (outerCageRef.current && active) {
      outerCageRef.current.rotation.y += delta * 4.2;
      outerCageRef.current.rotation.x += delta * 2.2;
      const s = (1 + Math.sin(t * 14) * 0.12) * intensity;
      outerCageRef.current.scale.set(s, s, s);
    }
    if (innerCoreRef.current && active) {
      innerCoreRef.current.rotation.y -= delta * 5.0;
      innerCoreRef.current.rotation.z += delta * 3.0;
    }
  });

  if (!active && shockwaveScale === 0) return null;

  return (
    <group position={[0, 0, 0]}>
      {active && (
        <>
          {/* Outer Rotating Cosmic Geodesic Plasma Cage (Electric Blue #287BFF) */}
          <mesh ref={outerCageRef}>
            <icosahedronGeometry args={[0.75, 2]} />
            <meshStandardMaterial
              color="#287BFF"
              emissive="#287BFF"
              emissiveIntensity={3.8 * intensity}
              wireframe
              transparent
              opacity={0.88}
            />
          </mesh>

          {/* Inner High-Density Plasma Core (Cosmic Purple #8B5CF6) */}
          <mesh ref={innerCoreRef}>
            <octahedronGeometry args={[0.42, 1]} />
            <meshBasicMaterial
              color="#8B5CF6"
              wireframe
              transparent
              opacity={0.92}
            />
          </mesh>

          {/* Super-Brilliant White/Ice Nucleus (#62C7FF / #FFFFFF) */}
          <mesh>
            <sphereGeometry args={[0.3, 32, 32]} />
            <meshBasicMaterial
              color="#FFFFFF"
              transparent
              opacity={0.96 * Math.min(intensity, 1)}
            />
          </mesh>

          {/* Dynamic Point Light Illuminating Midnight Arena */}
          <pointLight
            color="#287BFF"
            intensity={20 * intensity}
            distance={34}
            decay={2}
          />
          <pointLight
            color="#8B5CF6"
            intensity={10 * intensity}
            distance={20}
            decay={2}
          />
        </>
      )}

      {/* Primary Expanding Shockwave Ring (Electric Blue) */}
      {shockwaveScale > 0 && (
        <>
          <mesh
            ref={shockwaveRef}
            rotation={[Math.PI / 2, 0, 0]}
            scale={[shockwaveScale, shockwaveScale, shockwaveScale]}
          >
            <ringGeometry args={[0.96, 1.05, 64]} />
            <meshBasicMaterial
              color="#287BFF"
              transparent
              opacity={Math.max(0, 1 - shockwaveScale / 15)}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Secondary Trailing Shockwave Ring (Cosmic Purple) */}
          <mesh
            ref={shockwave2Ref}
            rotation={[Math.PI / 2, 0, 0]}
            scale={[shockwaveScale * 0.72, shockwaveScale * 0.72, shockwaveScale * 0.72]}
          >
            <ringGeometry args={[0.95, 1.02, 64]} />
            <meshBasicMaterial
              color="#8B5CF6"
              transparent
              opacity={Math.max(0, 0.85 - shockwaveScale / 12)}
              side={THREE.DoubleSide}
            />
          </mesh>
        </>
      )}
    </group>
  );
};
