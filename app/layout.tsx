import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";
import InteractiveGridBackground from "../components/InteractiveGridBackground";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Candor | Premium Automotive Concierge",
  description: "High-End Automotive Research & Fintech Concierge",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
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
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 relative selection:bg-brand-blue/30 selection:text-brand-blue">
        <ThemeProvider>
          <InteractiveGridBackground />
          <div className="relative z-10 min-h-screen flex flex-col">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
