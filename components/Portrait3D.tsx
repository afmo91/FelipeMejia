"use client";

import { useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type PortraitMode = "parallax" | "static" | "touch";
type PortraitGeometry = {
  edgesGeometry: THREE.EdgesGeometry;
  headGeometry: THREE.BufferGeometry;
  pointsGeometry: THREE.BufferGeometry;
};
type PortraitFocus = {
  id: string;
  progress: number;
  side: "left" | "right";
  titleX: number;
  titleY: number;
};

const MODEL_URL = "/portrait/felipe-bust.glb";
const DEFAULT_FOCUS: PortraitFocus = { id: "home", progress: 0, side: "left", titleX: 0.27, titleY: 0.45 };
const WHITE = new THREE.Color("#f8fbff");
const CYAN = new THREE.Color("#9ff6ff");
const PURPLE = new THREE.Color("#b7a2ff");

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

function usePortraitMode() {
  const [mode, setMode] = useState<PortraitMode>(() => {
    if (typeof window === "undefined") {
      return "parallax";
    }

    const stored = window.localStorage.getItem("portrait-mode");
    return stored === "parallax" || stored === "static" || stored === "touch" ? stored : "parallax";
  });

  useEffect(() => {
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

function getScrollProgress() {
  const documentElement = document.documentElement;
  const maxScroll = Math.max(documentElement.scrollHeight - window.innerHeight, 1);
  return Math.min(1, Math.max(0, window.scrollY / maxScroll));
}

function findHeadMesh(scene: THREE.Group) {
  const meshes: THREE.Mesh[] = [];

  scene.traverse((object) => {
    const mesh = object as THREE.Mesh;
    if (mesh.isMesh && mesh.geometry) {
      meshes.push(mesh);
    }
  });

  const namedMesh = meshes.find((mesh) => mesh.name === "FBHead" || mesh.geometry.name === "FBHead_mesh");
  return namedMesh ?? meshes[0] ?? null;
}

function makePointGeometry(geometry: THREE.BufferGeometry) {
  const sourcePositions = geometry.getAttribute("position") as THREE.BufferAttribute;
  const sourceNormals = geometry.getAttribute("normal") as THREE.BufferAttribute | undefined;
  const box = geometry.boundingBox ?? new THREE.Box3().setFromBufferAttribute(sourcePositions);
  const size = new THREE.Vector3();
  box.getSize(size);

  const stride = Math.max(1, Math.ceil(sourcePositions.count / 22000));
  const pointCount = Math.ceil(sourcePositions.count / stride);
  const positions = new Float32Array(pointCount * 3);
  const colors = new Float32Array(pointCount * 3);
  const color = new THREE.Color();
  let cursor = 0;

  for (let index = 0; index < sourcePositions.count; index += stride) {
    const x = sourcePositions.getX(index);
    const y = sourcePositions.getY(index);
    const z = sourcePositions.getZ(index);
    const nx = sourceNormals?.getX(index) ?? 0;
    const ny = sourceNormals?.getY(index) ?? 0;
    const nz = sourceNormals?.getZ(index) ?? 1;
    const height = (y - box.min.y) / Math.max(size.y, 0.001);
    const depth = (z - box.min.z) / Math.max(size.z, 0.001);
    const centerBias = 1 - Math.min(1, Math.abs(x) / Math.max(size.x * 0.48, 0.001));
    const frontBias = Math.max(0, depth * 0.78 + centerBias * 0.22);

    color.copy(PURPLE).lerp(CYAN, Math.min(1, frontBias * 0.82));
    color.lerp(WHITE, Math.min(0.72, depth * 0.46 + height * 0.18));
    color.multiplyScalar(0.62 + frontBias * 0.55);

    positions[cursor * 3] = x + nx * 0.008;
    positions[cursor * 3 + 1] = y + ny * 0.008;
    positions[cursor * 3 + 2] = z + nz * 0.008;
    colors[cursor * 3] = color.r;
    colors[cursor * 3 + 1] = color.g;
    colors[cursor * 3 + 2] = color.b;
    cursor += 1;
  }

  const pointsGeometry = new THREE.BufferGeometry();
  pointsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  pointsGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  pointsGeometry.computeBoundingSphere();
  return pointsGeometry;
}

function createPortraitGeometry(scene: THREE.Group): PortraitGeometry {
  const mesh = findHeadMesh(scene);

  if (!mesh) {
    throw new Error("No mesh found in portrait GLB.");
  }

  const headGeometry = mesh.geometry.clone();
  headGeometry.computeVertexNormals();

  const positionAttribute = headGeometry.getAttribute("position") as THREE.BufferAttribute;
  const box = new THREE.Box3().setFromBufferAttribute(positionAttribute);
  const center = new THREE.Vector3();
  const size = new THREE.Vector3();
  box.getCenter(center);
  box.getSize(size);

  const targetHeight = 2.86;
  const scale = targetHeight / Math.max(size.y, 0.001);
  headGeometry.translate(-center.x, -center.y, -center.z);
  headGeometry.scale(scale, scale, scale);
  headGeometry.computeVertexNormals();
  headGeometry.computeBoundingBox();
  headGeometry.computeBoundingSphere();

  return {
    edgesGeometry: new THREE.EdgesGeometry(headGeometry, 24),
    headGeometry,
    pointsGeometry: makePointGeometry(headGeometry),
  };
}

function GlbBust({ mode }: { mode: PortraitMode }) {
  const { scene } = useGLTF(MODEL_URL);
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const pointerRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const focusRef = useRef<PortraitFocus>(DEFAULT_FOCUS);
  const scrollRef = useRef(0);

  const portraitGeometry = useMemo(() => createPortraitGeometry(scene), [scene]);

  useEffect(() => {
    return () => {
      portraitGeometry.headGeometry.dispose();
      portraitGeometry.pointsGeometry.dispose();
      portraitGeometry.edgesGeometry.dispose();
    };
  }, [portraitGeometry]);

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

  useEffect(() => {
    let frame = 0;

    function updateScrollProgress() {
      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(() => {
        scrollRef.current = getScrollProgress();
        frame = 0;
      });
    }

    updateScrollProgress();
    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    window.addEventListener("resize", updateScrollProgress);
    return () => {
      window.removeEventListener("scroll", updateScrollProgress);
      window.removeEventListener("resize", updateScrollProgress);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  useEffect(() => {
    function handleFocusChange(event: Event) {
      const detail = (event as CustomEvent<PortraitFocus>).detail;
      if (!detail || (detail.side !== "left" && detail.side !== "right")) {
        return;
      }

      focusRef.current = {
        id: detail.id || "home",
        progress: THREE.MathUtils.clamp(detail.progress || 0, 0, 1),
        side: detail.side,
        titleX: THREE.MathUtils.clamp(detail.titleX || 0.5, 0, 1),
        titleY: THREE.MathUtils.clamp(detail.titleY || 0.45, 0, 1),
      };
    }

    window.addEventListener("portrait-focus-change", handleFocusChange);
    return () => window.removeEventListener("portrait-focus-change", handleFocusChange);
  }, []);

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) {
      return;
    }

    const pointer = pointerRef.current;
    pointer.x = THREE.MathUtils.lerp(pointer.x, mode === "static" ? 0 : pointer.targetX, 0.06);
    pointer.y = THREE.MathUtils.lerp(pointer.y, mode === "static" ? 0 : pointer.targetY, 0.06);

    const focus = mode === "static" ? DEFAULT_FOCUS : focusRef.current;
    const scroll = scrollRef.current;
    const titleX = (focus.titleX - 0.5) * 2;
    const titleY = (focus.titleY - 0.5) * 2;
    const sideX = focus.side === "right" ? 1.02 : -1.02;
    const sectionLift = 0.18 - focus.progress * 0.34;
    const targetScale = focus.id === "home" ? 0.88 : focus.id === "contact" ? 0.72 : 0.78 + Math.sin(focus.progress * Math.PI) * 0.08;
    const scrollDepth = mode === "static" ? 0 : (scroll - 0.42) * 0.18;
    const elapsed = state.clock.elapsedTime;
    const targetYaw = titleX * 0.46 + pointer.x * 0.045;
    const targetPitch = -titleY * 0.14 - pointer.y * 0.032;

    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, targetYaw, 0.055);
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, targetPitch, 0.055);
    group.rotation.z = Math.sin(elapsed * 0.14) * 0.004 + pointer.x * 0.004;
    group.position.x = THREE.MathUtils.lerp(group.position.x, sideX + pointer.x * 0.02, 0.038);
    group.position.y = THREE.MathUtils.lerp(group.position.y, sectionLift - titleY * 0.08 - pointer.y * 0.018, 0.038);
    group.position.z = THREE.MathUtils.lerp(group.position.z, scrollDepth, 0.035);
    group.scale.setScalar(THREE.MathUtils.lerp(group.scale.x, targetScale, 0.04));

    if (glowRef.current) {
      glowRef.current.rotation.copy(group.rotation);
      glowRef.current.position.copy(group.position);
      const pulse = 1.015 + Math.sin(elapsed * 0.45) * 0.004;
      glowRef.current.scale.setScalar(pulse);
    }

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, pointer.x * 0.06, 0.035);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, -pointer.y * 0.055, 0.035);
    const camera = state.camera as THREE.PerspectiveCamera;
    camera.fov = THREE.MathUtils.lerp(camera.fov, focus.id === "home" ? 33 : 36, 0.035);
    camera.updateProjectionMatrix();
    state.camera.lookAt(0, -0.16, 0);
  });

  return (
    <>
      <ambientLight intensity={0.85} />
      <pointLight color="#b7a2ff" intensity={1.4} position={[1.7, 1.4, 2.3]} />
      <pointLight color="#9ff6ff" intensity={0.85} position={[-1.5, -0.2, 2.6]} />

      <mesh ref={glowRef} geometry={portraitGeometry.headGeometry}>
        <meshBasicMaterial
          blending={THREE.AdditiveBlending}
          color="#8b5cf6"
          depthWrite={false}
          opacity={0.035}
          side={THREE.BackSide}
          transparent
        />
      </mesh>

      <group ref={groupRef} scale={0.84}>
        <mesh geometry={portraitGeometry.headGeometry} renderOrder={0}>
          <meshBasicMaterial colorWrite={false} depthTest depthWrite />
        </mesh>

        <mesh geometry={portraitGeometry.headGeometry} renderOrder={2}>
          <meshStandardMaterial
            color="#dfe7ff"
            emissive="#8b5cf6"
            emissiveIntensity={0.08}
            metalness={0.08}
            opacity={0.05}
            roughness={0.34}
            transparent
            depthWrite
          />
        </mesh>

        <mesh geometry={portraitGeometry.headGeometry} renderOrder={3}>
          <meshBasicMaterial
            blending={THREE.AdditiveBlending}
            color="#f8fbff"
            depthTest
            depthWrite={false}
            opacity={0.026}
            transparent
            wireframe
          />
        </mesh>

        <lineSegments geometry={portraitGeometry.edgesGeometry} renderOrder={3}>
          <lineBasicMaterial
            blending={THREE.AdditiveBlending}
            color="#ffffff"
            depthTest
            depthWrite={false}
            opacity={0.12}
            transparent
          />
        </lineSegments>

        <points geometry={portraitGeometry.pointsGeometry} renderOrder={3}>
          <pointsMaterial
            blending={THREE.AdditiveBlending}
            depthTest
            depthWrite={false}
            opacity={0.42}
            size={0.006}
            sizeAttenuation
            transparent
            vertexColors
          />
        </points>

      </group>
    </>
  );
}

