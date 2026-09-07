import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import TrackCard from "../components/TrackCard.jsx";
import AddToPlaylistModal from "../components/AddToPlaylistModal.jsx";

function flatten(rows) {
  return (rows || []).map((t) => ({
    ...t,
    artist_username: t.profiles?.username,
  }));
}

export default function Home({ search }) {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalTrack, setModalTrack] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    supabase
      .from("tracks")
      .select("*, profiles(username, avatar_url)")
      .order("created_at", { ascending: false })
      .then(({ data }) => { if (active) { setTracks(flatten(data)); setLoading(false); } });
    return () => { active = false; };
  }, []);

  const shown = search
    ? tracks.filter(
        (t) =>
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          (t.artist_username || "").toLowerCase().includes(search.toLowerCase())
      )
    : tracks;

  return (
    <section className="os-section">
      <div className="os-page-heading">
        <h1>New on OpenStage</h1>
        <p>Every track here is uploaded directly by the artist — free to stream, free to share.</p>
      </div>

      {loading && <p className="os-note">Loading tracks…</p>}
      {!loading && shown.length === 0 && (
        <p className="os-note">
          {search ? "No tracks match your search." : "No tracks yet — be the first to upload one."}
        </p>
      )}

      <div className="os-track-list">
        {shown.map((t) => (
          <TrackCard key={t.id} track={t} queue={shown} onAddToPlaylist={setModalTrack} />
        ))}
      </div>

      {modalTrack && <AddToPlaylistModal track={modalTrack} onClose={() => setModalTrack(null)} />}
    </section>
  );
}
