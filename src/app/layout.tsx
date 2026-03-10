import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "道生匯 - 卡台",
  description: "道生匯钱包与卡管理后台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
