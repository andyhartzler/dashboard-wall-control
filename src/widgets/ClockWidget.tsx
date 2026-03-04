"use client";

import { useState, useEffect } from "react";
import { registerWidget } from "./registry";

function ClockWidget(_props: { data: Record<string, unknown> }) {
  const [time, setTime] = useState(new Date());
  const [colonVisible, setColonVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
      setColonVisible((prev) => !prev);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const seconds = time.getSeconds().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const h12 = hours % 12 || 12;

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%", gap: 4 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 0 }}>
        <span style={{
          fontSize: 72, fontWeight: 200, lineHeight: 1, letterSpacing: "-0.04em",
          fontVariantNumeric: "tabular-nums", fontFamily: "var(--font-mono)",
          color: "var(--color-t-primary)", textShadow: "0 0 30px rgba(76, 159, 255, 0.15)",
        }}>{h12}</span>
        <span style={{
          fontSize: 72, fontWeight: 200, lineHeight: 1, fontFamily: "var(--font-mono)",
          color: "var(--color-accent-cyan)", opacity: colonVisible ? 1 : 0.15,
          transition: "opacity 0.4s ease", margin: "0 1px",
          textShadow: colonVisible ? "0 0 12px rgba(24, 255, 255, 0.4)" : "none",
        }}>:</span>
        <span style={{
          fontSize: 72, fontWeight: 200, lineHeight: 1, letterSpacing: "-0.04em",
          fontVariantNumeric: "tabular-nums", fontFamily: "var(--font-mono)",
          color: "var(--color-t-primary)", textShadow: "0 0 30px rgba(76, 159, 255, 0.15)",
        }}>{minutes}</span>
        <div style={{ display: "flex", flexDirection: "column", marginLeft: 8, gap: 2, alignSelf: "center" }}>
          <span style={{
            fontSize: 13, fontWeight: 600, color: "var(--color-accent-blue)",
            letterSpacing: "0.08em", fontFamily: "var(--font-sans)",
          }}>{ampm}</span>
          <span style={{
            fontSize: 13, fontWeight: 300, fontVariantNumeric: "tabular-nums",
            fontFamily: "var(--font-mono)", color: "var(--color-t-muted)",
          }}>:{seconds}</span>
        </div>
      </div>
      <div style={{
        fontSize: 14, fontWeight: 400, color: "var(--color-t-secondary)",
        letterSpacing: "0.02em", fontFamily: "var(--font-sans)", marginTop: 4,
      }}>
        {days[time.getDay()]}, {months[time.getMonth()]} {time.getDate()}
      </div>
    </div>
  );
}

registerWidget("clock", { title: "Clock", topic: "clock", component: ClockWidget, defaultSize: { width: 3, height: 2 } });
