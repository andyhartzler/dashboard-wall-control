import "./globals.css";
import type { Viewport } from "next";
import { DashboardProvider } from "@/components/DashboardProvider";

export const metadata = {
  title: "Command Center",
  description: "Dashboard Wall Control Panel",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a0e1a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <DashboardProvider>{children}</DashboardProvider>
      </body>
    </html>
  );
}
