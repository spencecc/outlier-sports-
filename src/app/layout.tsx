import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: {
    default: "Outlier Sports",
    template: "%s | Outlier Sports",
  },
  description:
    "A Monte Carlo sports model that surfaces the games where the market is wrong. Daily picks, fully transparent track record, free.",
  metadataBase: new URL("https://outliersportshq.com"),
  openGraph: {
    siteName: "Outlier Sports",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@OutlierSportsHQ",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col"
        style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
