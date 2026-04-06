import type { Metadata } from "next";
import { Ma_Shan_Zheng } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

/** 书法体「道」字（马善政楷书） */
const fontDao = Ma_Shan_Zheng({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dao-calligraphy",
});

export const metadata: Metadata = {
  title: "道生匯 - 卡台",
  description: "道生匯钱包与卡管理后台",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${fontDao.variable} font-sans`}>
      <body className="min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
