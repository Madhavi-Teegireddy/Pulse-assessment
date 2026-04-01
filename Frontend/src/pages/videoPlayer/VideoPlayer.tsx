import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./videoPlayer.css";
 
interface Video {
  _id: string;
  title: string;
  filename: string;
  size: number;
  status: "processing" | "safe" | "flagged";
  createdAt: string;
  duration?: number;
}
 
const formatSize = (bytes: number) => {
  if (bytes >= 1e9) return (bytes / 1e9).toFixed(1) + " GB";
  if (bytes >= 1e6) return (bytes / 1e6).toFixed(1) + " MB";
  return (bytes / 1e3).toFixed(0) + " KB";
};
 
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
 
const formatDur = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};
 
export default function VideoPlayer() {
  // Get :id from URL — works with react-router or plain window.location
  const id = window.location.pathname.split("/").pop();
 
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
 
  // Player state
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
//   const controlsTimer = useRef<ReturnType<typeof setTimeout>>();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const playerWrap = useRef<HTMLDivElement>(null);

 
  useEffect(() => {
    setMounted(true);
    fetchVideo();
  }, []);
 
  const fetchVideo = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/videos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const found = res.data.find((v: Video) => v._id === id);
      if (!found) { setError("Video not found"); return; }
      setVideo(found);
    } catch {
      setError("Failed to load video");
    } finally {
      setLoading(false);
    }
  };
 
  const streamUrl = `http://localhost:5000/api/videos/stream/${id}`;
 
  // Player controls
  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  };
 
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Number(e.target.value);
    setCurrentTime(Number(e.target.value));
  };
 
  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (videoRef.current) videoRef.current.volume = val;
    setMuted(val === 0);
  };
 
  const toggleMute = () => {
    if (!videoRef.current) return;
    const next = !muted;
    setMuted(next);
    videoRef.current.muted = next;
  };
 
  const toggleFullscreen = () => {
    if (!playerWrap.current) return;
    if (!document.fullscreenElement) {
      playerWrap.current.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };
 
  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimer.current);
    if (playing) {
      controlsTimer.current = setTimeout(() => setShowControls(false), 2500);
    }
  };
 
  const skip = (secs: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(duration, currentTime + secs));
  };
 
  const progressPct = duration ? (currentTime / duration) * 100 : 0;
 
  return (
    <>
      <div className="vp-root">
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
          {loading ? (
            <div>
              <div className="skel" style={{ width:"100%", aspectRatio:"16/9", borderRadius:"20px", marginBottom:"24px" }} />
              <div className="skel" style={{ height:"28px", width:"50%", marginBottom:"12px" }} />
              <div className="skel" style={{ height:"16px", width:"30%" }} />
            </div>
          ) : error ? (
            <div className="state-box">
              <div className="state-title">Video not found</div>
              <div className="state-sub">{error}</div>
            </div>
          ) : video ? (
            <>
              {/* ── Player ── */}
              <div
                ref={playerWrap}
                className={`player-wrap ${playing ? "playing" : ""}`}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => playing && setShowControls(false)}
              >
                <video
                  ref={videoRef}
                  src={streamUrl}
                  onClick={togglePlay}
                  onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime ?? 0)}
                  onLoadedMetadata={() => setDuration(videoRef.current?.duration ?? 0)}
                  onEnded={() => setPlaying(false)}
                  preload="metadata"
                />
 
                {/* Centre play icon */}
                <div className="center-play">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                </div>
 
                {/* Controls */}
                <div className={`controls-overlay ${!showControls ? "hidden" : ""}`}>
                  {/* Seek bar */}
                  <div className="prog-wrap">
                    <div className="prog-track">
                      <div className="prog-fill" style={{ width: `${progressPct}%` }}>
                        <div className="prog-thumb" />
                      </div>
                      <input
                        type="range" className="prog-input"
                        min={0} max={duration || 100} step={0.1}
                        value={currentTime}
                        onChange={handleSeek}
                      />
                    </div>
                  </div>
 
                  {/* Control row */}
                  <div className="ctrl-row">
                    {/* Play/Pause */}
                    <button className="ctrl-btn" onClick={togglePlay}>
                      {playing ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="5 3 19 12 5 21 5 3"/>
                        </svg>
                      )}
                    </button>
 
                    {/* Skip back */}
                    <button className="ctrl-btn" onClick={() => skip(-10)} title="−10s">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
                      </svg>
                    </button>
 
                    {/* Skip forward */}
                    <button className="ctrl-btn" onClick={() => skip(10)} title="+10s">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
                      </svg>
                    </button>
 
                    {/* Time */}
                    <span className="time-display">
                      {formatDur(currentTime)} / {formatDur(duration)}
                    </span>
 
                    <div className="spacer" />
 
                    {/* Volume */}
                    <div className="vol-wrap">
                      <button className="ctrl-btn" onClick={toggleMute}>
                        {muted || volume === 0 ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                            <line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
                          </svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                            <path d="M15.54 8.46a5 5 0 010 7.07"/>
                            <path d="M19.07 4.93a10 10 0 010 14.14"/>
                          </svg>
                        )}
                      </button>
                      <input
                        type="range" className="vol-slider"
                        min={0} max={1} step={0.05}
                        value={muted ? 0 : volume}
                        onChange={handleVolume}
                      />
                    </div>
 
                    {/* Fullscreen */}
                    <button className="ctrl-btn" onClick={toggleFullscreen}>
                      {fullscreen ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3"/>
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
 
              {/* ── Video info ── */}
              <div className="info-section">
                <div className="info-top">
                  <div>
                    <h1 className="video-title">{video.title || video.filename}</h1>
                    <div className="video-meta">
                      <span className="meta-item">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        {formatDate(video.createdAt)}
                      </span>
                      <span className="meta-item">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                        </svg>
                        {formatSize(video.size)}
                      </span>
                      {video.duration && (
                        <span className="meta-item">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                          </svg>
                          {formatDur(video.duration)}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className={`status-badge badge-${video.status}`}>
                    {video.status === "safe" ? "✓ Safe" : video.status === "flagged" ? "⚠ Flagged" : "⏳ Processing"}
                  </span>
                </div>
 
                {/* Flagged warning */}
                {video.status === "flagged" && (
                  <div className="flag-warning">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fca5a5" strokeWidth="2" style={{flexShrink:0, marginTop:"2px"}}>
                      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                    <div className="flag-warning-text">
                      <h4>Sensitive Content Detected</h4>
                      <p>This video has been flagged during sensitivity analysis. Viewer discretion is advised.</p>
                    </div>
                  </div>
                )}
 
                {/* Stats row */}
                <div className="info-card">
                  <div className="info-stat">
                    <div className="info-stat-num">{formatSize(video.size)}</div>
                    <div className="info-stat-lbl">File Size</div>
                  </div>
                  <div className="info-stat">
                    <div className="info-stat-num">{video.duration ? formatDur(video.duration) : "--:--"}</div>
                    <div className="info-stat-lbl">Duration</div>
                  </div>
                  <div className="info-stat">
                    <div className="info-stat-num" style={{
                      color: video.status === "safe" ? "#86efac" : video.status === "flagged" ? "#fca5a5" : "#fcd34d"
                    }}>
                      {video.status.charAt(0).toUpperCase() + video.status.slice(1)}
                    </div>
                    <div className="info-stat-lbl">Analysis</div>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </main>
      </div>
    </>
  );
}
 