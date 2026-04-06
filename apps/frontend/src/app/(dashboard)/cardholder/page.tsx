"use client";

import DataTable, { type Column } from "@/components/DataTable";
import Pagination from "@/components/Pagination";
import {
  type CardholderInput,
  type CardholderRow,
  createCardholder,
  deleteCardholder,
  getCardholders,
  updateCardholder,
} from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";

const emptyForm: CardholderInput = {
  subAccount: "",
  firstName: "",
  lastName: "",
  countryCode: "",
  state: "",
  city: "",
  address: "",
  zip: "",
  remark: "",
};

function FormFields({
  form,
  onChange,
}: {
  form: CardholderInput;
  onChange: (patch: Partial<CardholderInput>) => void;
}) {
  const field = (
    label: string,
    key: keyof CardholderInput,
    props: React.InputHTMLAttributes<HTMLInputElement> = {}
  ) => (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="text"
        value={form[key]}
        onChange={(e) => onChange({ [key]: e.target.value })}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        {...props}
      />
    </div>
  );

  return (
    <div className="grid max-h-[70vh] grid-cols-1 gap-4 overflow-y-auto sm:grid-cols-2">
      {field("子账号 *", "subAccount", { required: true })}
      {field("持卡人名 *", "firstName", { required: true })}
      {field("持卡人姓 *", "lastName", { required: true })}
      {field("账单国家代码 *", "countryCode", { required: true })}
      {field("账单省/州 *", "state", { required: true })}
      {field("账单城市 *", "city", { required: true })}
      {field("账单邮编 *", "zip", { required: true })}
      <div className="sm:col-span-2">
        <label className="mb-1 block text-sm font-medium text-gray-700">账单地址 *</label>
        <input
          type="text"
          value={form.address}
          onChange={(e) => onChange({ address: e.target.value })}
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
      <div className="sm:col-span-2">
        <label className="mb-1 block text-sm font-medium text-gray-700">审核备注</label>
        <input
          type="text"
          value={form.remark}
          onChange={(e) => onChange({ remark: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
    </div>
  );
}

export default function CardholderPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterSubAccount, setFilterSubAccount] = useState("");
  const [filterFirstName, setFilterFirstName] = useState("");
  const [filterLastName, setFilterLastName] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<CardholderInput>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);

  const params = useMemo(() => {
    const p = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    const s = filterSubAccount.trim();
    const f = filterFirstName.trim();
    const l = filterLastName.trim();
    if (s) p.set("subAccount", s);
    if (f) p.set("firstName", f);
    if (l) p.set("lastName", l);
    return p;
  }, [page, pageSize, filterSubAccount, filterFirstName, filterLastName]);

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["cardholders", params.toString()],
    queryFn: () => getCardholders(params),
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editingId != null) {
        return updateCardholder(editingId, form);
      }
      return createCardholder(form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cardholders"] });
      setModalOpen(false);
      setFormError(null);
    },
    onError: (e: Error) => setFormError(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteCardholder(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cardholders"] }),
  });

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setFormError(null);
    setModalOpen(true);
  };

  const openEdit = (row: CardholderRow) => {
    setEditingId(row.id);
    setForm({
      subAccount: row.subAccount,
      firstName: row.firstName,
      lastName: row.lastName,
      countryCode: row.countryCode,
      state: row.state,
      city: row.city,
      address: row.address,
      zip: row.zip,
      remark: row.remark,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const required: (keyof CardholderInput)[] = [
      "subAccount",
      "firstName",
      "lastName",
      "countryCode",
      "state",
      "city",
      "address",
      "zip",
    ];
    for (const k of required) {
      if (!form[k]?.trim()) {
        setFormError("请填写所有必填项");
        return;
      }
    }
    setFormError(null);
    saveMutation.mutate();
  };

  const resetFilters = () => {
    setFilterSubAccount("");
    setFilterFirstName("");
    setFilterLastName("");
    setPage(1);
  };

  const columns: Column<CardholderRow & Record<string, unknown>>[] = [
    { key: "id", label: "ID" },
    { key: "subAccount", label: "子账号" },
    { key: "firstName", label: "持卡人名字" },
    { key: "lastName", label: "持卡人姓" },
    { key: "countryCode", label: "账单国家代码" },
    { key: "state", label: "账单省/州" },
    { key: "city", label: "账单城市" },
    { key: "address", label: "账单地址" },
    { key: "zip", label: "账单邮编" },
    { key: "remark", label: "审核备注" },
    {
      key: "action",
      label: "操作",
      stickyRight: true,
      render: (row: CardholderRow) => (
        <div className="flex flex-nowrap gap-2">
          <button
            type="button"
            className="rounded border border-gray-300 bg-white px-2 py-1 text-sm hover:bg-gray-50"
            onClick={() => openEdit(row)}
          >
            编辑
          </button>
          <button
            type="button"
            className="rounded border border-red-200 bg-white px-2 py-1 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
            disabled={deleteMutation.isPending}
            onClick={() => {
              if (window.confirm("确定删除该持卡人？")) {
                deleteMutation.mutate(row.id);
              }
            }}
          >
            删除
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl font-semibold text-gray-800">持卡人信息</h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={openCreate}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            新增持卡人
          </button>
          <button
            type="button"
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            {isFetching ? "刷新中…" : "数据刷新"}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-4 rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <label className="mb-1 block text-sm text-gray-600">子账号</label>
          <input
            type="text"
            value={filterSubAccount}
            onChange={(e) => {
              setFilterSubAccount(e.target.value);
              setPage(1);
            }}
            placeholder="模糊筛选"
            className="w-48 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-600">持卡人名</label>
          <input
            type="text"
            value={filterFirstName}
            onChange={(e) => {
              setFilterFirstName(e.target.value);
              setPage(1);
            }}
            placeholder="模糊筛选"
            className="w-48 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-600">持卡人姓</label>
          <input
            type="text"
            value={filterLastName}
            onChange={(e) => {
              setFilterLastName(e.target.value);
              setPage(1);
            }}
            placeholder="模糊筛选"
            className="w-48 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <button type="button" className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50" onClick={resetFilters}>
          重置
        </button>
      </div>

      <DataTable<CardholderRow & Record<string, unknown>>
        columns={columns}
        data={isLoading ? [] : (data?.list ?? [])}
        emptyText={isLoading ? "加载中..." : "暂无数据"}
        stickyLastColumn
      />

      <Pagination
        total={data?.total ?? 0}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
            <div className="border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-800">{editingId != null ? "编辑持卡人" : "新增持卡人"}</h2>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 py-4">
              {formError && (
                <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</div>
              )}
              <FormFields form={form} onChange={(patch) => setForm((f) => ({ ...f, ...patch }))} />
              <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
                  onClick={() => setModalOpen(false)}
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-60"
                >
                  {saveMutation.isPending ? "保存中…" : "保存"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
