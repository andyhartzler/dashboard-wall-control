"use client";

import { Wifi, WifiOff, Settings } from "lucide-react";

interface ConnectionBannerProps {
  connected: boolean;
  url: string;
  onConfigure: () => void;
}

export function ConnectionBanner({
  connected,
  url,
  onConfigure,
}: ConnectionBannerProps) {
  return (
    <div className="px-6 pt-4">
      <div
        className={`flex items-center justify-between px-4 py-2.5 rounded-xl border ${
          connected
            ? "bg-accent-green/5 border-accent-green/15"
            : "bg-accent-red/5 border-accent-red/15"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            {connected ? (
              <Wifi className="w-4 h-4 text-accent-green" />
            ) : (
              <WifiOff className="w-4 h-4 text-accent-red" />
            )}
            <span
              className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ${
                connected
                  ? "bg-accent-green status-dot-connected"
                  : "bg-accent-red"
              }`}
            />
          </div>
          <div>
            <span
              className={`text-xs font-medium ${
                connected ? "text-accent-green" : "text-accent-red"
              }`}
            >
              {connected ? "Connected" : "Disconnected"}
            </span>
            {url && (
              <span className="text-xs text-text-muted ml-2">{url}</span>
            )}
          </div>
        </div>
        <button
          onClick={onConfigure}
          className="p-1.5 rounded-lg hover:bg-white/[0.05] transition-colors"
          title="Configure connection"
        >
          <Settings className="w-3.5 h-3.5 text-text-muted" />
        </button>
      </div>
    </div>
  );
}
