import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "SportsHub24 Match Schedule & Live Events",
    template: "%s | SportsHub24",
  },
  description: "Stay updated with today's live match schedule across football, cricket, NBA, NHL, MLB, UFC, boxing, motorsports, and other major sporting events.",
};

import AutoRefresh from "@/components/AutoRefresh";

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100">
        <AutoRefresh intervalMs={30000} />
        {children}

        <div
      className="hidden"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: `
  
      <script id="_waut8x">var _wau = _wau || []; _wau.push(["dynamic", "snwpn1a57g", "t8x", "c4302bffffff", "small"]);</script><script async src="//waust.at/d.js"></script>

  `,
        }}
      ></div>
      </body>
    </html>
  );
}
