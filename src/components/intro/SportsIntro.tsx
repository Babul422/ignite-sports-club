import React, { useEffect, useRef, useState, useCallback } from 'react';
import { TapToEnter } from './TapToEnter';
import { IntroControls } from './IntroControls';
import { sportsAudio } from '../../utils/soundSynthesizer';
import './SportsIntro.css';

export type StoryboardSceneType = 'tap' | 'video';

interface SportsIntroProps {
  onEnterArena: () => void;
  onSkip: () => void;
  clubName?: string;
  tagline?: string;
}

export const SportsIntro: React.FC<SportsIntroProps> = ({
  onEnterArena,
  onSkip,
}) => {
  const [currentScene, setCurrentScene] = useState<StoryboardSceneType>('tap');
  const [isMuted, setIsMuted] = useState<boolean>(() => sportsAudio.isMuted);
  const [isEnteringArena, setIsEnteringArena] = useState<boolean>(false);
  const [videoError, setVideoError] = useState<boolean>(false);

  const [watermarkPos, setWatermarkPos] = useState<{
    right: number;
    bottom: number;
    size: number;
    visible: boolean;
  }>({
    right: 104,
    bottom: 112,
    size: 62,
    visible: true,
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasStartedRef = useRef<boolean>(false);
  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Dynamic layout calculation so the logo overlay precisely tracks the video watermark
  const updateWatermarkLayout = useCallback(() => {
    if (typeof window === 'undefined') return;
    const container = containerRef.current;
    const cW = container ? container.clientWidth : window.innerWidth;
    const cH = container ? container.clientHeight : window.innerHeight;
    const vW = 1280;
    const vH = 720;
    const cRatio = cW / cH;
    const vRatio = vW / vH;

    let renderW: number;
    let renderH: number;
    let offsetX: number;
    let offsetY: number;

    if (cRatio > vRatio) {
      // Screen is wider than 16:9
      renderW = cW;
      renderH = cW / vRatio;
      offsetX = 0;
      offsetY = (cH - renderH) / 2;
    } else {
      // Screen is narrower/taller than 16:9 (e.g. mobile portrait)
      renderH = cH;
      renderW = cH * vRatio;
      offsetX = (cW - renderW) / 2;
      offsetY = 0;
    }

    const scale = renderH / vH;
    // Gemini sparkle center in 1280x720 video: X = 1160, Y = 600
    const sparkleCenterX = offsetX + 1160 * scale;
    const sparkleCenterY = offsetY + 600 * scale;

    // Size of logo overlay (slightly larger than the 46.5px watermark to cleanly cover all points)
    const logoSize = Math.max(34, Math.min(76, Math.round(58 * scale)));

    // On narrow portrait screens, if video is cropped horizontally by object-fit: cover,
    // verify if the watermark is still on screen
    const isOffScreen =
      sparkleCenterX > cW + logoSize / 2 ||
      sparkleCenterX < -logoSize / 2 ||
      sparkleCenterY > cH + logoSize / 2 ||
      sparkleCenterY < -logoSize / 2;

    const right = Math.round(cW - sparkleCenterX - logoSize / 2);
    const bottom = Math.round(cH - sparkleCenterY - logoSize / 2);

    setWatermarkPos({
      right: Math.max(8, right),
      bottom: Math.max(8, bottom),
      size: logoSize,
      visible: !isOffScreen && sparkleCenterX <= cW - 4,
    });
  }, []);

  useEffect(() => {
    if (currentScene !== 'video') return;
    updateWatermarkLayout();
    window.addEventListener('resize', updateWatermarkLayout);
    return () => window.removeEventListener('resize', updateWatermarkLayout);
  }, [currentScene, updateWatermarkLayout]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      sportsAudio.stopAllAudio();
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current);
      }
    };
  }, []);

  // Audio mute/unmute toggle (synchronizes with video audio track)
  const handleToggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      sportsAudio.isMuted = next;
      if (videoRef.current) {
        videoRef.current.muted = next;
      }
      return next;
    });
  }, []);

  // Immediate Skip Intro (instant transition & stop audio/video)
  const handleSkip = useCallback(() => {
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
    }
    sportsAudio.stopAllAudio();
    if (videoRef.current) {
      videoRef.current.pause();
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('ignite_skip_intro_pref', 'true');
    }
    onSkip();
  }, [onSkip]);

  // Cinematic Enter Arena warp dive transition into homepage
  const handleEnterArena = useCallback(() => {
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
    }
    sportsAudio.stopAllAudio();
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setIsEnteringArena(true);

    // Warp flash transition into homepage
    setTimeout(() => {
      onEnterArena();
    }, 550);
  }, [onEnterArena]);

  // Transition from TAP TO ENTER to full-screen intro video
  const handleStartIntro = useCallback(() => {
    sportsAudio.stopAllAudio();
    setCurrentScene('video');
  }, []);

  // Handle Video playback lifecycle when entering 'video' scene
  useEffect(() => {
    if (currentScene !== 'video') {
      hasStartedRef.current = false;
      return;
    }
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    video.muted = isMuted;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('[Intro Video] autoplay unmuted restricted, trying muted:', err);
        if (video) {
          video.muted = true;
          video.play().catch((playErr) => {
            console.warn('[Intro Video] playback failed, will wait for user or timeout:', playErr);
          });
        }
      });
    }

    // Failsafe timeout: video is 10s; if stalled beyond 13s, transition to homepage
    fallbackTimerRef.current = setTimeout(() => {
      handleEnterArena();
    }, 13000);

    return () => {
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current);
      }
    };
  }, [currentScene, isMuted, handleEnterArena]);

  // Video error fallback
  const handleVideoError = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
      const video = e.currentTarget;
      console.error('[Intro Video Error]', video.error);
      setVideoError(true);
      // Graceful fallback to arena homepage
      setTimeout(() => {
        handleEnterArena();
      }, 1000);
    },
    [handleEnterArena]
  );

  return (
    <div className={`sports-intro-wrapper ${isEnteringArena ? 'entering-warp' : ''}`}>
      {/* 1. Initial TAP TO ENTER Screen */}
      {currentScene === 'tap' && (
        <TapToEnter
          onEnter={handleStartIntro}
          onSkip={handleSkip}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {/* 2. Full-Screen Cinematic Gemini Intro Video */}
      {currentScene === 'video' && (
        <div ref={containerRef} className="intro-video-container">
          {!videoError ? (
            <>
              <video
                ref={videoRef}
                className="intro-fullscreen-video"
                src="/videos/ignite-intro.mp4"
                playsInline
                autoPlay
                muted={isMuted}
                loop={false}
                controls={false}
                preload="auto"
                onLoadedMetadata={updateWatermarkLayout}
                onEnded={handleEnterArena}
                onError={handleVideoError}
              />

              {/* Watermark Replacement: Original IGNITE Dragon Emblem */}
              {watermarkPos.visible && (
                <div
                  className="intro-watermark-overlay"
                  style={{
                    right: `${watermarkPos.right}px`,
                    bottom: `${watermarkPos.bottom}px`,
                    width: `${watermarkPos.size}px`,
                    height: `${watermarkPos.size}px`,
                  }}
                  aria-hidden="true"
                >
                  <img
                    src="/ignite-dragon-emblem.png"
                    alt=""
                    className="intro-watermark-logo"
                    draggable={false}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="intro-video-fallback">
              <span className="fallback-text">ENTERING IGNITE SPORTS CLUB...</span>
            </div>
          )}

          {/* Top HUD Controls during video playback (Sound Toggle & Skip) */}
          <IntroControls
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            onSkipIntro={handleSkip}
            onReplayIntro={() => {
              if (videoRef.current) {
                videoRef.current.currentTime = 0;
                videoRef.current.play();
              }
            }}
            showReplay={false}
          />
        </div>
      )}

      {/* Cinematic Warp Speedlines Flash upon Entering Website */}
      {isEnteringArena && <div className="arena-warp-flash" aria-hidden="true" />}
    </div>
  );
};

