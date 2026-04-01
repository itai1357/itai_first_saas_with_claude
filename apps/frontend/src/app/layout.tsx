import type { Metadata } from "next";
import { AuthProvider } from "@/auth";
import "./globals.css";

export const metadata: Metadata = {
  title: "SaaS Starter",
  description: "Minimal SaaS monorepo frontend",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
