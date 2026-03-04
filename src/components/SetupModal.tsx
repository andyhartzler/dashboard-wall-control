"use client";

import { useState } from "react";

interface SetupModalProps {
  onSave: (url: string) => void;
  onClose?: () => void;
}

const PRESETS = [
  { label: "Home WiFi", url: "http://192.168.4.31:3000" },
];

export function SetupModal({ onSave, onClose }: SetupModalProps) {
  const [url, setUrl] = useState("");
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState("");

  const testAndSave = async (targetUrl: string) => {
    setTesting(true);
    setError("");
    const cleaned = targetUrl.replace(/\/+$/, "");
    try {
      const res = await fetch(`${cleaned}/api/config`, {
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) {
        onSave(cleaned);
      } else {
        setError("Connected but got an error response");
      }
    } catch {
      setError("Can't reach that address");
    } finally {
      setTesting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) testAndSave(url.trim());
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "#0a0e1a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div style={{ width: "100%", maxWidth: 320 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              width: 48,
              height: 48,
              margin: "0 auto 16px",
              borderRadius: 14,
              background: "rgba(76, 159, 255, 0.1)",
              border: "1px solid rgba(76, 159, 255, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
            }}
          >
            📡
          </div>
          <h1
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: "var(--color-t-primary)",
              marginBottom: 4,
            }}
          >
            Connect to Dashboard
          </h1>
          <p style={{ fontSize: 13, color: "var(--color-t-muted)" }}>
            Enter your Pi&apos;s address or pick a preset
          </p>
        </div>

        {/* Quick presets */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          {PRESETS.map((p) => (
            <button
              key={p.url}
              onClick={() => testAndSave(p.url)}
              disabled={testing}
              style={{
                padding: "12px 16px",
                borderRadius: 12,
                border: "1px solid var(--color-glass-border)",
                background: "var(--color-surface-0)",
                color: "var(--color-t-primary)",
                fontSize: 14,
                fontWeight: 500,
                fontFamily: "inherit",
                cursor: "pointer",
                textAlign: "left",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>{p.label}</span>
              <span
                style={{
                  fontSize: 11,
                  color: "var(--color-t-muted)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {p.url.replace(/^https?:\/\//, "")}
              </span>
            </button>
          ))}
        </div>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <div
            style={{ flex: 1, height: 1, background: "var(--color-glass-border)" }}
          />
          <span style={{ fontSize: 11, color: "var(--color-t-muted)" }}>or</span>
          <div
            style={{ flex: 1, height: 1, background: "var(--color-glass-border)" }}
          />
        </div>

        {/* Manual URL */}
        <form onSubmit={handleSubmit}>
          <input
            type="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError("");
            }}
            placeholder="http://192.168.x.x:3000"
            className="input"
            style={{ marginBottom: 12 }}
          />
          <button
            type="submit"
            disabled={testing || !url.trim()}
            style={{
              width: "100%",
              padding: "12px 0",
              borderRadius: 12,
              border: "none",
              background:
                testing || !url.trim()
                  ? "rgba(76, 159, 255, 0.1)"
                  : "rgba(76, 159, 255, 0.2)",
              color:
                testing || !url.trim()
                  ? "var(--color-t-muted)"
                  : "var(--color-accent-blue)",
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "inherit",
              cursor: testing || !url.trim() ? "default" : "pointer",
            }}
          >
            {testing ? "Testing..." : "Connect"}
          </button>
        </form>

        {error && (
          <p
            style={{
              marginTop: 12,
              fontSize: 12,
              color: "var(--color-accent-red)",
              textAlign: "center",
            }}
          >
            {error}
          </p>
        )}

        {onClose && (
          <button
            onClick={onClose}
            style={{
              display: "block",
              width: "100%",
              marginTop: 16,
              padding: 8,
              border: "none",
              background: "none",
              color: "var(--color-t-muted)",
              fontSize: 13,
              fontFamily: "inherit",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
