import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { createFootballTexture } from '../../utils/proceduralTextures';
import { FuturisticTunnel } from './FuturisticTunnel';

export type CinematicScenePhase =
  | 'scene-1-dark-intro'
  | 'scene-2-energy-particles'
  | 'scene-3-football-forming'
  | 'scene-4-tunnel-reveal';

interface CinematicFootballSceneProps {
  phase: CinematicScenePhase;
  progress: number; // 0 to 1 within the current phase
  reducedMotion?: boolean;
}

// Deterministic pseudo-random number generator
function createRand(initialSeed: number) {
  let seed = initialSeed;
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

// Pre-computed static buffer for Ambient Space Particles
const AMBIENT_COUNT = 300;
function createAmbientParticles() {
  const pos = new Float32Array(AMBIENT_COUNT * 3);
  const col = new Float32Array(AMBIENT_COUNT * 3);
  const electricBlue = new THREE.Color('#287BFF');
  const cosmicPurple = new THREE.Color('#8B5CF6');
  const iceBlue = new THREE.Color('#62C7FF');
  const white = new THREE.Color('#FFFFFF');
  const rand = createRand(1337);

  for (let i = 0; i < AMBIENT_COUNT; i++) {
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(rand() * 2 - 1);
    const r = 2.5 + rand() * 14;

    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i * 3 + 2] = r * Math.cos(phi);

    const choice = rand();
    let c = electricBlue;
    if (choice < 0.35) c = electricBlue;
    else if (choice < 0.7) c = cosmicPurple;
    else if (choice < 0.9) c = iceBlue;
    else c = white;

    col[i * 3] = c.r;
    col[i * 3 + 1] = c.g;
    col[i * 3 + 2] = c.b;
  }
  return { pos, col };
}
const STATIC_AMBIENT = createAmbientParticles();

// Pre-computed static buffer for Controlled Sparks
const SPARK_COUNT = 75;
function createSparkParticles() {
  const pos = new Float32Array(SPARK_COUNT * 3);
  const col = new Float32Array(SPARK_COUNT * 3);
  const c1 = new THREE.Color('#287BFF');
  const c2 = new THREE.Color('#8B5CF6');
  const c3 = new THREE.Color('#FFFFFF');
  const rand = createRand(9941);

  for (let i = 0; i < SPARK_COUNT; i++) {
    const u = rand();
    const v = rand();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = 1.1 + rand() * 0.9;

    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i * 3 + 2] = r * Math.cos(phi);

    const pick = rand();
    const chosen = pick < 0.5 ? c1 : pick < 0.8 ? c2 : c3;
    col[i * 3] = chosen.r;
    col[i * 3 + 1] = chosen.g;
    col[i * 3 + 2] = chosen.b;
  }
  return { pos, col };
}
const STATIC_SPARKS = createSparkParticles();

// Pre-computed static buffer for Converging Swarm
const CONVERGE_COUNT = 250;
function createConvergeParticles() {
  const pos = new Float32Array(CONVERGE_COUNT * 3);
  const col = new Float32Array(CONVERGE_COUNT * 3);
  const c1 = new THREE.Color('#287BFF');
  const c2 = new THREE.Color('#8B5CF6');
  const c3 = new THREE.Color('#FFFFFF');
  const rand = createRand(5521);

  for (let i = 0; i < CONVERGE_COUNT; i++) {
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(rand() * 2 - 1);
    const r = 7 + rand() * 7;

    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i * 3 + 2] = r * Math.cos(phi);

    const pick = rand();
    const chosen = pick < 0.4 ? c1 : pick < 0.8 ? c2 : c3;
    col[i * 3] = chosen.r;
    col[i * 3 + 1] = chosen.g;
    col[i * 3 + 2] = chosen.b;
  }
  return { pos, col };
}
const STATIC_CONVERGE = createConvergeParticles();

