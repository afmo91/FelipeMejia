"use client";

import { Environment, Html, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import type { Group } from "three";
import type { FelipeOSView } from "@/data/chatFlows";

const MODEL_PATH = "/guide/felipe-guide.glb";

function GuideBust({ activeView, motionEnabled }: { activeView: FelipeOSView; motionEnabled: boolean }) {
  const group = useRef<Group>(null);
  const { scene } = useGLTF(MODEL_PATH);

  useEffect(() => {
    scene.traverse((object) => {
      object.frustumCulled = true;
    });
  }, [scene]);

  useFrame(({ clock, pointer }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    const viewOffset = activeView === "contact" ? -0.08 : activeView === "systems" ? 0.08 : 0;
    group.current.rotation.y = motionEnabled ? -0.22 + pointer.x * 0.12 + viewOffset + Math.sin(t * 0.45) * 0.035 : -0.2 + viewOffset;
    group.current.rotation.x = motionEnabled ? -0.04 + pointer.y * 0.035 + Math.sin(t * 0.6) * 0.012 : -0.04;
    group.current.position.y = motionEnabled ? -1.18 + Math.sin(t * 0.78) * 0.025 : -1.18;
  });

  return (
    <group ref={group} scale={1.78}>
      <primitive object={scene} />
    </group>
  );
}

function ModelLoading() {
  return (
    <Html center>
      <div className="rounded-full border border-white/10 bg-black/55 px-3 py-1.5 text-[0.68rem] text-slate-300 backdrop-blur">
        Loading guide
      </div>
    </Html>
  );
}

export default function FelipeGuideModel({
  activeView,
  motionEnabled,
}: {
  activeView: FelipeOSView;
  motionEnabled: boolean;
}) {
  return (
    <Canvas
      camera={{ fov: 26, position: [0, 0.32, 5.6] }}
      dpr={[1, 1.55]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={1.35} />
      <directionalLight intensity={1.8} position={[2.4, 3.2, 4.8]} />
      <pointLight color="#22d3ee" intensity={3.4} position={[-2.2, 1.8, 2.8]} />
      <pointLight color="#8b5cf6" intensity={2.2} position={[2.4, 0.8, 2.6]} />
      <Suspense fallback={<ModelLoading />}>
        <GuideBust activeView={activeView} motionEnabled={motionEnabled} />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload(MODEL_PATH);
