import React, { useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Athlete3D } from './Athlete3D';
import { FootballModel } from './FootballModel';
import { CricketBallModel } from './CricketBallModel';
import { BasketballModel } from './BasketballModel';
import { ShuttlecockModel } from './ShuttlecockModel';

export type IntroSceneType =
  | 'tap'
  | 'football'
  | 'cricket'
  | 'badminton'
  | 'basketball'
  | 'fire-transition'
  | 'crest';

interface SportsCinematicSceneProps {
  currentScene: IntroSceneType;
  sceneProgress: number; // 0 to 1
  impactActive?: boolean;
  reducedMotion?: boolean;
}

// 1. FOOTBALL ENVIRONMENT & GOAL PROPS
const FootballEnvironment: React.FC<{ progress: number; impactActive?: boolean }> = ({
  progress,
}) => {
  const ballRef = useRef<THREE.Group>(null);
  const netMeshRef = useRef<THREE.Mesh>(null);

  // Ball trajectory:
  // 0.0 - 0.65: At player's feet
  // 0.65: Kicked!
  // 0.65 - 0.95: Blasts in high arc into the top-right corner of the goal net
  // 0.95 - 1.0: Ripples net and drops slightly
  useFrame(() => {
    if (!ballRef.current) return;
    const t = progress;

    if (t < 0.65) {
      // Resting / rolling ahead of the sprinting player
      const startX = -3.2 + t * 4.8;
      ballRef.current.position.set(startX, 0.28, 0);
      ballRef.current.scale.setScalar(0.5);
    } else {
      // Kicked trajectory towards the goal (located at X: 5.5, Y: 2.1, Z: -1.2)
      const kickT = (t - 0.65) / 0.32;
      const arcY = Math.sin(kickT * Math.PI * 0.7) * 2.2;
      const x = THREE.MathUtils.lerp(0, 5.5, Math.min(1, kickT));
      const z = THREE.MathUtils.lerp(0, -1.2, Math.min(1, kickT));
      const y = Math.min(2.1, 0.28 + arcY);

      ballRef.current.position.set(x, y, z);
      ballRef.current.scale.setScalar(0.48);

      // Net ripple vibration when ball penetrates net
      if (kickT > 0.85 && netMeshRef.current) {
        netMeshRef.current.rotation.y = Math.sin(t * 35) * 0.06;
      }
    }
  });

  return (
    <group>
      {/* Stadium Turf Pitch Markings */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[50, 40]} />
        <meshStandardMaterial color="#0b172a" roughness={0.8} metalness={0.15} />
      </mesh>
      {/* Penalty Box Line in Electric Blue */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2.5, 0.01, 0]}>
        <planeGeometry args={[0.08, 14]} />
        <meshBasicMaterial color="#287BFF" />
      </mesh>

      {/* 3D Football Goal Frame at X: 5.8 */}
      <group position={[5.8, 0, 0]}>
        {/* Left Post */}
        <mesh position={[0, 1.4, -2.4]}>
          <cylinderGeometry args={[0.07, 0.07, 2.8, 16]} />
          <meshStandardMaterial color="#FFFFFF" metalness={0.4} roughness={0.2} />
        </mesh>
        {/* Right Post */}
        <mesh position={[0, 1.4, 2.4]}>
          <cylinderGeometry args={[0.07, 0.07, 2.8, 16]} />
          <meshStandardMaterial color="#FFFFFF" metalness={0.4} roughness={0.2} />
        </mesh>
        {/* Crossbar */}
        <mesh position={[0, 2.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 4.88, 16]} />
          <meshStandardMaterial color="#FFFFFF" metalness={0.4} roughness={0.2} />
        </mesh>

        {/* 3D Goal Net Backing */}
        <mesh ref={netMeshRef} position={[1.0, 1.4, 0]}>
          <boxGeometry args={[1.8, 2.75, 4.8]} />
          <meshBasicMaterial color="#62C7FF" wireframe transparent opacity={0.32} />
        </mesh>
      </group>

      {/* 3D Articulated Striker (Runs in, winds back, strikes ball!) */}
      <Athlete3D
        action="football-kick"
        progress={progress}
        position={[-1.2, 0, 0]}
        scale={1.05}
      />

      {/* 3D Football with Cosmic Seam Texture */}
      <group ref={ballRef}>
        <FootballModel scale={0.8} />
      </group>
    </group>
  );
};