// 1. Ambient Background Particles
const AmbientSpaceParticles: React.FC<{
  phase: CinematicScenePhase;
  progress: number;
  reducedMotion?: boolean;
}> = ({ phase, progress, reducedMotion }) => {
  const pointsRef = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    if (!pointsRef.current || reducedMotion) return;
    const rotSpeed = phase === 'scene-4-tunnel-reveal' ? 0.35 : 0.08;
    pointsRef.current.rotation.y += delta * rotSpeed;
    pointsRef.current.rotation.x += delta * (rotSpeed * 0.4);
  });

  const particleOpacity =
    phase === 'scene-1-dark-intro'
      ? Math.min(0.65, 0.15 + progress * 0.45)
      : 0.75;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[STATIC_AMBIENT.pos, 3]} />
        <bufferAttribute attach="attributes-color" args={[STATIC_AMBIENT.col, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.085}
        vertexColors
        transparent
        opacity={particleOpacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

// 2. Central Pinpoint Light Core for Scene 1 (Dark Intro)
const CentralLightPoint: React.FC<{
  phase: CinematicScenePhase;
  progress: number;
}> = ({ phase, progress }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      const pulse = 1 + Math.sin(t * 8) * 0.15;
      meshRef.current.scale.setScalar(pulse);
    }
    if (lightRef.current) {
      const baseIntensity = phase === 'scene-1-dark-intro' ? 3 + progress * 6 : 8;
      lightRef.current.intensity = baseIntensity + Math.sin(t * 6) * 2;
    }
  });

  if (phase !== 'scene-1-dark-intro') return null;

  return (
    <group position={[0, 0, 0]}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.08, 24, 24]} />
        <meshBasicMaterial color="#62C7FF" />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshBasicMaterial
          color="#287BFF"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <pointLight ref={lightRef} color="#287BFF" distance={16} decay={2} />
    </group>
  );
};

// 3. Orbiting Energy Trails (Rings/Ribbons around the football)
const OrbitingEnergyTrails: React.FC<{
  active: boolean;
  speedMultiplier: number;
  reducedMotion?: boolean;
}> = ({ active, speedMultiplier, reducedMotion }) => {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!active || reducedMotion) return;
    const t = state.clock.getElapsedTime();
    const mult = speedMultiplier;

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = Math.PI / 3 + Math.sin(t * 1.5) * 0.15;
      ring1Ref.current.rotation.y += delta * 2.2 * mult;
      ring1Ref.current.rotation.z += delta * 0.8 * mult;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = -Math.PI / 4 + Math.cos(t * 1.8) * 0.12;
      ring2Ref.current.rotation.y -= delta * 2.6 * mult;
      ring2Ref.current.rotation.z += delta * 1.1 * mult;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = Math.PI / 6;
      ring3Ref.current.rotation.y += delta * 1.8 * mult;
      ring3Ref.current.rotation.z -= delta * 2.4 * mult;
    }
  });

  if (!active) return null;

  return (
    <group>
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.42, 0.026, 16, 80]} />
        <meshBasicMaterial
          color="#287BFF"
          transparent
          opacity={0.88}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[1.58, 0.024, 16, 80]} />
        <meshBasicMaterial
          color="#8B5CF6"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh ref={ring3Ref}>
        <torusGeometry args={[1.34, 0.018, 16, 80]} />
        <meshBasicMaterial
          color="#62C7FF"
          transparent
          opacity={0.75}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};

