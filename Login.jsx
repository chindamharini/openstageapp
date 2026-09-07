import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      await signIn(form);
      navigate("/");
    } catch (err) {
      setError(err.message || "Couldn't log in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="os-section os-narrow">
      <div className="os-page-heading">
        <h1>Log in</h1>
      </div>
      <form className="os-form" onSubmit={submit}>
        <div className="os-field"><label>Email</label>
          <input required type="email" value={form.email} onChange={set("email")} /></div>
        <div className="os-field"><label>Password</label>
          <input required type="password" value={form.password} onChange={set("password")} /></div>
        {error && <p className="os-error">{error}</p>}
        <button className="os-btn primary full" disabled={loading}>{loading ? "Logging in…" : "Log in"}</button>
      </form>
      <p className="os-note">New here? <Link to="/signup">Create a free account</Link></p>
    </section>
  );
}
