"use client";

import { useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import type { MutableRefObject } from "react";
import * as THREE from "three";

type PortraitMode = "parallax" | "static" | "touch";
type MotionTarget = { fov: number; pitch: number; scale: number; x: number; y: number; yaw: number; z: number };
type PortraitGeometry = {
  edgesGeometry: THREE.EdgesGeometry;
  headGeometry: THREE.BufferGeometry;
  pointsGeometry: THREE.BufferGeometry;
};
type Vec3Tuple = [number, number, number];

const MODEL_URL = "/portrait/felipe-bust.glb";
const DEFAULT_MOTION: MotionTarget = { fov: 34, pitch: 0.02, scale: 0.86, x: 0.28, y: -0.2, yaw: -0.5, z: 0 };
const WHITE = new THREE.Color("#f8fbff");
const CYAN = new THREE.Color("#9ff6ff");
const PURPLE = new THREE.Color("#b7a2ff");
const PINK = new THREE.Color("#ff8acb");

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

function getSectionMotionTarget(): MotionTarget {
  const sections: (MotionTarget & { id: string })[] = [
    { ...DEFAULT_MOTION, id: "services", fov: 35, scale: 0.8, x: 0.36, y: -0.04, yaw: -0.42, z: 0.1 },
    { ...DEFAULT_MOTION, id: "about", fov: 36, scale: 0.77, x: 0.42, y: -0.15, yaw: -0.46, z: 0.18 },
    { ...DEFAULT_MOTION, id: "resume", fov: 35, scale: 0.82, x: 0.22, y: -0.28, yaw: -0.56, z: -0.08 },
    { ...DEFAULT_MOTION, id: "portfolio", fov: 33, scale: 0.88, x: 0.34, y: -0.18, yaw: -0.5, z: -0.04 },
    { ...DEFAULT_MOTION, id: "contact", fov: 37, scale: 0.76, x: 0.46, y: -0.36, yaw: -0.58, z: 0.22 },
  ];

  let selected = DEFAULT_MOTION;
  let closest = Number.POSITIVE_INFINITY;
  const viewportCenter = window.innerHeight * 0.5;

  sections.forEach((section) => {
    const element = document.getElementById(section.id);
    if (!element) {
      return;
    }

    const rect = element.getBoundingClientRect();
    const distance = Math.abs(rect.top + rect.height * 0.28 - viewportCenter);
    if (distance < closest) {
      closest = distance;
      selected = section;
    }
  });

  return selected;
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

function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function makeAmbientPointGeometry() {
  const random = seededRandom(78191);
  const count = 950;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const color = new THREE.Color();

  for (let index = 0; index < count; index += 1) {
    const radius = 0.9 + random() * 2.1;
    const angle = random() * Math.PI * 2;
    const height = (random() - 0.48) * 3.2;
    const depth = -0.72 - random() * 0.8;

    positions[index * 3] = Math.cos(angle) * radius + 0.15;
    positions[index * 3 + 1] = height;
    positions[index * 3 + 2] = Math.sin(angle) * radius * 0.34 + depth;

    color.copy(PURPLE).lerp(CYAN, random() * 0.75);
    if (random() > 0.82) {
      color.lerp(PINK, 0.45);
    }
    color.multiplyScalar(0.48 + random() * 0.52);
    colors[index * 3] = color.r;
    colors[index * 3 + 1] = color.g;
    colors[index * 3 + 2] = color.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.computeBoundingSphere();
  return geometry;
}

function curveGeometry(points: Vec3Tuple[], radius = 0.005) {
  const curve = new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point)));
  return new THREE.TubeGeometry(curve, Math.max(18, points.length * 8), radius, 8, false);
}

function ellipsePoints(
  center: Vec3Tuple,
  radiusX: number,
  radiusY: number,
  zRadius = 0,
  count = 56,
): Vec3Tuple[] {
  const points: Vec3Tuple[] = [];
  for (let index = 0; index <= count; index += 1) {
    const t = (index / count) * Math.PI * 2;
    points.push([
      center[0] + Math.cos(t) * radiusX,
      center[1] + Math.sin(t) * radiusY,
      center[2] + Math.sin(t) * zRadius,
    ]);
  }
  return points;
}

