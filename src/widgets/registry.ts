"use client";

import type { ComponentType } from "react";

export interface WidgetProps {
  data: Record<string, unknown>;
  width?: number;
  height?: number;
}

export interface WidgetRegistryEntry {
  title: string;
  topic: string;
  component: ComponentType<WidgetProps>;
  defaultSize: { width: number; height: number };
}

export const WIDGET_REGISTRY: Record<string, WidgetRegistryEntry> = {};

export function registerWidget(id: string, entry: WidgetRegistryEntry) {
  WIDGET_REGISTRY[id] = entry;
}
