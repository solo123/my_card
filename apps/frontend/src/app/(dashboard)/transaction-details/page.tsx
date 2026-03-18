"use client";

import DataTable from "@/components/DataTable";
import Pagination from "@/components/Pagination";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "@/lib/api";

const columns = [
  { key: "id", label: "ID" },
  { key: "subAccount", label: "子账号" },
  { key: "cardNumber", label: "卡号" },
  { key: "transactionTime", label: "交易发生时间" },
  { key: "currency", label: "交易币种" },
  { key: "amount", label: "交易币种金额" },
  { key: "baseCurrency", label: "卡本币种" },
  { key: "baseAmount", label: "卡本币种金额" },
  { key: "description", label: "描述" },
  { key: "merchant", label: "商户名称" },
  { key: "mcc", label: "商户MCC" },
  { key: "type", label: "交易类型" },
  { key: "status", label: "交易状态" },
];

export default function TransactionDetailsPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const params = useMemo(() => {
    const p = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    return p;
  }, [page, pageSize]);
  const { data, isLoading } = useQuery({
    queryKey: ["transactions", page, pageSize, params.toString()],
    queryFn: () => getTransactions(params),
  });
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">交易明细</h1>
        <button type="button" className="flex items-center gap-2 rounded border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          数据刷新
        </button>
      </div>
      <div className="flex flex-wrap items-end gap-4 rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <label className="mb-1 block text-sm text-gray-600">交易类型</label>
          <select className="w-40 rounded border border-gray-300 px-3 py-2 text-sm" defaultValue="">
            <option value="">请选择交易类型</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-600">交易状态</label>
          <select className="w-40 rounded border border-gray-300 px-3 py-2 text-sm" defaultValue="">
            <option value="">请选择交易状态</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-600">卡号</label>
          <input type="text" placeholder="请输入卡号" className="w-48 rounded border border-gray-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-600">交易时间</label>
          <div className="flex items-center gap-2">
            <input type="date" className="rounded border border-gray-300 px-3 py-2 text-sm" />
            <span className="text-gray-500">至</span>
            <input type="date" className="rounded border border-gray-300 px-3 py-2 text-sm" />
          </div>
        </div>
        <button type="button" className="rounded border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50">重置</button>
        <button type="button" className="rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600">搜索</button>
      </div>
      <DataTable columns={columns} data={isLoading ? [] : (data?.list ?? [])} emptyText={isLoading ? "加载中..." : "暂无数据"} />
      <Pagination total={data?.total ?? 0} page={page} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={setPageSize} />
    </div>
  );
}
