"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useDashboardWS } from "@/hooks/useDashboardWS";
import { SetupModal } from "@/components/SetupModal";
import type { WidgetPlacement } from "@/lib/widget-meta";

interface DashboardContextType {
  data: Record<string, unknown>;
  connected: boolean;
  url: string;
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

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [backendUrl, setBackendUrl] = useState<string>("");
  const [showSetup, setShowSetup] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("dashboard-backend-url");
    if (stored) {
      setBackendUrl(stored);
    } else {
      setShowSetup(true);
    }
  }, []);

  const handleSetUrl = (url: string) => {
    const cleaned = url.replace(/\/+$/, "");
    localStorage.setItem("dashboard-backend-url", cleaned);
    setBackendUrl(cleaned);
    setShowSetup(false);
  };

  const { data, connected, layout, activePreset, send } = useDashboardWS(backendUrl);

  const saveLayout = useCallback(async (presetName: string, name: string, widgets: WidgetPlacement[]) => {
    if (!backendUrl) return;
    await fetch(`${backendUrl}/api/layout/${presetName}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, widgets }),
    });
  }, [backendUrl]);

  const switchPreset = useCallback(async (presetName: string) => {
    if (!backendUrl) return;
    await fetch(`${backendUrl}/api/layout/active`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ preset: presetName }),
    });
  }, [backendUrl]);

  if (!mounted) {
    return <div style={{ minHeight: "100dvh", background: "#0a0e1a" }} />;
  }

  return (
    <DashboardContext.Provider
      value={{
        data, connected, url: backendUrl, setUrl: handleSetUrl,
        layout, activePreset, send, saveLayout, switchPreset,
      }}
    >
      {showSetup && (
        <SetupModal
          onSave={handleSetUrl}
          onClose={backendUrl ? () => setShowSetup(false) : undefined}
        />
      )}
      <main>{children}</main>
    </DashboardContext.Provider>
  );
}
