"use client";

import { motion } from "framer-motion";

export type AnimatedFelipeOSLogoProps = {
  variant?: "static" | "loading" | "hover" | "dock" | "boot";
  size?: number;
  className?: string;
  reducedMotion?: boolean;
};

export default function AnimatedFelipeOSLogo({
  className = "",
  reducedMotion = false,
  size = 32,
  variant = "static",
}: AnimatedFelipeOSLogoProps) {
  const animated = !reducedMotion && variant !== "static";
  const boot = variant === "boot";
  const dock = variant === "dock";

  return (
    <motion.span
      aria-hidden="true"
      className={`relative inline-grid place-items-center ${className}`}
      style={{ height: size, width: size }}
      whileHover={animated && (variant === "hover" || dock) ? { scale: dock ? 1.08 : 1.03 } : undefined}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      <svg fill="none" height={size} viewBox="0 0 512 512" width={size} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="felipe-os-logo-glow" x1="80" x2="432" y1="92" y2="420">
            <stop stopColor="#8b5cf6" stopOpacity="0.86" />
            <stop offset="1" stopColor="#22d3ee" stopOpacity="0.9" />
          </linearGradient>
          <filter id="felipe-os-logo-soft-glow" colorInterpolationFilters="sRGB" x="-45%" y="-45%" width="190%" height="190%">
            <feGaussianBlur stdDeviation="18" />
          </filter>
        </defs>
        <motion.rect
          animate={animated ? { opacity: dock ? [0.62, 0.78, 0.62] : 0.68 } : { opacity: 0.58 }}
          fill="#08080d"
          height="500"
          initial={{ opacity: dock ? 0.62 : 0.58 }}
          rx="110"
          stroke="rgba(255,255,255,0.14)"
          strokeWidth="10"
          transition={{ duration: 2.4, repeat: dock ? Infinity : 0 }}
          width="500"
          x="6"
          y="6"
        />
        <motion.rect
          animate={animated ? { opacity: dock ? [0.35, 0.58, 0.35] : 0.42 } : { opacity: 0.28 }}
          fill="url(#felipe-os-logo-glow)"
          filter="url(#felipe-os-logo-soft-glow)"
          height="310"
          initial={{ opacity: dock ? 0.35 : 0.28 }}
          rx="78"
          transition={{ duration: 2.8, repeat: dock ? Infinity : 0 }}
          width="310"
          x="82"
          y="106"
        />
        {[
          { width: 320, x: 96, y: 150, delay: 0.08 },
          { width: 216, x: 96, y: 236, delay: 0.22 },
          { width: 74, x: 96, y: 322, delay: 0.38 },
        ].map((bar) => (
          <motion.rect
            animate={{ opacity: 1, scaleX: 1 }}
            fill="#ffffff"
            height={bar.width === 74 ? 74 : 64}
            initial={boot ? { opacity: 0, scaleX: 0.16 } : { opacity: 1, scaleX: 1 }}
            key={`${bar.x}-${bar.y}`}
            rx="32"
            style={{ originX: 0.16 }}
            transition={{ delay: boot ? bar.delay : 0, duration: boot ? 0.46 : 0.2, ease: [0.22, 1, 0.36, 1] }}
            width={bar.width}
            x={bar.x}
            y={bar.y}
          />
        ))}
        <motion.circle
          animate={animated ? { opacity: [0.55, 1, 0.55], scale: [0.94, 1.12, 0.94] } : { opacity: 0.72, scale: 1 }}
          cx="133"
          cy="359"
          fill="#22d3ee"
          initial={{ opacity: 0.72, scale: 1 }}
          r="13"
          transition={{ delay: boot ? 0.8 : 0, duration: boot ? 0.7 : 2.4, repeat: boot ? 0 : Infinity }}
        />
        <motion.circle
          animate={animated ? { rotate: 360, opacity: dock ? 0.76 : 0.48 } : { opacity: 0 }}
          cx="133"
          cy="359"
          fill="none"
          initial={{ opacity: 0, rotate: 0 }}
          r="34"
          stroke="#8b5cf6"
          strokeDasharray="18 28"
          strokeLinecap="round"
          strokeWidth="5"
          style={{ originX: "133px", originY: "359px" }}
          transition={{ duration: variant === "hover" ? 1.2 : 5.5, ease: "linear", repeat: variant === "hover" ? 0 : Infinity }}
        />
      </svg>
    </motion.span>
  );
}