// 4. Controlled Sparks Emitter around the ball
const ControlledSparks: React.FC<{
  active: boolean;
  intensity: number;
  reducedMotion?: boolean;
}> = ({ active, intensity, reducedMotion }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const sparkPositions = useMemo(() => new Float32Array(STATIC_SPARKS.pos), []);

  useFrame((state, delta) => {
    if (!active || !pointsRef.current || reducedMotion) return;
    const t = state.clock.getElapsedTime();
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const posArray = posAttr.array as Float32Array;

    for (let i = 0; i < SPARK_COUNT; i++) {
      const idx = i * 3;
      posArray[idx] += Math.sin(t * 3 + i) * delta * 0.6 * intensity;
      posArray[idx + 1] += Math.cos(t * 3.5 + i) * delta * 0.6 * intensity;
      posArray[idx + 2] += Math.sin(t * 2.5 + i) * delta * 0.6 * intensity;

      const dist = Math.hypot(posArray[idx], posArray[idx + 1], posArray[idx + 2]);
      if (dist > 2.6 || dist < 1.05) {
        posArray[idx] = sparkPositions[idx];
        posArray[idx + 1] = sparkPositions[idx + 1];
        posArray[idx + 2] = sparkPositions[idx + 2];
      }
    }
    posAttr.needsUpdate = true;
  });

  if (!active) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[sparkPositions, 3]} />
        <bufferAttribute attach="attributes-color" args={[STATIC_SPARKS.col, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.065}
        vertexColors
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

// 5. Scene 2 (Energy Particles Converging) Swarm
const ConvergingEnergySwarm: React.FC<{
  active: boolean;
  progress: number;
}> = ({ active, progress }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const dynamicPos = useMemo(() => new Float32Array(STATIC_CONVERGE.pos), []);

  useFrame(() => {
    if (!active || !pointsRef.current) return;
    const attr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    // Particles converge into center
    const factor = Math.max(0.08, 1 - Math.pow(progress, 1.6));

    for (let i = 0; i < CONVERGE_COUNT; i++) {
      arr[i * 3] = STATIC_CONVERGE.pos[i * 3] * factor;
      arr[i * 3 + 1] = STATIC_CONVERGE.pos[i * 3 + 1] * factor;
      arr[i * 3 + 2] = STATIC_CONVERGE.pos[i * 3 + 2] * factor;
    }
    attr.needsUpdate = true;
  });

  if (!active) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[dynamicPos, 3]} />
        <bufferAttribute attach="attributes-color" args={[STATIC_CONVERGE.col, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.095}
        vertexColors
        transparent
        opacity={0.95}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

// 6. Realistic 3D Football Mesh
const Realistic3DFootball: React.FC<{
  phase: CinematicScenePhase;
  progress: number;
  reducedMotion?: boolean;
}> = ({ phase, progress, reducedMotion }) => {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useMemo(() => createFootballTexture(), []);

  useFrame((_, delta) => {
    if (!groupRef.current || !meshRef.current) return;

    if (phase === 'scene-1-dark-intro' || phase === 'scene-2-energy-particles') {
      groupRef.current.scale.set(0, 0, 0);
      return;
    }

    if (phase === 'scene-3-football-forming') {
      // Emerges and crystallizes in center
      const scaleEase = THREE.MathUtils.smoothstep(progress, 0, 0.85);
      const currentScale = 0.05 + scaleEase * 0.95;
      groupRef.current.scale.setScalar(currentScale);
      groupRef.current.position.set(0, 0, 0);

      if (!reducedMotion) {
        meshRef.current.rotation.x += delta * 1.2;
        meshRef.current.rotation.y += delta * 1.6;
        meshRef.current.rotation.z += delta * 0.6;
      }
    } else if (phase === 'scene-4-tunnel-reveal') {
      // Hovering perfectly framed in the center of the futuristic tunnel corridor
      groupRef.current.scale.setScalar(0.72);
      groupRef.current.position.set(0, 0, 0);

      if (!reducedMotion) {
        meshRef.current.rotation.x += delta * 1.5;
        meshRef.current.rotation.y += delta * 2.0;
        meshRef.current.rotation.z += delta * 0.8;
      }
    }
  });

  const isVisible =
    phase === 'scene-3-football-forming' || phase === 'scene-4-tunnel-reveal';
  const glowIntensity = phase === 'scene-4-tunnel-reveal' ? 2.2 : 1.2;

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhysicalMaterial
          map={texture}
          roughness={0.22}
          metalness={0.15}
          clearcoat={0.45}
          clearcoatRoughness={0.12}
          emissive={new THREE.Color('#287BFF')}
          emissiveIntensity={0.28 * glowIntensity}
        />
      </mesh>

      <OrbitingEnergyTrails
        active={isVisible}
        speedMultiplier={phase === 'scene-4-tunnel-reveal' ? 2.2 : 1.0}
        reducedMotion={reducedMotion}
      />

      <ControlledSparks
        active={isVisible}
        intensity={phase === 'scene-4-tunnel-reveal' ? 2.0 : 1.0}
        reducedMotion={reducedMotion}
      />
    </group>
  );
};

// 7. Dynamic World Motion Group for Tunnel Corridor Flight
const WorldMotionGroup: React.FC<{
  phase: CinematicScenePhase;
  progress: number;
  reducedMotion?: boolean;
  children: React.ReactNode;
}> = ({ phase, progress, reducedMotion, children }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    if (phase === 'scene-4-tunnel-reveal' && !reducedMotion) {
      groupRef.current.position.z = THREE.MathUtils.lerp(-1.5, 1.2, progress);
      groupRef.current.position.y = THREE.MathUtils.lerp(-0.35, 0.05, progress);
    } else {
      groupRef.current.position.set(0, 0, 0);
    }
  });

  return <group ref={groupRef}>{children}</group>;
};

