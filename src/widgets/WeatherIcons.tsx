"use client";

import { CSSProperties } from "react";

interface IconProps {
  size?: number;
  style?: CSSProperties;
}

// Keyframe animations as inline style tags
const AnimStyles = () => (
  <style>{`
    @keyframes wi-spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
    @keyframes wi-drift { 0%,100% { transform: translateX(0) } 50% { transform: translateX(3px) } }
    @keyframes wi-fall { 0% { transform: translateY(-2px); opacity:0 } 50% { opacity:1 } 100% { transform: translateY(4px); opacity:0 } }
    @keyframes wi-flash { 0%,90%,100% { opacity:0 } 92%,96% { opacity:1 } }
    @keyframes wi-wave { 0%,100% { transform: translateX(0) } 50% { transform: translateX(2px) } }
  `}</style>
);

function Sun({ size = 32, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={style}>
      <AnimStyles />
      <g style={{ animation: "wi-spin 20s linear infinite", transformOrigin: "center" }}>
        {[0,45,90,135,180,225,270,315].map(angle => (
          <line key={angle} x1="16" y1="2" x2="16" y2="6" stroke="#FFD54F" strokeWidth="2" strokeLinecap="round"
            transform={`rotate(${angle} 16 16)`} />
        ))}
      </g>
      <circle cx="16" cy="16" r="7" fill="#FFD54F" />
    </svg>
  );
}

function Moon({ size = 32, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={style}>
      <path d="M22 16a10 10 0 01-10 10A10 10 0 0116 6a8 8 0 006 10z" fill="#CFD8DC" />
    </svg>
  );
}

function CloudSun({ size = 32, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={style}>
      <AnimStyles />
      <circle cx="12" cy="10" r="5" fill="#FFD54F" />
      {[0,60,120,180,240,300].map(angle => (
        <line key={angle} x1="12" y1="2" x2="12" y2="4" stroke="#FFD54F" strokeWidth="1.5" strokeLinecap="round"
          transform={`rotate(${angle} 12 10)`} />
      ))}
      <g style={{ animation: "wi-drift 4s ease-in-out infinite" }}>
        <path d="M8 20a5 5 0 019.9-1A4 4 0 1126 24H8a5 5 0 010-4z" fill="#B0BEC5" />
      </g>
    </svg>
  );
}

function Cloud({ size = 32, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={style}>
      <AnimStyles />
      <g style={{ animation: "wi-drift 5s ease-in-out infinite" }}>
        <path d="M8 22a5 5 0 019.9-1A4 4 0 1126 26H8a5 5 0 010-4z" fill="#90A4AE" />
      </g>
    </svg>
  );
}

function CloudDark({ size = 32, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={style}>
      <AnimStyles />
      <g style={{ animation: "wi-drift 6s ease-in-out infinite" }}>
        <path d="M6 20a6 6 0 0111.9-1A5 5 0 1128 24H6z" fill="#78909C" />
        <path d="M10 22a4 4 0 017.9-.8A3 3 0 1124 25H10z" fill="#607D8B" />
      </g>
    </svg>
  );
}

function Rain({ size = 32, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={style}>
      <AnimStyles />
      <g style={{ animation: "wi-drift 5s ease-in-out infinite" }}>
        <path d="M8 16a5 5 0 019.9-1A4 4 0 1126 20H8z" fill="#78909C" />
      </g>
      {[12,16,20].map((x,i) => (
        <line key={x} x1={x} y1="22" x2={x-1} y2="28" stroke="#4FC3F7" strokeWidth="1.5" strokeLinecap="round"
          style={{ animation: `wi-fall 1s ease-in infinite ${i*0.3}s` }} />
      ))}
    </svg>
  );
}

function RainSun({ size = 32, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={style}>
      <AnimStyles />
      <circle cx="10" cy="8" r="4" fill="#FFD54F" opacity="0.7" />
      <g style={{ animation: "wi-drift 4s ease-in-out infinite" }}>
        <path d="M8 16a5 5 0 019.9-1A4 4 0 1126 20H8z" fill="#90A4AE" />
      </g>
      {[12,16,20].map((x,i) => (
        <line key={x} x1={x} y1="22" x2={x-1} y2="28" stroke="#4FC3F7" strokeWidth="1.5" strokeLinecap="round"
          style={{ animation: `wi-fall 1s ease-in infinite ${i*0.3}s` }} />
      ))}
    </svg>
  );
}

function Snow({ size = 32, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={style}>
      <AnimStyles />
      <g style={{ animation: "wi-drift 5s ease-in-out infinite" }}>
        <path d="M8 16a5 5 0 019.9-1A4 4 0 1126 20H8z" fill="#90A4AE" />
      </g>
      {[11,16,21].map((x,i) => (
        <circle key={x} cx={x} cy={24+i*2} r="1.5" fill="#E0E0E0"
          style={{ animation: `wi-fall 2s ease-in infinite ${i*0.4}s` }} />
      ))}
    </svg>
  );
}

function Thunder({ size = 32, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={style}>
      <AnimStyles />
      <g style={{ animation: "wi-drift 4s ease-in-out infinite" }}>
        <path d="M6 14a6 6 0 0111.9-1A5 5 0 1128 18H6z" fill="#607D8B" />
      </g>
      <polygon points="16,19 13,25 15,25 14,30 19,23 17,23 18,19" fill="#FFEB3B"
        style={{ animation: "wi-flash 3s infinite" }} />
    </svg>
  );
}

function Fog({ size = 32, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={style}>
      <AnimStyles />
      {[12,16,20,24].map((y,i) => (
        <line key={y} x1="6" y1={y} x2="26" y2={y} stroke="#90A4AE" strokeWidth="2" strokeLinecap="round"
          opacity={0.6-i*0.1} style={{ animation: `wi-wave 3s ease-in-out infinite ${i*0.5}s` }} />
      ))}
    </svg>
  );
}

function Drizzle({ size = 32, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={style}>
      <AnimStyles />
      <g style={{ animation: "wi-drift 5s ease-in-out infinite" }}>
        <path d="M8 16a5 5 0 019.9-1A4 4 0 1126 20H8z" fill="#90A4AE" />
      </g>
      {[11,15,19,23].map((x,i) => (
        <circle key={x} cx={x} cy={24+((i%2)*2)} r="1" fill="#4FC3F7"
          style={{ animation: `wi-fall 1.5s ease-in infinite ${i*0.25}s` }} />
      ))}
    </svg>
  );
}

// Icon code mapping
const ICON_COMPONENTS: Record<string, (props: IconProps) => JSX.Element> = {
  "01d": Sun, "01n": Moon,
  "02d": CloudSun, "02n": Cloud,
  "03d": Cloud, "03n": Cloud,
  "04d": CloudDark, "04n": CloudDark,
  "09d": Drizzle, "09n": Drizzle,
  "10d": RainSun, "10n": Rain,
  "11d": Thunder, "11n": Thunder,
  "13d": Snow, "13n": Snow,
  "50d": Fog, "50n": Fog,
};

export function WeatherIcon({ code, size = 32, style }: { code: string; size?: number; style?: CSSProperties }) {
  const Component = ICON_COMPONENTS[code];
  if (!Component) return <Sun size={size} style={style} />;
  return <Component size={size} style={style} />;
}

export default WeatherIcon;
