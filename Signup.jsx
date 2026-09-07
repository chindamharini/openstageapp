import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Signup() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", username: "", isArtist: false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      await signUp(form);
      navigate("/");
    } catch (err) {
      setError(err.message || "Couldn't create your account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="os-section os-narrow">
      <div className="os-page-heading">
        <h1>Create your free account</h1>
      </div>
      <form className="os-form" onSubmit={submit}>
        <div className="os-field"><label>Username</label>
          <input required value={form.username} onChange={set("username")} placeholder="how you'll appear to others" /></div>
        <div className="os-field"><label>Email</label>
          <input required type="email" value={form.email} onChange={set("email")} /></div>
        <div className="os-field"><label>Password</label>
          <input required type="password" minLength={6} value={form.password} onChange={set("password")} /></div>
        <label className="os-checkbox">
          <input type="checkbox" checked={form.isArtist} onChange={(e) => setForm((f) => ({ ...f, isArtist: e.target.checked }))} />
          I'm an artist — I want to upload my own music
        </label>
        {error && <p className="os-error">{error}</p>}
        <button className="os-btn primary full" disabled={loading}>{loading ? "Creating account…" : "Sign up free"}</button>
      </form>
      <p className="os-note">Already have an account? <Link to="/login">Log in</Link></p>
    </section>
  );
}
