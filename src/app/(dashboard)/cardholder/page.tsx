"use client";

import DataTable from "@/components/DataTable";
import Pagination from "@/components/Pagination";

type Row = {
  id: number;
  subAccount: string;
  firstName: string;
  lastName: string;
  countryCode: string;
  state: string;
  city: string;
  address: string;
  zip: string;
  remark: string;
};

const mockData: Row[] = [
  { id: 389, subAccount: "-", firstName: "Sheri", lastName: "McKay", countryCode: "US", state: "CA", city: "Merced", address: "123 Main St", zip: "95340", remark: "" },
  { id: 388, subAccount: "-", firstName: "Josh", lastName: "Aukes", countryCode: "US", state: "NC", city: "Lexington", address: "456 Oak Ave", zip: "27292", remark: "" },
];

const columns = [
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
    render: () => (
      <button type="button" className="rounded border border-gray-300 bg-white px-2 py-1 text-sm hover:bg-gray-50">
        编辑
      </button>
    ),
  },
];

export default function CardholderPage() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl font-semibold text-gray-800">持卡人信息</h1>
        <div className="flex gap-2">
          <button type="button" className="flex items-center gap-2 rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
            申请持卡人
          </button>
          <button type="button" className="rounded border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50">
            导入
          </button>
          <button type="button" className="flex items-center gap-2 rounded border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            数据刷新
          </button>
        </div>
      </div>
      <div className="flex flex-wrap items-end gap-4 rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <label className="mb-1 block text-sm text-gray-600">状态</label>
          <select className="w-40 rounded border border-gray-300 px-3 py-2 text-sm" defaultValue="">
            <option value="">请选择状态</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-600">持卡人名</label>
          <input type="text" placeholder="请输入持卡人名" className="w-48 rounded border border-gray-300 px-3 py-2 text-sm" />
        </div>
        <button type="button" className="rounded border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50">重置</button>
        <button type="button" className="rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600">搜索</button>
      </div>
      <DataTable<Row> columns={columns} data={mockData} />
      <Pagination total={5} page={1} pageSize={10} />
    </div>
  );
}
