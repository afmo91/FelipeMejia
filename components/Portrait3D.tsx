"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type PointCloudData = {
  positions: Float32Array;
  colors: Float32Array;
  sizes: Float32Array;
};

type PortraitPayload = {
  positions: number[];
  colors: number[];
  sizes: number[];
};

type PortraitMode = "parallax" | "static" | "touch";

const DATA_SRC = "/portrait/points.json";

const vertexShader = `
  attribute vec3 color;
  attribute float pointSize;
  varying vec3 vColor;

  void main() {
    vColor = color;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = pointSize * (360.0 / max(1.0, -mvPosition.z));
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying vec3 vColor;

  void main() {
    vec2 center = gl_PointCoord - vec2(0.5);
    float distanceFromCenter = length(center);
    float alpha = smoothstep(0.5, 0.08, distanceFromCenter);
    gl_FragColor = vec4(vColor, alpha * 0.92);
  }
`;

function fract(value: number) {
  return value - Math.floor(value);
}

function seededNoise(seed: number) {
  return fract(Math.sin(seed * 12.9898) * 43758.5453);
}

function canUseWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")),
    );
  } catch {
    return false;
  }
}

function getScrollProgress() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  return maxScroll > 0 ? THREE.MathUtils.clamp(window.scrollY / maxScroll, 0, 1) : 0;
}

function usePortraitMode() {
  const [mode, setMode] = useState<PortraitMode>("parallax");

  useEffect(() => {
    const stored = window.localStorage.getItem("portrait-mode") as PortraitMode | null;
    if (stored === "parallax" || stored === "static" || stored === "touch") {
      setMode(stored);
    }

    function updateMode(event: Event) {
      const nextMode = (event as CustomEvent<PortraitMode>).detail;
      if (nextMode === "parallax" || nextMode === "static" || nextMode === "touch") {
        setMode(nextMode);
      }
    }

    window.addEventListener("portrait-mode-change", updateMode);
    return () => window.removeEventListener("portrait-mode-change", updateMode);
  }, []);

  return mode;
}

function createFallbackPointCloud(): PointCloudData {
  const count = 5200;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  for (let index = 0; index < count; index += 1) {
    const angle = index * 2.399963229728653;
    const radius = Math.sqrt(index / count);
    const offset = index * 3;
    const faceBias = seededNoise(index + 5);

    positions[offset] = Math.cos(angle) * radius * 0.92 + (seededNoise(index + 11) - 0.5) * 0.08;
    positions[offset + 1] = Math.sin(angle) * radius * 1.3 + (seededNoise(index + 29) - 0.5) * 0.08;
    positions[offset + 2] = (1 - radius) * 0.75 + Math.sin(index * 0.035) * 0.12;
    colors[offset] = 0.54 + faceBias * 0.24;
    colors[offset + 1] = 0.45 + faceBias * 0.28;
    colors[offset + 2] = 0.96;
    sizes[index] = 0.016 + faceBias * 0.01;
  }

  return { positions, colors, sizes };
}

