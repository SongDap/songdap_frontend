import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import kotraFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import { AuthHydrator } from "@/shared";
import ReactQueryProvider from "@/shared/providers/ReactQueryProvider";

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
}: {
  children: React.ReactNode;
}) {
  // 환경 변수 가져오기
  const GA_ID = process.env.REACT_APP_GOOGLE_ANALYTICS_ID;

  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${kotraHope.variable} antialiased`}
      >
        {/* GA활용 */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}

        <ReactQueryProvider>
          <AuthHydrator />
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
