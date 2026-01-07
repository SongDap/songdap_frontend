import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const kyoboHandwriting = localFont({
  src: "../../public/fonts/KyoboHandwriting2019.ttf",
  variable: "--font-kyobo-handwriting",
  display: "swap",
});

const galmuri9 = localFont({
  src: "../../public/fonts/Galmuri9.ttf",
  variable: "--font-galmuri9",
  display: "swap",
});

const cafe24PROslim = localFont({
  src: "../../public/fonts/Cafe24PROSlimMax.ttf",
  variable: "--font-cafe24-proslim",
  display: "swap",
});

const dungGeunMo = localFont({
  src: "../../public/fonts/DungGeunMo.ttf",
  variable: "--font-dung-geun-mo",
  display: "swap",
});

const hssaemaeul = localFont({
  src: "../../public/fonts/HSSaemaeul-1.005.ttf",
  variable: "--font-hssaemaeul",
  display: "swap",
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${kyoboHandwriting.variable} ${galmuri9.variable} ${dungGeunMo.variable} ${hssaemaeul.variable} ${cafe24PROslim.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
