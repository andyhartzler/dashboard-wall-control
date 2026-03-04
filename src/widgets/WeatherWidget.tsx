"use client";

import { registerWidget } from "./registry";

const ICON_MAP: Record<string, string> = {
  "01d": "\u2600\uFE0F", "01n": "\uD83C\uDF19", "02d": "\u26C5", "02n": "\u2601\uFE0F",
  "03d": "\u2601\uFE0F", "03n": "\u2601\uFE0F", "04d": "\u2601\uFE0F", "04n": "\u2601\uFE0F",
  "09d": "\uD83C\uDF27\uFE0F", "09n": "\uD83C\uDF27\uFE0F", "10d": "\uD83C\uDF26\uFE0F", "10n": "\uD83C\uDF27\uFE0F",
  "11d": "\u26C8\uFE0F", "11n": "\u26C8\uFE0F", "13d": "\uD83C\uDF28\uFE0F", "13n": "\uD83C\uDF28\uFE0F",
  "50d": "\uD83C\uDF2B\uFE0F", "50n": "\uD83C\uDF2B\uFE0F",
};

function tempColor(temp: number): string {
  if (temp >= 90) return "var(--color-accent-red)";
  if (temp >= 75) return "var(--color-accent-orange)";
  if (temp >= 55) return "var(--color-accent-green)";
  if (temp >= 35) return "var(--color-accent-cyan)";
  return "var(--color-accent-blue)";
}

function WeatherWidget({ data }: { data: Record<string, unknown> }) {
  const temp = data.temp as number | undefined;
  const icon = data.icon as string | undefined;
  const description = data.description as string | undefined;
  const humidity = data.humidity as number | undefined;
  const wind = data.wind_speed as number | undefined;
  const feelsLike = data.feels_like as number | undefined;
  const high = data.high as number | undefined;
  const low = data.low as number | undefined;

  if (temp === undefined) {
    return <div className="metric-label" style={{ padding: 8 }}>Awaiting weather data...</div>;
  }

  const color = tempColor(temp);

  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ fontSize: 38, lineHeight: 1 }}>{icon ? ICON_MAP[icon] || "" : ""}</span>
        <div>
          <div className="xl-number" style={{ color }}>
            {Math.round(temp)}<span style={{ fontSize: 28, fontWeight: 200, color: "var(--color-t-muted)" }}>&deg;</span>
          </div>
        </div>
      </div>
      <div style={{
        fontSize: 13, fontWeight: 500, color: "var(--color-t-secondary)",
        textTransform: "capitalize", letterSpacing: "0.01em", fontFamily: "var(--font-sans)",
      }}>
        {description}
        {feelsLike !== undefined && (
          <span style={{ color: "var(--color-t-muted)" }}> &middot; Feels {Math.round(feelsLike)}&deg;</span>
        )}
      </div>
      <div style={{ display: "flex", gap: 16, fontSize: 11, fontWeight: 500, letterSpacing: "0.03em" }}>
        {high !== undefined && low !== undefined && (
          <span style={{ color: "var(--color-t-muted)" }}>
            <span style={{ color: "var(--color-accent-red)" }}>H:{Math.round(high)}&deg;</span>{" "}
            <span style={{ color: "var(--color-accent-blue)" }}>L:{Math.round(low)}&deg;</span>
          </span>
        )}
        {humidity !== undefined && (
          <span style={{ color: "var(--color-accent-cyan)" }}>{humidity}% <span style={{ color: "var(--color-t-muted)" }}>Hum</span></span>
        )}
        {wind !== undefined && (
          <span style={{ color: "var(--color-t-muted)" }}>{Math.round(wind)} <span style={{ fontSize: 9 }}>MPH</span></span>
        )}
      </div>
    </div>
  );
}

registerWidget("weather", { title: "Weather", topic: "weather", component: WeatherWidget, defaultSize: { width: 3, height: 2 } });
