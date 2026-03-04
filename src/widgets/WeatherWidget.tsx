"use client";

import { registerWidget } from "./registry";
import { WeatherIcon } from "./WeatherIcons";

interface ForecastHour {
  dt: number;
  temp: number;
  icon: string;
  description: string;
  pop?: number;
}

interface ForecastDay {
  date: string;
  high: number;
  low: number;
  icon: string;
  description: string;
  pop?: number;
}

function conditionGradient(icon: string): string {
  const isNight = icon?.endsWith("n");
  if (isNight) return "linear-gradient(180deg, #0f1b3d 0%, #1a1a2e 50%, #16213e 100%)";
  if (icon?.startsWith("01")) return "linear-gradient(180deg, #1e6091 0%, #2980b9 40%, #3498db 100%)";
  if (icon?.startsWith("02") || icon?.startsWith("03")) return "linear-gradient(180deg, #2c3e6b 0%, #34495e 50%, #4a6888 100%)";
  if (icon?.startsWith("04")) return "linear-gradient(180deg, #2c3e50 0%, #34495e 50%, #3d566e 100%)";
  if (icon?.startsWith("09") || icon?.startsWith("10")) return "linear-gradient(180deg, #2c3e50 0%, #3d566e 50%, #4a6888 100%)";
  if (icon?.startsWith("11")) return "linear-gradient(180deg, #1a1a2e 0%, #2d2d44 50%, #3a3a5c 100%)";
  if (icon?.startsWith("13")) return "linear-gradient(180deg, #4a6888 0%, #6b8fb5 50%, #8bb0d4 100%)";
  if (icon?.startsWith("50")) return "linear-gradient(180deg, #3d566e 0%, #4a6888 50%, #5a7a9a 100%)";
  return "linear-gradient(180deg, #1e6091 0%, #2980b9 40%, #3498db 100%)";
}

function formatHour(index: number): string {
  const now = new Date();
  const hour = (now.getHours() + index) % 24;
  if (index === 0) return "Now";
  const period = hour >= 12 ? "PM" : "AM";
  const h = hour % 12 || 12;
  return `${h}${period}`;
}

