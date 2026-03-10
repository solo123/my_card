"use client";

import { useState } from "react";

const validityOptions = ["三个月", "半年", "一年", "两年"];
const scopeOptions = ["广告投放", "电商消费", "ChatGpt"];
const regions = ["香港", "美国", "英国"];
const visaBins = ["49109000", "489683", "48960700", "485997"];
const masterBins = ["559292", "556371", "556167238", "556167236"];

export default function OpenCardPage() {
  const [validity, setValidity] = useState("三个月");
  const [region, setRegion] = useState("香港");
  const [scope, setScope] = useState<string>("广告投放");
  const [cardPrefix, setCardPrefix] = useState("");

  return (
    <div className="mx-auto max-w-4xl space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold text-gray-800">开卡</h1>

      {/* 卡有效期 */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          卡有效期 <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <input type="date" defaultValue="2026-03-08" className="rounded border border-gray-300 px-3 py-2 text-sm" />
          <span className="text-gray-500">至</span>
          <input type="date" defaultValue="2026-06-08" className="rounded border border-gray-300 px-3 py-2 text-sm" />
          <div className="ml-4 flex gap-2">
            {validityOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setValidity(opt)}
                className={`rounded px-3 py-1.5 text-sm ${
                  validity === opt ? "bg-blue-500 text-white" : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 充值金额 */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          充值金额 <span className="text-red-500">*</span>
        </label>
        <input type="text" placeholder="请输入充值金额" className="w-full max-w-xs rounded border border-gray-300 px-3 py-2 text-sm" />
      </div>

      {/* 适用范围 */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          适用范围 <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          {scopeOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setScope(opt)}
              className={`rounded border px-4 py-2 text-sm ${
                scope === opt ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* 发行区域 */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          发行区域 <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-4">
          {regions.map((r) => (
            <label key={r} className="flex cursor-pointer items-center gap-2">
              <input type="radio" name="region" checked={region === r} onChange={() => setRegion(r)} className="text-blue-500" />
              <span>{r}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 卡头 */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          卡头 <span className="text-red-500">*</span>
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 font-medium text-gray-700">VISA</div>
            <div className="grid grid-cols-2 gap-2 bg-gray-50 p-4">
              {visaBins.map((bin) => (
                <label key={bin} className="flex cursor-pointer items-center gap-2">
                  <input type="radio" name="cardPrefix" value={bin} checked={cardPrefix === bin} onChange={() => setCardPrefix(bin)} />
                  <span className="font-mono text-sm">{bin}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-amber-200 overflow-hidden bg-amber-50/50">
            <div className="flex items-center justify-between bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-2 font-medium text-amber-900">
              mastercard
              <span className="text-lg font-bold">◆</span>
            </div>
            <div className="grid grid-cols-2 gap-2 bg-amber-50/30 p-4">
              {masterBins.map((bin) => (
                <label key={bin} className="flex cursor-pointer items-center gap-2">
                  <input type="radio" name="cardPrefix" value={bin} checked={cardPrefix === bin} onChange={() => setCardPrefix(bin)} />
                  <span className="font-mono text-sm">{bin}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <button type="button" className="rounded bg-blue-500 px-6 py-2 text-white hover:bg-blue-600">
          提交开卡
        </button>
      </div>
    </div>
  );
}
