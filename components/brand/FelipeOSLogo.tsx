"use client";

import AnimatedFelipeOSLogo from "@/components/brand/AnimatedFelipeOSLogo";

type FelipeOSLogoProps = {
  className?: string;
  size?: number;
};

export default function FelipeOSLogo({ className = "", size = 32 }: FelipeOSLogoProps) {
  return <AnimatedFelipeOSLogo className={className} size={size} variant="static" />;
}
