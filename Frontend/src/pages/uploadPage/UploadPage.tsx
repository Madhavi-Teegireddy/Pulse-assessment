import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./upload.css";
 
export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
 
  useEffect(() => { setMounted(true); }, []);
 
  const formatSize = (bytes: number) => {
    if (bytes >= 1e9) return (bytes / 1e9).toFixed(1) + " GB";
    if (bytes >= 1e6) return (bytes / 1e6).toFixed(1) + " MB";
    return (bytes / 1e3).toFixed(0) + " KB";
  };
 
  const handleFile = (f: File) => {
    setError("");
    setDone(false);
    setProgress(0);
    if (!f.type.startsWith("video/")) {
      setError("Only video files are allowed (MP4, MOV, AVI...)");
      return;
    }
    if (f.size > 500 * 1024 * 1024) {
      setError("File size must be under 500 MB");
      return;
    }
    setFile(f);
    if (!title) setTitle(f.name.replace(/\.[^/.]+$/, ""));
  };
 
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };
 
  const handleUpload = async () => {
    if (!file) return;
    try {
      setUploading(true);
      setError("");
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("video", file);
      formData.append("title", title || file.name);
 
      await axios.post("http://localhost:5000/api/videos/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (e) => {
          const pct = Math.round((e.loaded * 100) / (e.total ?? 1));
          setProgress(pct);
        },
      });
 
      setDone(true);
      setProgress(100);
    } catch (err: any) {
      setError(err.response?.data?.message || "Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };
 
  const reset = () => {
    setFile(null);
    setTitle("");
    setProgress(0);
    setDone(false);
    setError("");
  };
 
  return (
    <>
      <div className="up-root">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="grid-ov" />
 
        {/* Navbar */}
        <nav className="navbar">
          <div className="nav-logo" onClick={() => window.location.href = "/dashboard"}>
            <div className="nav-logo-icon">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="#fff">
                <path d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/>
              </svg>
            </div>
            <span className="nav-logo-name">VideoSafe</span>
          </div>
          <button className="nav-back" onClick={() => window.location.href = "/dashboard"}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Back to Dashboard
          </button>
        </nav>
 
        <main className="main">
          {/* Header */}
          <div className="page-header">
            <h1 className="page-title">Upload Video</h1>
            <p className="page-sub">Upload your video for sensitivity analysis and streaming</p>
          </div>
 
          {done ? (
            /* ── Success ── */
            <div className="success-box">
              <div className="success-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div className="success-title">Upload Complete!</div>
              <div className="success-sub">Your video is now being analysed for content sensitivity</div>
              <div className="success-actions">
                <button className="sec-btn" onClick={reset}>Upload Another</button>
                <button className="pri-btn" onClick={() => window.location.href = "/dashboard"}>
                  Go to Dashboard →
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* ── Drop zone ── */}
              <div
                className={`dropzone ${dragging ? "drag" : ""} ${file ? "has-file" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => !file && fileRef.current?.click()}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept="video/*"
                  style={{ display: "none" }}
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
 
                {file ? (
                  <div className="file-row">
                    <div className="file-icon-box">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.8">
                        <path d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/>
                      </svg>
                    </div>
                    <div className="file-info">
                      <div className="file-name">{file.name}</div>
                      <div className="file-meta">{formatSize(file.size)} · {file.type}</div>
                    </div>
                    <div className="file-remove" onClick={(e) => { e.stopPropagation(); reset(); }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fca5a5" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="drop-icon">
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.8">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                    </div>
                    <div className="drop-title">Drop your video here</div>
                    <div className="drop-sub">or click to browse from your device</div>
                    <span className="drop-btn">Browse Files</span>
                    <div className="drop-hint">MP4, MOV, AVI, MKV · Max 500 MB</div>
                  </>
                )}
              </div>
 
              {/* ── Form fields ── */}
              <div className="form-section">
                <div className="field">
                  <label className="field-label">Video Title</label>
                  <div className="field-wrap">
                    <svg className="field-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    <input
                      className="field-input"
                      type="text"
                      placeholder="Enter a title for your video"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                </div>
 
                {/* Progress bar */}
                {(uploading || progress > 0) && !done && (
                  <div className="progress-wrap">
                    <div className="progress-header">
                      <span className="progress-label">
                        {uploading ? "Uploading..." : "Processing..."}
                      </span>
                      <span className="progress-pct">{progress}%</span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                )}
 
                {/* Error */}
                {error && (
                  <div className="error-box">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fca5a5" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {error}
                  </div>
                )}
 
                {/* Submit */}
                <button
                  className="submit-btn"
                  onClick={handleUpload}
                  disabled={!file || uploading}
                >
                  <span className="btn-shimmer" />
                  {uploading
                    ? <><span className="spinner" />Uploading {progress}%...</>
                    : "Upload & Analyse →"
                  }
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}