"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DataTable from "@/components/DataTable";
import Pagination from "@/components/Pagination";
import { getUsers } from "@/lib/api";

const columns = [
  { key: "id", label: "ID" },
  { key: "account", label: "账号" },
  { key: "realName", label: "真实姓名" },
  { key: "role", label: "角色" },
  { key: "status", label: "状态" },
  { key: "createdAt", label: "创建时间" },
];

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const params = useMemo(() => {
    const p = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    return p;
  }, [page, pageSize]);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", params.toString()],
    queryFn: () => getUsers(params),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">用户列表</h1>
      </div>

      <DataTable columns={columns} data={isLoading ? [] : (data?.list ?? [])} emptyText={isLoading ? "加载中..." : "暂无数据"} />

      <Pagination total={data?.total ?? 0} page={page} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={setPageSize} />
    </div>
  );
}

