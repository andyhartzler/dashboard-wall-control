"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useDashboardWS } from "@/hooks/useDashboardWS";
import { SetupModal } from "@/components/SetupModal";
import { BottomNav } from "@/components/BottomNav";

interface DashboardContextType {
  data: Record<string, unknown>;
  connected: boolean;
  url: string;
  setUrl: (url: string) => void;
}

const DashboardContext = createContext<DashboardContextType>({
  data: {},
  connected: false,
  url: "",
  setUrl: () => {},
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

  const { data, connected } = useDashboardWS(backendUrl);

  if (!mounted) {
    return <div style={{ minHeight: "100dvh", background: "#0c0c0e" }} />;
  }

  return (
    <DashboardContext.Provider
      value={{ data, connected, url: backendUrl, setUrl: handleSetUrl }}
    >
      {showSetup && (
        <SetupModal
          onSave={handleSetUrl}
          onClose={backendUrl ? () => setShowSetup(false) : undefined}
        />
      )}
      <main>{children}</main>
      {!showSetup && <BottomNav />}
    </DashboardContext.Provider>
  );
}
