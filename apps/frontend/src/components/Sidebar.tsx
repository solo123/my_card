"use client";

import Link from "next/link";
import SidebarNavContent from "./SidebarNavContent";

/** 桌面端固定侧边栏：始终显示，深色底、teal 高亮、底部登出与用户信息 */
export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-20 hidden h-screen w-56 flex-col border-r border-white/10 bg-[#1a1a1a] md:flex">
      {/* Logo */}
      <div className="flex h-14 shrink-0 items-center gap-2 border-b border-white/10 px-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
          道
        </span>
        <span className="text-lg font-semibold text-white">道生匯</span>
      </div>

      {/* 导航 */}
      <div className="flex-1 overflow-y-auto py-3">
        <SidebarNavContent dark />
      </div>

      {/* 底部：登出 + 用户信息 */}
      <div className="shrink-0 border-t border-white/10 p-3">
        <Link
          href="/login"
          className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg bg-white/10 py-2 text-sm font-medium text-gray-200 hover:bg-white/15"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          退出登录
        </Link>
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <div className="h-9 w-9 shrink-0 rounded-full bg-white/20 flex items-center justify-center">
            <svg className="h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">主账户</p>
            <p className="truncate text-xs text-gray-400">查看资料</p>
          </div>
          <button type="button" className="rounded p-1 text-gray-400 hover:bg-white/10 hover:text-white" aria-label="更多">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