// 2. CRICKET ENVIRONMENT & STUMPS
const CricketEnvironment: React.FC<{ progress: number; impactActive?: boolean }> = ({
  progress,
}) => {
  const ballRef = useRef<THREE.Group>(null);
  const flashRef = useRef<THREE.PointLight>(null);

  // Ball bowled towards batsman (X: -6 -> X: 0.2 at bat)
  // At t=0.6: Contact! Bat strikes ball, ball accelerates towards camera (X: 0.2 -> X: 8)
  useFrame(() => {
    if (!ballRef.current) return;
    const t = progress;

    if (t < 0.6) {
      // Approaching ball
      const bowlT = t / 0.6;
      const x = THREE.MathUtils.lerp(-7, 0.35, bowlT);
      const y = THREE.MathUtils.lerp(1.8, 0.65, bowlT);
      const z = THREE.MathUtils.lerp(0.5, 0.2, bowlT);
      ballRef.current.position.set(x, y, z);
      ballRef.current.scale.setScalar(0.4);
    } else {
      // Shot launched off the bat!
      const shotT = (t - 0.6) / 0.4;
      const x = THREE.MathUtils.lerp(0.35, 9.5, shotT);
      const y = THREE.MathUtils.lerp(0.65, 3.2, shotT);
      const z = THREE.MathUtils.lerp(0.2, 5.0, shotT);
      ballRef.current.position.set(x, y, z);
      ballRef.current.scale.setScalar(0.42);
    }

    if (flashRef.current) {
      if (t >= 0.58 && t <= 0.68) {
        flashRef.current.intensity = 18 * (1 - (t - 0.58) / 0.1);
      } else {
        flashRef.current.intensity = 0;
      }
    }
  });

  return (
    <group>
      {/* 22-Yard Pitch Strip */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[16, 3.2]} />
        <meshStandardMaterial color="#1a2542" roughness={0.7} />
      </mesh>
      {/* Popping Crease in Cosmic Purple */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.7, 0.01, 0]}>
        <planeGeometry args={[0.08, 3.0]} />
        <meshBasicMaterial color="#8B5CF6" />
      </mesh>

      {/* 3 Wooden Stumps with Bails behind Batsman */}
      <group position={[1.4, 0, 0.1]}>
        {[-0.14, 0, 0.14].map((zPos, idx) => (
          <mesh key={idx} position={[0, 0.48, zPos]}>
            <cylinderGeometry args={[0.025, 0.025, 0.95, 12]} />
            <meshStandardMaterial color="#D7A15C" roughness={0.4} />
          </mesh>
        ))}
        {/* Bail */}
        <mesh position={[0, 0.97, 0]}>
          <boxGeometry args={[0.03, 0.02, 0.32]} />
          <meshStandardMaterial color="#D7A15C" roughness={0.4} />
        </mesh>
      </group>

      {/* 3D Batsman */}
      <Athlete3D
        action="cricket-bat"
        progress={progress}
        position={[0, 0, 0]}
        rotation={[0, -Math.PI / 2 + 0.3, 0]}
        scale={1.05}
      />

      {/* Cricket Ball */}
      <group ref={ballRef}>
        <CricketBallModel scale={0.7} />
      </group>

      {/* Bat Impact Flash Light */}
      <pointLight
        ref={flashRef}
        position={[0.3, 0.7, 0.2]}
        color="#62C7FF"
        distance={8}
        intensity={0}
      />
    </group>
  );
};

