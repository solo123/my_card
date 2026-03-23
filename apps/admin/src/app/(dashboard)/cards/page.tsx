"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DataTable from "@/components/DataTable";
import Pagination from "@/components/Pagination";
import { getCards } from "@/lib/api";

const columns = [
  { key: "id", label: "ID" },
  { key: "cardType", label: "卡类型" },
  { key: "effectiveDate", label: "生效日期" },
  { key: "expireDate", label: "失效日期" },
  { key: "balance", label: "余额" },
  { key: "alias", label: "别名" },
  { key: "cardholder", label: "持卡人" },
  { key: "status", label: "状态" },
];

export default function CardsPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const params = useMemo(() => {
    const p = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    return p;
  }, [page, pageSize]);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-cards", params.toString()],
    queryFn: () => getCards(params),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">卡列表</h1>
      </div>

      <DataTable columns={columns} data={isLoading ? [] : (data?.list ?? [])} emptyText={isLoading ? "加载中..." : "暂无数据"} />

      <Pagination total={data?.total ?? 0} page={page} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={setPageSize} />
    </div>
  );
}

