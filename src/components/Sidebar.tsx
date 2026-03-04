"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  Activity,
  Wifi,
  WifiOff,
  Monitor,
} from "lucide-react";
import { useDashboard } from "@/components/DashboardProvider";

interface SidebarProps {
  onOpenSetup: () => void;
}

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/config", label: "Configuration", icon: Settings },
  { href: "/status", label: "Status", icon: Activity },
];

export function Sidebar({ onOpenSetup }: SidebarProps) {
  const pathname = usePathname();
  const { connected } = useDashboard();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[240px] bg-sidebar-bg border-r border-sidebar-border flex flex-col z-40">
      {/* Logo */}
      <div className="p-5 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <Monitor className="w-6 h-6 text-accent-blue" />
          <div>
            <h1 className="text-sm font-semibold text-text-primary">
              Dashboard Wall
            </h1>
            <p className="text-xs text-text-muted">Control Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                isActive
                  ? "bg-accent-blue/15 text-accent-blue border border-accent-blue/20"
                  : "text-text-secondary hover:text-text-primary hover:bg-white/[0.03] border border-transparent"
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Connection status footer */}
      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={onOpenSetup}
          className="flex items-center gap-2 text-xs text-text-muted hover:text-text-secondary transition-colors w-full"
        >
          {connected ? (
            <Wifi className="w-3.5 h-3.5 text-accent-green" />
          ) : (
            <WifiOff className="w-3.5 h-3.5 text-accent-red" />
          )}
          <span className="truncate">
            {connected ? "Connected" : "Disconnected"}
          </span>
        </button>
      </div>
    </aside>
  );
}
