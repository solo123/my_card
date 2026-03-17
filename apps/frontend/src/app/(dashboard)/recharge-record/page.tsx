"use client";

import DataTable from "@/components/DataTable";
import Pagination from "@/components/Pagination";

const columns = [
  { key: "id", label: "ID" },
  { key: "subAccount", label: "子账号" },
  { key: "cardNumber", label: "卡号" },
  { key: "requestId", label: "请求流水号" },
  { key: "orderNo", label: "服务系统返回的单号" },
  { key: "status", label: "状态" },
  { key: "amount", label: "充值/退款金额" },
  { key: "createTime", label: "创建时间" },
];

const mockData = [
  { id: 1, subAccount: "446***", cardNumber: "44661***", requestId: "REQ001", orderNo: "ORD001", status: "账户转卡", amount: "8000.00", createTime: "2026-03-07 13:08:30" },
];

export default function RechargeRecordPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">充值记录</h1>
        <button type="button" className="flex items-center gap-2 rounded border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          数据刷新
        </button>
      </div>
      <div className="flex flex-wrap items-end gap-4 rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <label className="mb-1 block text-sm text-gray-600">创建日期</label>
          <div className="flex items-center gap-2">
            <input type="date" placeholder="请选择开始日期" className="rounded border border-gray-300 px-3 py-2 text-sm" />
            <span className="text-gray-500">至</span>
            <input type="date" placeholder="请选择结束日期" className="rounded border border-gray-300 px-3 py-2 text-sm" />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-600">卡号</label>
          <input type="text" placeholder="请输入卡号" className="w-48 rounded border border-gray-300 px-3 py-2 text-sm" />
        </div>
        <button type="button" className="rounded border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50">重置</button>
        <button type="button" className="rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600">搜索</button>
      </div>
      <DataTable columns={columns} data={mockData} />
      <Pagination total={99} page={1} pageSize={10} />
    </div>
  );
}
