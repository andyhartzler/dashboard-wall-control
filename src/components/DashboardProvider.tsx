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

    // Try stored URL first, then ngrok, then local
    async function autoConnect() {
      const stored = localStorage.getItem("dashboard-backend-url");

      // Try stored URL
      if (stored) {
        if (await tryConnect(stored)) {
          setBackendUrl(stored);
          return;
        }
      }

      // Try ngrok (works from anywhere)
      if (await tryConnect(NGROK_URL)) {
        localStorage.setItem("dashboard-backend-url", NGROK_URL);
        setBackendUrl(NGROK_URL);
        return;
      }

      // Try local (home network only)
      if (await tryConnect(LOCAL_URL)) {
        localStorage.setItem("dashboard-backend-url", LOCAL_URL);
        setBackendUrl(LOCAL_URL);
        return;
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
