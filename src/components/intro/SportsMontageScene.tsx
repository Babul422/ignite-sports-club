import React, { useEffect, useRef } from 'react';
import './SportsMontageScene.css';

interface SportsMontageSceneProps {
  active: boolean;
  reducedMotion?: boolean;
}

interface SportPanelData {
  id: string;
  number: string;
  title: string;
  tagline: string;
  videoSrc: string;
  videoType: string;
  panelClass: string;
}

const SPORTS_PANELS: SportPanelData[] = [
  {
    id: 'football',
    number: '01',
    title: 'FOOTBALL',
    tagline: 'PRECISION STRIKE • GOAL FINISH',
    videoSrc: '/videos/football-goal.mp4',
    videoType: 'video/mp4',
    panelClass: 'panel-football',
  },
  {
    id: 'cricket',
    number: '02',
    title: 'CRICKET',
    tagline: 'POWER DRIVE • WILLOW CONTACT',
    videoSrc: '/videos/cricket-hit.webm',
    videoType: 'video/webm',
    panelClass: 'panel-cricket',
  },
  {
    id: 'badminton',
    number: '03',
    title: 'BADMINTON',
    tagline: 'HYPERSONIC SMASH • COURT RALLY',
    videoSrc: '/videos/badminton-smash.mp4',
    videoType: 'video/mp4',
    panelClass: 'panel-badminton',
  },
  {
    id: 'basketball',
    number: '04',
    title: 'BASKETBALL',
    tagline: 'ELEVATION SHOT • CLEAN SWISH',
    videoSrc: '/videos/basketball-shot.mp4',
    videoType: 'video/mp4',
    panelClass: 'panel-basketball',
  },
];

export const SportsMontageScene: React.FC<SportsMontageSceneProps> = ({
  active,
  reducedMotion = false,
}) => {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Start video playback when montage becomes active
  useEffect(() => {
    if (!active) return;
    videoRefs.current.forEach((video) => {
      if (!video) return;
      video.currentTime = 0;
      const promise = video.play();
      if (promise !== undefined) {
        promise.catch(() => {});
      }
    });
  }, [active]);

  if (!active) return null;

  return (
    <div
      className={`sports-montage-container ${active ? 'is-active' : ''} ${
        reducedMotion ? 'reduced-motion' : ''
      }`}
      role="region"
      aria-label="IGNITE Sports Club 4-Discipline Montage"
    >
      {/* Top HUD Badge */}
      <div className="montage-header-hud">
        <div className="montage-hud-badge">
          <span className="montage-hud-pulse" />
          <span className="montage-hud-text">IGNITE SPORTS CLUB • 4 DISCIPLINES</span>
        </div>
      </div>

      {/* 4-Panel Split Stage */}
      <div className="montage-split-stage">
        {SPORTS_PANELS.map((panel, idx) => (
          <div
            key={panel.id}
            className={`montage-panel ${panel.panelClass}`}
            tabIndex={0}
            role="article"
            aria-label={`${panel.title} discipline`}
          >
            {/* Real Licensed Sport Footage Video */}
            <video
              ref={(el) => {
                videoRefs.current[idx] = el;
              }}
              className="montage-panel-video"
              src={panel.videoSrc}
              muted
              playsInline
              autoPlay
              loop
            />

            {/* Cinematic Storyboard Color Accent Overlay */}
            <div className="montage-color-tint" aria-hidden="true" />

            {/* Bottom Dark Gradient Vignette */}
            <div className="montage-vignette" aria-hidden="true" />

            {/* Neon Vertical Divider Beam */}
            <div className="montage-neon-divider" aria-hidden="true" />

            {/* Sport Info & Action Tag */}
            <div className="montage-panel-content">
              <div className="montage-badge-row">
                <span className="montage-number">{panel.number}</span>
              </div>
              <h3 className="montage-sport-title">{panel.title}</h3>
              <p className="montage-sport-tagline">{panel.tagline}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
