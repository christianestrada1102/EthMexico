import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BridgeFastWithdraw - Retiros Rápidos L2→L1",
  description: "Sistema de retiros rápidos para puentes L2→L1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className="dark">{children}</body>
    </html>
  );
}

