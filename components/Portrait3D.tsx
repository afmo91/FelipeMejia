"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type PointCloudData = {
  positions: Float32Array;
  colors: Float32Array;
};

type PortraitMode = "parallax" | "static" | "touch";

const IMAGE_SRC = "/assets/user.jpg";
const MAX_POINTS = 14000;

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

function colorFromPixel(red: number, green: number, blue: number, brightness: number, saturation: number) {
  const purple = [0.62, 0.42, 1];
  const cyan = [0.18, 0.9, 0.98];
  const pink = [0.95, 0.32, 0.72];
  const accent = brightness > 0.68 ? cyan : saturation > 0.18 ? pink : purple;
  const contrast = 1.42;
  const base = [
    THREE.MathUtils.clamp((red - 0.5) * contrast + 0.58, 0.08, 1),
    THREE.MathUtils.clamp((green - 0.5) * contrast + 0.58, 0.08, 1),
    THREE.MathUtils.clamp((blue - 0.5) * contrast + 0.58, 0.08, 1),
  ];
  const mix = THREE.MathUtils.clamp(0.22 + saturation * 0.42 + (1 - brightness) * 0.16, 0.2, 0.52);

  return [
    base[0] * (1 - mix) + accent[0] * mix,
    base[1] * (1 - mix) + accent[1] * mix,
    base[2] * (1 - mix) + accent[2] * mix,
  ];
}

function createPointCloudFromImage(image: HTMLImageElement): PointCloudData {
  const sampleWidth = 190;
  const cropWidth = image.naturalWidth * 0.84;
  const cropX = (image.naturalWidth - cropWidth) / 2;
  const cropY = Math.max(0, image.naturalHeight * 0.02);
  const cropHeight = Math.min(image.naturalHeight - cropY, cropWidth * 1.28);
  const sampleHeight = Math.round(sampleWidth * (cropHeight / cropWidth));
  const canvas = document.createElement("canvas");
  canvas.width = sampleWidth;
  canvas.height = sampleHeight;

  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    return createFallbackPointCloud();
  }

  context.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, sampleWidth, sampleHeight);
  const pixels = context.getImageData(0, 0, sampleWidth, sampleHeight).data;
  const positions: number[] = [];
  const colors: number[] = [];
  const stride = Math.max(1, Math.ceil(Math.sqrt((sampleWidth * sampleHeight) / (MAX_POINTS * 1.25))));

  for (let y = 0; y < sampleHeight; y += stride) {
    for (let x = 0; x < sampleWidth; x += stride) {
      const pixelIndex = y * sampleWidth + x;
      const offset = pixelIndex * 4;
      const alpha = pixels[offset + 3] / 255;
      if (alpha < 0.08) {
        continue;
      }

      const red = pixels[offset] / 255;
      const green = pixels[offset + 1] / 255;
      const blue = pixels[offset + 2] / 255;
      const brightness = red * 0.2126 + green * 0.7152 + blue * 0.0722;
      const maxChannel = Math.max(red, green, blue);
      const minChannel = Math.min(red, green, blue);
      const saturation = maxChannel - minChannel;
      const nx = x / sampleWidth - 0.5;
      const ny = 0.5 - y / sampleHeight;
      const faceMask = THREE.MathUtils.clamp(
        1 - (Math.pow(nx / 0.42, 2) + Math.pow((ny - 0.02) / 0.58, 2)) * 0.44,
        0,
        1,
      );
      const detail = (1 - brightness) * 0.52 + saturation * 0.68 + faceMask * 0.36;
      const keep = seededNoise(pixelIndex + brightness * 113) < 0.12 + detail * 0.74;

      if (!keep || positions.length / 3 >= MAX_POINTS) {
        continue;
      }

      const noiseA = seededNoise(pixelIndex + 17);
      const noiseB = seededNoise(pixelIndex + 71);
      const noiseC = seededNoise(pixelIndex + 137);
      const curve = 1 - Math.min(1, Math.sqrt(nx * nx + ny * ny) * 1.5);
      const depth =
        faceMask * 0.78 +
        curve * 0.32 +
        (0.5 - brightness) * 0.58 +
        saturation * 0.62 +
        Math.sin((nx * 9 + ny * 6) * Math.PI) * 0.045;

      positions.push(
        nx * 2.25 + (noiseB - 0.5) * 0.085,
        ny * 2.95 + (noiseC - 0.5) * 0.085,
        depth + (noiseA - 0.5) * 0.16,
      );

      colors.push(...colorFromPixel(red, green, blue, brightness, saturation));
    }
  }

  if (positions.length < 900) {
    return createFallbackPointCloud();
  }

  return {
    positions: new Float32Array(positions),
    colors: new Float32Array(colors),
  };
}

function createFallbackPointCloud(): PointCloudData {
  const positions = new Float32Array(3600 * 3);
  const colors = new Float32Array(3600 * 3);

  for (let index = 0; index < 3600; index += 1) {
    const angle = index * 2.399963229728653;
    const radius = Math.sqrt(index / 3600) * 1.05;
    const brightness = 0.35 + seededNoise(index + 5) * 0.65;
    const wave = Math.sin(index * 0.035) * 0.32;
    const offset = index * 3;

    positions[offset] = Math.cos(angle) * radius * 1.6 + (seededNoise(index + 11) - 0.5) * 0.14;
    positions[offset + 1] = Math.sin(angle) * radius * 1.9 + (seededNoise(index + 29) - 0.5) * 0.14;
    positions[offset + 2] = wave + (brightness - 0.5) * 0.9;

    const color = colorFromPixel(0.55, 0.36, 0.96, brightness, 0.25);
    colors[offset] = color[0];
    colors[offset + 1] = color[1];
    colors[offset + 2] = color[2];
  }

  return { positions, colors };
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
    const image = new Image();
    image.decoding = "async";
    image.onload = () => {
      if (!cancelled) {
        setData(createPointCloudFromImage(image));
      }
    };
    image.onerror = () => {
      if (!cancelled) {
        setData(createFallbackPointCloud());
      }
    };
    image.src = IMAGE_SRC;

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
    scrollRef.current = THREE.MathUtils.lerp(scrollRef.current, scroll, 0.06);
    const elapsed = state.clock.elapsedTime;

    groupRef.current.rotation.y = elapsed * 0.035 + scrollRef.current * 0.7 + pointer.x * 0.2;
    groupRef.current.rotation.x = Math.sin(elapsed * 0.16) * 0.06 - scrollRef.current * 0.18 - pointer.y * 0.14;
    groupRef.current.scale.z = 1.08 + scrollRef.current * 0.72 + Math.sin(elapsed * 0.34) * 0.025;
    groupRef.current.position.x = pointer.x * 0.1;
    groupRef.current.position.y = -pointer.y * 0.08;
    ref.current.rotation.z = Math.sin(elapsed * 0.12) * 0.035 + pointer.x * 0.025;
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, pointer.x * 0.16, 0.025);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, -pointer.y * 0.12, 0.025);
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={groupRef}>
      <points ref={ref} geometry={geometry}>
        <pointsMaterial
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          opacity={0.95}
          size={0.0125}
          sizeAttenuation
          transparent
          vertexColors
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
      className="pointer-events-none fixed inset-y-0 right-0 z-0 h-screen w-full opacity-80 [mask-image:linear-gradient(to_left,black_36%,rgba(0,0,0,0.78)_64%,transparent_100%)] md:w-[62vw]"
      role="img"
    >
      <Canvas
        camera={{ position: [0, 0, 3.05], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.7} />
        <Cloud data={data} mode={mode} />
      </Canvas>
    </div>
  );
}
