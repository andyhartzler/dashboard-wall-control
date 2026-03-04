"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { WidgetPlacement } from "@/lib/widget-meta";

interface WSMessage {
  topic: string;
  data: unknown;
}

export interface UseDashboardWSReturn {
  data: Record<string, unknown>;
  connected: boolean;
  layout: WidgetPlacement[];
  activePreset: string;
  send: (msg: Record<string, unknown>) => void;
}

export function useDashboardWS(backendUrl: string): UseDashboardWSReturn {
  const [data, setData] = useState<Record<string, unknown>>({});
  const [connected, setConnected] = useState(false);
  const [layout, setLayout] = useState<WidgetPlacement[]>([]);
  const [activePreset, setActivePreset] = useState("default");
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectDelay = useRef(1000);

  const connect = useCallback(() => {
    if (!backendUrl) return;

    const wsUrl = backendUrl
      .replace(/^http/, "ws")
      .replace(/\/+$/, "") + "/ws";

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
        reconnectDelay.current = 1000;
      };

      ws.onmessage = (event) => {
        try {
          const msg: WSMessage = JSON.parse(event.data);
          if (msg.topic === "layout_update") {
            const d = msg.data as { preset: string; widgets: WidgetPlacement[] };
            setLayout(d.widgets);
            setActivePreset(d.preset);
          } else if (msg.topic && msg.data !== undefined) {
            setData((prev) => ({ ...prev, [msg.topic]: msg.data }));
          }
        } catch {
          // Ignore malformed messages
        }
      };

      ws.onclose = () => {
        setConnected(false);
        wsRef.current = null;
        reconnectTimer.current = setTimeout(() => {
          reconnectDelay.current = Math.min(reconnectDelay.current * 1.5, 30000);
          connect();
        }, reconnectDelay.current);
      };

      ws.onerror = () => {
        ws.close();
      };
    } catch {
      setConnected(false);
    }
  }, [backendUrl]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  const send = useCallback((msg: Record<string, unknown>) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
    }
  }, []);

  return { data, connected, layout, activePreset, send };
}
