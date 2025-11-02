import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Settarb - Retiros Rápidos y Liquidez L2→L1",
  description: "Settarb - Retira tus fondos de Arbitrum a Ethereum en segundos. Sistema de retiros rápidos L2→L1 con proveedores de liquidez.",
  openGraph: {
    title: "Settarb - Retiros Rápidos L2→L1",
    description: "Retira tus fondos de Arbitrum a Ethereum en segundos, no en días",
    type: "website",
  },
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

