/** 品牌图标：圆形主色底，书法体「道」（马善政体，圆内尽量撑满）。 */
export function BrandMark({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md";
  className?: string;
}) {
  const box =
    size === "sm"
      ? // 32px 圆内约 20px 字高
        "h-8 w-8 text-[1.28rem] leading-none"
      : // 56px 圆内约 40px+ 字高，leading-none 避免行高留白
        "h-14 w-14 text-[2.7rem] leading-none sm:text-[2.75rem]";
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary font-normal text-white shadow-md [font-family:var(--font-dao-calligraphy),serif] ${box} ${className}`}
      aria-label="道生匯"
    >
      道
    </span>
  );
}
