import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { X } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext.jsx";
import { usePlayer } from "../context/PlayerContext.jsx";

export default function Playlist() {
  const { id } = useParams();
  const { user } = useAuth();
  const { playQueue, currentTrack, isPlaying, toggle } = usePlayer();
  const [playlist, setPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    (async () => {
      const { data: pl } = await supabase.from("playlists").select("*").eq("id", id).maybeSingle();
      if (!active) return;
      setPlaylist(pl);
      const { data: rows } = await supabase
        .from("playlist_tracks")
        .select("position, tracks(*, profiles(username))")
        .eq("playlist_id", id)
        .order("position", { ascending: true });
      const flat = (rows || []).map((r) => ({ ...r.tracks, artist_username: r.tracks?.profiles?.username })).filter(Boolean);
      setTracks(flat);
      setLoading(false);
    })();
    return () => { active = false; };
  }, [id]);

  async function removeTrack(trackId) {
    await supabase.from("playlist_tracks").delete().eq("playlist_id", id).eq("track_id", trackId);
    setTracks((t) => t.filter((tr) => tr.id !== trackId));
  }

  if (loading) return <section className="os-section"><p className="os-note">Loading…</p></section>;
  if (!playlist) return <section className="os-section"><p className="os-note">Playlist not found.</p></section>;

  const isOwner = user?.id === playlist.owner_id;

  return (
    <section className="os-section">
      <div className="os-page-heading">
        <h1>{playlist.name}</h1>
        <p>{tracks.length} track{tracks.length === 1 ? "" : "s"}</p>
      </div>

      {tracks.length > 0 && (
        <button className="os-btn primary" onClick={() => playQueue(tracks, 0)} style={{ marginBottom: 20 }}>
          Play all
        </button>
      )}

      <div className="os-simple-list">
        {tracks.map((t, i) => {
          const isCurrent = currentTrack?.id === t.id;
          return (
            <div key={t.id} className={`os-simple-row ${isCurrent ? "current" : ""}`}>
              <button className="os-simple-row-main" onClick={() => (isCurrent ? toggle() : playQueue(tracks, i))}>
                <span className="os-simple-row-title">{t.title}</span>
                <span className="os-simple-row-artist">{t.artist_username}</span>
              </button>
              {isOwner && (
                <button className="os-icon-btn" onClick={() => removeTrack(t.id)} title="Remove"><X size={15} /></button>
              )}
            </div>
          );
        })}
      </div>
      {tracks.length === 0 && <p className="os-note">No tracks in this playlist yet — add some from the home page.</p>}
    </section>
  );
}
