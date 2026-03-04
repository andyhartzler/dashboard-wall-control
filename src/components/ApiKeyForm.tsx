"use client";

import { useState } from "react";
import { Eye, EyeOff, Save, Loader2 } from "lucide-react";

interface ApiKeyFormProps {
  backendUrl: string;
}

interface KeyEntry {
  key: string;
  value: string;
  revealed: boolean;
}

const API_KEY_NAMES = [
  "OPENWEATHERMAP_API_KEY",
  "NEWSDATA_API_KEY",
  "POLYGON_API_KEY",
  "ADSB_API_KEY",
  "GOOGLE_CALENDAR_API_KEY",
  "POLYMARKET_API_KEY",
];

export function ApiKeyForm({ backendUrl }: ApiKeyFormProps) {
  const [keys, setKeys] = useState<KeyEntry[]>(
    API_KEY_NAMES.map((k) => ({ key: k, value: "", revealed: false }))
  );
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [status, setStatus] = useState<string>("");

  const fetchKeys = async () => {
    if (!backendUrl) return;
    setFetchLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/config/keys`);
      if (res.ok) {
        const data = await res.json();
        setKeys((prev) =>
          prev.map((entry) => ({
            ...entry,
            value: data[entry.key] ? "********" : "",
          }))
        );
        setStatus("Keys fetched");
      } else {
        setStatus("Failed to fetch keys");
      }
    } catch {
      setStatus("Connection error");
    }
    setFetchLoading(false);
    setTimeout(() => setStatus(""), 3000);
  };

  const saveKey = async (keyName: string, value: string) => {
    if (!backendUrl || !value || value === "********") return;
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/config/keys`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [keyName]: value }),
      });
      if (res.ok) {
        setStatus(`${keyName} updated`);
      } else {
        setStatus(`Failed to update ${keyName}`);
      }
    } catch {
      setStatus("Connection error");
    }
    setLoading(false);
    setTimeout(() => setStatus(""), 3000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-text-primary">API Keys</h3>
        <button
          onClick={fetchKeys}
          disabled={fetchLoading}
          className="glass-btn text-xs flex items-center gap-1.5"
        >
          {fetchLoading && <Loader2 className="w-3 h-3 animate-spin" />}
          Fetch Current
        </button>
      </div>

      {status && (
        <div className="text-xs text-accent-cyan px-3 py-2 bg-accent-cyan/5 border border-accent-cyan/15 rounded-lg">
          {status}
        </div>
      )}

      <div className="space-y-3">
        {keys.map((entry, i) => (
          <div key={entry.key} className="space-y-1.5">
            <label className="text-xs text-text-muted">{entry.key}</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type={entry.revealed ? "text" : "password"}
                  value={entry.value}
                  onChange={(e) => {
                    const updated = [...keys];
                    updated[i] = { ...entry, value: e.target.value };
                    setKeys(updated);
                  }}
                  placeholder="Enter API key..."
                  className="glass-input pr-10"
                />
                <button
                  onClick={() => {
                    const updated = [...keys];
                    updated[i] = { ...entry, revealed: !entry.revealed };
                    setKeys(updated);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-white/[0.05]"
                >
                  {entry.revealed ? (
                    <EyeOff className="w-3.5 h-3.5 text-text-muted" />
                  ) : (
                    <Eye className="w-3.5 h-3.5 text-text-muted" />
                  )}
                </button>
              </div>
              <button
                onClick={() => saveKey(entry.key, entry.value)}
                disabled={loading || !entry.value || entry.value === "********"}
                className="glass-btn-success glass-btn px-3 disabled:opacity-30"
              >
                <Save className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
