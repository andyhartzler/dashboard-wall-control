"use client";

import { useState } from "react";
import { Lock } from "lucide-react";

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
      <div className="w-full max-w-xs mx-4 flex flex-col items-center gap-6">
        <Lock className="w-8 h-8 text-white/30" />

        <form onSubmit={handleSubmit} className="w-full space-y-3">
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            placeholder="Password"
            className="glass-input w-full text-center"
            autoFocus
          />
          {error && (
            <p className="text-xs text-accent-red text-center">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
}
