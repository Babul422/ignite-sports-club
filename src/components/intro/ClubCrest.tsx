import React from 'react';
import './ClubCrest.css';

interface ClubCrestProps {
  visible: boolean;
  clubName?: string;
  tagline?: string;
  onEnterArena: () => void;
  onSkipIntro: () => void;
  isAudioMuted: boolean;
  onToggleAudio: () => void;
}

export const ClubCrest: React.FC<ClubCrestProps> = ({
  visible,
  clubName = 'IGNITE SPORTS CLUB',
  tagline = 'PLAY. COMPETE. GROW. TOGETHER.',
  onEnterArena,
  onSkipIntro,
  isAudioMuted,
  onToggleAudio,
}) => {
  return (
    <div className={`club-crest-overlay ${visible ? 'is-visible' : ''}`}>
      {/* Cosmic Speed Blur Radial Backdrop */}
      <div className="radial-speed-lines" aria-hidden="true" />

      {/* Main Crest Content Container */}
      <div className="crest-content-box">
        {/* Official IGNITE Sports Club Uploaded Logo Asset */}
        <div className="crest-emblem-wrap">
          <img
            src="/ignite-logo.jpg"
            alt="IGNITE SPORTS CLUB — EST. 2026"
            className="ignite-official-emblem-img"
            loading="eager"
          />
        </div>

        {/* Club Title & Athletic Tagline */}
        <div className="crest-typography">
          <div className="club-badge-ticker">
            <span className="ticker-dot" />
            OFFICIAL ATHLETIC CLUB • EST. 2026
          </div>
          <h1 className="club-title-text">{clubName}</h1>
          <p className="club-tagline-text">{tagline}</p>
        </div>

        {/* Action Controls */}
        <div className="crest-action-row">
          <button
            type="button"
            className="sports-cut-button primary enter-arena-btn"
            onClick={onEnterArena}
          >
            <span>ENTER ARENA</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          <button
            type="button"
            className="sports-cut-button secondary skip-intro-btn"
            onClick={onSkipIntro}
          >
            <span>SKIP INTRO</span>
          </button>
        </div>

        {/* Audio Status & Sound Indicator */}
        <div className="crest-sound-indicator">
          <button
            type="button"
            className="audio-pill-btn"
            onClick={onToggleAudio}
            aria-label={isAudioMuted ? 'Unmute sound effects' : 'Mute sound effects'}
          >
            <span className={`audio-dot ${!isAudioMuted ? 'active' : ''}`} />
            <span>{isAudioMuted ? 'AUDIO: OFF' : 'AUDIO: LIVE'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
