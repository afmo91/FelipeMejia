import FelipeOSLogo from "@/components/brand/FelipeOSLogo";

type FelipeOSWordmarkProps = {
  className?: string;
};

export default function FelipeOSWordmark({ className = "" }: FelipeOSWordmarkProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <FelipeOSLogo className="drop-shadow-[0_0_18px_rgba(34,211,238,0.18)]" size={28} />
      <span className="leading-none">
        <span className="block text-sm font-semibold text-[var(--fos-text)]">FelipeOS</span>
        <span className="hidden text-[0.64rem] font-medium text-[var(--fos-muted)] sm:block">Product / Growth / AI</span>
      </span>
    </span>
  );
}
