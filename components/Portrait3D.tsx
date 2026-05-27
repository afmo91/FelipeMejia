"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Points, PointMaterial } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function Cloud() {
  const ref = useRef<THREE.Points>(null);
  const sphere = useMemo(() => {
    const arr = new Float32Array(6000);
    for (let i = 0; i < 6000; i += 3) {
      arr[i] = (Math.random() - 0.5) * 2;
      arr[i + 1] = (Math.random() - 0.5) * 2;
      arr[i + 2] = (Math.random() - 0.5) * 2;
    }
    return arr;
  }, []);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.1;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
  });
  return <Points ref={ref} positions={sphere} stride={3}><PointMaterial color="#8b5cf6" size={0.01} transparent opacity={0.8} /></Points>;
}

export default function Portrait3D() {
  return <div className="h-[420px] w-full"><Canvas camera={{ position: [0, 0, 2.2] }}><ambientLight intensity={0.8} /><Float speed={1.4}><Cloud /></Float></Canvas></div>;
}
