"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const menuConfig = [
  {
    key: "wallet",
    label: "钱包",
    children: [
      { href: "/wallet", label: "我的钱包" },
      { href: "/account-details", label: "账户明细" },
      { href: "/fund-transfer", label: "资金划转" },
      { href: "/transfer-management", label: "转账管理" },
    ],
  },
  {
    key: "regular",
    label: "常规卡",
    children: [
      { href: "/cardholder", label: "持卡人信息" },
      { href: "/card-management", label: "卡管理" },
      { href: "/open-card", label: "开卡" },
      { href: "/recharge-record", label: "充值记录" },
      { href: "/transaction-details", label: "交易明细" },
      { href: "/refund-details", label: "退款明细" },
      { href: "/fee-details", label: "手续费明细" },
      { href: "/cancelled-cards", label: "销卡列表" },
    ],
  },
  {
    key: "3d",
    label: "3D卡",
    children: [
      { href: "/3d/cardholder", label: "持卡人信息" },
      { href: "/3d/card-management", label: "卡管理" },
      { href: "/3d/open-card", label: "开卡" },
    ],
  },
  {
    key: "3d1",
    label: "3D-1卡",
    children: [
      { href: "/3d1/cardholder", label: "持卡人信息" },
      { href: "/3d1/card-management", label: "卡管理" },
      { href: "/3d1/open-card", label: "开卡" },
    ],
  },
  {
    key: "account",
    label: "账户",
    children: [
      { href: "/verify", label: "实名认证" },
      { href: "/password", label: "密码设置" },
      { href: "/sub-accounts", label: "子账户" },
      { href: "/security", label: "安全验证" },
    ],
  },
];

function NavItem({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`block rounded px-3 py-2 text-sm transition-colors ${
        active
          ? "bg-purple-100 text-purple-800 font-medium"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      {label}
    </Link>
  );
}

export default function Sidebar({ open }: { open: boolean }) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    wallet: true,
    regular: true,
    "3d": true,
    "3d1": false,
    account: false,
  });

  const toggle = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <aside
      className={`fixed left-0 top-14 z-20 h-[calc(100vh-3.5rem)] w-56 border-r border-gray-200 bg-[#f8f8f8] transition-transform duration-200 md:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <nav className="flex flex-col gap-1 overflow-y-auto p-3">
        {menuConfig.map((section) => {
          const isExpanded = expanded[section.key] ?? true;
          const hasActive = section.children.some((c) => pathname === c.href);
          return (
            <div key={section.key}>
              <button
                type="button"
                onClick={() => toggle(section.key)}
                className="flex w-full items-center justify-between rounded px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                {section.label}
                <svg
                  className={`h-4 w-4 text-gray-500 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isExpanded && (
                <div className="ml-2 mt-1 flex flex-col gap-0.5 border-l border-gray-200 pl-2">
                  {section.children.map((item) => (
                    <NavItem
                      key={item.href}
                      href={item.href}
                      label={item.label}
                      active={pathname === item.href}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