// 8. Dynamic Lighting Rig
const CinematicLighting: React.FC<{
  phase: CinematicScenePhase;
  progress: number;
}> = ({ phase, progress }) => {
  const keyIntensity =
    phase === 'scene-1-dark-intro'
      ? 1
      : phase === 'scene-2-energy-particles'
      ? 6
      : phase === 'scene-3-football-forming'
      ? 16 * THREE.MathUtils.smoothstep(progress, 0, 0.7)
      : 24;

  const rimIntensity =
    phase === 'scene-4-tunnel-reveal' ? 36 : 22;

  return (
    <>
      <ambientLight color="#070C1A" intensity={0.4} />

      <spotLight
        position={[4, 6, 5]}
        angle={0.5}
        penumbra={0.7}
        intensity={keyIntensity}
        color="#cbe5ff"
        castShadow
      />

      <spotLight
        position={[-5, 4, -4]}
        angle={0.65}
        penumbra={0.8}
        intensity={rimIntensity}
        color="#287BFF"
      />

      <pointLight position={[0, -4, 2]} intensity={10} color="#8B5CF6" distance={16} />
      <pointLight position={[0, 0, 0]} intensity={20} color="#287BFF" distance={22} decay={2} />
    </>
  );
};

export const CinematicFootballScene: React.FC<CinematicFootballSceneProps> = ({
  phase,
  progress,
  reducedMotion = false,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 2,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 42 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <CinematicLighting phase={phase} progress={progress} />

        <WorldMotionGroup phase={phase} progress={progress} reducedMotion={reducedMotion}>
          {/* Scene 4: Futuristic Sports Tunnel */}
          {phase === 'scene-4-tunnel-reveal' && (
            <FuturisticTunnel progress={progress} reducedMotion={reducedMotion} />
          )}

          {/* Ambient background particles */}
          <AmbientSpaceParticles phase={phase} progress={progress} reducedMotion={reducedMotion} />

          {/* Scene 1: Pinpoint Light Core */}
          <CentralLightPoint phase={phase} progress={progress} />

          {/* Scene 2: Converging Energy Swarm */}
          <ConvergingEnergySwarm
            active={phase === 'scene-2-energy-particles'}
            progress={progress}
          />

          {/* Scene 3 & 4: 3D Football with Energy Trails & Sparks */}
          <Realistic3DFootball
            phase={phase}
            progress={progress}
            reducedMotion={reducedMotion}
          />
        </WorldMotionGroup>
      </Canvas>
    </div>
  );
};
