import React, { useEffect, useState } from "react";
import { Play, Pause, Heart, ListPlus, Music2 } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext.jsx";
import { usePlayer } from "../context/PlayerContext.jsx";

export default function TrackCard({ track, queue, onAddToPlaylist }) {
  const { user } = useAuth();
  const { currentTrack, isPlaying, playQueue, toggle } = usePlayer();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const isCurrent = currentTrack?.id === track.id;

  useEffect(() => {
    let active = true;
    async function loadLikes() {
      const { count } = await supabase
        .from("likes").select("*", { count: "exact", head: true }).eq("track_id", track.id);
      if (active) setLikeCount(count || 0);
      if (user) {
        const { data } = await supabase
          .from("likes").select("*").eq("track_id", track.id).eq("user_id", user.id).maybeSingle();
        if (active) setLiked(!!data);
      }
    }
    loadLikes();
    return () => { active = false; };
  }, [track.id, user]);

  async function toggleLike(e) {
    e.stopPropagation();
    if (!user) return;
    if (liked) {
      await supabase.from("likes").delete().eq("track_id", track.id).eq("user_id", user.id);
      setLiked(false); setLikeCount((c) => Math.max(0, c - 1));
    } else {
      await supabase.from("likes").insert({ track_id: track.id, user_id: user.id });
      setLiked(true); setLikeCount((c) => c + 1);
    }
  }

  function handlePlay() {
    if (isCurrent) { toggle(); return; }
    const list = queue || [track];
    const idx = list.findIndex((t) => t.id === track.id);
    playQueue(list, idx >= 0 ? idx : 0);
  }

  return (
    <div className={`os-track-card ${isCurrent ? "current" : ""}`}>
      <button className="os-track-art" onClick={handlePlay}>
        {track.cover_url ? <img src={track.cover_url} alt="" /> : <Music2 size={22} />}
        <span className="os-track-play-overlay">
          {isCurrent && isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </span>
      </button>
      <div className="os-track-info">
        <div className="os-track-title">{track.title}</div>
        <Link className="os-track-artist" to={`/artist/${track.artist_username}`}>
          {track.artist_username || "Unknown artist"}
        </Link>
      </div>
      <div className="os-track-actions">
        <button className={`os-icon-btn ${liked ? "liked" : ""}`} onClick={toggleLike} title="Like">
          <Heart size={16} fill={liked ? "currentColor" : "none"} /> <span>{likeCount}</span>
        </button>
        {onAddToPlaylist && (
          <button className="os-icon-btn" onClick={(e) => { e.stopPropagation(); onAddToPlaylist(track); }} title="Add to playlist">
            <ListPlus size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
