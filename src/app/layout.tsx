import type { Metadata } from "next";
import { MainProviders } from "@/Providers/MainProviders";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zakers — Dashboard",
  description: "A focused workspace for your business metrics.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body><MainProviders>{children}</MainProviders></body>
    </html>
  );
}
