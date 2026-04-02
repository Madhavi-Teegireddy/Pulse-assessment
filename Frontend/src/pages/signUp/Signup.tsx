import { useState, useEffect } from "react";
import axios from "axios";
import "./Signup.css";
import { useNavigate } from "react-router-dom";
 
export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);
  const [mounted, setMounted] = useState(false);

  const navigate = useNavigate();
 
  useEffect(() => {
    setMounted(true);
  }, []);
 
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
 
  const handleSignup = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post("https://pulse-assessment.onrender.com/api/auth/signup", form);
      localStorage.setItem("token", res.data.token);
      alert("Signup success");
      navigate("/dashboard");
      console.log(res.data);
    } catch (err: any) {
      alert(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <>
      <div className="signup-root">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="grid-overlay" />
 
        <div className={`card ${mounted ? "mounted" : ""}`}>
 
          {/* Logo */}
          <div className="logo-area">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/>
              </svg>
            </div>
            <span className="logo-name">VideoSafe</span>
          </div>
 
          <h1 className="heading">Create account</h1>
          <p className="subheading">Upload, analyse and stream your videos</p>
 
          <form className="form" onSubmit={handleSignup}>
 
            {/* Name */}
            <div className="field-wrapper">
              <label className="field-label">Full Name</label>
              <div className="input-wrap">
                <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                </svg>
                <input
                  className="field-input"
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
 
            {/* Email */}
            <div className="field-wrapper">
              <label className="field-label">Email Address</label>
              <div className="input-wrap">
                <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="2" y="4" width="20" height="16" rx="3"/><path d="M2 7l10 7 10-7"/>
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
                  <rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/>
                </svg>
                <input
                  className="field-input"
                  type={showPass ? "text" : "password"}
                  name="password"
                  placeholder="Min. 8 characters"
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
              {/* Password strength bars */}
              {form.password.length > 0 && (
                <div className="strength-row">
                  {[1,2,3,4].map(i => {
                    const len = form.password.length;
                    const strength = len < 4 ? 1 : len < 7 ? 2 : len < 10 ? 3 : 4;
                    return (
                      <div
                        key={i}
                        className={`strength-bar ${i <= strength ? `str-${strength}` : ""}`}
                      />
                    );
                  })}
                </div>
              )}
            </div>
 
            <button type="submit" className="submit-btn" disabled={loading}>
              <span className="btn-shimmer" />
              {loading ? (
                <><span className="spinner" />Creating account...</>
              ) : (
                "Create Account →"
              )}
            </button>
 
          </form>
 
          <p className="footer-text">
            Already have an account?{" "}
            <span className="footer-link">Sign in</span>
          </p>
 
        </div>
      </div>
    </>
  );
}
 