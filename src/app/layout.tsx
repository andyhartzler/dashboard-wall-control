import "./globals.css";
import { DashboardProvider } from "@/components/DashboardProvider";

export const metadata = {
  title: "Dashboard",
  description: "Dashboard Wall Remote",
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
  themeColor: "#0c0c0e",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent" },
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
