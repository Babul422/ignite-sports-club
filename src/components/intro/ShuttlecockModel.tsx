import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface ShuttlecockProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  glowIntensity?: number;
}

export const ShuttlecockModel: React.FC<ShuttlecockProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  glowIntensity = 1,
}) => {
  const groupRef = useRef<THREE.Group>(null);

  // 16 overlapping aerodynamic feathers arranged symmetrically in a cone
  const feathers = useMemo(() => {
    const list = [];
    const count = 16;
    const radiusBase = 0.42;
    const radiusTop = 1.05;
    const height = 1.6;

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x1 = Math.cos(angle) * radiusBase;
      const z1 = Math.sin(angle) * radiusBase;
      const x2 = Math.cos(angle + 0.18) * radiusTop; // Overlapping aerodynamic pitch
      const z2 = Math.sin(angle + 0.18) * radiusTop;

      list.push({
        id: i,
        pos: [(x1 + x2) / 2, height / 2, (z1 + z2) / 2] as [number, number, number],
        quillStart: [x1, 0, z1] as [number, number, number],
        quillEnd: [x2, height, z2] as [number, number, number],
        angle,
      });
    }
    return list;
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      // Rapid aerodynamic axial spin
      groupRef.current.rotation.y += delta * 4.2;
    }
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Shuttlecock angled with cork head leading aerodynamic flight path */}
      <group ref={groupRef} rotation={[Math.PI * 0.7, 0, -Math.PI * 0.25]}>
        {/* Rounded Natural White/Cream Cork Dome */}
        <mesh position={[0, -0.22, 0]} castShadow>
          <sphereGeometry args={[0.44, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial
            color="#f4f0e6"
            roughness={0.65}
            metalness={0.02}
          />
        </mesh>

        {/* Cork Flat Face Top */}
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.44, 32]} />
          <meshStandardMaterial color="#ebe6d8" roughness={0.7} />
        </mesh>

        {/* Electric-Blue / Cosmic Athletic Collar Ribbon */}
        <mesh position={[0, -0.05, 0]}>
          <cylinderGeometry args={[0.442, 0.442, 0.08, 32]} />
          <meshStandardMaterial
            color="#287BFF"
            emissive={new THREE.Color('#287BFF')}
            emissiveIntensity={0.4 * glowIntensity}
            roughness={0.25}
          />
        </mesh>

        {/* 16 Overlapping White Feather Blades */}
        {feathers.map((f) => (
          <group key={f.id}>
            {/* Feather Vane (Surface) */}
            <mesh
              position={f.pos}
              rotation={[0, -f.angle, 0.32]}
              castShadow
            >
              <planeGeometry args={[0.26, 1.55]} />
              <meshStandardMaterial
                color="#ffffff"
                roughness={0.38}
                side={THREE.DoubleSide}
                transparent
                opacity={0.94}
              />
            </mesh>

            {/* Central Feather Quill Stem (Shaft) */}
            <mesh
              position={f.pos}
              rotation={[0, -f.angle, 0.32]}
            >
              <cylinderGeometry args={[0.012, 0.016, 1.58, 8]} />
              <meshStandardMaterial color="#f0efe8" roughness={0.3} />
            </mesh>
          </group>
        ))}

        {/* Lower Thread Binding Ring */}
        <mesh position={[0, 0.58, 0]}>
          <torusGeometry args={[0.62, 0.016, 12, 36]} />
          <meshBasicMaterial color="#62C7FF" />
        </mesh>

        {/* Upper Thread Binding Ring */}
        <mesh position={[0, 1.15, 0]}>
          <torusGeometry args={[0.88, 0.018, 12, 36]} />
          <meshBasicMaterial color="#8B5CF6" />
        </mesh>
      </group>
    </group>
  );
};
