"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getWalletOverview } from "@/lib/api";

export default function WalletPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["wallet-overview"],
    queryFn: getWalletOverview,
  });
  return (
    <div className="space-y-6">
      {/* 我的钱包 卡片区 */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">我的钱包</h2>
          <div className="flex gap-2">
            <button type="button" className="rounded border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50">
              刷新
            </button>
            <button type="button" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover">
              充值
            </button>
          </div>
        </div>
        {isLoading ? (
          <div className="text-gray-500 text-sm">加载中...</div>
        ) : error ? (
          <div className="text-red-600 text-sm">加载失败</div>
        ) : (
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* 虚拟卡 */}
          <div className="relative h-48 w-full max-w-sm overflow-hidden rounded-xl bg-gradient-to-br from-primary to-teal-600 p-5 text-white shadow-lg">
            <div className="absolute right-4 top-4 text-right text-xs opacity-90">ID: {data?.walletAccountId}</div>
            <div className="mt-6 text-sm opacity-90">我的钱包账户</div>
            <div className="mt-2 font-mono text-lg tracking-widest">{data?.maskedCardNumber}</div>
            <div className="mt-4 flex justify-between text-xs opacity-80">
              <span>Card holder</span>
              <span>MONTH/YEAR</span>
            </div>
            <div className="flex justify-between font-mono text-sm">
              <span>18759270938</span>
              <span>12/2088</span>
            </div>
            <div className="absolute bottom-4 right-4 text-2xl font-bold text-white/90">VISA</div>
            <button type="button" className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-1 hover:bg-white/30">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-1 hover:bg-white/30">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
          {/* 余额信息 */}
          <div className="grid flex-1 grid-cols-2 gap-4 lg:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="text-sm text-gray-500">我的钱包余额</div>
              <div className="mt-1 text-xl font-semibold text-gray-900">${data?.balance ?? "0.00"}</div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="text-sm text-gray-500">冻结金额</div>
              <div className="mt-1 text-xl font-semibold text-gray-900">${data?.frozenAmount ?? "0.00"}</div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <span className="text-green-500">↑</span> 充值总额
              </div>
              <div className="mt-1 text-xl font-semibold text-gray-900">${data?.totalRecharge ?? "0.00"}</div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <span className="text-orange-500">↓</span> 消费总额
              </div>
              <div className="mt-1 text-xl font-semibold text-gray-900">${data?.totalConsume ?? "0.00"}</div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <span className="text-blue-500">→</span> 提理总额
              </div>
              <div className="mt-1 text-xl font-semibold text-gray-900">${data?.totalWithdraw ?? "0.00"}</div>
            </div>
          </div>
        </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* 卡消费统计 */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">卡消费统计(当月统计)</h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "常规卡转入", value: "$0.00" },
              { label: "常规卡消费", value: "$0.00" },
              { label: "常规卡退款", value: "$0.00" },
              { label: "3D卡转入", value: "$0.00" },
              { label: "3D卡消费", value: "$0.00" },
              { label: "3D卡退款", value: "$0.00" },
              { label: "3D-1卡转入", value: "$0.00" },
              { label: "3D-1卡消费", value: "$0.00" },
              { label: "3D-1卡退款", value: "$0.00" },
            ].map((item, i) => (
              <div key={i} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <div className="text-xs text-gray-500">{item.label}</div>
                <div className="mt-1 font-semibold text-gray-800">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 最新公告 */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">最新公告</h2>
            <Link href="/announcements" className="text-sm text-primary hover:underline font-medium">
              查看更多
            </Link>
          </div>
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
            <h3 className="font-medium text-gray-800">公告测试2</h3>
            <p className="mt-2 text-sm text-gray-600">
              时间戳转换工具说明：自1970年1月1日（UTC/GMT午夜）起经过的秒数无法直接阅读，需要转换为日期时间格式。本工具支持正向与反向转换。
            </p>
          </div>
        </div>
      </div>

      {/* 常规卡/3D卡/3D-1卡 交易统计 */}
      {["常规卡", "3D卡", "3D-1卡"].map((name, idx) => (
        <div key={name} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-gray-800">{name}交易统计(当月统计)</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                卡包余额: ${idx === 0 ? "8,910.00" : "0.00"}
              </span>
              <button type="button" className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50">
                退款
              </button>
              <button type="button" className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-hover">
                充值
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="text-sm text-gray-500">拒付率</div>
              <div className="mt-1 font-medium">0% <span className="text-gray-400">0/6791</span></div>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="text-sm text-gray-500">退款率</div>
              <div className="mt-1 font-medium">0% <span className="text-gray-400">0/6791</span></div>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="text-sm text-gray-500">退款金额率</div>
              <div className="mt-1 font-medium">0% <span className="text-gray-400">0/0</span></div>
            </div>
          </div>
        </div>
      ))}

      {/* 我要转账 悬浮按钮 */}
      <Link
        href="/fund-transfer"
        className="fixed bottom-8 right-8 flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-white shadow-lg hover:bg-primary-hover font-medium"
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        我要转账
      </Link>
    </div>
  );
}
