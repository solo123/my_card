"use client";

import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setSidebarOpen((o) => !o)} />
      <Sidebar open={sidebarOpen} />
      <main className="pl-0 pt-14 md:pl-56">
        <div className="min-h-[calc(100vh-3.5rem)] p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
}
