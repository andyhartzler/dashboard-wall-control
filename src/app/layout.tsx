import { Inter } from "next/font/google";
import "./globals.css";
import { DashboardProvider } from "@/components/DashboardProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Dashboard Wall Control",
  description: "Remote control panel for Dashboard Wall",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <DashboardProvider>{children}</DashboardProvider>
      </body>
    </html>
  );
}
