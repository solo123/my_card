"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // 占位：后续接入真实登录 API
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    router.push("/wallet");
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 品牌区 */}
        <div className="flex flex-col items-center mb-8">
          <span className="h-14 w-14 rounded-full bg-primary flex items-center justify-center text-xl font-bold text-white shadow-md">
            道
          </span>
          <h1 className="mt-3 text-2xl font-semibold text-gray-800">道生匯</h1>
          <p className="mt-1 text-sm text-gray-500">卡台管理后台</p>
        </div>

        {/* 登录卡片 */}
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">账号登录</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="account" className="mb-1.5 block text-sm font-medium text-gray-700">
                手机号 / 邮箱
              </label>
              <input
                id="account"
                type="text"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                placeholder="请输入手机号或邮箱"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">
                密码
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>
            <div className="flex items-center justify-end">
              <Link
                href="/login/forgot"
                className="text-sm text-primary hover:underline font-medium"
              >
                忘记密码？
              </Link>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "登录中..." : "登录"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          登录即表示同意
          <Link href="/terms" className="text-primary hover:underline font-medium"> 服务协议 </Link>
          与
          <Link href="/privacy" className="text-primary hover:underline font-medium"> 隐私政策</Link>
        </p>
      </div>
    </div>
  );
}
