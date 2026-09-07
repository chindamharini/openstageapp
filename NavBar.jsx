import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Upload, ListMusic, LogOut, User } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function NavBar({ search, setSearch }) {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="os-nav">
      <Link to="/" className="os-logo">OpenStage</Link>

      <div className="os-search">
        <Search size={16} />
        <input
          placeholder="Search tracks or artists"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="os-nav-actions">
        {user ? (
          <>
            {profile?.is_artist && (
              <button className="os-icon-btn" title="Upload" onClick={() => navigate("/upload")}>
                <Upload size={18} />
              </button>
            )}
            <button className="os-icon-btn" title="Playlists" onClick={() => navigate("/playlists")}>
              <ListMusic size={18} />
            </button>
            <button className="os-icon-btn" title={profile?.username || "Profile"} onClick={() => navigate(`/artist/${profile?.username}`)}>
              <User size={18} />
            </button>
            <button className="os-icon-btn" title="Sign out" onClick={signOut}>
              <LogOut size={18} />
            </button>
          </>
        ) : (
          <>
            <Link className="os-btn ghost" to="/login">Log in</Link>
            <Link className="os-btn primary" to="/signup">Sign up free</Link>
          </>
        )}
      </div>
    </header>
  );
}
