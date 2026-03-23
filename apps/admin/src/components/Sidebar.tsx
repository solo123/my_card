"use client";

import Link from "next/link";
import { clearAuth } from "@/lib/api";
import SidebarNavContent from "./SidebarNavContent";

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-20 hidden h-screen w-56 flex-col border-r border-white/10 bg-[#1a1a1a] md:flex">
      <div className="flex h-14 shrink-0 items-center gap-2 border-b border-white/10 px-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
          道
        </span>
        <span className="text-lg font-semibold text-white">道生匯 Admin</span>
      </div>
      <div className="flex-1 overflow-y-auto py-3">
        <SidebarNavContent dark />
      </div>
      <div className="shrink-0 border-t border-white/10 p-3">
        <Link
          href="/login"
          onClick={() => clearAuth()}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-white/10 py-2 text-sm font-medium text-gray-200 hover:bg-white/15"
        >
          退出登录
        </Link>
      </div>
    </aside>
  );
}

