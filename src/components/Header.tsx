"use client";

export default function Header({
  onMenuClick,
}: {
  onMenuClick?: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded p-2 hover:bg-gray-100"
          aria-label="菜单"
        >
          <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <span className="h-8 w-8 rounded-full bg-amber-400 flex items-center justify-center text-sm font-bold text-amber-900">道</span>
          <span className="text-lg font-semibold text-gray-800">道生匯</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="rounded bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600">主账户</span>
        <span className="text-sm text-gray-600">18759270938</span>
        <button type="button" className="rounded-full h-8 w-8 bg-gray-200 flex items-center justify-center hover:bg-gray-300">
          <svg className="h-4 w-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </button>
        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </header>
  );
}
