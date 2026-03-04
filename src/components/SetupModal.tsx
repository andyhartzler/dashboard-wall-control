"use client";

import { useState } from "react";
import { Monitor, X } from "lucide-react";

interface SetupModalProps {
  onSave: (url: string) => void;
  onClose?: () => void;
}

export function SetupModal({ onSave, onClose }: SetupModalProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }
    try {
      new URL(url.trim());
      onSave(url.trim());
    } catch {
      setError("Please enter a valid URL");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="glass-panel relative p-8 w-full max-w-md mx-4">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/[0.05] transition-colors"
          >
            <X className="w-4 h-4 text-text-muted" />
          </button>
        )}

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-accent-blue/15 border border-accent-blue/20 flex items-center justify-center">
            <Monitor className="w-5 h-5 text-accent-blue" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-text-primary">
              Connect to Dashboard
            </h2>
            <p className="text-xs text-text-muted">
              Enter your dashboard backend URL
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-text-secondary mb-2">
              Backend URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError("");
              }}
              placeholder="http://192.168.4.31:8000"
              className="glass-input"
              autoFocus
            />
            {error && (
              <p className="text-xs text-accent-red mt-1.5">{error}</p>
            )}
          </div>

          <p className="text-xs text-text-muted leading-relaxed">
            This is the URL of your Raspberry Pi dashboard backend. It can be a
            local IP address or a Cloudflare Tunnel URL.
          </p>

          <button type="submit" className="glass-btn w-full py-2.5">
            Connect
          </button>
        </form>
      </div>
    </div>
  );
}
