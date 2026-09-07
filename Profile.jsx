import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserPlus, UserCheck, Music2 } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext.jsx";
import TrackCard from "../components/TrackCard.jsx";
import AddToPlaylistModal from "../components/AddToPlaylistModal.jsx";

export default function Profile() {
  const { username } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [following, setFollowing] = useState(false);
  const [modalTrack, setModalTrack] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    (async () => {
      const { data: p } = await supabase.from("profiles").select("*").eq("username", username).maybeSingle();
      if (!active) return;
      setProfile(p);
      if (p) {
        const { data: t } = await supabase.from("tracks").select("*").eq("artist_id", p.id).order("created_at", { ascending: false });
        setTracks((t || []).map((tr) => ({ ...tr, artist_username: username })));
        const { count } = await supabase.from("follows").select("*", { count: "exact", head: true }).eq("followee_id", p.id);
        setFollowerCount(count || 0);
        if (user) {
          const { data: f } = await supabase.from("follows").select("*").eq("follower_id", user.id).eq("followee_id", p.id).maybeSingle();
          setFollowing(!!f);
        }
      }
      setLoading(false);
    })();
    return () => { active = false; };
  }, [username, user]);

  async function toggleFollow() {
    if (!user || !profile) return;
    if (following) {
      await supabase.from("follows").delete().eq("follower_id", user.id).eq("followee_id", profile.id);
      setFollowing(false); setFollowerCount((c) => Math.max(0, c - 1));
    } else {
      await supabase.from("follows").insert({ follower_id: user.id, followee_id: profile.id });
      setFollowing(true); setFollowerCount((c) => c + 1);
    }
  }

  if (loading) return <section className="os-section"><p className="os-note">Loading…</p></section>;
  if (!profile) return <section className="os-section"><p className="os-note">No artist found at @{username}.</p></section>;

  const isSelf = user?.id === profile.id;

  return (
    <section className="os-section">
      <div className="os-profile-head">
        <div className="os-profile-avatar">
          {profile.avatar_url ? <img src={profile.avatar_url} alt="" /> : <Music2 size={28} />}
        </div>
        <div>
          <h1>@{profile.username}</h1>
          {profile.bio && <p>{profile.bio}</p>}
          <p className="os-note">{followerCount} follower{followerCount === 1 ? "" : "s"} · {tracks.length} track{tracks.length === 1 ? "" : "s"}</p>
        </div>
        {user && !isSelf && (
          <button className={`os-btn ${following ? "ghost" : "primary"}`} onClick={toggleFollow}>
            {following ? <><UserCheck size={15} /> Following</> : <><UserPlus size={15} /> Follow</>}
          </button>
        )}
      </div>

      <div className="os-track-list">
        {tracks.map((t) => <TrackCard key={t.id} track={t} queue={tracks} onAddToPlaylist={setModalTrack} />)}
      </div>
      {tracks.length === 0 && <p className="os-note">No tracks uploaded yet.</p>}

      {modalTrack && <AddToPlaylistModal track={modalTrack} onClose={() => setModalTrack(null)} />}
    </section>
  );
}
