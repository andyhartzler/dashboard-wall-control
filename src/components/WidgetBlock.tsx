"use client";

import { WIDGET_META } from "@/lib/widget-meta";

interface WidgetBlockProps {
  widgetId: string;
  selected?: boolean;
  onTap?: () => void;
}

export function WidgetBlock({ widgetId, selected, onTap }: WidgetBlockProps) {
  const meta = WIDGET_META[widgetId];
  if (!meta) return null;

  return (
    <button
      onClick={onTap}
      className="widget-block"
      style={{
        "--widget-accent": meta.accent,
        "--widget-accent-dim": `${meta.accent}20`,
        outline: selected ? `1px solid ${meta.accent}` : undefined,
        outlineOffset: -1,
      } as React.CSSProperties}
    >
      <span className="widget-block-icon">{meta.icon}</span>
      <span className="widget-block-title">{meta.title}</span>
    </button>
  );
}
