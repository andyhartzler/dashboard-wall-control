"use client";

import { useState } from "react";

interface SetupModalProps {
  onSave: (url: string) => void;
  onClose?: () => void;
}

export function SetupModal({ onSave, onClose }: SetupModalProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "pooosh") {
      onSave("https://expeditiously-unspeakable-aracelis.ngrok-free.dev");
    } else {
      setError("Wrong password");
      setTimeout(() => setError(""), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0b10]">
      <div className="w-full max-w-sm mx-4">
        <h2 className="text-2xl font-semibold text-white text-center mb-8">
          Dashboard Wall
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            placeholder="Password"
            className="glass-input w-full"
            autoFocus
          />
          {error && (
            <p className="text-xs text-accent-red text-center">{error}</p>
          )}

          <button type="submit" className="glass-btn w-full py-2.5">
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}
