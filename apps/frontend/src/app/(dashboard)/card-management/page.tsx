"use client";

import DataTable from "@/components/DataTable";
import Pagination from "@/components/Pagination";

type Row = {
  id: number;
  subAccount: string;
  effectiveDate: string;
  expireDate: string;
  balance: string;
  rechargeAmount: string;
  alias: string;
  cardholder: string;
};

const mockData: Row[] = [
  { id: 1566, subAccount: "", effectiveDate: "2026/02/23", expireDate: "2026/05/23", balance: "916.07", rechargeAmount: "-", alias: "点击设置别名", cardholder: "Sheri" },
];

const columns = [
  { key: "id", label: "ID" },
  { key: "subAccount", label: "子账号" },
  { key: "effectiveDate", label: "卡生效日期" },
  { key: "expireDate", label: "卡失效日期" },
  {
    key: "balance",
    label: "卡片余额",
    render: (row: Row) => (
      <span className="flex items-center gap-1">
        <button type="button" className="rounded p-0.5 hover:bg-gray-100">
          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        </button>
        {row.balance}
      </span>
    ),
  },
  {
    key: "cvv",
    label: "查看CVV密码",
    render: () => (
      <button type="button" className="flex items-center gap-1 rounded-lg bg-primary/10 px-2 py-1 text-sm text-primary hover:bg-primary/20 font-medium">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
        查看CVV密码
      </button>
    ),
  },
  { key: "rechargeAmount", label: "充值金额" },
  {
    key: "alias",
    label: "卡别名",
    render: (row: Row) => (
      <span className="flex cursor-pointer items-center gap-1 text-primary hover:underline font-medium">
        {row.alias}
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
      </span>
    ),
  },
  { key: "cardholder", label: "持卡人" },
  {
    key: "action",
    label: "操作",
    render: () => (
      <div className="flex gap-1">
        <button type="button" className="rounded-lg bg-primary px-2 py-1 text-sm font-medium text-white hover:bg-primary-hover">
          √更多
        </button>
        <button type="button" className="rounded border border-gray-300 bg-white px-2 py-1 text-sm hover:bg-gray-50">详情</button>
        <button type="button" className="rounded border border-gray-300 bg-white px-2 py-1 text-sm hover:bg-gray-50">删除</button>
      </div>
    ),
  },
];

export default function CardManagementPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">卡管理</h1>
        <button type="button" className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          数据刷新
        </button>
      </div>
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        说明: 卡片余额每天上午会自动更新一次; 销卡, 卡余额可自动退到卡钱包余额。
      </div>
      <div className="flex flex-wrap items-end gap-4 rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <label className="mb-1 block text-sm text-gray-600">卡号</label>
          <input type="text" placeholder="请输入卡号" className="w-48 rounded border border-gray-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-600">卡片余额大于</label>
          <input type="text" placeholder="请输入金额" className="w-40 rounded border border-gray-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-600">状态</label>
          <select className="w-44 rounded border border-gray-300 px-3 py-2 text-sm" defaultValue="">
            <option value="">请选择申请状态</option>
          </select>
        </div>
        <button type="button" className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50">重置</button>
        <button type="button" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover">查询</button>
      </div>
      <DataTable<Row> columns={columns} data={mockData} />
      <Pagination total={5} page={1} pageSize={10} />
    </div>
  );
}
