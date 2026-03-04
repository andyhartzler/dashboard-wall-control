"use client";

import { registerWidget } from "./registry";

interface Team { name: string; score: string; logo: string; }
interface GameScore { league: string; status: string; teams: Team[]; }

const LEAGUE_COLORS: Record<string, string> = {
  NFL: "var(--color-accent-red)", MLB: "var(--color-accent-blue)", MLS: "var(--color-accent-green)",
  NBA: "var(--color-accent-orange)", NHL: "var(--color-accent-cyan)",
};

function SportsWidget({ data }: { data: Record<string, unknown> }) {
  const scores = (data.scores as GameScore[]) || [];
  if (scores.length === 0) {
    return (
      <div style={{ color: "var(--color-t-muted)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 6 }}>
        <div style={{ fontSize: 13, fontWeight: 400, fontFamily: "var(--font-sans)" }}>No active KC games</div>
        <div style={{ fontSize: 10, letterSpacing: "0.06em", fontWeight: 600, color: "var(--color-accent-blue)", fontFamily: "var(--font-sans)" }}>
          CHIEFS &middot; ROYALS &middot; SPORTING
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, height: "100%", overflowY: "auto" }}>
      {scores.map((game, i) => {
        const leagueColor = LEAGUE_COLORS[game.league?.toUpperCase()] || "var(--color-accent-blue)";
        return (
          <div key={i} style={{ padding: "6px 0", borderBottom: i < scores.length - 1 ? "1px solid rgba(80, 120, 200, 0.06)" : "none" }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: leagueColor, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6, fontFamily: "var(--font-sans)", textShadow: `0 0 8px ${leagueColor}` }}>
              {game.league}
            </div>
            {game.teams.map((team, j) => (
              <div key={j} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "3px 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {team.logo && <img src={team.logo} alt={team.name} style={{ width: 18, height: 18, objectFit: "contain" }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />}
                  <span style={{ fontSize: 13, fontWeight: 500, fontFamily: "var(--font-sans)" }}>{team.name}</span>
                </div>
                <span style={{ fontSize: 20, fontWeight: 300, fontVariantNumeric: "tabular-nums", fontFamily: "var(--font-mono)", letterSpacing: "-0.02em", color: "var(--color-t-primary)" }}>{team.score}</span>
              </div>
            ))}
            <div style={{
              fontSize: 10, marginTop: 4, fontWeight: 500, letterSpacing: "0.03em", fontFamily: "var(--font-sans)",
              color: game.status?.toLowerCase().includes("live") || game.status?.toLowerCase().includes("progress") ? "var(--color-accent-green)" : "var(--color-t-muted)",
            }}>{game.status}</div>
          </div>
        );
      })}
    </div>
  );
}

registerWidget("sports", { title: "KC Sports", topic: "sports", component: SportsWidget, defaultSize: { width: 3, height: 2 } });
