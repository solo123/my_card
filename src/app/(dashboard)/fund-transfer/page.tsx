"use client";

import DataTable from "@/components/DataTable";
import Pagination from "@/components/Pagination";

const columns = [
  { key: "id", label: "ID" },
  { key: "initiator", label: "发起人姓名" },
  { key: "recipient", label: "接收人姓名" },
  { key: "amount", label: "金额" },
  { key: "fee", label: "手续费" },
  { key: "actual", label: "实际到账金额" },
  { key: "status", label: "状态" },
  { key: "reviewer", label: "审核姓名" },
  { key: "reviewTime", label: "审核时间" },
  { key: "createTime", label: "创建时间" },
];

export default function FundTransferPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">资金划拨</h1>
        <div className="flex gap-2">
          <button type="button" className="flex items-center gap-2 rounded border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            数据刷新
          </button>
          <button type="button" className="flex items-center gap-2 rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
            新增
          </button>
        </div>
      </div>
      <DataTable columns={columns} data={[]} emptyText="暂无数据" />
      <Pagination total={0} page={1} pageSize={10} />
    </div>
  );
}
