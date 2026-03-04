"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { registerWidget } from "./registry";

interface Camera { name: string; url: string; type: string; }

function WebcamWidget({ data }: { data: Record<string, unknown> }) {
  const cameras = (data.cameras as Camera[]) || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const cycleTimer = useRef<number>();
  const camera = cameras[currentIndex];

  useEffect(() => {
    if (cameras.length <= 1) return;
    cycleTimer.current = window.setInterval(() => setCurrentIndex((prev) => (prev + 1) % cameras.length), 15000);
    return () => clearInterval(cycleTimer.current);
  }, [cameras.length]);

  useEffect(() => {
    if (!camera) return;
    if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }
    if (camera.type === "hls" && videoRef.current) {
      if (Hls.isSupported()) {
        const hls = new Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(camera.url);
        hls.attachMedia(videoRef.current);
        hlsRef.current = hls;
      } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
        videoRef.current.src = camera.url;
      }
    }
    return () => { if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; } };
  }, [camera]);

  const goNext = () => { if (cameras.length === 0) return; setCurrentIndex((prev) => (prev + 1) % cameras.length); clearInterval(cycleTimer.current); };
  const goPrev = () => { if (cameras.length === 0) return; setCurrentIndex((prev) => (prev - 1 + cameras.length) % cameras.length); clearInterval(cycleTimer.current); };

  if (cameras.length === 0) return <div className="metric-label" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>No cameras configured</div>;

  return (
    <div style={{ position: "relative", height: "100%" }}>
      {camera?.type === "hls" ? (
        <video ref={videoRef} autoPlay muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 12, background: "var(--color-bg-primary)" }} />
      ) : (
        <img src={`${camera?.url}?t=${Math.floor(Date.now() / 30000)}`} alt={camera?.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 12, background: "var(--color-bg-primary)" }} />
      )}
      <div className="glass-badge" style={{ position: "absolute", bottom: 10, left: 10, zIndex: 10, display: "flex", alignItems: "center", gap: 6 }}>
        <div className="pulse-live" style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--color-accent-cyan)", boxShadow: "0 0 6px var(--color-accent-cyan)" }} />
        {camera?.name}
        <span style={{ color: "var(--color-t-muted)", fontFamily: "var(--font-mono)", fontSize: 10 }}>{currentIndex + 1}/{cameras.length}</span>
      </div>
      <button onClick={goPrev} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", background: "rgba(10, 14, 26, 0.7)", border: "1px solid rgba(80, 120, 200, 0.15)", color: "var(--color-t-secondary)", fontSize: 18, width: 32, height: 32, borderRadius: 16, cursor: "pointer", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>&lsaquo;</button>
      <button onClick={goNext} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "rgba(10, 14, 26, 0.7)", border: "1px solid rgba(80, 120, 200, 0.15)", color: "var(--color-t-secondary)", fontSize: 18, width: 32, height: 32, borderRadius: 16, cursor: "pointer", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>&rsaquo;</button>
    </div>
  );
}

registerWidget("webcam", { title: "Webcams", topic: "webcams", component: WebcamWidget, defaultSize: { width: 6, height: 4 } });
