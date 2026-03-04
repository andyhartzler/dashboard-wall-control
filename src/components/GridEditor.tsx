"use client";

import { useState, useCallback, useRef } from "react";
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { useDashboard } from "@/components/DashboardProvider";
import { WIDGET_META, type WidgetPlacement } from "@/lib/widget-meta";

interface GridEditorProps {
  onDone: () => void;
}

// ── Draggable widget on the grid ──
function DraggableWidget({ placement }: { placement: WidgetPlacement }) {
  const meta = WIDGET_META[placement.widget];
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `grid-${placement.widget}`,
    data: { widget: placement.widget, source: "grid" },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`widget-draggable ${isDragging ? "dragging" : ""}`}
      style={{ ["--widget-accent" as string]: meta?.accent }}
    >
      <span className="widget-block-icon">{meta?.icon}</span>
      <span className="widget-block-title">{meta?.title}</span>
    </div>
  );
}

// ── Draggable palette item ──
function DraggablePaletteItem({ widgetId }: { widgetId: string }) {
  const meta = WIDGET_META[widgetId];
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${widgetId}`,
    data: { widget: widgetId, source: "palette" },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="palette-item"
      style={{
        ["--widget-accent" as string]: meta?.accent,
        opacity: isDragging ? 0.4 : 1,
      }}
    >
      <span className="palette-item-icon">{meta?.icon}</span>
      <span className="palette-item-title">{meta?.title}</span>
    </div>
  );
}

// ── Droppable grid cell ──
function DroppableCell({ col, row, isHighlighted }: { col: number; row: number; isHighlighted: boolean }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `cell-${col}-${row}`,
    data: { col, row },
  });

  return (
    <div
      ref={setNodeRef}
      className={`grid-cell-empty ${isOver || isHighlighted ? "drag-over" : ""}`}
      style={{ gridColumn: col, gridRow: row }}
    />
  );
}

// ── Drag overlay ──
function OverlayWidget({ widgetId }: { widgetId: string }) {
  const meta = WIDGET_META[widgetId];
  if (!meta) return null;
  return (
    <div
      style={{
        width: 60,
        height: 50,
        background: "rgba(14, 20, 38, 0.95)",
        border: `1px solid ${meta.accent}`,
        borderRadius: 6,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        boxShadow: `0 0 20px ${meta.accent}40`,
      }}
    >
      <span style={{ fontSize: 16 }}>{meta.icon}</span>
      <span style={{ fontSize: 7, fontWeight: 600, color: meta.accent, textTransform: "uppercase" as const }}>
        {meta.title}
      </span>
    </div>
  );
}

export function GridEditor({ onDone }: GridEditorProps) {
  const { layout, activePreset, saveLayout } = useDashboard();
  const [widgets, setWidgets] = useState<WidgetPlacement[]>(() => [...layout]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const lastLayoutRef = useRef(layout);

  // Sync if layout changes externally
  if (layout !== lastLayoutRef.current) {
    lastLayoutRef.current = layout;
    setWidgets([...layout]);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  const placedIds = new Set(widgets.map((w) => w.widget));
  const availableWidgets = Object.keys(WIDGET_META).filter((id) => !placedIds.has(id));

  const isOccupied = useCallback(
    (col: number, row: number, excludeWidget?: string) => {
      return widgets.some(
        (w) =>
          w.widget !== excludeWidget &&
          col >= w.col &&
          col < w.col + w.width &&
          row >= w.row &&
          row < w.row + w.height
      );
    },
    [widgets]
  );

  const canPlace = useCallback(
    (col: number, row: number, width: number, height: number, excludeWidget?: string) => {
      if (col < 1 || row < 1 || col + width - 1 > 12 || row + height - 1 > 8) return false;
      for (let c = col; c < col + width; c++) {
        for (let r = row; r < row + height; r++) {
          if (isOccupied(c, r, excludeWidget)) return false;
        }
      }
      return true;
    },
    [isOccupied]
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.data.current?.widget ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const widgetId = active.data.current?.widget as string;
    const source = active.data.current?.source as string;
    const cellData = over.data.current as { col: number; row: number } | undefined;
    if (!widgetId || !cellData) return;

    const meta = WIDGET_META[widgetId];
    if (!meta) return;

    const { col, row } = cellData;

    if (source === "palette") {
      const { w, h } = meta.defaultSize;
      if (canPlace(col, row, w, h)) {
        setWidgets((prev) => [...prev, { widget: widgetId, col, row, width: w, height: h }]);
      }
    } else if (source === "grid") {
      const existing = widgets.find((w) => w.widget === widgetId);
      if (!existing) return;
      if (canPlace(col, row, existing.width, existing.height, widgetId)) {
        setWidgets((prev) =>
          prev.map((w) => (w.widget === widgetId ? { ...w, col, row } : w))
        );
      }
    }
  };

  const handleRemoveWidget = (widgetId: string) => {
    setWidgets((prev) => prev.filter((w) => w.widget !== widgetId));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveLayout(activePreset, activePreset, widgets);
      onDone();
    } finally {
      setSaving(false);
    }
  };

  // Empty cells for drop targets
  const emptyCells: React.ReactNode[] = [];
  for (let row = 1; row <= 8; row++) {
    for (let col = 1; col <= 12; col++) {
      if (!isOccupied(col, row)) {
        emptyCells.push(
          <DroppableCell key={`e-${col}-${row}`} col={col} row={row} isHighlighted={!!activeId} />
        );
      }
    }
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div>
        <div className="grid-editor">
          <div className="grid-editor-grid">
            {widgets.map((w) => (
              <div
                key={w.widget}
                style={{
                  gridColumn: `${w.col} / span ${w.width}`,
                  gridRow: `${w.row} / span ${w.height}`,
                  position: "relative",
                }}
              >
                <DraggableWidget placement={w} />
                <button
                  className="remove-btn"
                  onClick={() => handleRemoveWidget(w.widget)}
                  style={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: "rgba(255, 82, 82, 0.85)",
                    border: "none",
                    color: "white",
                    fontSize: 9,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    zIndex: 10,
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
            {emptyCells}
          </div>
        </div>

        {/* Widget Palette */}
        <div style={{ marginTop: 8 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-t-muted)" }}>
              Drag widgets onto grid
            </span>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: "5px 14px",
                borderRadius: 12,
                border: "1px solid rgba(0, 230, 118, 0.3)",
                background: "rgba(0, 230, 118, 0.12)",
                color: "#00E676",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {saving ? "Saving..." : "Save Layout"}
            </button>
          </div>
          <div className="widget-palette">
            {availableWidgets.map((id) => (
              <DraggablePaletteItem key={id} widgetId={id} />
            ))}
            {availableWidgets.length === 0 && (
              <span style={{ fontSize: 11, color: "var(--color-t-muted)", padding: "16px 0" }}>
                All widgets placed on grid
              </span>
            )}
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeId ? <OverlayWidget widgetId={activeId} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
