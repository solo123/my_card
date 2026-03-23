"use client";

import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import SidebarNavContent from "./SidebarNavContent";
import { Sheet, SheetContent } from "./ui/sheet";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Sidebar />
      <div className="md:hidden">
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" showCloseButton className="w-56 border-r border-white/10 bg-[#1a1a1a] p-0">
            <div className="flex h-full flex-col pt-14">
              <div className="border-b border-white/10 px-4 pb-3">
                <span className="text-lg font-semibold text-white">道生匯 Admin</span>
              </div>
              <div className="flex-1 overflow-y-auto py-3">
                <SidebarNavContent dark onNavigate={() => setMobileMenuOpen(false)} />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <main className="min-h-screen md:pl-56">
        <Header onMenuClick={() => setMobileMenuOpen((o) => !o)} />
        <div className="p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
}

