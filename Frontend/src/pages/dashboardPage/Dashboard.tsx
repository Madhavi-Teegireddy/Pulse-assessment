import { useState, useEffect } from "react";
import axios from "axios";
import "./dashboard.css";
 
// Types
interface Video {
  _id: string;
  title: string;
  filename: string;
  size: number;
  status: "processing" | "safe" | "flagged";
  createdAt: string;
  duration?: number;
}
 
// Helpers 
const formatSize = (bytes: number) => {
  if (bytes >= 1e9) return (bytes / 1e9).toFixed(1) + " GB";
  if (bytes >= 1e6) return (bytes / 1e6).toFixed(1) + " MB";
  return (bytes / 1e3).toFixed(0) + " KB";
};
 
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
 
const formatDuration = (secs?: number) => {
  if (!secs) return "--:--";
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};
 
// Component
export default function Dashboard() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "safe" | "flagged" | "processing">("all");
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);
 
  useEffect(() => {
    setMounted(true);
    fetchVideos();
  }, []);
 
  const fetchVideos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }
      const res = await axios.get("http://localhost:5000/api/videos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVideos(res.data.videos);
      console.log(res.data);
    } catch (err) {
      console.error("Failed to fetch videos", err);
    } finally {
      setLoading(false);
    }
  };
 
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };
 
  const filtered = videos.filter((v) => {
    const matchFilter = filter === "all" || v.status === filter;
    const matchSearch = (v.title || "").toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });
 
  const stats = {
    total: videos.length,
    safe: videos.filter((v) => v.status === "safe").length,
    flagged: videos.filter((v) => v.status === "flagged").length,
    processing: videos.filter((v) => v.status === "processing").length,
  };
 
  return (
    <>
      <div className="dash-root">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="grid-overlay" />
 
        {/* ── Navbar ── */}
        <nav className="navbar">
          <div className="nav-logo">
            <div className="nav-logo-icon">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="#fff">
                <path d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/>
              </svg>
            </div>
            <span className="nav-logo-name">VideoSafe</span>
          </div>
          <div className="nav-right">
            <button className="nav-upload-btn" onClick={() => window.location.href = "/upload"}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              Upload Video
            </button>
            <button className="nav-logout" onClick={handleLogout}>Logout</button>
          </div>
        </nav>
 
        {/* ── Main Content ── */}
        <main className="main">
 
          {/* Page Header */}
          <div className="page-header">
            <h1 className="page-title">Your Library</h1>
            <p className="page-sub">All uploaded videos with sensitivity analysis results</p>
          </div>
 
          {/* Stats */}
          <div className="stats-grid">
            {[
              { cls: "total",   num: stats.total,      label: "Total Videos" },
              { cls: "safe",    num: stats.safe,       label: "Safe" },
              { cls: "flagged", num: stats.flagged,    label: "Flagged" },
              { cls: "proc",    num: stats.processing, label: "Processing" },
            ].map((s) => (
              <div key={s.cls} className={`stat-card ${s.cls}`}>
                <div className="stat-num">{s.num}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
 
          {/* Controls */}
          <div className="controls">
            <div className="search-wrap">
              <svg className="search-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                className="search-input"
                placeholder="Search videos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="filter-pills">
              {(["all","safe","flagged","processing"] as const).map((f) => (
                <button
                  key={f}
                  className={`pill ${filter === f ? `active-${f}` : ""}`}
                  onClick={() => setFilter(f)}
                >
                  {f === "all" ? "All" : f === "processing" ? "Processing" : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
 
          {/* Video Grid */}
          <div className="video-grid">
            {loading ? (
              // Skeleton loaders
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton-card">
                  <div className="skel skel-thumb" />
                  <div className="skel-body">
                    <div className="skel skel-title" />
                    <div className="skel skel-meta" />
                  </div>
                </div>
              ))
            ) : filtered.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">🎬</div>
                <div className="empty-title">No videos found</div>
                <div className="empty-sub">Upload your first video or try a different filter</div>
              </div>
            ) : (
              filtered.map((video) => (
                <div
                  key={video._id}
                  className="video-card"
                  onClick={() => window.location.href = `/stream/${video._id}`}
                >
                  {/* Thumbnail */}
                  <div className="thumb">
                    <svg className="thumb-icon" width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/>
                    </svg>
 
                    {/* Status badge */}
                    <span className={`status-dot dot-${video.status}`}>
                      {video.status === "processing" ? "⏳ Processing" : video.status === "safe" ? "✓ Safe" : "⚠ Flagged"}
                    </span>
 
                    {/* Duration */}
                    {video.duration && (
                      <span className="thumb-duration">{formatDuration(video.duration)}</span>
                    )}
 
                    {/* Hover play */}
                    <div className="thumb-play">
                      <div className="play-circle">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
                          <polygon points="5 3 19 12 5 21 5 3"/>
                        </svg>
                      </div>
                    </div>
                  </div>
 
                  {/* Card body */}
                  <div className="card-body">
                    <div className="card-title">{video.title || video.filename}</div>
                    <div className="card-meta">
                      <span>{formatSize(video.size)}</span>
                      <span className="meta-dot" />
                      <span>{formatDate(video.createdAt)}</span>
                    </div>
 
                    {/* Processing shimmer bar */}
                    {video.status === "processing" && (
                      <div className="processing-bar">
                        <div className="processing-fill" />
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </>
  );
}
