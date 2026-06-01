type FelipeOSLogoProps = {
  className?: string;
  size?: number;
};

export default function FelipeOSLogo({ className = "", size = 32 }: FelipeOSLogoProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 48 48"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="felipe-os-mark-stroke" x1="12" x2="37" y1="10" y2="39">
          <stop stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
        <radialGradient id="felipe-os-mark-glow" cx="0" cy="0" gradientTransform="matrix(24 28 -28 24 24 18)" gradientUnits="userSpaceOnUse" r="1">
          <stop stopColor="#22d3ee" stopOpacity="0.28" />
          <stop offset="0.52" stopColor="#8b5cf6" stopOpacity="0.16" />
          <stop offset="1" stopColor="#02040a" />
        </radialGradient>
      </defs>
      <rect height="43" rx="14" fill="url(#felipe-os-mark-glow)" stroke="rgba(255,255,255,0.14)" width="43" x="2.5" y="2.5" />
      <path
        d="M17 34V14h15M17 23h12"
        stroke="url(#felipe-os-mark-stroke)"
        strokeLinecap="round"
        strokeWidth="3.4"
      />
      <path
        d="M31.5 14h3.5c2.8 0 5 2.2 5 5v2.5M29 23h4.5c2.8 0 5 2.2 5 5V33"
        stroke="url(#felipe-os-mark-stroke)"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
      <circle cx="17" cy="14" fill="#c4b5fd" r="2.4" />
      <circle cx="31.5" cy="14" fill="#67e8f9" r="2.4" />
      <circle cx="29" cy="23" fill="#67e8f9" r="2.2" />
      <circle cx="38.5" cy="33" fill="#8b5cf6" r="2.2" />
      <path d="M16 38h13" stroke="rgba(255,255,255,0.35)" strokeLinecap="round" strokeWidth="1.4" />
    </svg>
  );
}
