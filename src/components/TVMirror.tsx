"use client";

import { useDashboard } from "@/components/DashboardProvider";
import { WidgetBlock } from "@/components/WidgetBlock";

export function TVMirror() {
  const { layout } = useDashboard();

  return (
    <div className="tv-mirror-container">
      <div className="tv-mirror-grid">
        {layout.map((placement) => (
          <div
            key={placement.widget}
            style={{
              gridColumn: `${placement.col} / span ${placement.width}`,
              gridRow: `${placement.row} / span ${placement.height}`,
            }}
          >
            <WidgetBlock widgetId={placement.widget} />
          </div>
        ))}
      </div>
    </div>
  );
}
