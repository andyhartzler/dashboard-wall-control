"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface WSMessage {
  topic: string;
  data: unknown;
}

interface UseDashboardWSReturn {
  data: Record<string, unknown>;
  connected: boolean;
}

export function useDashboardWS(backendUrl: string): UseDashboardWSReturn {
  const [data, setData] = useState<Record<string, unknown>>({});
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectDelay = useRef(1000);

  const connect = useCallback(() => {
    if (!backendUrl) return;

    // Build WebSocket URL from backend URL
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
          if (msg.topic && msg.data !== undefined) {
            setData((prev) => ({ ...prev, [msg.topic]: msg.data }));
          }
        } catch {
          // Ignore malformed messages
        }
      };

      ws.onclose = () => {
        setConnected(false);
        wsRef.current = null;
        // Auto-reconnect with exponential backoff
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

  return { data, connected };
}
