import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { FootballModel } from './FootballModel';
import { CricketBallModel } from './CricketBallModel';
import { BasketballModel } from './BasketballModel';
import { ShuttlecockModel } from './ShuttlecockModel';
import { CentralEnergyCore } from './CentralEnergyCore';

export interface SportsPositionsState {
  football: [number, number, number];
  footballScale: number;
  cricket: [number, number, number];
  cricketScale: number;
  basketball: [number, number, number];
  basketballScale: number;
  shuttlecock: [number, number, number];
  shuttlecockScale: number;
  coreActive: boolean;
  coreIntensity: number;
  shockwaveScale: number;
  cameraZ: number;
  cameraY: number;
}

interface SportsSceneProps {
  sportsState: SportsPositionsState;
  reducedMotion?: boolean;
}

// Deterministic pseudorandom generator for cosmic stadium particles
function createSeededParticles(count: number) {
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const electricBlue = new THREE.Color('#287BFF');
  const cosmicPurple = new THREE.Color('#8B5CF6');
  const iceBlue = new THREE.Color('#62C7FF');
  const white = new THREE.Color('#FFFFFF');

  let seed = 42;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let i = 0; i < count; i++) {
    pos[i * 3] = (rand() - 0.5) * 36;
    pos[i * 3 + 1] = (rand() - 0.5) * 24;
    pos[i * 3 + 2] = (rand() - 0.5) * 30;

    const rVal = rand();
    let c = white;
    if (rVal < 0.35) c = electricBlue;
    else if (rVal < 0.65) c = cosmicPurple;
    else if (rVal < 0.85) c = iceBlue;

    col[i * 3] = c.r;
    col[i * 3 + 1] = c.g;
    col[i * 3 + 2] = c.b;
  }
  return { pos, col };
}

const STATIC_PARTICLES = createSeededParticles(350);

// Atmospheric Cosmic Particles
const StadiumParticles: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.04;
      pointsRef.current.rotation.x += delta * 0.015;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[STATIC_PARTICLES.pos, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[STATIC_PARTICLES.col, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.09}
        vertexColors
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Cyber Stadium Grid Arena Floor (Midnight & Navy with Electric Blue Grid)
const StadiumArenaGrid: React.FC = () => {
  return (
    <group position={[0, -4.5, 0]}>
      {/* Primary Electric Blue Grid */}
      <gridHelper
        args={[80, 40, '#287BFF', '#101B3D']}
        position={[0, 0, 0]}
      />
      {/* Dark midnight reflective floor backing */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial
          color="#080B18"
          roughness={0.7}
          metalness={0.85}
        />
      </mesh>
    </group>
  );
};

// Neon Convergence Guide Beams (Electric Blue to Core)
const ConvergenceBeams: React.FC<{ sportsState: SportsPositionsState }> = ({ sportsState }) => {
  const lineGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(8 * 3);
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame(() => {
    const attr = lineGeo.getAttribute('position') as THREE.BufferAttribute;
    const array = attr.array as Float32Array;

    // Football to center
    array[0] = sportsState.football[0];
    array[1] = sportsState.football[1];
    array[2] = sportsState.football[2];
    array[3] = 0; array[4] = 0; array[5] = 0;

    // Cricket to center
    array[6] = sportsState.cricket[0];
    array[7] = sportsState.cricket[1];
    array[8] = sportsState.cricket[2];
    array[9] = 0; array[10] = 0; array[11] = 0;

    // Basketball to center
    array[12] = sportsState.basketball[0];
    array[13] = sportsState.basketball[1];
    array[14] = sportsState.basketball[2];
    array[15] = 0; array[16] = 0; array[17] = 0;

    // Shuttlecock to center
    array[18] = sportsState.shuttlecock[0];
    array[19] = sportsState.shuttlecock[1];
    array[20] = sportsState.shuttlecock[2];
    array[21] = 0; array[22] = 0; array[23] = 0;

    attr.needsUpdate = true;
  });

  const shouldShow =
    sportsState.coreActive &&
    (sportsState.footballScale > 0.1 || sportsState.cricketScale > 0.1);

  if (!shouldShow) return null;

  return (
    <lineSegments geometry={lineGeo}>
      <lineBasicMaterial
        color="#287BFF"
        transparent
        opacity={Math.min(0.7, sportsState.coreIntensity * 0.45)}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
};

// Animated Sweeping Arena Spotlights (Electric Blue & Cosmic Purple)
const ArenaSpotlights: React.FC = () => {
  const spot1Ref = useRef<THREE.SpotLight>(null);
  const spot2Ref = useRef<THREE.SpotLight>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (spot1Ref.current) {
      spot1Ref.current.position.x = Math.sin(t * 0.9) * 12;
      spot1Ref.current.position.z = Math.cos(t * 0.7) * 8 + 4;
    }
    if (spot2Ref.current) {
      spot2Ref.current.position.x = -Math.sin(t * 0.8) * 12;
      spot2Ref.current.position.z = Math.cos(t * 0.6) * 8 + 4;
    }
  });

  return (
    <>
      <spotLight
        ref={spot1Ref}
        position={[-10, 14, 8]}
        angle={0.44}
        penumbra={0.7}
        intensity={22}
        color="#287BFF"
        distance={50}
      />
      <spotLight
        ref={spot2Ref}
        position={[10, 14, 8]}
        angle={0.44}
        penumbra={0.7}
        intensity={20}
        color="#8B5CF6"
        distance={50}
      />
    </>
  );
};

// Dynamic Camera Controller linked to sportsState
const CameraRig: React.FC<{ cameraZ: number; cameraY: number }> = ({
  cameraZ,
  cameraY,
}) => {
  useFrame(({ camera }) => {
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, cameraZ, 0.12);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, cameraY, 0.12);
    camera.lookAt(0, 0, 0);
  });
  return null;
};

