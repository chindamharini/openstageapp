import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { PlayerProvider } from "./context/PlayerContext.jsx";
import NavBar from "./components/NavBar.jsx";
import PlayerBar from "./components/PlayerBar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Upload from "./pages/Upload.jsx";
import Profile from "./pages/Profile.jsx";
import Playlists from "./pages/Playlists.jsx";
import Playlist from "./pages/Playlist.jsx";

export default function App() {
  const [search, setSearch] = useState("");

  return (
    <AuthProvider>
      <PlayerProvider>
        <div className="os-root">
          <GlobalStyle />
          <NavBar search={search} setSearch={setSearch} />
          <main className="os-main">
            <Routes>
              <Route path="/" element={<Home search={search} />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/artist/:username" element={<Profile />} />
              <Route path="/playlists" element={<Playlists />} />
              <Route path="/playlist/:id" element={<Playlist />} />
            </Routes>
          </main>
          <PlayerBar />
        </div>
      </PlayerProvider>
    </AuthProvider>
  );
}

function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');

      .os-root {
        --bg: #0B0B0F; --surface: #17161D; --surface-2: #1F1E27;
        --indigo: #7C5CFF; --coral: #FF6659; --text: #F2F1F7; --muted: #8D8B99;
        --border: rgba(242,241,247,0.09);
        background: var(--bg); color: var(--text);
        font-family: 'Inter', sans-serif;
        min-height: 100vh; display:flex; flex-direction:column;
      }
      .os-root * { box-sizing: border-box; }
      .os-root h1, .os-root h2, .os-root h3 { font-family: 'Space Grotesk', sans-serif; font-weight:600; margin:0; }
      .os-root p { color: var(--muted); line-height:1.6; margin:0; }
      .os-root a { color: var(--indigo); text-decoration:none; }
      .os-root button, .os-root input, .os-root select { font-family:'Inter', sans-serif; }

      /* Nav */
      .os-nav { display:flex; align-items:center; gap:20px; padding:16px 28px; border-bottom:1px solid var(--border); position:sticky; top:0; background:rgba(11,11,15,0.9); backdrop-filter: blur(10px); z-index:30; flex-wrap:wrap; }
      .os-logo { font-family:'Space Grotesk', sans-serif; font-weight:700; font-size:19px; color:var(--text) !important; letter-spacing:-0.02em; }
      .os-search { flex:1; max-width:420px; display:flex; align-items:center; gap:8px; background:var(--surface); border:1px solid var(--border); border-radius:8px; padding:9px 12px; color:var(--muted); }
      .os-search input { flex:1; background:none; border:none; outline:none; color:var(--text); font-size:13.5px; }
      .os-nav-actions { display:flex; align-items:center; gap:10px; margin-left:auto; }
      .os-icon-btn { display:flex; align-items:center; gap:5px; background:none; border:none; color:var(--muted); padding:7px; border-radius:6px; font-size:12px; }
      .os-icon-btn:hover { color:var(--text); background:var(--surface); }
      .os-icon-btn.liked { color: var(--coral); }

      /* Buttons */
      .os-btn { font-size:13.5px; font-weight:500; padding:10px 18px; border-radius:8px; display:inline-flex; align-items:center; gap:7px; border:1px solid transparent; }
      .os-btn.primary { background: var(--indigo); color:#fff; }
      .os-btn.ghost { background:none; border-color:var(--border); color:var(--text); }
      .os-btn.full { width:100%; justify-content:center; }
      .os-btn:disabled { opacity:0.6; }

      .os-main { flex:1; max-width:900px; margin:0 auto; width:100%; padding:0 28px 120px; }
      .os-section { padding:40px 0; }
      .os-narrow { max-width:420px; }
      .os-page-heading { margin-bottom:28px; }
      .os-page-heading h1 { font-size:28px; }
      .os-page-heading p { margin-top:6px; font-size:14px; }
      .os-note { color:var(--muted); font-size:13.5px; }
      .os-error { color: var(--coral); font-size:13px; }

      /* Forms */
      .os-form { display:flex; flex-direction:column; gap:16px; }
      .os-field label { display:block; font-size:12px; color:var(--muted); margin-bottom:6px; }
      .os-field input, .os-field select { width:100%; padding:11px 13px; border:1px solid var(--border); border-radius:8px; background:var(--surface); color:var(--text); font-size:14px; }
      .os-field input:focus { outline:2px solid var(--indigo); outline-offset:1px; }
      .os-checkbox { display:flex; align-items:center; gap:8px; font-size:13.5px; color:var(--text); }
      .os-rights-agreement { align-items:flex-start; gap:10px; font-size:12.5px; color:var(--muted); line-height:1.5; background:var(--surface); border:1px solid var(--border); border-radius:8px; padding:12px 14px; }
      .os-rights-agreement input { margin-top:2px; flex-shrink:0; }
      .os-inline-form { display:flex; gap:8px; margin-bottom:20px; }
      .os-inline-form input { flex:1; padding:10px 13px; border:1px solid var(--border); border-radius:8px; background:var(--surface); color:var(--text); }
      .os-inline-form button { background:var(--indigo); border:none; color:#fff; border-radius:8px; padding:0 14px; display:flex; align-items:center; }

      /* Track list / card */
      .os-track-list { display:flex; flex-direction:column; gap:8px; }
      .os-track-card { display:flex; align-items:center; gap:14px; padding:10px; border-radius:10px; border:1px solid transparent; }
      .os-track-card:hover, .os-track-card.current { background:var(--surface); border-color:var(--border); }
      .os-track-art { position:relative; width:48px; height:48px; border-radius:6px; background:var(--surface-2); border:none; display:flex; align-items:center; justify-content:center; color:var(--muted); overflow:hidden; flex-shrink:0; }
      .os-track-art img { width:100%; height:100%; object-fit:cover; }
      .os-track-play-overlay { position:absolute; inset:0; background:rgba(0,0,0,0.45); display:flex; align-items:center; justify-content:center; color:#fff; opacity:0; transition:opacity .15s; }
      .os-track-art:hover .os-track-play-overlay { opacity:1; }
      .os-track-info { flex:1; min-width:0; }
      .os-track-title { font-size:14.5px; font-weight:500; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
      .os-track-artist { font-size:12.5px; color:var(--muted) !important; }
      .os-track-actions { display:flex; align-items:center; gap:4px; }

      /* Simple list (playlist view) */
      .os-simple-list { display:flex; flex-direction:column; gap:2px; }
      .os-simple-row { display:flex; align-items:center; justify-content:space-between; padding:8px 10px; border-radius:8px; }
      .os-simple-row:hover, .os-simple-row.current { background:var(--surface); }
      .os-simple-row-main { flex:1; display:flex; justify-content:space-between; background:none; border:none; text-align:left; color:var(--text); padding:0; }
      .os-simple-row-title { font-size:14px; }
      .os-simple-row-artist { font-size:12.5px; color:var(--muted); }

      /* Playlists index */
      .os-playlist-list { display:flex; flex-direction:column; gap:4px; }
      .os-playlist-row { display:flex; align-items:center; gap:10px; padding:11px 12px; border-radius:8px; color:var(--text) !important; }
      .os-playlist-row:hover { background:var(--surface); }

      /* Profile */
      .os-profile-head { display:flex; align-items:center; gap:18px; margin-bottom:32px; flex-wrap:wrap; }
      .os-profile-avatar { width:76px; height:76px; border-radius:50%; background:var(--surface-2); display:flex; align-items:center; justify-content:center; color:var(--muted); overflow:hidden; }
      .os-profile-avatar img { width:100%; height:100%; object-fit:cover; }

      /* Modal */
      .os-modal-backdrop { position:fixed; inset:0; background:rgba(0,0,0,0.6); display:flex; align-items:center; justify-content:center; z-index:100; padding:20px; }
      .os-modal { background:var(--surface); border:1px solid var(--border); border-radius:12px; max-width:400px; width:100%; padding:22px; max-height:80vh; overflow:auto; }
      .os-modal-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }
      .os-modal-head button { background:none; border:none; color:var(--muted); }
      .os-modal-list { display:flex; flex-direction:column; gap:4px; margin-top:14px; }
      .os-modal-list-item { display:flex; justify-content:space-between; padding:10px 12px; border-radius:8px; background:var(--surface-2); border:none; color:var(--text); }
      .os-modal-list-item:disabled { opacity:0.5; }

      /* Player bar */
      .os-playerbar { position:fixed; bottom:0; left:0; right:0; height:76px; background:var(--surface); border-top:1px solid var(--border); display:flex; align-items:center; gap:24px; padding:0 24px; z-index:50; }
      .os-playerbar-track { display:flex; align-items:center; gap:12px; width:220px; flex-shrink:0; }
      .os-playerbar-art { width:44px; height:44px; border-radius:6px; background:var(--surface-2); display:flex; align-items:center; justify-content:center; color:var(--muted); overflow:hidden; }
      .os-playerbar-art img { width:100%; height:100%; object-fit:cover; }
      .os-playerbar-title { font-size:13.5px; font-weight:500; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:150px; }
      .os-playerbar-artist { font-size:11.5px; color:var(--muted); }
      .os-playerbar-controls { flex:1; display:flex; flex-direction:column; align-items:center; gap:6px; }
      .os-playerbar-buttons { display:flex; align-items:center; gap:16px; }
      .os-playerbar-buttons button { background:none; border:none; color:var(--text); }
      .os-play-toggle { width:34px; height:34px; border-radius:50%; background:var(--indigo) !important; display:flex; align-items:center; justify-content:center; color:#fff !important; }
      .os-playerbar-seek { display:flex; align-items:center; gap:10px; width:100%; max-width:480px; font-size:11px; color:var(--muted); }
      .os-playerbar-seek input { flex:1; accent-color: var(--indigo); }

      @media (max-width: 700px) {
        .os-search { display:none; }
        .os-playerbar-track { width:auto; }
        .os-playerbar-title { max-width:90px; }
      }
    `}</style>
  );
}
