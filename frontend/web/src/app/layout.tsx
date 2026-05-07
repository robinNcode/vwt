import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Volt Wave Tech",
    template: "%s · Volt Wave Tech",
  },
  description: "Electrical & electronics accessories and services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}

