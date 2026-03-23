import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "道生匯 - Admin",
  description: "道生匯后台管理（Admin）",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="font-sans">
      <body className="min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

