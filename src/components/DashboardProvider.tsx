"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useDashboardWS } from "@/hooks/useDashboardWS";
import type { WidgetPlacement } from "@/lib/widget-meta";

const NGROK_URL = "https://expeditiously-unspeakable-aracelis.ngrok-free.dev";
const LOCAL_URL = "http://192.168.4.31:3000";
const PASSWORD = "pooosh";

interface DashboardContextType {
  data: Record<string, unknown>;
  connected: boolean;
  url: string;
  password: string;
  setUrl: (url: string) => void;
  layout: WidgetPlacement[];
  activePreset: string;
  send: (msg: Record<string, unknown>) => void;
  saveLayout: (presetName: string, name: string, widgets: WidgetPlacement[]) => Promise<void>;
  switchPreset: (presetName: string) => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType>({
  data: {},
  connected: false,
  url: "",
  password: PASSWORD,
  setUrl: () => {},
  layout: [],
  activePreset: "default",
  send: () => {},
  saveLayout: async () => {},
  switchPreset: async () => {},
});

export function useDashboard() {
  return useContext(DashboardContext);
}

async function tryConnect(url: string): Promise<boolean> {
  try {
    const resp = await fetch(`${url}/api/auth?password=${PASSWORD}`, {
      signal: AbortSignal.timeout(4000),
      headers: { "ngrok-skip-browser-warning": "1" },
    });
    return resp.ok;
  } catch {
    return false;
  }
}

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [backendUrl, setBackendUrl] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Race ngrok and local in parallel — use whichever responds first
    async function autoConnect() {
      const candidates = [NGROK_URL, LOCAL_URL];

      // Try all candidates in parallel, use first success
      const results = await Promise.allSettled(
        candidates.map(async (url) => {
          const ok = await tryConnect(url);
          if (!ok) throw new Error("failed");
          return url;
        })
      );

      for (const result of results) {
        if (result.status === "fulfilled") {
          localStorage.setItem("dashboard-backend-url", result.value);
          setBackendUrl(result.value);
          return;
        }
      }

      // Fallback to ngrok anyway — WebSocket will retry
      localStorage.setItem("dashboard-backend-url", NGROK_URL);
      setBackendUrl(NGROK_URL);
    }

    autoConnect();
  }, []);

  const handleSetUrl = (url: string) => {
    const cleaned = url.replace(/\/+$/, "");
    localStorage.setItem("dashboard-backend-url", cleaned);
    setBackendUrl(cleaned);
  };

  const { data, connected, layout, activePreset, send } = useDashboardWS(backendUrl, PASSWORD);

  const authHeaders = useCallback((): HeadersInit => ({
    "Content-Type": "application/json",
    "x-dashboard-password": PASSWORD,
    "ngrok-skip-browser-warning": "1",
  }), []);

  const saveLayout = useCallback(async (presetName: string, name: string, widgets: WidgetPlacement[]) => {
    if (!backendUrl) return;
    await fetch(`${backendUrl}/api/layout/${presetName}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ name, widgets }),
    });
  }, [backendUrl, authHeaders]);

  const switchPreset = useCallback(async (presetName: string) => {
    if (!backendUrl) return;
    await fetch(`${backendUrl}/api/layout/active`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ preset: presetName }),
    });
  }, [backendUrl, authHeaders]);

  if (!mounted) {
    return <div style={{ minHeight: "100dvh", background: "#0a0e1a" }} />;
  }

  return (
    <DashboardContext.Provider
      value={{
        data, connected, url: backendUrl, password: PASSWORD,
        setUrl: handleSetUrl, layout, activePreset, send,
        saveLayout, switchPreset,
      }}
    >
      <main>{children}</main>
    </DashboardContext.Provider>
  );
}
