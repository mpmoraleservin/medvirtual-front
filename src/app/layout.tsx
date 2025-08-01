import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner"
import { DarkModeProvider } from "@/components/providers/dark-mode-provider";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MedVirtual",
  description: "MedVirtual",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${instrumentSans.variable} antialiased`}>
        <DarkModeProvider>
          <Toaster position="top-right" className="font-[Instrument_Sans]" />
          {children}
        </DarkModeProvider>
      </body>
    </html>
  );
}