function CanvasFallback() {
  return (
    <div
      aria-label="Loading Felipe Mejia wireframe portrait"
      className="absolute inset-0 opacity-70 [background-image:radial-gradient(circle,rgba(248,251,255,0.72)_1px,transparent_1.5px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_at_67%_46%,black_18%,transparent_62%)]"
      role="img"
    />
  );
}

function VisualFallback({ label = "Felipe Mejia wireframe portrait fallback" }: { label?: string }) {
  return (
    <div
      aria-label={label}
      className="pointer-events-none fixed inset-y-0 right-0 z-0 h-screen w-full overflow-hidden opacity-70 md:w-[56vw]"
      role="img"
    >
      <div className="absolute inset-8 opacity-80 [background-image:radial-gradient(circle,rgba(247,248,255,0.7)_1px,transparent_1.5px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_at_70%_45%,black_20%,transparent_68%)]" />
      <div className="absolute inset-16 opacity-55 [background-image:radial-gradient(circle,rgba(159,246,255,0.8)_1px,transparent_1.5px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_70%_45%,black_16%,transparent_66%)]" />
    </div>
  );
}

export default function Portrait3D() {
  const [webGLSupported] = useState(() => (typeof document === "undefined" ? true : canUseWebGL()));
  const mode = usePortraitMode();

  if (!webGLSupported) {
    return <VisualFallback />;
  }

  return (
    <div
      aria-label="Reactive GLB wireframe portrait of Felipe Mejia"
      className="pointer-events-none fixed inset-0 z-0 h-screen w-full overflow-hidden opacity-90 [mask-image:radial-gradient(circle_at_center,black_34%,rgba(0,0,0,0.76)_58%,transparent_88%)]"
      role="img"
    >
      <Suspense fallback={<CanvasFallback />}>
        <Canvas
          camera={{ position: [0, -0.02, 4.9], fov: 34 }}
          dpr={[1, 1.65]}
          gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        >
          <GlbBust mode={mode} />
        </Canvas>
      </Suspense>
    </div>
  );
}

useGLTF.preload(MODEL_URL);
