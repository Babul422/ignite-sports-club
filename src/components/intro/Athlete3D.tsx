import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export type SportActionType = 'football-kick' | 'cricket-bat' | 'badminton-smash' | 'basketball-shot';

interface Athlete3DProps {
  action: SportActionType;
  progress: number; // 0 to 1 within the scene's timeframe
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

export const Athlete3D: React.FC<Athlete3DProps> = ({
  action,
  progress,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}) => {
  const groupRef = useRef<THREE.Group>(null);

  // Limb references for articulation
  const torsoRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const rightForearmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const rightCalfRef = useRef<THREE.Group>(null);
  const batRef = useRef<THREE.Group>(null);
  const racketRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const t = Math.max(0, Math.min(1, progress));

    // Dynamic kinematic updates based on sport action
    if (action === 'football-kick') {
      // 0.0 - 0.45: Sprinting forward into position
      // 0.45 - 0.65: Plant left foot, wind back right leg
      // 0.65 - 0.78: Explosive forward kick through the ball!
      // 0.78 - 1.0: Follow-through and landing
      if (t < 0.45) {
        const runCycle = t * 18;
        if (leftLegRef.current) leftLegRef.current.rotation.x = Math.sin(runCycle) * 0.7;
        if (rightLegRef.current) rightLegRef.current.rotation.x = -Math.sin(runCycle) * 0.7;
        if (leftArmRef.current) leftArmRef.current.rotation.x = -Math.sin(runCycle) * 0.6;
        if (rightArmRef.current) rightArmRef.current.rotation.x = Math.sin(runCycle) * 0.6;
        if (torsoRef.current) torsoRef.current.position.y = Math.abs(Math.sin(runCycle)) * 0.15;
      } else if (t < 0.65) {
        // Backswing / windup
        const wind = (t - 0.45) / 0.2;
        if (leftLegRef.current) leftLegRef.current.rotation.x = 0.2; // plant
        if (rightLegRef.current) {
          rightLegRef.current.rotation.x = -1.1 * wind; // thigh drawn back
          if (rightCalfRef.current) rightCalfRef.current.rotation.x = 1.3 * wind; // knee bent
        }
        if (leftArmRef.current) leftArmRef.current.rotation.z = -0.6 * wind;
        if (rightArmRef.current) rightArmRef.current.rotation.x = -0.5 * wind;
      } else if (t < 0.8) {
        // Strike through
        const strike = (t - 0.65) / 0.15;
        if (rightLegRef.current) {
          rightLegRef.current.rotation.x = THREE.MathUtils.lerp(-1.1, 1.3, strike);
          if (rightCalfRef.current) rightCalfRef.current.rotation.x = THREE.MathUtils.lerp(1.3, 0.1, strike);
        }
        if (torsoRef.current) torsoRef.current.rotation.x = THREE.MathUtils.lerp(-0.1, 0.35, strike);
      } else {
        // Follow-through decay
        const follow = (t - 0.8) / 0.2;
        if (rightLegRef.current) {
          rightLegRef.current.rotation.x = THREE.MathUtils.lerp(1.3, 0.4, follow);
        }
      }
    } else if (action === 'cricket-bat') {
      // Batsman:
      // 0.0 - 0.3: Focused stance, tapping bat on ground
      // 0.3 - 0.55: Backlift, watching approaching ball
      // 0.55 - 0.72: Powerful cover-drive / pull swing connecting with the ball!
      // 0.72 - 1.0: High stylish follow-through
      if (t < 0.35) {
        const tap = Math.sin(t * 16) * 0.15;
        if (rightArmRef.current) rightArmRef.current.rotation.x = -0.4 + tap;
        if (batRef.current) batRef.current.rotation.x = 0.5 + tap;
        if (torsoRef.current) torsoRef.current.rotation.y = 0.4;
      } else if (t < 0.55) {
        // High backlift
        const lift = (t - 0.35) / 0.2;
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = THREE.MathUtils.lerp(-0.4, -1.3, lift);
          rightArmRef.current.rotation.z = THREE.MathUtils.lerp(0.2, 0.7, lift);
        }
        if (batRef.current) batRef.current.rotation.x = THREE.MathUtils.lerp(0.5, 1.4, lift);
        if (torsoRef.current) torsoRef.current.rotation.y = THREE.MathUtils.lerp(0.4, 0.65, lift);
      } else if (t < 0.75) {
        // Impact & drive swing
        const swing = (t - 0.55) / 0.2;
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = THREE.MathUtils.lerp(-1.3, 0.9, swing);
          rightArmRef.current.rotation.y = THREE.MathUtils.lerp(0, -0.6, swing);
        }
        if (batRef.current) {
          batRef.current.rotation.x = THREE.MathUtils.lerp(1.4, -0.6, swing);
          batRef.current.rotation.z = THREE.MathUtils.lerp(0, 0.4, swing);
        }
        if (torsoRef.current) torsoRef.current.rotation.y = THREE.MathUtils.lerp(0.65, -0.4, swing);
      } else {
        // Follow-through hold
        if (batRef.current) batRef.current.rotation.x = -0.6;
      }
    } else if (action === 'badminton-smash') {
      // 0.0 - 0.4: Preparation and explosive vertical leap into the air
      // 0.4 - 0.6: Racket cocked behind head at jump apex
      // 0.6 - 0.75: Hypersonic overhead whip down onto the shuttlecock
      // 0.75 - 1.0: Athletic landing
      if (t < 0.4) {
        const prep = t / 0.4;
        if (torsoRef.current) torsoRef.current.position.y = Math.sin(prep * Math.PI) * 1.8;
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = THREE.MathUtils.lerp(0, -2.2, prep);
          rightArmRef.current.rotation.z = THREE.MathUtils.lerp(0, 0.8, prep);
        }
        if (racketRef.current) racketRef.current.rotation.x = THREE.MathUtils.lerp(0, 1.2, prep);
      } else if (t < 0.72) {
        // Smash down!
        const smash = (t - 0.4) / 0.32;
        if (torsoRef.current) torsoRef.current.position.y = 1.8 - smash * 0.9;
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = THREE.MathUtils.lerp(-2.2, 1.1, smash);
          rightArmRef.current.rotation.z = THREE.MathUtils.lerp(0.8, -0.2, smash);
        }
        if (racketRef.current) {
          racketRef.current.rotation.x = THREE.MathUtils.lerp(1.2, -1.2, smash);
        }
        if (torsoRef.current) torsoRef.current.rotation.x = smash * 0.4;
      } else {
        // Landing
        const land = (t - 0.72) / 0.28;
        if (torsoRef.current) torsoRef.current.position.y = (1 - land) * 0.9;
      }
    } else if (action === 'basketball-shot') {
      // 0.0 - 0.35: Knee bend gather with ball
      // 0.35 - 0.65: Elevation jump to peak
      // 0.65 - 0.78: Extension and wrist snap release towards the hoop
      // 0.78 - 1.0: Floating descent with shooting arm follow-through held
      if (t < 0.35) {
        const gather = t / 0.35;
        if (torsoRef.current) torsoRef.current.position.y = -Math.sin(gather * Math.PI * 0.5) * 0.4;
        if (leftLegRef.current) leftLegRef.current.rotation.x = gather * 0.5;
        if (rightLegRef.current) rightLegRef.current.rotation.x = gather * 0.5;
        if (rightArmRef.current) rightArmRef.current.rotation.x = -gather * 0.8;
      } else if (t < 0.65) {
        // Jump elevation
        const jump = (t - 0.35) / 0.3;
        if (torsoRef.current) torsoRef.current.position.y = Math.sin(jump * Math.PI * 0.5) * 1.9;
        if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
        if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = THREE.MathUtils.lerp(-0.8, -2.1, jump);
          rightArmRef.current.rotation.z = 0.25;
        }
        if (leftArmRef.current) {
          leftArmRef.current.rotation.x = THREE.MathUtils.lerp(0, -1.9, jump);
          leftArmRef.current.rotation.z = -0.3;
        }
      } else if (t < 0.8) {
        // Release & wrist snap
        const release = (t - 0.65) / 0.15;
        if (torsoRef.current) torsoRef.current.position.y = 1.9 - release * 0.3;
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = THREE.MathUtils.lerp(-2.1, -1.4, release);
        }
        if (rightForearmRef.current) {
          rightForearmRef.current.rotation.x = THREE.MathUtils.lerp(0, -0.7, release);
        }
      } else {
        // Descend with follow-through
        const fall = (t - 0.8) / 0.2;
        if (torsoRef.current) torsoRef.current.position.y = (1 - fall) * 1.6;
      }
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* Upper Torso & Head Rig */}
      <group ref={torsoRef} position={[0, 1.8, 0]}>
        {/* Athletic Jersey (#101B3D deep navy with #287BFF electric blue & cosmic purple trim) */}
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[0.72, 0.95, 0.42]} />
          <meshStandardMaterial color="#101B3D" roughness={0.4} metalness={0.2} />
        </mesh>

        {/* Electric Blue Side Accents */}
        <mesh position={[0.37, 0, 0]}>
          <boxGeometry args={[0.04, 0.92, 0.4]} />
          <meshBasicMaterial color="#287BFF" />
        </mesh>
        <mesh position={[-0.37, 0, 0]}>
          <boxGeometry args={[0.04, 0.92, 0.4]} />
          <meshBasicMaterial color="#287BFF" />
        </mesh>

        {/* Team Number 26 on Jersey Chest */}
        <mesh position={[0, 0.1, 0.22]}>
          <planeGeometry args={[0.3, 0.22]} />
          <meshBasicMaterial color="#62C7FF" />
        </mesh>

        {/* Neck & Head */}
        <group ref={headRef} position={[0, 0.65, 0]}>
          {/* Head */}
          <mesh castShadow position={[0, 0, 0]}>
            <sphereGeometry args={[0.22, 24, 24]} />
            <meshStandardMaterial color="#9E7658" roughness={0.6} />
          </mesh>
          {/* IGNITE Athletic Headband */}
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.23, 0.23, 0.08, 24]} />
            <meshBasicMaterial color="#287BFF" />
          </mesh>
        </group>

        {/* Left Arm */}
        <group ref={leftArmRef} position={[-0.45, 0.35, 0]}>
          <mesh castShadow position={[0, -0.3, 0]}>
            <cylinderGeometry args={[0.09, 0.08, 0.55, 16]} />
            <meshStandardMaterial color="#101B3D" roughness={0.4} />
          </mesh>
          {/* Forearm & Hand */}
          <group position={[0, -0.58, 0]}>
            <mesh castShadow position={[0, -0.22, 0]}>
              <cylinderGeometry args={[0.07, 0.06, 0.45, 16]} />
              <meshStandardMaterial color="#9E7658" roughness={0.6} />
            </mesh>
          </group>
        </group>

        {/* Right Arm (Action Arm with Equipment) */}
        <group ref={rightArmRef} position={[0.45, 0.35, 0]}>
          <mesh castShadow position={[0, -0.3, 0]}>
            <cylinderGeometry args={[0.09, 0.08, 0.55, 16]} />
            <meshStandardMaterial color="#101B3D" roughness={0.4} />
          </mesh>
          {/* Right Forearm */}
          <group ref={rightForearmRef} position={[0, -0.58, 0]}>
            <mesh castShadow position={[0, -0.22, 0]}>
              <cylinderGeometry args={[0.07, 0.06, 0.45, 16]} />
              <meshStandardMaterial color="#9E7658" roughness={0.6} />
            </mesh>
            {/* Hand */}
            <mesh castShadow position={[0, -0.46, 0]}>
              <sphereGeometry args={[0.08, 12, 12]} />
              <meshStandardMaterial color="#9E7658" roughness={0.6} />
            </mesh>

            {/* Equipment: Cricket Bat */}
            {action === 'cricket-bat' && (
              <group ref={batRef} position={[0, -0.5, 0.2]}>
                {/* Bat Handle with Purple Grip */}
                <mesh position={[0, 0.3, 0]}>
                  <cylinderGeometry args={[0.035, 0.035, 0.45, 12]} />
                  <meshStandardMaterial color="#8B5CF6" roughness={0.3} />
                </mesh>
                {/* Willow Blade with Electric Blue Edge */}
                <mesh castShadow position={[0, -0.42, 0]}>
                  <boxGeometry args={[0.18, 0.95, 0.065]} />
                  <meshStandardMaterial color="#CBB18B" roughness={0.5} />
                </mesh>
                <mesh position={[0.09, -0.42, 0]}>
                  <boxGeometry args={[0.015, 0.95, 0.066]} />
                  <meshBasicMaterial color="#287BFF" />
                </mesh>
              </group>
            )}

            {/* Equipment: Badminton Racket */}
            {action === 'badminton-smash' && (
              <group ref={racketRef} position={[0, -0.5, 0.15]}>
                {/* Shaft & Handle */}
                <mesh position={[0, 0.45, 0]}>
                  <cylinderGeometry args={[0.02, 0.02, 0.85, 12]} />
                  <meshStandardMaterial color="#287BFF" metalness={0.7} roughness={0.2} />
                </mesh>
                {/* Racket Head Ring */}
                <mesh position={[0, 1.05, 0]}>
                  <torusGeometry args={[0.24, 0.022, 12, 32]} />
                  <meshStandardMaterial color="#62C7FF" metalness={0.8} roughness={0.15} />
                </mesh>
                {/* String Mesh */}
                <mesh position={[0, 1.05, 0]}>
                  <circleGeometry args={[0.22, 24]} />
                  <meshBasicMaterial color="#FFFFFF" transparent opacity={0.35} wireframe />
                </mesh>
              </group>
            )}
          </group>
        </group>

        {/* Athletic Shorts */}
        <mesh position={[0, -0.55, 0]}>
          <boxGeometry args={[0.74, 0.45, 0.44]} />
          <meshStandardMaterial color="#080B18" roughness={0.5} />
        </mesh>
      </group>

      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.22, 1.25, 0]}>
        <mesh castShadow position={[0, -0.32, 0]}>
          <cylinderGeometry args={[0.11, 0.09, 0.62, 16]} />
          <meshStandardMaterial color="#9E7658" roughness={0.6} />
        </mesh>
        {/* Calf & Shoe */}
        <group position={[0, -0.65, 0]}>
          <mesh castShadow position={[0, -0.32, 0]}>
            <cylinderGeometry args={[0.09, 0.07, 0.6, 16]} />
            <meshStandardMaterial color="#9E7658" roughness={0.6} />
          </mesh>
          {/* Athletic Cleat / Sneaker */}
          <mesh castShadow position={[0, -0.62, 0.1]}>
            <boxGeometry args={[0.16, 0.12, 0.36]} />
            <meshStandardMaterial color="#287BFF" roughness={0.3} metalness={0.3} />
          </mesh>
        </group>
      </group>

      {/* Right Leg (Kicking / Driving Leg) */}
      <group ref={rightLegRef} position={[0.22, 1.25, 0]}>
        <mesh castShadow position={[0, -0.32, 0]}>
          <cylinderGeometry args={[0.11, 0.09, 0.62, 16]} />
          <meshStandardMaterial color="#9E7658" roughness={0.6} />
        </mesh>
        {/* Calf & Shoe */}
        <group ref={rightCalfRef} position={[0, -0.65, 0]}>
          <mesh castShadow position={[0, -0.32, 0]}>
            <cylinderGeometry args={[0.09, 0.07, 0.6, 16]} />
            <meshStandardMaterial color="#9E7658" roughness={0.6} />
          </mesh>
          {/* Athletic Cleat / Sneaker */}
          <mesh castShadow position={[0, -0.62, 0.1]}>
            <boxGeometry args={[0.16, 0.12, 0.36]} />
            <meshStandardMaterial color="#8B5CF6" roughness={0.3} metalness={0.3} />
          </mesh>
        </group>
      </group>
    </group>
  );
};
