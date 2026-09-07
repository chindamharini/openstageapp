import React, { useEffect, useState } from "react";
import { X, Plus, Check } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext.jsx";

export default function AddToPlaylistModal({ track, onClose }) {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [added, setAdded] = useState({});
  const [newName, setNewName] = useState("");

  useEffect(() => {
    if (!user) return;
    supabase.from("playlists").select("*").eq("owner_id", user.id).order("created_at", { ascending: false })
      .then(({ data }) => setPlaylists(data || []));
  }, [user]);

  async function addTo(playlistId) {
    await supabase.from("playlist_tracks").insert({ playlist_id: playlistId, track_id: track.id });
    setAdded((a) => ({ ...a, [playlistId]: true }));
  }

  async function createAndAdd(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    const { data, error } = await supabase
      .from("playlists").insert({ owner_id: user.id, name: newName.trim() }).select().single();
    if (!error && data) {
      setPlaylists((p) => [data, ...p]);
      await addTo(data.id);
      setNewName("");
    }
  }

  if (!track) return null;

  return (
    <div className="os-modal-backdrop" onClick={onClose}>
      <div className="os-modal" onClick={(e) => e.stopPropagation()}>
        <div className="os-modal-head">
          <h3>Add "{track.title}" to a playlist</h3>
          <button onClick={onClose}><X size={18} /></button>
        </div>
        <form className="os-inline-form" onSubmit={createAndAdd}>
          <input placeholder="New playlist name" value={newName} onChange={(e) => setNewName(e.target.value)} />
          <button type="submit"><Plus size={16} /></button>
        </form>
        <div className="os-modal-list">
          {playlists.length === 0 && <p className="os-note">You don't have any playlists yet — create one above.</p>}
          {playlists.map((p) => (
            <button key={p.id} className="os-modal-list-item" onClick={() => addTo(p.id)} disabled={added[p.id]}>
              <span>{p.name}</span>
              {added[p.id] && <Check size={15} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
