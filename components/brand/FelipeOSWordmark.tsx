import AnimatedFelipeOSLogo from "@/components/brand/AnimatedFelipeOSLogo";

type FelipeOSWordmarkProps = {
  className?: string;
  reducedMotion?: boolean;
};

export default function FelipeOSWordmark({ className = "", reducedMotion = false }: FelipeOSWordmarkProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <AnimatedFelipeOSLogo className="drop-shadow-[0_0_18px_rgba(34,211,238,0.2)]" reducedMotion={reducedMotion} size={28} variant="hover" />
      <span className="leading-none">
        <span className="block text-sm font-semibold text-[var(--fos-text)]">Felipe OS</span>
        <span className="hidden text-[0.64rem] font-medium text-[var(--fos-muted)] sm:block">Product / Growth / AI</span>
      </span>
    </span>
  );
}
