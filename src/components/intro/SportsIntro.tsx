import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { CinematicVideoScene, type SportsVideoSceneType } from './CinematicVideoScene';
import { TapToEnter } from './TapToEnter';
import { FireTransitionOverlay } from './FireTransitionOverlay';
import { IntroControls } from './IntroControls';
import { sportsAudio } from '../../utils/soundSynthesizer';
import './SportsIntro.css';

export type IntroSceneType = 'tap' | SportsVideoSceneType | 'fire-transition' | 'crest';

interface SportsIntroProps {
  onEnterArena: () => void;
  onSkip: () => void;
  clubName?: string;
  tagline?: string;
}

function getInitialReducedMotion(): boolean {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  return false;
}

export const SportsIntro: React.FC<SportsIntroProps> = ({
  onEnterArena,
  onSkip,
}) => {
  const [reducedMotion, setReducedMotion] = useState<boolean>(getInitialReducedMotion);
  const [currentScene, setCurrentScene] = useState<IntroSceneType>('tap');
  const [sceneProgress, setSceneProgress] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(sportsAudio.isMuted);
  const [logoRevealed, setLogoRevealed] = useState<boolean>(false);
  const [isEnteringArena, setIsEnteringArena] = useState<boolean>(false);
  const [introFinished, setIntroFinished] = useState<boolean>(false);

  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Sync reduced motion preference
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const listener = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      sportsAudio.stopAllAudio();
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, []);

  // Audio mute/unmute
  const handleToggleMute = useCallback(() => {
    const muted = sportsAudio.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      sportsAudio.playButtonHover();
    }
  }, []);

  // Immediate Skip Intro (instant transition & stop audio)
  const handleSkip = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.kill();
    }
    sportsAudio.stopAllAudio();
    sportsAudio.playButtonHover();
    // Save skip preference for returning visitor option
    if (typeof window !== 'undefined') {
      localStorage.setItem('ignite_skip_intro_pref', 'true');
    }
    onSkip();
  }, [onSkip]);

  // Cinematic Enter Arena warp dive transition
  const handleEnterArena = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.kill();
    }
    sportsAudio.stopAllAudio();
    sportsAudio.playButtonHover();
    sportsAudio.playWhoosh(1.8);
    setIsEnteringArena(true);

    // Warp flash transition into homepage
    setTimeout(() => {
      onEnterArena();
    }, 550);
  }, [onEnterArena]);

  // Orchestrate the full 6-Scene Cinematic Sports Journey
  const startCinematicExperience = useCallback(() => {
    // Start audio groove
    sportsAudio.startFunkyGroove();

    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const master = gsap.timeline({
      onComplete: () => {
        setIntroFinished(true);
      },
    });
    timelineRef.current = master;

    // SCENE 2: FOOTBALL GOAL (Duration: ~3.2s)
    const fbAnim = { progress: 0 };
    master.call(() => {
      setCurrentScene('football');
      setSceneProgress(0);
    });

    master.to(fbAnim, {
      progress: 1,
      duration: 3.2,
      ease: 'none',
      onUpdate: () => setSceneProgress(fbAnim.progress),
    });
    // Synchronize football kick at ~1.6s and goal net strike at ~2.7s
    master.add(() => sportsAudio.playFootballKick(), '-=1.6');
    master.add(() => sportsAudio.playGoalNetHit(), '-=0.5');

    // SCENE 3: CRICKET BAT HIT (Duration: ~3.0s)
    const cbAnim = { progress: 0 };
    master.call(() => {
      setCurrentScene('cricket');
      setSceneProgress(0);
    });

    master.to(cbAnim, {
      progress: 1,
      duration: 3.0,
      ease: 'none',
      onUpdate: () => setSceneProgress(cbAnim.progress),
    });
    // Synchronize cricket bat impact at ~1.5s
    master.add(() => sportsAudio.playCricketBatHit(), '-=1.5');

    // SCENE 4: BADMINTON OVERHEAD SMASH (Duration: ~3.0s)
    const bdAnim = { progress: 0 };
    master.call(() => {
      setCurrentScene('badminton');
      setSceneProgress(0);
    });

    master.to(bdAnim, {
      progress: 1,
      duration: 3.0,
      ease: 'none',
      onUpdate: () => setSceneProgress(bdAnim.progress),
    });
    // Synchronize overhead smash at ~1.4s
    master.add(() => sportsAudio.playBadmintonSmash(), '-=1.6');

    // SCENE 5: BASKETBALL SHOT & SWISH (Duration: ~3.2s)
    const bbAnim = { progress: 0 };
    master.call(() => {
      setCurrentScene('basketball');
      setSceneProgress(0);
    });

    master.to(bbAnim, {
      progress: 1,
      duration: 3.2,
      ease: 'none',
      onUpdate: () => setSceneProgress(bbAnim.progress),
    });
    // Synchronize basketball swish through hoop at ~2.5s
    master.add(() => sportsAudio.playBasketballSwish(), '-=0.7');

    // SCENE 6: BLUE-PURPLE FIRE TRANSITION & LOGO REVEAL (Duration: ~3.6s)
    const fireAnim = { progress: 0 };
    master.call(() => {
      setCurrentScene('fire-transition');
      setSceneProgress(0);
      sportsAudio.playFireVortexSweep();
    });

    master.to(fireAnim, {
      progress: 1,
      duration: 2.2,
      ease: 'power2.out',
      onUpdate: () => setSceneProgress(fireAnim.progress),
    });

    // Reveal Official Logo & Sub-bass Impact
    master.call(() => {
      setLogoRevealed(true);
      sportsAudio.playLogoRevealImpact();
    });

    master.to({}, { duration: 1.4 });
  }, []);

  // Replay from Scene 1
  const handleReplay = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.kill();
    }
    sportsAudio.stopAllAudio();
    setIsEnteringArena(false);
    setLogoRevealed(false);
    setIntroFinished(false);
    setSceneProgress(0);
    setCurrentScene('tap');
  }, []);

  return (
    <div className={`sports-intro-wrapper ${isEnteringArena ? 'entering-warp' : ''}`}>
      {/* SCENE 1: Tap to Enter Overlay */}
      {currentScene === 'tap' && (
        <TapToEnter
          onEnter={startCinematicExperience}
          onSkip={handleSkip}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {/* Real Cinematic Sports Video Scenes (Football, Cricket, Badminton, Basketball) */}
      {(currentScene === 'football' ||
        currentScene === 'cricket' ||
        currentScene === 'badminton' ||
        currentScene === 'basketball') && (
        <CinematicVideoScene
          currentScene={currentScene}
          sceneProgress={sceneProgress}
          reducedMotion={reducedMotion}
        />
      )}

      {/* Top HUD Controls (Always accessible after entry) */}
      {currentScene !== 'tap' && (
        <IntroControls
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onSkipIntro={handleSkip}
          onReplayIntro={handleReplay}
          showReplay={introFinished}
        />
      )}

      {/* SCENE 6: Cosmic Blue-Purple Fire Transition & Official Logo Reveal */}
      <FireTransitionOverlay
        active={currentScene === 'fire-transition' || currentScene === 'crest'}
        progress={sceneProgress}
        logoRevealed={logoRevealed}
        onEnterArena={handleEnterArena}
        onSkipIntro={handleSkip}
      />

      {/* Cinematic Warp Speedlines Flash upon Entering Arena */}
      {isEnteringArena && <div className="arena-warp-flash" aria-hidden="true" />}
    </div>
  );
};
