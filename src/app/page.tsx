"use client";

import { useState } from "react";
import { useDashboard } from "@/components/DashboardProvider";
import { TVMirror } from "@/components/TVMirror";
import { GridEditor } from "@/components/GridEditor";
import { PresetSelector } from "@/components/PresetSelector";
import { SetupModal } from "@/components/SetupModal";

export default function DashboardPage() {
  const { connected, layout, url, setUrl } = useDashboard();
  const [isEditing, setIsEditing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

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
        <button
          onClick={() => setShowSettings(true)}
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            border: "1px solid var(--color-glass-border)",
            background: "var(--color-surface-0)",
            color: "var(--color-t-muted)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: 14,
            padding: 0,
            fontFamily: "inherit",
          }}
          aria-label="Settings"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
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
            Not connected to dashboard
          </p>
          <p style={{ fontSize: 11, color: "var(--color-t-muted)", marginTop: 4 }}>
            Make sure you&apos;re on the same network as the Pi
          </p>
          <button
            onClick={() => setShowSettings(true)}
            style={{
              marginTop: 10,
              padding: "8px 20px",
              borderRadius: 10,
              border: "1px solid var(--color-glass-border)",
              background: "var(--color-surface-0)",
              color: "var(--color-t-primary)",
              fontSize: 12,
              fontWeight: 500,
              fontFamily: "inherit",
              cursor: "pointer",
            }}
          >
            Change Connection
          </button>
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

      {/* Settings modal */}
      {showSettings && (
        <SetupModal
          onSave={(newUrl) => {
            setUrl(newUrl);
            setShowSettings(false);
          }}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
