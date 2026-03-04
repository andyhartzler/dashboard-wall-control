"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useDashboardWS } from "@/hooks/useDashboardWS";
import { SetupModal } from "@/components/SetupModal";
import { Sidebar } from "@/components/Sidebar";
import { ConnectionBanner } from "@/components/ConnectionBanner";

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
    return <div className="min-h-screen bg-bg-primary" />;
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
      <div className="flex min-h-screen">
        <Sidebar onOpenSetup={() => setShowSetup(true)} />
        <main className="flex-1 ml-[240px]">
          <ConnectionBanner
            connected={connected}
            url={backendUrl}
            onConfigure={() => setShowSetup(true)}
          />
          <div className="p-6">{children}</div>
        </main>
      </div>
    </DashboardContext.Provider>
  );
}
