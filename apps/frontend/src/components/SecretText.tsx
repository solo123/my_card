"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

const MASK = "****";

type SecretTextProps = {
  /** 脱敏占位，默认 **** */
  mask?: string;
  /** 真实数据（若已知可直接传入，不触发 fetch） */
  value?: string | null;
  /** 按需请求真实数据的函数，点击眼睛时调用 */
  fetchValue?: () => Promise<string>;
  /** 请求用的 queryKey，用于缓存与防重复请求 */
  queryKey?: unknown[];
  /** 额外 class */
  className?: string;
  /** 未脱敏时的展示样式 */
  valueClassName?: string;
};

/**
 * 敏感信息脱敏展示：默认显示 ****，点击眼睛图标后通过 React Query 请求真实数据并展示。
 * 若传入 value 则直接展示，不请求。
 */
export default function SecretText({
  mask = MASK,
  value: controlledValue,
  fetchValue,
  queryKey = ["secret"],
  className,
  valueClassName,
}: SecretTextProps) {
  const [revealed, setRevealed] = useState(false);

  const { data: fetchedValue, isLoading, isFetching } = useQuery({
    queryKey: [...queryKey, revealed],
    queryFn: fetchValue ?? (() => Promise.resolve("")),
    enabled: Boolean(fetchValue && revealed && controlledValue === undefined),
    staleTime: 30_000,
  });

  const displayValue = controlledValue ?? fetchedValue;
  const loading = Boolean(
    fetchValue && revealed && (isLoading || (isFetching && displayValue === undefined))
  );
  const text = loading
    ? "加载中..."
    : revealed
      ? (displayValue ?? mask)
      : mask;

  return (
    <span
      className={cn("inline-flex items-center gap-1.5", className)}
      role="text"
    >
      <span className={valueClassName}>{text}</span>
      <button
        type="button"
        onClick={() => setRevealed((r) => !r)}
        className="rounded p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        aria-label={revealed ? "隐藏" : "显示"}
      >
        {revealed ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
    </span>
  );
}
