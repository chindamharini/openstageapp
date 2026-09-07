import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, ListMusic } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext.jsx";

export default function Playlists() {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    supabase.from("playlists").select("*").eq("owner_id", user.id).order("created_at", { ascending: false })
      .then(({ data }) => { setPlaylists(data || []); setLoading(false); });
  }, [user]);

  async function create(e) {
    e.preventDefault();
    if (!name.trim()) return;
    const { data, error } = await supabase.from("playlists").insert({ owner_id: user.id, name: name.trim() }).select().single();
    if (!error && data) { setPlaylists((p) => [data, ...p]); setName(""); }
  }

  if (!user) return <section className="os-section"><p className="os-note">Log in to see your playlists.</p></section>;

  return (
    <section className="os-section os-narrow">
      <div className="os-page-heading"><h1>Your playlists</h1></div>

      <form className="os-inline-form" onSubmit={create}>
        <input placeholder="New playlist name" value={name} onChange={(e) => setName(e.target.value)} />
        <button type="submit"><Plus size={16} /></button>
      </form>

      {loading && <p className="os-note">Loading…</p>}
      {!loading && playlists.length === 0 && <p className="os-note">No playlists yet — create one above.</p>}

      <div className="os-playlist-list">
        {playlists.map((p) => (
          <Link key={p.id} to={`/playlist/${p.id}`} className="os-playlist-row">
            <ListMusic size={16} /> {p.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
