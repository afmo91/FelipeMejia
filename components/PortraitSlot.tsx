"use client";

import dynamic from "next/dynamic";

const Portrait3D = dynamic(() => import("./Portrait3D"), {
  ssr: false,
  loading: () => (
    <div
      aria-label="Loading Felipe Mejia wireframe portrait"
      className="pointer-events-none fixed inset-y-0 right-0 z-0 h-screen w-full opacity-50 [background-image:radial-gradient(circle,rgba(139,92,246,0.8)_1px,transparent_1.5px)] [background-size:20px_20px] [mask-image:linear-gradient(to_left,black_30%,transparent_92%)] md:w-[56vw]"
      role="img"
    />
  ),
});

export default function PortraitSlot() {
  return <Portrait3D />;
}