export const SportsScene: React.FC<SportsSceneProps> = ({
  sportsState,
  reducedMotion = false,
}) => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 14], fov: 50, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2)]}
      >
        <color attach="background" args={['#080B18']} />
        <fog attach="fog" args={['#080B18', 8, 38]} />

        {/* Dynamic Camera Rig */}
        <CameraRig
          cameraZ={sportsState.cameraZ}
          cameraY={sportsState.cameraY}
        />

        {/* Cinematic Arena Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 12, 6]} intensity={1.4} color="#ffffff" />
        <directionalLight position={[-8, -4, -6]} intensity={0.9} color="#287BFF" />
        <directionalLight position={[8, 6, 2]} intensity={0.8} color="#8B5CF6" />

        {/* Stadium Arena Atmosphere */}
        <ArenaSpotlights />
        {!reducedMotion && <StadiumParticles />}
        <StadiumArenaGrid />

        {/* Neon Convergence Guides between Objects and Core */}
        <ConvergenceBeams sportsState={sportsState} />

        {/* Central Energy Core & Shockwave */}
        <CentralEnergyCore
          active={sportsState.coreActive}
          intensity={sportsState.coreIntensity}
          shockwaveScale={sportsState.shockwaveScale}
        />

        {/* 4 Procedural 3D Sports Objects */}
        {sportsState.footballScale > 0.01 && (
          <FootballModel
            position={sportsState.football}
            scale={sportsState.footballScale}
            glowIntensity={sportsState.coreActive ? 1.6 : 1}
          />
        )}

        {sportsState.cricketScale > 0.01 && (
          <CricketBallModel
            position={sportsState.cricket}
            scale={sportsState.cricketScale}
            glowIntensity={sportsState.coreActive ? 1.6 : 1}
          />
        )}

        {sportsState.basketballScale > 0.01 && (
          <BasketballModel
            position={sportsState.basketball}
            scale={sportsState.basketballScale}
            glowIntensity={sportsState.coreActive ? 1.6 : 1}
          />
        )}

        {sportsState.shuttlecockScale > 0.01 && (
          <ShuttlecockModel
            position={sportsState.shuttlecock}
            scale={sportsState.shuttlecockScale}
            glowIntensity={sportsState.coreActive ? 1.6 : 1}
          />
        )}
      </Canvas>
    </div>
  );
};
