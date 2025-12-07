import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://trnc-outage-map.vercel.app'),
  title: "Kıbrıs Elektrik Kesinti Haritası ⚡️",
  description: "Mahallende elektrik mi kesildi? Haritadan kontrol et, jeneratör ihtiyacını hesapla. KKTC'nin ilk topluluk tabanlı kesinti takip sistemi.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Kesinti Yok",
  },
  icons: {
    apple: "/logo_elek.png",
  },
  openGraph: {
    title: "Elektrik mi Kesildi? Haritaya Bak!",
    description: "Anlık kesinti bildirimleri ve jeneratör hesaplayıcı.",
    images: ['/og-image.png'],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster position="bottom-right" richColors />
        <Analytics />
      </body>
    </html>
  );
}
