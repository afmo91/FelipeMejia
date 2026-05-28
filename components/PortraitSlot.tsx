"use client";

import dynamic from "next/dynamic";

const Portrait3D = dynamic(() => import("./Portrait3D"), {
  ssr: false,
  loading: () => (
    <div
      aria-label="Loading abstract portrait"
      className="h-[420px] w-full opacity-70 [background-image:radial-gradient(circle,rgba(139,92,246,0.8)_1px,transparent_1.5px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,black_24%,transparent_70%)]"
      role="img"
    />
  ),
});

export default function PortraitSlot() {
  return <Portrait3D />;
}
