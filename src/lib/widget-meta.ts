export interface WidgetMeta {
  title: string
  icon: string
  accent: string
  defaultSize: { w: number; h: number }
}

export const WIDGET_META: Record<string, WidgetMeta> = {
  clock:          { title: 'Clock',          icon: '⏰', accent: '#18FFFF', defaultSize: { w: 3, h: 2 } },
  weather:        { title: 'Weather',        icon: '🌤', accent: '#4C9FFF', defaultSize: { w: 3, h: 2 } },
  calendar:       { title: 'Calendar',       icon: '📅', accent: '#B388FF', defaultSize: { w: 3, h: 4 } },
  reminders:      { title: 'Reminders',      icon: '🔔', accent: '#FF4081', defaultSize: { w: 3, h: 2 } },
  air_traffic:    { title: 'Air Traffic',    icon: '✈️', accent: '#00E676', defaultSize: { w: 6, h: 4 } },
  weather_radar:  { title: 'Weather Radar',  icon: '📡', accent: '#4C9FFF', defaultSize: { w: 6, h: 4 } },
  world_map:      { title: 'Seismic Map',    icon: '🌍', accent: '#FF5252', defaultSize: { w: 6, h: 4 } },
  webcam:         { title: 'Webcams',        icon: '📷', accent: '#18FFFF', defaultSize: { w: 6, h: 4 } },
  stocks:         { title: 'Stocks',         icon: '📈', accent: '#00E676', defaultSize: { w: 3, h: 3 } },
  crypto:         { title: 'Crypto',         icon: '₿',  accent: '#FFB300', defaultSize: { w: 3, h: 3 } },
  news_kc:        { title: 'KC News',        icon: '📰', accent: '#FF4081', defaultSize: { w: 3, h: 4 } },
  news_world:     { title: 'World News',     icon: '🌐', accent: '#4C9FFF', defaultSize: { w: 3, h: 4 } },
  earthquake:     { title: 'Earthquakes',    icon: '🔴', accent: '#FF5252', defaultSize: { w: 3, h: 3 } },
  sun:            { title: 'Sun & Moon',     icon: '☀️', accent: '#FFB300', defaultSize: { w: 3, h: 2 } },
  moon:           { title: 'Moon Phase',     icon: '🌙', accent: '#B388FF', defaultSize: { w: 3, h: 3 } },
  sports:         { title: 'Sports',         icon: '🏆', accent: '#00E676', defaultSize: { w: 3, h: 3 } },
  prediction:     { title: 'Predictions',    icon: '🎯', accent: '#B388FF', defaultSize: { w: 3, h: 3 } },
  trending:       { title: 'Trending',       icon: '🔥', accent: '#FF4081', defaultSize: { w: 3, h: 2 } },
  disaster:       { title: 'Disasters',      icon: '⚠️', accent: '#FF5252', defaultSize: { w: 3, h: 3 } },
  conflict:       { title: 'Conflicts',      icon: '🗺', accent: '#FFB300', defaultSize: { w: 3, h: 3 } },
  smart_home:     { title: 'Smart Home',     icon: '🏠', accent: '#18FFFF', defaultSize: { w: 3, h: 4 } },
  system_health:  { title: 'System Health',  icon: '💻', accent: '#00E676', defaultSize: { w: 3, h: 2 } },
}

export interface WidgetPlacement {
  widget: string
  col: number
  row: number
  width: number
  height: number
}
