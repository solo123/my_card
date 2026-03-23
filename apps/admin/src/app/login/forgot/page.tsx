"use client";

import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <span className="h-14 w-14 rounded-full bg-primary flex items-center justify-center text-xl font-bold text-white shadow-md">
            道
          </span>
          <h1 className="mt-3 text-2xl font-semibold text-gray-800">道生匯 Admin</h1>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">找回密码</h2>
          <p className="text-sm text-gray-500 mb-6">输入注册邮箱，我们将发送重置链接。</p>
          {sent ? (
            <div className="rounded-lg bg-green-50 p-4 text-sm text-green-800">
              已发送重置邮件，请查收。未收到请检查垃圾箱。
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
                  邮箱
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="请输入注册邮箱"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <button type="submit" className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-white hover:bg-primary-hover">
                发送重置链接
              </button>
            </form>
          )}
          <Link href="/login" className="mt-6 block text-center text-sm text-primary hover:underline font-medium">
            返回登录
          </Link>
        </div>
      </div>
    </div>
  );
}

