"use client";

import DataTable from "@/components/DataTable";
import Pagination from "@/components/Pagination";

const columns = [
  { key: "id", label: "ID" },
  { key: "subAccount", label: "子账号" },
  { key: "recordNo", label: "记录编号" },
  { key: "cardNumber", label: "卡号" },
  { key: "cardId", label: "卡编号" },
  { key: "billDate", label: "账单日期" },
  { key: "txCurrency", label: "交易币种" },
  { key: "txAmount", label: "交易金额" },
  { key: "billCurrency", label: "账单币种" },
  { key: "billAmount", label: "账单金额" },
  { key: "fee", label: "手续费" },
  { key: "createTime", label: "创建时间" },
  { key: "updateTime", label: "更新时间" },
];

export default function RefundDetailsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">退款明细</h1>
        <button type="button" className="flex items-center gap-2 rounded border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          数据刷新
        </button>
      </div>
      <div className="flex flex-wrap items-end gap-4 rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <label className="mb-1 block text-sm text-gray-600">卡号</label>
          <input type="text" placeholder="请输入卡号" className="w-48 rounded border border-gray-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-600">账单日期</label>
          <div className="flex items-center gap-2">
            <input type="date" className="rounded border border-gray-300 px-3 py-2 text-sm" />
            <span className="text-gray-500">至</span>
            <input type="date" className="rounded border border-gray-300 px-3 py-2 text-sm" />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-600">创建日期</label>
          <div className="flex items-center gap-2">
            <input type="date" className="rounded border border-gray-300 px-3 py-2 text-sm" />
            <span className="text-gray-500">至</span>
            <input type="date" className="rounded border border-gray-300 px-3 py-2 text-sm" />
          </div>
        </div>
        <button type="button" className="rounded border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50">重置</button>
        <button type="button" className="rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600">搜索</button>
      </div>
      <DataTable columns={columns} data={[]} emptyText="暂无数据" />
      <Pagination total={3114} page={1} pageSize={10} />
    </div>
  );
}
