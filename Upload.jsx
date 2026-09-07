import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud, Check } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext.jsx";

function slug() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export default function Upload() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [rightsConfirmed, setRightsConfirmed] = useState(false);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!user) {
    return (
      <section className="os-section os-narrow">
        <p className="os-note">You need to be logged in to upload. <a href="/login">Log in</a></p>
      </section>
    );
  }
  if (profile && !profile.is_artist) {
    return (
      <section className="os-section os-narrow">
        <p className="os-note">Your account isn't marked as an artist account. Update that in your profile to upload tracks.</p>
      </section>
    );
  }

  function getDuration(file) {
    return new Promise((resolve) => {
      const audio = document.createElement("audio");
      audio.preload = "metadata";
      audio.onloadedmetadata = () => resolve(Math.round(audio.duration) || null);
      audio.onerror = () => resolve(null);
      audio.src = URL.createObjectURL(file);
    });
  }

  async function submit(e) {
    e.preventDefault();
    if (!audioFile || !title.trim()) return;
    if (!rightsConfirmed) {
      setError("You need to confirm you own the rights to this track before uploading.");
      return;
    }
    setBusy(true); setError(""); setStatus("Uploading audio…");
    try {
      const id = slug();
      const audioPath = `${user.id}/${id}-${audioFile.name}`;
      const { error: audioErr } = await supabase.storage.from("tracks").upload(audioPath, audioFile);
      if (audioErr) throw audioErr;
      const { data: audioPublic } = supabase.storage.from("tracks").getPublicUrl(audioPath);

      let coverUrl = null;
      if (coverFile) {
        setStatus("Uploading cover art…");
        const coverPath = `${user.id}/${id}-${coverFile.name}`;
        const { error: coverErr } = await supabase.storage.from("covers").upload(coverPath, coverFile);
        if (coverErr) throw coverErr;
        coverUrl = supabase.storage.from("covers").getPublicUrl(coverPath).data.publicUrl;
      }

      setStatus("Reading duration…");
      const duration = await getDuration(audioFile);

      setStatus("Saving track…");
      const { error: insertErr } = await supabase.from("tracks").insert({
        artist_id: user.id,
        title: title.trim(),
        audio_url: audioPublic.publicUrl,
        cover_url: coverUrl,
        duration_seconds: duration,
        rights_confirmed: true,
        rights_confirmed_at: new Date().toISOString(),
      });
      if (insertErr) throw insertErr;

      setStatus("done");
      setTimeout(() => navigate("/"), 900);
    } catch (err) {
      setError(err.message || "Upload failed.");
      setStatus("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="os-section os-narrow">
      <div className="os-page-heading">
        <h1>Upload a track</h1>
        <p>MP3 or WAV work best. Cover art is optional but recommended.</p>
      </div>
      <form className="os-form" onSubmit={submit}>
        <div className="os-field"><label>Title</label>
          <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Track name" /></div>
        <div className="os-field"><label>Audio file</label>
          <input required type="file" accept="audio/*" onChange={(e) => setAudioFile(e.target.files[0])} /></div>
        <div className="os-field"><label>Cover art (optional)</label>
          <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files[0])} /></div>

        <label className="os-checkbox os-rights-agreement">
          <input
            type="checkbox"
            checked={rightsConfirmed}
            onChange={(e) => setRightsConfirmed(e.target.checked)}
          />
          <span>
            I confirm I own this recording (or have permission from whoever does) to upload
            and stream it here. I understand OpenStage can remove any track and my account
            if this isn't true.
          </span>
        </label>

        {error && <p className="os-error">{error}</p>}
        <button className="os-btn primary full" disabled={busy || !rightsConfirmed}>
          {status === "done" ? <><Check size={16} /> Uploaded</> : busy ? status : <><UploadCloud size={16} /> Upload track</>}
        </button>
      </form>
    </section>
  );
}
