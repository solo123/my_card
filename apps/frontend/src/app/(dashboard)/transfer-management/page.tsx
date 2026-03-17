"use client";

import DataTable from "@/components/DataTable";
import Pagination from "@/components/Pagination";

const columns = [
  { key: "id", label: "ID" },
  { key: "realName", label: "真实姓名" },
  { key: "account", label: "账号" },
  { key: "amount", label: "金额" },
  { key: "rate", label: "转账费率" },
  { key: "type", label: "类型" },
  { key: "paymentStatus", label: "打款状态" },
  { key: "approvalTime", label: "审核时间" },
  { key: "paymentTime", label: "打款时间" },
  { key: "updateTime", label: "更新时间" },
];

export default function TransferManagementPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">转账管理</h1>
        <div className="flex gap-2">
          <button type="button" className="flex items-center gap-2 rounded border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            数据刷新
          </button>
          <button type="button" className="flex items-center gap-2 rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6h1v1H1v-1a6 6 0 016-6z" /></svg>
            转账
          </button>
        </div>
      </div>
      <div className="flex flex-wrap items-end gap-4 rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <label className="mb-1 block text-sm text-gray-600">真实姓名</label>
          <input
            type="text"
            placeholder="请输入真实姓名"
            className="w-48 rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <button type="button" className="rounded border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50">
          重置
        </button>
        <button type="button" className="rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600">
          查询
        </button>
      </div>
      <DataTable columns={columns} data={[]} emptyText="暂无数据" />
      <Pagination total={0} page={1} pageSize={10} />
    </div>
  );
}
