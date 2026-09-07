import React from "react";
import { Play, Pause, SkipBack, SkipForward, Music2 } from "lucide-react";
import { usePlayer } from "../context/PlayerContext.jsx";

function fmt(sec) {
  if (!sec || isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function PlayerBar() {
  const { currentTrack, isPlaying, progress, duration, toggle, next, prev, seek } = usePlayer();

  if (!currentTrack) return null;

  return (
    <div className="os-playerbar">
      <div className="os-playerbar-track">
        <div className="os-playerbar-art">
          {currentTrack.cover_url ? <img src={currentTrack.cover_url} alt="" /> : <Music2 size={18} />}
        </div>
        <div>
          <div className="os-playerbar-title">{currentTrack.title}</div>
          <div className="os-playerbar-artist">{currentTrack.artist_username || "Unknown artist"}</div>
        </div>
      </div>

      <div className="os-playerbar-controls">
        <div className="os-playerbar-buttons">
          <button onClick={prev}><SkipBack size={18} /></button>
          <button className="os-play-toggle" onClick={toggle}>
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button onClick={next}><SkipForward size={18} /></button>
        </div>
        <div className="os-playerbar-seek">
          <span>{fmt(progress)}</span>
          <input
            type="range" min={0} max={duration || 0} value={progress}
            onChange={(e) => seek(Number(e.target.value))}
          />
          <span>{fmt(duration)}</span>
        </div>
      </div>
    </div>
  );
}
