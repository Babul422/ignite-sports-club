import React from 'react';
import { Volume2, VolumeX, RotateCcw, FastForward } from 'lucide-react';
import './IntroControls.css';

interface IntroControlsProps {
  isMuted: boolean;
  onToggleMute: () => void;
  onSkipIntro: () => void;
  onReplayIntro: () => void;
  showReplay?: boolean;
}

export const IntroControls: React.FC<IntroControlsProps> = ({
  isMuted,
  onToggleMute,
  onSkipIntro,
  onReplayIntro,
  showReplay = false,
}) => {
  return (
    <div className="intro-hud-controls" role="toolbar" aria-label="Intro controls">
      {/* Audio Toggle Button */}
      <button
        type="button"
        className={`hud-btn audio-btn ${!isMuted ? 'active' : ''}`}
        onClick={onToggleMute}
        title={isMuted ? 'Unmute Sound FX' : 'Mute Sound FX'}
        aria-label={isMuted ? 'Unmute Sound FX' : 'Mute Sound FX'}
      >
        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        <span className="hud-btn-label">{isMuted ? 'MUTE' : 'AUDIO ON'}</span>
      </button>

      {/* Replay Button if intro has completed */}
      {showReplay && (
        <button
          type="button"
          className="hud-btn replay-btn"
          onClick={onReplayIntro}
          title="Replay Cinematic Intro"
          aria-label="Replay Cinematic Intro"
        >
          <RotateCcw size={16} />
          <span className="hud-btn-label">REPLAY</span>
        </button>
      )}

      {/* Instant Skip Intro HUD */}
      <button
        type="button"
        className="hud-btn skip-btn"
        onClick={onSkipIntro}
        title="Skip Intro to Homepage"
        aria-label="Skip Intro to Homepage"
      >
        <FastForward size={16} />
        <span className="hud-btn-label">SKIP</span>
      </button>
    </div>
  );
};
