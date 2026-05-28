"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type PointCloudData = {
  positions: Float32Array;
  colors: Float32Array;
};

const IMAGE_SRC = "/assets/user.jpg";
const MAX_POINTS = 5200;

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

function colorFromBrightness(brightness: number) {
  const mix = THREE.MathUtils.clamp(brightness * 0.75, 0, 1);
  const purple = [0.55, 0.36, 0.96];
  const cyan = [0.13, 0.83, 0.93];
  return [
    purple[0] * (1 - mix) + cyan[0] * mix + brightness * 0.12,
    purple[1] * (1 - mix) + cyan[1] * mix + brightness * 0.08,
    purple[2] * (1 - mix) + cyan[2] * mix,
  ];
}

function createPointCloudFromImage(image: HTMLImageElement): PointCloudData {
  const sampleWidth = 124;
  const ratio = image.naturalHeight / Math.max(image.naturalWidth, 1);
  const sampleHeight = Math.max(92, Math.min(168, Math.round(sampleWidth * ratio)));
  const canvas = document.createElement("canvas");
  canvas.width = sampleWidth;
  canvas.height = sampleHeight;

  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    return createFallbackPointCloud();
  }

  context.drawImage(image, 0, 0, sampleWidth, sampleHeight);
  const pixels = context.getImageData(0, 0, sampleWidth, sampleHeight).data;
  const positions: number[] = [];
  const colors: number[] = [];
  const stride = Math.max(2, Math.ceil(Math.sqrt((sampleWidth * sampleHeight) / MAX_POINTS)));

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
      const keep = seededNoise(pixelIndex + brightness * 113) < 0.34 + brightness * 0.58;

      if (!keep || positions.length / 3 >= MAX_POINTS) {
        continue;
      }

      const nx = x / sampleWidth - 0.5;
      const ny = 0.5 - y / sampleHeight;
      const noiseA = seededNoise(pixelIndex + 17);
      const noiseB = seededNoise(pixelIndex + 71);
      const noiseC = seededNoise(pixelIndex + 137);
      const swirl = (brightness - 0.5) * 1.65 + (noiseA - 0.5) * 0.85;
      const cos = Math.cos(swirl);
      const sin = Math.sin(swirl);
      const xRot = nx * cos - ny * sin;
      const yRot = nx * sin + ny * cos;
      const depth = (brightness - 0.5) * 1.18 + Math.sin((nx + ny) * 8) * 0.12;

      positions.push(
        xRot * 2.18 + (noiseB - 0.5) * 0.22,
        yRot * 2.5 + (noiseC - 0.5) * 0.22,
        depth + (noiseA - 0.5) * 0.28,
      );

      colors.push(...colorFromBrightness(brightness));
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

    const color = colorFromBrightness(brightness);
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

function Cloud({ data }: { data: PointCloudData }) {
  const ref = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);
  const scrollRef = useRef(0);
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

  useFrame((state) => {
    if (!ref.current || !groupRef.current) {
      return;
    }

    const scroll = getScrollProgress();
    scrollRef.current = THREE.MathUtils.lerp(scrollRef.current, scroll, 0.06);
    const elapsed = state.clock.elapsedTime;

    groupRef.current.rotation.y = elapsed * 0.16 + scrollRef.current * 1.2;
    groupRef.current.rotation.x = Math.sin(elapsed * 0.24) * 0.16 - scrollRef.current * 0.22;
    groupRef.current.scale.z = 0.82 + scrollRef.current * 1.35 + Math.sin(elapsed * 0.55) * 0.04;
    ref.current.rotation.z = Math.sin(elapsed * 0.18) * 0.08;
  });

  return (
    <group ref={groupRef}>
      <points ref={ref} geometry={geometry}>
        <pointsMaterial
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          opacity={0.88}
          size={0.018}
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
      className="relative h-[420px] w-full overflow-hidden"
      role="img"
    >
      <div className="absolute inset-8 opacity-80 [background-image:radial-gradient(circle,rgba(139,92,246,0.9)_1px,transparent_1.5px)] [background-size:18px_18px] [mask-image:radial-gradient(ellipse_at_center,black_22%,transparent_72%)]" />
      <div className="absolute inset-16 opacity-60 [background-image:radial-gradient(circle,rgba(34,211,238,0.85)_1px,transparent_1.5px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_18%,transparent_68%)]" />
    </div>
  );
}

export default function Portrait3D() {
  const { data, webGLSupported } = usePointCloud();

  if (!webGLSupported) {
    return <VisualFallback label="Abstract portrait fallback for environments without WebGL" />;
  }

  if (!data) {
    return <VisualFallback label="Loading abstract portrait point cloud" />;
  }

  return (
    <div
      aria-label="Abstract point-cloud portrait"
      className="h-[420px] w-full"
      role="img"
    >
      <Canvas
        camera={{ position: [0, 0, 3.15], fov: 46 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.7} />
        <Cloud data={data} />
      </Canvas>
    </div>
  );
}
