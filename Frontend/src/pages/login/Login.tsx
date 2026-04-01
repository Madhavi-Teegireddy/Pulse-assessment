import { useState, useEffect } from "react";
import axios from "axios";
import "../login/losin.css";
 
export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showPass, setShowPass] = useState(false);
 
  useEffect(() => {
    setMounted(true);
  }, []);
 
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
 
  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      alert("Login success");
      console.log(res.data);
      // store token: localStorage.setItem("token", res.data.token);
    } catch (err: any) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <>
      <div className="login-root">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="grid-overlay" />
 
        <div className={`card ${mounted ? "mounted" : ""}`}>
 
          {/* Logo */}
          <div className="logo-area">
            <div className="logo-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
                <path d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/>
              </svg>
            </div>
            <span className="logo-name">VideoSafe</span>
          </div>
 
          <h1 className="heading">Welcome back</h1>
          <p className="subheading">Sign in to your account to continue</p>
 
          <form className="form" onSubmit={handleLogin}>
 
            {/* Email */}
            <div className="field-wrapper">
              <label className="field-label">Email Address</label>
              <div className="input-wrap">
                <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="2" y="4" width="20" height="16" rx="3"/>
                  <path d="M2 7l10 7 10-7"/>
                </svg>
                <input
                  className="field-input"
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
 
            {/* Password */}
            <div className="field-wrapper">
              <label className="field-label">Password</label>
              <div className="input-wrap">
                <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="5" y="11" width="14" height="10" rx="2"/>
                  <path d="M8 11V7a4 4 0 018 0v4"/>
                </svg>
                <input
                  className="field-input"
                  type={showPass ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  style={{ paddingRight: "44px" }}
                />
                <button
                  type="button"
                  className="toggle-pass"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
 
            {/* Forgot password */}
            <div className="forgot-row">
              <span className="forgot-link">Forgot password?</span>
            </div>
 
            <button type="submit" className="submit-btn" disabled={loading}>
              <span className="btn-shimmer" />
              {loading ? (
                <><span className="spinner" />Signing in...</>
              ) : (
                "Sign In →"
              )}
            </button>
 
          </form>
 
          <p className="footer-text">
            Don't have an account?{" "}
            <span className="footer-link">Create one</span>
          </p>
 
        </div>
      </div>
    </>
  );
}