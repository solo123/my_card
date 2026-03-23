"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
  { href: "/users", label: "用户列表" },
  { href: "/cards", label: "卡列表" },
];

export default function SidebarNavContent({
  onNavigate,
  dark = false,
}: {
  onNavigate?: () => void;
  dark?: boolean;
}) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1 px-3">
      {menu.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={
              dark
                ? `block rounded-lg px-3 py-2 text-sm transition-colors ${
                    active ? "bg-primary text-white font-medium" : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`
                : `block rounded px-3 py-2 text-sm transition-colors ${
                    active ? "bg-primary/15 text-primary font-medium" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`
            }
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

