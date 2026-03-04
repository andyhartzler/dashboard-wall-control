"use client";

import { useState } from "react";

import { useDashboard } from "@/components/DashboardProvider";
import { TVMirror } from "@/components/TVMirror";
import { GridEditor } from "@/components/GridEditor";
import { PresetSelector } from "@/components/PresetSelector";

export default function DashboardPage() {
  const { connected, layout, url } = useDashboard();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="page-shell">
      {/* Header */}
      <div className="status-bar">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h1
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "var(--color-t-primary)",
              letterSpacing: "-0.01em",
            }}
          >
            Dashboard
          </h1>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "3px 8px",
              borderRadius: 20,
              background: connected
                ? "rgba(0, 230, 118, 0.08)"
                : "rgba(255, 82, 82, 0.08)",
              border: `1px solid ${connected ? "rgba(0, 230, 118, 0.15)" : "rgba(255, 82, 82, 0.15)"}`,
            }}
          >
            <span
              className="status-dot"
              style={{ background: connected ? "#00E676" : "#FF5252" }}
            />
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: connected ? "#00E676" : "#FF5252",
                letterSpacing: "0.03em",
              }}
            >
              {connected ? "LIVE" : "OFFLINE"}
            </span>
          </div>
        </div>
      </div>

      {/* Widget count + preset */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 0 8px",
        }}
      >
        <span
          style={{
            fontSize: 11,
            color: "var(--color-t-muted)",
            fontWeight: 500,
          }}
        >
          {layout.length} widget{layout.length !== 1 ? "s" : ""} active
        </span>
      </div>

      {/* Preset selector */}
      <PresetSelector />

      {/* Main content — flip between mirror and editor */}
      <div className="flip-container animate-in">
        <div className={`flip-inner ${isEditing ? "flipped" : ""}`}>
          <div className="flip-front">
            <TVMirror />
          </div>
          <div className="flip-back">
            <GridEditor onDone={() => setIsEditing(false)} />
          </div>
        </div>
      </div>

      {/* Quick info */}
      {!isEditing && connected && (
        <div
          className="animate-in"
          style={{
            marginTop: 16,
            padding: "10px 14px",
            borderRadius: 12,
            background: "var(--color-surface-0)",
            border: "1px solid var(--color-glass-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: 11, color: "var(--color-t-muted)" }}>
            Connected to{" "}
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10 }}>
              {url.replace(/^https?:\/\//, "").slice(0, 30)}
            </span>
          </span>
          <span
            style={{
              fontSize: 10,
              color: "var(--color-accent-green)",
              fontWeight: 600,
            }}
          >
            Streaming
          </span>
        </div>
      )}

      {!isEditing && !connected && (
        <div
          className="animate-in"
          style={{
            marginTop: 16,
            padding: "14px",
            borderRadius: 12,
            background: "rgba(255, 82, 82, 0.06)",
            border: "1px solid rgba(255, 82, 82, 0.12)",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: 12, color: "var(--color-accent-red)", fontWeight: 500 }}>
            Connecting to dashboard...
          </p>
          <p style={{ fontSize: 11, color: "var(--color-t-muted)", marginTop: 4 }}>
            Trying to reach the Pi — will auto-retry
          </p>
        </div>
      )}

      {/* FAB — edit/save toggle */}
      <button
        className={`fab ${isEditing ? "editing" : ""}`}
        onClick={() => setIsEditing(!isEditing)}
        aria-label={isEditing ? "Done editing" : "Edit layout"}
      >
        {isEditing ? (
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
          </svg>
        )}
      </button>

    </div>
  );
}
