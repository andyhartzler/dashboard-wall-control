"use client";

import { useState } from "react";

interface SetupModalProps {
  onSave: (url: string) => void;
  onClose?: () => void;
}

export function SetupModal({ onSave }: SetupModalProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "pooosh") {
      onSave("https://expeditiously-unspeakable-aracelis.ngrok-free.dev");
    } else {
      setError(true);
      setTimeout(() => setError(false), 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ background: "#0c0c0e" }}>
      <form onSubmit={handleSubmit} className="w-full max-w-[280px] mx-auto px-6 flex flex-col items-center gap-8">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={error ? "#ff453a" : "#48484a"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 0.3s" }}>
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <input
          type="password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(false); }}
          placeholder="Password"
          className="input text-center"
          style={error ? { borderColor: "#ff453a" } : {}}
          autoFocus
        />
      </form>
    </div>
  );
}