// 3. BADMINTON ENVIRONMENT & OVERHEAD SMASH
const BadmintonEnvironment: React.FC<{ progress: number }> = ({ progress }) => {
  const shuttleRef = useRef<THREE.Group>(null);

  // Shuttlecock trajectory:
  // 0.0 - 0.58: Floating upward towards player at jump peak
  // 0.58: Racket contact!
  // 0.58 - 1.0: Hypersonic smash downward across the net
  useFrame(() => {
    if (!shuttleRef.current) return;
    const t = progress;

    if (t < 0.58) {
      const floatT = t / 0.58;
      const x = THREE.MathUtils.lerp(3.5, 0.45, floatT);
      const y = THREE.MathUtils.lerp(1.2, 3.2, floatT);
      shuttleRef.current.position.set(x, y, 0);
      shuttleRef.current.scale.setScalar(0.4);
    } else {
      const smashT = (t - 0.58) / 0.42;
      const x = THREE.MathUtils.lerp(0.45, -5.5, smashT);
      const y = THREE.MathUtils.lerp(3.2, 0.08, smashT);
      shuttleRef.current.position.set(x, y, 0);
      shuttleRef.current.scale.setScalar(0.42);
    }
  });

  return (
    <group>
      {/* Synthetic Badminton Court Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[18, 10]} />
        <meshStandardMaterial color="#0a1835" roughness={0.6} />
      </mesh>

      {/* Badminton Center Net */}
      <group position={[-1.8, 0, 0]}>
        {/* Posts */}
        <mesh position={[0, 0.8, -3.2]}>
          <cylinderGeometry args={[0.04, 0.04, 1.6, 12]} />
          <meshStandardMaterial color="#287BFF" />
        </mesh>
        <mesh position={[0, 0.8, 3.2]}>
          <cylinderGeometry args={[0.04, 0.04, 1.6, 12]} />
          <meshStandardMaterial color="#287BFF" />
        </mesh>
        {/* Net Mesh */}
        <mesh position={[0, 1.15, 0]}>
          <boxGeometry args={[0.04, 0.85, 6.4]} />
          <meshBasicMaterial color="#62C7FF" wireframe transparent opacity={0.4} />
        </mesh>
        {/* Top White Tape */}
        <mesh position={[0, 1.58, 0]}>
          <boxGeometry args={[0.06, 0.08, 6.4]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
      </group>

      {/* 3D Badminton Player */}
      <Athlete3D
        action="badminton-smash"
        progress={progress}
        position={[0.3, 0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        scale={1.05}
      />

      {/* Shuttlecock */}
      <group ref={shuttleRef}>
        <ShuttlecockModel scale={0.65} />
      </group>
    </group>
  );
};

// 4. BASKETBALL ENVIRONMENT & REGULATION HOOP
const BasketballEnvironment: React.FC<{ progress: number }> = ({ progress }) => {
  const ballRef = useRef<THREE.Group>(null);
  const netRef = useRef<THREE.Mesh>(null);

  // Basketball trajectory:
  // 0.0 - 0.65: In player's hands rising to peak of jump
  // 0.65: Released at peak!
  // 0.65 - 0.92: High parabolic arc towards rim (located at X: -3.8, Y: 3.05)
  // 0.92: Swish through rim and drop through net!
  useFrame(() => {
    if (!ballRef.current) return;
    const t = progress;

    if (t < 0.65) {
      // Raised above head in shooting stance
      const jumpElevation = Math.sin((t / 0.65) * Math.PI * 0.5) * 1.8;
      ballRef.current.position.set(0.1, 2.2 + jumpElevation, 0.1);
      ballRef.current.scale.setScalar(0.45);
    } else {
      const shotT = (t - 0.65) / 0.35;
      const x = THREE.MathUtils.lerp(0.1, -3.8, Math.min(1, shotT));
      // Parabolic arc peak around shotT = 0.5
      const arcH = Math.sin(Math.min(1, shotT) * Math.PI) * 1.4;
      const y = THREE.MathUtils.lerp(3.9, 3.05, Math.min(1, shotT)) + arcH;

      if (shotT > 1.0) {
        // Dropping through net
        const drop = (shotT - 1.0) * 4;
        ballRef.current.position.set(-3.8, 3.05 - drop, 0);
      } else {
        ballRef.current.position.set(x, y, 0);
      }
      ballRef.current.scale.setScalar(0.45);

      // Net swish stretch
      if (shotT >= 0.88 && netRef.current) {
        netRef.current.scale.y = 1 + Math.sin(t * 30) * 0.25;
      }
    }
  });

  return (
    <group>
      {/* Hardwood Basketball Court */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[20, 14]} />
        <meshStandardMaterial color="#0c1736" roughness={0.3} metalness={0.4} />
      </mesh>
      {/* 3-Point Arc Line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.5, 0.01, 0]}>
        <ringGeometry args={[3.8, 3.88, 32, 1, -Math.PI / 2, Math.PI]} />
        <meshBasicMaterial color="#287BFF" />
      </mesh>

      {/* Regulation Backboard, Rim & Net at X: -4.4 */}
      <group position={[-4.4, 0, 0]}>
        {/* Support Post */}
        <mesh position={[-0.8, 2.2, 0]}>
          <boxGeometry args={[0.15, 4.4, 0.15]} />
          <meshStandardMaterial color="#101B3D" />
        </mesh>
        {/* Glass Backboard */}
        <mesh position={[0, 3.4, 0]}>
          <boxGeometry args={[0.06, 1.25, 1.85]} />
          <meshPhysicalMaterial
            color="#FFFFFF"
            roughness={0.1}
            transmission={0.8}
            thickness={0.05}
            transparent
            opacity={0.7}
          />
        </mesh>
        {/* Target Box Border */}
        <mesh position={[0.04, 3.25, 0]}>
          <boxGeometry args={[0.02, 0.55, 0.65]} />
          <meshBasicMaterial color="#62C7FF" wireframe />
        </mesh>
        {/* Orange Iron Rim at 3.05m Height */}
        <mesh position={[0.42, 3.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.26, 0.022, 16, 32]} />
          <meshStandardMaterial color="#FF5A1F" roughness={0.3} metalness={0.6} />
        </mesh>
        {/* White Net */}
        <mesh ref={netRef} position={[0.42, 2.8, 0]}>
          <cylinderGeometry args={[0.24, 0.12, 0.5, 16, 4, true]} />
          <meshBasicMaterial color="#FFFFFF" wireframe transparent opacity={0.65} />
        </mesh>
      </group>

      {/* 3D Basketball Shooter */}
      <Athlete3D
        action="basketball-shot"
        progress={progress}
        position={[0, 0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        scale={1.05}
      />

      {/* Basketball */}
      <group ref={ballRef}>
        <BasketballModel scale={0.75} />
      </group>
    </group>
  );
};

function createSeededVortexParticles(count: number) {
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const electricBlue = new THREE.Color('#287BFF');
  const cosmicPurple = new THREE.Color('#8B5CF6');
  const iceBlue = new THREE.Color('#62C7FF');

  let seed = 12345;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let i = 0; i < count; i++) {
    const radius = 0.5 + rand() * 6.0;
    const angle = rand() * Math.PI * 2;
    pos[i * 3] = Math.cos(angle) * radius;
    pos[i * 3 + 1] = (rand() - 0.5) * 4;
    pos[i * 3 + 2] = Math.sin(angle) * radius;

    const pick = rand();
    const c = pick < 0.45 ? electricBlue : pick < 0.8 ? cosmicPurple : iceBlue;
    col[i * 3] = c.r;
    col[i * 3 + 1] = c.g;
    col[i * 3 + 2] = c.b;
  }
  return { positions: pos, colors: col };
}

const STATIC_VORTEX_PARTICLES = createSeededVortexParticles(380);

// 5. BLUE-PURPLE FIRE VORTEX & ENERGY DISSOLUTION
const CosmicFireVortex: React.FC<{ progress: number }> = ({ progress }) => {
  const vortexRef = useRef<THREE.Group>(null);
  const { positions, colors } = STATIC_VORTEX_PARTICLES;

  useFrame((_, delta) => {
    if (vortexRef.current) {
      // Swirling cosmic flame vortex
      vortexRef.current.rotation.y += delta * 4.2;
      vortexRef.current.rotation.x = Math.sin(progress * 6) * 0.2;
      const scale = 0.5 + progress * 2.8;
      vortexRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group ref={vortexRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.16}
          vertexColors
          transparent
          opacity={Math.min(1, progress * 1.5)}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Energy Rings expanding */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 1.8, 32]} />
        <meshBasicMaterial color="#287BFF" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.5, 2.7, 32]} />
        <meshBasicMaterial color="#8B5CF6" transparent opacity={0.45} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

// Dynamic Camera Controller interpolating across scenes
const CinematicCameraRig: React.FC<{
  currentScene: IntroSceneType;
  sceneProgress: number;
}> = ({ currentScene, sceneProgress }) => {
  useFrame(({ camera }) => {
    let targetX = 0;
    let targetY = 2.0;
    let targetZ = 6.8;
    let lookAtY = 1.4;

    if (currentScene === 'football') {
      // Side tracking angle watching the run and goal
      targetX = THREE.MathUtils.lerp(-1.0, 3.0, sceneProgress * 0.7);
      targetY = 2.2;
      targetZ = 6.4;
      lookAtY = 1.5;
    } else if (currentScene === 'cricket') {
      // Front-side perspective watching the bowler and cover drive
      targetX = THREE.MathUtils.lerp(4.0, 3.0, sceneProgress);
      targetY = 1.8;
      targetZ = 5.2;
      lookAtY = 1.2;
    } else if (currentScene === 'badminton') {
      // Dramatic low angle highlighting the vertical leap and smash
      targetX = THREE.MathUtils.lerp(1.5, -0.5, sceneProgress);
      targetY = 1.2;
      targetZ = 5.5;
      lookAtY = 2.0;
    } else if (currentScene === 'basketball') {
      // Elevation angle looking up towards the hoop
      targetX = THREE.MathUtils.lerp(1.2, -1.8, sceneProgress);
      targetY = 2.4;
      targetZ = 6.0;
      lookAtY = 2.6;
    } else if (currentScene === 'fire-transition' || currentScene === 'crest') {
      targetX = 0;
      targetY = 0;
      targetZ = 8.5;
      lookAtY = 0;
    }

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.08);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.08);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.08);
    camera.lookAt(0, lookAtY, 0);
  });

  return null;
};

export const SportsCinematicScene: React.FC<SportsCinematicSceneProps> = ({
  currentScene,
  sceneProgress,
  impactActive = false,
}) => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
      <Canvas
        camera={{ position: [0, 2, 7], fov: 48, near: 0.1, far: 80 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2)]}
      >
        <color attach="background" args={['#080B18']} />
        <fog attach="fog" args={['#080B18', 6, 32]} />

        {/* Dynamic Camera Rig */}
        <CinematicCameraRig
          currentScene={currentScene}
          sceneProgress={sceneProgress}
        />

        {/* Cinematic Arena Lighting */}
        <ambientLight intensity={0.45} />
        <directionalLight position={[0, 10, 5]} intensity={1.5} color="#FFFFFF" />
        <directionalLight position={[-6, 4, -4]} intensity={1.0} color="#287BFF" />
        <directionalLight position={[6, 4, 4]} intensity={0.9} color="#8B5CF6" />

        {/* Active Scene Content */}
        {currentScene === 'football' && (
          <FootballEnvironment
            progress={sceneProgress}
            impactActive={impactActive}
          />
        )}

        {currentScene === 'cricket' && (
          <CricketEnvironment
            progress={sceneProgress}
            impactActive={impactActive}
          />
        )}

        {currentScene === 'badminton' && (
          <BadmintonEnvironment progress={sceneProgress} />
        )}

        {currentScene === 'basketball' && (
          <BasketballEnvironment progress={sceneProgress} />
        )}

        {(currentScene === 'fire-transition' || currentScene === 'crest') && (
          <CosmicFireVortex progress={sceneProgress} />
        )}
      </Canvas>
    </div>
  );
};