function FeatureCurve({
  color,
  opacity = 0.26,
  points,
  radius = 0.004,
}: {
  color: string;
  opacity?: number;
  points: Vec3Tuple[];
  radius?: number;
}) {
  const geometry = useMemo(() => curveGeometry(points, radius), [points, radius]);

  useEffect(() => {
    return () => geometry.dispose();
  }, [geometry]);

  return (
    <mesh geometry={geometry} renderOrder={4}>
      <meshBasicMaterial
        blending={THREE.AdditiveBlending}
        color={color}
        depthTest
        depthWrite={false}
        opacity={opacity}
        transparent
      />
    </mesh>
  );
}

function AmbientPointField({
  pointerRef,
  scrollRef,
}: {
  pointerRef: MutableRefObject<{ x: number; y: number; targetX: number; targetY: number }>;
  scrollRef: MutableRefObject<number>;
}) {
  const fieldRef = useRef<THREE.Points>(null);
  const geometry = useMemo(() => makeAmbientPointGeometry(), []);

  useEffect(() => {
    return () => geometry.dispose();
  }, [geometry]);

  useFrame((state) => {
    if (!fieldRef.current) {
      return;
    }

    const pointer = pointerRef.current;
    const scroll = scrollRef.current;
    fieldRef.current.rotation.y = state.clock.elapsedTime * 0.018 + pointer.x * 0.045;
    fieldRef.current.rotation.x = -0.12 + pointer.y * 0.025;
    fieldRef.current.position.y = (0.5 - scroll) * 0.38;
    fieldRef.current.position.x = 0.16 + pointer.x * 0.05;
  });

  return (
    <points ref={fieldRef} geometry={geometry} position={[0.18, -0.08, -0.82]} renderOrder={1}>
      <pointsMaterial
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        opacity={0.26}
        size={0.017}
        sizeAttenuation
        transparent
        vertexColors
      />
    </points>
  );
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
  const sectionRef = useRef<MotionTarget>(DEFAULT_MOTION);
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

    function updateMotionTarget() {
      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(() => {
        sectionRef.current = getSectionMotionTarget();
        scrollRef.current = getScrollProgress();
        frame = 0;
      });
    }

    updateMotionTarget();
    window.addEventListener("scroll", updateMotionTarget, { passive: true });
    window.addEventListener("resize", updateMotionTarget);
    return () => {
      window.removeEventListener("scroll", updateMotionTarget);
      window.removeEventListener("resize", updateMotionTarget);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) {
      return;
    }

    const pointer = pointerRef.current;
    pointer.x = THREE.MathUtils.lerp(pointer.x, mode === "static" ? 0 : pointer.targetX, 0.06);
    pointer.y = THREE.MathUtils.lerp(pointer.y, mode === "static" ? 0 : pointer.targetY, 0.06);

    const active = mode === "static" ? DEFAULT_MOTION : sectionRef.current;
    const scroll = scrollRef.current;
    const scrollY = window.scrollY > 8 && mode !== "static" ? (0.5 - scroll) * 0.68 : 0;
    const scrollDepth = mode === "static" ? 0 : (scroll - 0.42) * 0.28;
    const elapsed = state.clock.elapsedTime;
    const targetYaw = active.yaw + pointer.x * 0.14;
    const targetPitch = active.pitch - pointer.y * 0.065;

    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, targetYaw, 0.055);
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, targetPitch, 0.055);
    group.rotation.z = Math.sin(elapsed * 0.16) * 0.005 + pointer.x * 0.005;
    group.position.x = THREE.MathUtils.lerp(group.position.x, pointer.x * 0.03 + active.x, 0.042);
    group.position.y = THREE.MathUtils.lerp(group.position.y, -pointer.y * 0.02 + active.y + scrollY, 0.042);
    group.position.z = THREE.MathUtils.lerp(group.position.z, scrollDepth, 0.035);
    group.scale.setScalar(THREE.MathUtils.lerp(group.scale.x, active.scale + scroll * 0.05, 0.045));

    if (glowRef.current) {
      glowRef.current.rotation.copy(group.rotation);
      glowRef.current.position.copy(group.position);
      const pulse = 1.015 + Math.sin(elapsed * 0.45) * 0.004;
      glowRef.current.scale.setScalar(pulse);
    }

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, pointer.x * 0.06, 0.035);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, -pointer.y * 0.055, 0.035);
    const camera = state.camera as THREE.PerspectiveCamera;
    camera.fov = THREE.MathUtils.lerp(camera.fov, active.fov, 0.035);
    camera.updateProjectionMatrix();
    state.camera.lookAt(0.06, -0.22, 0);
  });

  return (
    <>
      <ambientLight intensity={0.85} />
      <pointLight color="#b7a2ff" intensity={1.4} position={[1.7, 1.4, 2.3]} />
      <pointLight color="#9ff6ff" intensity={0.85} position={[-1.5, -0.2, 2.6]} />
      <AmbientPointField pointerRef={pointerRef} scrollRef={scrollRef} />

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

      <group ref={groupRef} scale={DEFAULT_MOTION.scale}>
        <mesh geometry={portraitGeometry.headGeometry} renderOrder={0}>
          <meshBasicMaterial colorWrite={false} depthTest depthWrite />
        </mesh>

        <mesh geometry={portraitGeometry.headGeometry} renderOrder={2}>
          <meshStandardMaterial
            color="#dfe7ff"
            emissive="#8b5cf6"
            emissiveIntensity={0.12}
            metalness={0.08}
            opacity={0.06}
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
            opacity={0.04}
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
            opacity={0.22}
            transparent
          />
        </lineSegments>

        <points geometry={portraitGeometry.pointsGeometry} renderOrder={3}>
          <pointsMaterial
            blending={THREE.AdditiveBlending}
            depthTest
            depthWrite={false}
            opacity={0.48}
            size={0.0062}
            sizeAttenuation
            transparent
            vertexColors
          />
        </points>

        <FeatureCurve color="#9ff6ff" opacity={0.2} points={ellipsePoints([-0.28, 0.35, 0.77], 0.18, 0.08, 0.018)} />
        <FeatureCurve color="#9ff6ff" opacity={0.2} points={ellipsePoints([0.19, 0.36, 0.79], 0.17, 0.075, 0.018)} />
        <FeatureCurve color="#f8fbff" opacity={0.18} points={[[-0.1, 0.36, 0.79], [-0.02, 0.35, 0.82], [0.04, 0.36, 0.8]]} />
        <FeatureCurve color="#b7a2ff" opacity={0.16} points={[[-0.34, -0.28, 0.62], [-0.2, -0.46, 0.73], [0.02, -0.52, 0.76], [0.24, -0.43, 0.69], [0.36, -0.22, 0.58]]} />
        <FeatureCurve color="#ff8acb" opacity={0.13} points={[[-0.17, -0.02, 0.76], [-0.06, -0.04, 0.82], [0.07, -0.04, 0.82], [0.18, -0.02, 0.76]]} />
        <FeatureCurve color="#b7a2ff" opacity={0.12} points={[[0.24, 0.9, -0.34], [0.43, 0.84, -0.52], [0.56, 0.72, -0.55], [0.47, 0.62, -0.48], [0.28, 0.66, -0.36]]} radius={0.007} />
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
  const [webGLSupported, setWebGLSupported] = useState(true);
  const mode = usePortraitMode();

  useEffect(() => {
    setWebGLSupported(canUseWebGL());
  }, []);

  if (!webGLSupported) {
    return <VisualFallback />;
  }

  return (
    <div
      aria-label="Reactive GLB wireframe portrait of Felipe Mejia"
      className="pointer-events-none fixed inset-y-0 right-0 z-0 h-screen w-full overflow-hidden opacity-95 [mask-image:linear-gradient(to_left,black_46%,rgba(0,0,0,0.74)_72%,transparent_100%)] md:w-[56vw]"
      role="img"
    >
      <Suspense fallback={<CanvasFallback />}>
        <Canvas
          camera={{ position: [0, -0.02, 4.72], fov: 33 }}
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