function WeatherWidget({ data, width, height }: { data: Record<string, unknown>; width?: number; height?: number }) {
  const temp = data.temp as number | undefined;
  const icon = data.icon as string | undefined;
  const description = data.description as string | undefined;
  const humidity = data.humidity as number | undefined;
  const wind = data.wind_speed as number | undefined;
  const feelsLike = data.feels_like as number | undefined;
  const high = (data.temp_max ?? data.high) as number | undefined;
  const low = (data.temp_min ?? data.low) as number | undefined;
  const uvIndex = data.uv_index as number | undefined;
  const precipProb = data.precip_probability as number | undefined;
  const pressure = data.pressure as number | undefined;
  const visibility = data.visibility as number | undefined;
  const dewPoint = data.dew_point as number | undefined;
  const forecastHourly = (data.forecast_hourly ?? data.forecast) as ForecastHour[] | undefined;
  const forecastDaily = data.forecast_daily as ForecastDay[] | undefined;

  if (temp === undefined) {
    return <div className="metric-label" style={{ padding: 8 }}>Awaiting weather data...</div>;
  }

  const isCompact = (width ?? 3) <= 3 && (height ?? 2) <= 2;
  const bg = conditionGradient(icon || "01d");

  if (isCompact) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", justifyContent: "center",
        height: "100%", gap: 6, background: bg, borderRadius: "inherit",
        margin: -10, marginTop: -6, padding: "12px 14px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <WeatherIcon code={icon || "01d"} size={36} />
          <div style={{
            fontSize: 48, fontWeight: 200, lineHeight: 1, letterSpacing: "-0.03em",
            fontFamily: "var(--font-sans)", color: "#fff",
          }}>
            {Math.round(temp)}<span style={{ fontSize: 24, fontWeight: 200, opacity: 0.6 }}>&deg;</span>
          </div>
        </div>
        <div style={{
          fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.8)",
          textTransform: "capitalize", fontFamily: "var(--font-sans)",
        }}>
          {description}
        </div>
        <div style={{ display: "flex", gap: 12, fontSize: 11, fontWeight: 500 }}>
          {high !== undefined && low !== undefined && (
            <span style={{ color: "rgba(255,255,255,0.6)" }}>
              H:{Math.round(high)}&deg; L:{Math.round(low)}&deg;
            </span>
          )}
          {feelsLike !== undefined && (
            <span style={{ color: "rgba(255,255,255,0.5)" }}>Feels {Math.round(feelsLike)}&deg;</span>
          )}
        </div>
      </div>
    );
  }

  const allDailyTemps = forecastDaily?.flatMap(d => [d.high, d.low]) || [];
  const globalLow = allDailyTemps.length ? Math.min(...allDailyTemps) : (low ?? 0);
  const globalHigh = allDailyTemps.length ? Math.max(...allDailyTemps) : (high ?? 100);
  const tempRange = globalHigh - globalLow || 1;

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100%",
      background: bg, borderRadius: "inherit",
      margin: -10, marginTop: -6, padding: "14px 16px",
      gap: 10, overflowY: "auto", overflowX: "hidden",
    }}>
      <div style={{ textAlign: "center", paddingBottom: 4 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.6)", letterSpacing: "0.03em", textTransform: "uppercase" }}>
          Kansas City
        </div>
        <div style={{
          fontSize: 72, fontWeight: 200, lineHeight: 1, letterSpacing: "-0.04em",
          fontFamily: "var(--font-sans)", color: "#fff",
        }}>
          {Math.round(temp)}<span style={{ fontSize: 36, fontWeight: 200, opacity: 0.5 }}>&deg;</span>
        </div>
        <div style={{
          fontSize: 15, fontWeight: 500, color: "rgba(255,255,255,0.8)",
          textTransform: "capitalize", marginTop: 2,
        }}>
          {description}
        </div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>
          H:{high !== undefined ? Math.round(high) : "--"}&deg; L:{low !== undefined ? Math.round(low) : "--"}&deg;
        </div>
      </div>

      {forecastHourly && forecastHourly.length > 0 && (
        <div style={{
          background: "rgba(255,255,255,0.08)", borderRadius: 12, padding: "10px 0",
          borderTop: "1px solid rgba(255,255,255,0.1)",
        }}>
          <div style={{
            display: "flex", overflowX: "auto", gap: 0, scrollSnapType: "x mandatory",
            paddingLeft: 12, paddingRight: 12,
          }}>
            {forecastHourly.slice(0, 24).map((h, i) => (
              <div key={i} style={{
                flex: "0 0 52px", display: "flex", flexDirection: "column",
                alignItems: "center", gap: 6, scrollSnapAlign: "start", padding: "2px 0",
              }}>
                <span style={{ fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.6)" }}>
                  {formatHour(i)}
                </span>
                <WeatherIcon code={h.icon || "01d"} size={22} />
                <span style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>
                  {Math.round(h.temp)}&deg;
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {forecastDaily && forecastDaily.length > 0 && (
        <div style={{
          background: "rgba(255,255,255,0.08)", borderRadius: 12, padding: "8px 14px",
          borderTop: "1px solid rgba(255,255,255,0.1)",
        }}>
          <div style={{
            fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.4)",
            textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6,
          }}>
            7-DAY FORECAST
          </div>
          {forecastDaily.map((d, i) => {
            const dayDate = new Date(d.date + "T12:00:00");
            const dayName = i === 0 ? "Today" : dayDate.toLocaleDateString("en-US", { weekday: "short" });
            const lowPct = ((d.low - globalLow) / tempRange) * 100;
            const highPct = ((d.high - globalLow) / tempRange) * 100;
            return (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 8, padding: "5px 0",
                borderTop: i > 0 ? "1px solid rgba(255,255,255,0.06)" : "none",
              }}>
                <span style={{ width: 38, fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.8)" }}>
                  {dayName}
                </span>
                <WeatherIcon code={d.icon || "01d"} size={20} />
                <span style={{ width: 28, fontSize: 13, color: "rgba(255,255,255,0.4)", textAlign: "right" }}>
                  {Math.round(d.low)}&deg;
                </span>
                <div style={{
                  flex: 1, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.1)", position: "relative",
                }}>
                  <div style={{
                    position: "absolute", top: 0, bottom: 0, borderRadius: 2,
                    left: `${lowPct}%`, right: `${100 - highPct}%`,
                    background: "linear-gradient(to right, #4FC3F7, #FFB300, #FF5252)",
                    backgroundSize: "300% 100%",
                    backgroundPosition: `${lowPct}% 0`,
                  }} />
                </div>
                <span style={{ width: 28, fontSize: 13, fontWeight: 500, color: "#fff", textAlign: "right" }}>
                  {Math.round(d.high)}&deg;
                </span>
              </div>
            );
          })}
        </div>
      )}

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8,
      }}>
        {uvIndex !== undefined && (
          <ConditionCard label="UV INDEX" value={uvIndex.toString()} detail={uvIndex <= 2 ? "Low" : uvIndex <= 5 ? "Moderate" : uvIndex <= 7 ? "High" : "Very High"} />
        )}
        {feelsLike !== undefined && (
          <ConditionCard label="FEELS LIKE" value={`${Math.round(feelsLike)}\u00B0`} />
        )}
        {humidity !== undefined && (
          <ConditionCard label="HUMIDITY" value={`${humidity}%`} detail={dewPoint !== undefined ? `Dew point: ${Math.round(dewPoint)}\u00B0` : undefined} />
        )}
        {wind !== undefined && (
          <ConditionCard label="WIND" value={`${Math.round(wind)}`} detail="mph" />
        )}
        {precipProb !== undefined && (
          <ConditionCard label="PRECIPITATION" value={`${Math.round(precipProb * 100)}%`} detail="chance" />
        )}
        {visibility !== undefined && (
          <ConditionCard label="VISIBILITY" value={`${Math.round(visibility / 1609)}`} detail="mi" />
        )}
        {pressure !== undefined && (
          <ConditionCard label="PRESSURE" value={`${Math.round(pressure)}`} detail="mb" />
        )}
      </div>
    </div>
  );
}

function ConditionCard({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.08)", borderRadius: 12, padding: "10px 12px",
      borderTop: "1px solid rgba(255,255,255,0.1)",
    }}>
      <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.06em" }}>
        {label}
      </div>
      <div style={{ fontSize: 22, fontWeight: 400, color: "#fff", marginTop: 2, fontFamily: "var(--font-sans)" }}>
        {value}
      </div>
      {detail && (
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 1 }}>{detail}</div>
      )}
    </div>
  );
}

registerWidget("weather", {
  title: "Weather",
  topic: "weather",
  component: WeatherWidget,
  defaultSize: { width: 3, height: 2 },
});
