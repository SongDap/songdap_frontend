import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import kotraFont from "next/font/local";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const kotraHope = kotraFont({
  src: "../../public/fonts/KOTRA_HOPE.ttf",  
  variable: "--font-kotra-hope",
});

export const metadata: Metadata = {
  title: "노래로 답해줘",
  description: "SongDap",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${kotraHope.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
