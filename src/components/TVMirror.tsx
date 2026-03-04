"use client";

import { useRef, useState, useEffect } from "react";
import { useDashboard } from "@/components/DashboardProvider";

const TV_WIDTH = 1920;
const TV_HEIGHT = 1080;
const NGROK_URL = "https://expeditiously-unspeakable-aracelis.ngrok-free.dev";

export function TVMirror() {
  const { connected, url } = useDashboard();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setScale(Math.min(width / TV_WIDTH, height / TV_HEIGHT));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Always use HTTPS URL for iframe (control panel is HTTPS on Vercel)
  const iframeUrl = url?.startsWith("https://") ? url : NGROK_URL;

  if (!connected) {
    return (
      <div className="tv-mirror-container">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 28, opacity: 0.3 }}>📺</span>
          <span
            style={{
              fontSize: 11,
              color: "var(--color-t-muted)",
              fontWeight: 500,
            }}
          >
            Connecting to TV...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="tv-mirror-container">
      <div
        ref={wrapperRef}
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          position: "relative",
          borderRadius: 6,
        }}
      >
        {scale > 0 && (
          <iframe
            src={iframeUrl}
            width={TV_WIDTH}
            height={TV_HEIGHT}
            style={{
              border: "none",
              transformOrigin: "0 0",
              transform: `scale(${scale})`,
              display: "block",
            }}
            title="TV Dashboard"
            allow="autoplay"
          />
        )}
      </div>
    </div>
  );
}