function usePointCloud() {
  const [data, setData] = useState<PointCloudData | null>(null);
  const [webGLSupported, setWebGLSupported] = useState(true);

  useEffect(() => {
    if (!canUseWebGL()) {
      setWebGLSupported(false);
      return;
    }

    let cancelled = false;

    fetch(DATA_SRC)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Portrait data failed to load");
        }

        return response.json() as Promise<PortraitPayload>;
      })
      .then((payload) => {
        if (cancelled) {
          return;
        }

        setData({
          colors: new Float32Array(payload.colors),
          positions: new Float32Array(payload.positions),
          sizes: new Float32Array(payload.sizes),
        });
      })
      .catch(() => {
        if (!cancelled) {
          setData(createFallbackPointCloud());
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, webGLSupported };
}

function Cloud({ data, mode }: { data: PointCloudData; mode: PortraitMode }) {
  const ref = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);
  const scrollRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const geometry = useMemo(() => {
    const nextGeometry = new THREE.BufferGeometry();
    nextGeometry.setAttribute("position", new THREE.BufferAttribute(data.positions, 3));
    nextGeometry.setAttribute("color", new THREE.BufferAttribute(data.colors, 3));
    nextGeometry.setAttribute("pointSize", new THREE.BufferAttribute(data.sizes, 1));
    nextGeometry.computeBoundingSphere();
    return nextGeometry;
  }, [data]);

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  useEffect(() => {
    let frame = 0;
    const pointer = pointerRef.current;

    function handlePointerMove(event: PointerEvent) {
      const isTouch = event.pointerType === "touch";
      if (mode === "static" || (isTouch && mode !== "touch")) {
        return;
      }

      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(() => {
        pointer.targetX = (event.clientX / window.innerWidth - 0.5) * 2;
        pointer.targetY = (event.clientY / window.innerHeight - 0.5) * 2;
        frame = 0;
      });
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [mode]);

  useFrame((state) => {
    if (!ref.current || !groupRef.current) {
      return;
    }

    const scroll = mode === "static" ? 0 : getScrollProgress();
    const pointer = pointerRef.current;
    pointer.x = THREE.MathUtils.lerp(pointer.x, mode === "static" ? 0 : pointer.targetX, 0.045);
    pointer.y = THREE.MathUtils.lerp(pointer.y, mode === "static" ? 0 : pointer.targetY, 0.045);
    scrollRef.current = THREE.MathUtils.lerp(scrollRef.current, scroll, 0.055);
    const elapsed = state.clock.elapsedTime;

    groupRef.current.rotation.y = elapsed * 0.025 + scrollRef.current * 0.55 + pointer.x * 0.18;
    groupRef.current.rotation.x = Math.sin(elapsed * 0.16) * 0.04 - scrollRef.current * 0.14 - pointer.y * 0.12;
    groupRef.current.scale.z = 1.06 + scrollRef.current * 0.62 + Math.sin(elapsed * 0.34) * 0.02;
    groupRef.current.position.x = pointer.x * 0.08;
    groupRef.current.position.y = -pointer.y * 0.06;
    ref.current.rotation.z = Math.sin(elapsed * 0.12) * 0.025 + pointer.x * 0.018;
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, pointer.x * 0.13, 0.025);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, -pointer.y * 0.1, 0.025);
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={groupRef} scale={0.82}>
      <points ref={ref} geometry={geometry}>
        <shaderMaterial
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          fragmentShader={fragmentShader}
          transparent
          vertexShader={vertexShader}
        />
      </points>
    </group>
  );
}

function VisualFallback({ label = "Abstract portrait visual" }: { label?: string }) {
  return (
    <div
      aria-label={label}
      className="pointer-events-none fixed inset-y-0 right-0 z-0 h-screen w-full overflow-hidden opacity-70 md:w-[62vw]"
      role="img"
    >
      <div className="absolute inset-8 opacity-80 [background-image:radial-gradient(circle,rgba(139,92,246,0.9)_1px,transparent_1.5px)] [background-size:18px_18px] [mask-image:radial-gradient(ellipse_at_center,black_22%,transparent_72%)]" />
      <div className="absolute inset-16 opacity-60 [background-image:radial-gradient(circle,rgba(34,211,238,0.85)_1px,transparent_1.5px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_18%,transparent_68%)]" />
    </div>
  );
}

export default function Portrait3D() {
  const { data, webGLSupported } = usePointCloud();
  const mode = usePortraitMode();

  if (!webGLSupported) {
    return <VisualFallback label="Abstract portrait fallback for environments without WebGL" />;
  }

  if (!data) {
    return <VisualFallback label="Loading abstract portrait point cloud" />;
  }

  return (
    <div
      aria-label="Abstract point-cloud portrait"
      className="pointer-events-none fixed inset-y-0 right-0 z-0 h-screen w-full opacity-85 [mask-image:linear-gradient(to_left,black_42%,rgba(0,0,0,0.82)_70%,transparent_100%)] md:w-[62vw]"
      role="img"
    >
      <Canvas
        camera={{ position: [0, 0, 4.1], fov: 36 }}
        dpr={[1, 1.45]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.7} />
        <Cloud data={data} mode={mode} />
      </Canvas>
    </div>
  );
}
