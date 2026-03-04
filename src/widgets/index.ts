"use client";

// Import all pure React widgets (side-effect: registers in WIDGET_REGISTRY)
import "./ClockWidget";
import "./WeatherWidget";
import "./StocksWidget";
import "./CryptoWidget";
import "./NewsWidget";
import "./EarthquakeWidget";
import "./SportsWidget";
import "./SunWidget";
import "./MoonPhaseWidget";
import "./PredictionWidget";
import "./TrendingWidget";
import "./SystemHealthWidget";
import "./CalendarWidget";
import "./RemindersWidget";
import "./ConflictWidget";
import "./DisasterWidget";
import "./SmartHomeWidget";

// Leaflet + HLS widgets are loaded dynamically in TVMirror.tsx
// (they access window/document which breaks SSR)

export { WIDGET_REGISTRY } from "./registry";
