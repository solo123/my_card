"use client";

import { useState } from "react";

const steps = [
  "填写企业基本信息",
  "填写企业法人代表信息",
  "证件验证",
];
const enterpriseTypes = ["有限责任公司", "个体工商户", "个人独资企业", "合伙企业", "股份有限公司"];

export default function VerifyPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [enterpriseType, setEnterpriseType] = useState("有限责任公司");

  return (
    <div className="mx-auto max-w-3xl space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold text-gray-800">实名认证</h1>

      {/* 步骤条 */}
      <div className="flex items-center gap-2">
        {steps.map((label, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                i === currentStep ? "bg-purple-500 text-white" : "border-2 border-gray-300 text-gray-400"
              }`}
            >
              {i + 1}
            </div>
            <span className={i === currentStep ? "font-medium text-gray-800" : "text-gray-400"}>{label}</span>
            {i < steps.length - 1 && (
              <svg className="h-4 w-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        ))}
      </div>

      <h2 className="text-lg font-medium text-gray-800">填写企业基础信息</h2>

      {/* 营业执照上传 */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          营业执照 <span className="text-red-500">*</span>
        </label>
        <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
          <p className="text-sm text-gray-500">将文件拖拽至此处或者点击上传</p>
          <ul className="mt-4 text-left text-xs text-gray-500">
            <li>1. 请拍摄、扫描、拍照</li>
            <li>2. 有效期大于30天</li>
            <li>3. 支持JPG、JPEG、PNG格式</li>
            <li>4. 文件大小不超过2.5MB</li>
          </ul>
        </div>
      </div>

      {/* 企业类型 */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          企业类型 <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {enterpriseTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setEnterpriseType(type)}
              className={`rounded border px-4 py-2 text-sm ${
                enterpriseType === type ? "border-blue-500 bg-blue-500 text-white" : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* 企业注册地 */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          企业注册地 <span className="text-red-500">*</span>
        </label>
        <input type="text" placeholder="请输入企业注册地" className="w-full rounded border border-gray-300 px-3 py-2 text-sm" />
      </div>

      {/* 注册地址详情 */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          注册地址详情 <span className="text-red-500">*</span>
        </label>
        <input type="text" placeholder="请输入详细注册地址" className="w-full rounded border border-gray-300 px-3 py-2 text-sm" />
      </div>

      <div className="flex gap-4 pt-4">
        {currentStep > 0 && (
          <button type="button" onClick={() => setCurrentStep((s) => s - 1)} className="rounded border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50">
            上一步
          </button>
        )}
        <button type="button" onClick={() => setCurrentStep((s) => Math.min(s + 1, 2))} className="rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600">
          {currentStep < 2 ? "下一步" : "提交"}
        </button>
      </div>
    </div>
  );
}
