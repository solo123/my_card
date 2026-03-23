import Image from "next/image";

/** 道字品牌图标：`tao.png` 置于圆形 `bg-primary` 内；白底与主色融合（multiply），黑字保留。 */
export function BrandMark({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md";
  className?: string;
}) {
  const box = size === "sm" ? "h-8 w-8 p-1" : "h-14 w-14 p-2";
  const img = size === "sm" ? 26 : 44;
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary shadow-md ${box} ${className}`}
    >
      <Image
        src="/tao.png"
        alt="道生匯"
        width={img}
        height={img}
        className="h-full w-full object-contain mix-blend-multiply"
        priority
      />
    </span>
  );
}
