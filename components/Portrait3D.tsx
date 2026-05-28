"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type PortraitMode = "parallax" | "static" | "touch";
type Vec3Tuple = [number, number, number];
type LookTarget = { pitch: number; yaw: number };

const WHITE = "#f7f8ff";
const CYAN = "#9ff6ff";
const PURPLE = "#b7a2ff";
const PINK = "#ff9bcf";

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const t = clamp((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
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

function getSectionLookTarget(): LookTarget {
  const sections: { id: string; pitch: number; yaw: number }[] = [
    { id: "about", pitch: 0.03, yaw: -0.28 },
    { id: "resume", pitch: -0.06, yaw: -0.43 },
    { id: "portfolio", pitch: 0.02, yaw: -0.35 },
    { id: "contact", pitch: -0.09, yaw: -0.49 },
  ];

  let selected: LookTarget = { pitch: 0.02, yaw: -0.37 };
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
      selected = { pitch: section.pitch, yaw: section.yaw };
    }
  });

  return selected;
}

function headPoint(v: number, theta: number): THREE.Vector3 {
  const crossSection = Math.sin(Math.PI * v);
  const y = 1.14 - v * 2.18;
  const jawTaper = 1 - smoothstep(0.66, 0.98, v) * 0.34;
  const crownTaper = 0.75 + smoothstep(0.04, 0.22, v) * 0.25;
  const cheekPush = 1 + Math.exp(-((v - 0.49) ** 2) / 0.035) * 0.08;
  const rx = 0.78 * crossSection * jawTaper * crownTaper * cheekPush;
  const rz = 0.61 * crossSection * (0.82 + 0.18 * jawTaper);

  return new THREE.Vector3(Math.sin(theta) * rx, y, Math.cos(theta) * rz);
}

function neckPoint(v: number, theta: number): THREE.Vector3 {
  const y = -0.96 - v * 0.92;
  const taper = 1 - v * 0.12;
  return new THREE.Vector3(Math.sin(theta) * 0.31 * taper, y, Math.cos(theta) * 0.25 * taper);
}

function shoulderPoint(v: number, theta: number): THREE.Vector3 {
  const y = -1.72 - v * 0.62 + Math.cos(theta) * 0.05;
  const rx = 0.42 + v * 1.35;
  const rz = 0.14 + v * 0.3;
  return new THREE.Vector3(Math.sin(theta) * rx, y, Math.cos(theta) * rz - v * 0.14);
}

function createBustTopology() {
  const linePositions: number[] = [];
  const pointPositions: number[] = [];

  const addSegment = (a: THREE.Vector3, b: THREE.Vector3) => {
    linePositions.push(a.x, a.y, a.z, b.x, b.y, b.z);
  };

  const addPoint = (point: THREE.Vector3) => {
    pointPositions.push(point.x, point.y, point.z);
  };

  const thetaSegments = 72;
  const headRows = 44;

  for (let row = 2; row < headRows - 1; row += 1) {
    const v = row / (headRows - 1);
    let previous = headPoint(v, -Math.PI);
    for (let column = 1; column <= thetaSegments; column += 1) {
      const theta = -Math.PI + (column / thetaSegments) * Math.PI * 2;
      const point = headPoint(v, theta);
      addSegment(previous, point);
      previous = point;
      if (column % 2 === 0) {
        addPoint(point);
      }
    }
  }

  for (let column = 0; column < thetaSegments; column += 4) {
    const theta = -Math.PI + (column / thetaSegments) * Math.PI * 2;
    let previous = headPoint(0.05, theta);
    for (let row = 3; row < headRows - 2; row += 1) {
      const point = headPoint(row / (headRows - 1), theta);
      addSegment(previous, point);
      previous = point;
      addPoint(point);
    }
  }

  const neckRows = 14;
  for (let row = 0; row < neckRows; row += 1) {
    const v = row / (neckRows - 1);
    let previous = neckPoint(v, -Math.PI);
    for (let column = 1; column <= thetaSegments; column += 1) {
      const theta = -Math.PI + (column / thetaSegments) * Math.PI * 2;
      const point = neckPoint(v, theta);
      addSegment(previous, point);
      previous = point;
      if (column % 3 === 0) {
        addPoint(point);
      }
    }
  }

  for (let column = 0; column < thetaSegments; column += 6) {
    const theta = -Math.PI + (column / thetaSegments) * Math.PI * 2;
    let previous = neckPoint(0, theta);
    for (let row = 1; row < neckRows; row += 1) {
      const point = neckPoint(row / (neckRows - 1), theta);
      addSegment(previous, point);
      previous = point;
    }
  }

  const shoulderRows = 12;
  for (let row = 0; row < shoulderRows; row += 1) {
    const v = row / (shoulderRows - 1);
    let previous = shoulderPoint(v, -Math.PI * 0.92);
    for (let column = 1; column <= thetaSegments; column += 1) {
      const theta = -Math.PI * 0.92 + (column / thetaSegments) * Math.PI * 1.84;
      const point = shoulderPoint(v, theta);
      addSegment(previous, point);
      previous = point;
      if (column % 4 === 0) {
        addPoint(point);
      }
    }
  }

  for (let column = 3; column < thetaSegments - 3; column += 7) {
    const theta = -Math.PI * 0.82 + (column / thetaSegments) * Math.PI * 1.64;
    let previous = shoulderPoint(0, theta);
    for (let row = 1; row < shoulderRows; row += 1) {
      const point = shoulderPoint(row / (shoulderRows - 1), theta);
      addSegment(previous, point);
      previous = point;
    }
  }

  return {
    lines: new Float32Array(linePositions),
    points: new Float32Array(pointPositions),
  };
}

function createBufferGeometry(attribute: Float32Array) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(attribute, 3));
  geometry.computeBoundingSphere();
  return geometry;
}

function ellipsePoints(
  center: Vec3Tuple,
  radiusX: number,
  radiusY: number,
  zRadius = 0,
  start = 0,
  end = Math.PI * 2,
  count = 72,
): Vec3Tuple[] {
  const points: Vec3Tuple[] = [];
  for (let index = 0; index <= count; index += 1) {
    const t = start + (index / count) * (end - start);
    points.push([
      center[0] + Math.cos(t) * radiusX,
      center[1] + Math.sin(t) * radiusY,
      center[2] + Math.sin(t) * zRadius,
    ]);
  }
  return points;
}

function earPoints(side: -1 | 1): Vec3Tuple[] {
  return ellipsePoints([side * 0.72, 0.28, 0.02], 0.06, 0.22, 0.11, -Math.PI * 0.8, Math.PI * 0.8, 44);
}

function FeatureCurve({
  color = WHITE,
  opacity = 0.7,
  points,
  radius = 0.008,
}: {
  color?: string;
  opacity?: number;
  points: Vec3Tuple[];
  radius?: number;
}) {
  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point)));
    return new THREE.TubeGeometry(curve, Math.max(24, points.length * 3), radius, 8, false);
  }, [points, radius]);

  useEffect(() => {
    return () => geometry.dispose();
  }, [geometry]);

  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial
        blending={THREE.AdditiveBlending}
        color={color}
        depthWrite={false}
        opacity={opacity}
        transparent
      />
    </mesh>
  );
}

function Bust({ mode }: { mode: PortraitMode }) {
  const groupRef = useRef<THREE.Group>(null);
  const pointerRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const sectionRef = useRef<LookTarget>({ pitch: 0.02, yaw: -0.37 });
  const topology = useMemo(() => createBustTopology(), []);
  const lineGeometry = useMemo(() => createBufferGeometry(topology.lines), [topology.lines]);
  const pointGeometry = useMemo(() => createBufferGeometry(topology.points), [topology.points]);

  useEffect(() => {
    return () => {
      lineGeometry.dispose();
      pointGeometry.dispose();
    };
  }, [lineGeometry, pointGeometry]);

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

    function updateSectionTarget() {
      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(() => {
        sectionRef.current = getSectionLookTarget();
        frame = 0;
      });
    }

    updateSectionTarget();
    window.addEventListener("scroll", updateSectionTarget, { passive: true });
    window.addEventListener("resize", updateSectionTarget);
    return () => {
      window.removeEventListener("scroll", updateSectionTarget);
      window.removeEventListener("resize", updateSectionTarget);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  useFrame((state) => {
    if (!groupRef.current) {
      return;
    }

    const pointer = pointerRef.current;
    pointer.x = THREE.MathUtils.lerp(pointer.x, mode === "static" ? 0 : pointer.targetX, 0.055);
    pointer.y = THREE.MathUtils.lerp(pointer.y, mode === "static" ? 0 : pointer.targetY, 0.055);

    const active = mode === "static" ? { pitch: 0.02, yaw: -0.34 } : sectionRef.current;
    const targetYaw = active.yaw + pointer.x * 0.17;
    const targetPitch = active.pitch - pointer.y * 0.1;
    const elapsed = state.clock.elapsedTime;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetYaw, 0.055);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetPitch, 0.055);
    groupRef.current.rotation.z = Math.sin(elapsed * 0.22) * 0.012 + pointer.x * 0.012;
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, pointer.x * 0.04, 0.045);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, -pointer.y * 0.025, 0.045);
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, pointer.x * 0.09, 0.035);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, -pointer.y * 0.07, 0.035);
    state.camera.lookAt(0, -0.18, 0);
  });

  return (
    <group ref={groupRef} position={[0.1, 0.08, 0]} scale={0.94}>
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial
          blending={THREE.AdditiveBlending}
          color={WHITE}
          depthWrite={false}
          opacity={0.16}
          transparent
        />
      </lineSegments>
      <points geometry={pointGeometry}>
        <pointsMaterial
          blending={THREE.AdditiveBlending}
          color={WHITE}
          depthWrite={false}
          opacity={0.28}
          size={0.012}
          sizeAttenuation
          transparent
        />
      </points>

      <FeatureCurve color={PURPLE} opacity={0.82} radius={0.007} points={ellipsePoints([-0.28, 0.43, 0.56], 0.21, 0.115, 0.02)} />
      <FeatureCurve color={PURPLE} opacity={0.82} radius={0.007} points={ellipsePoints([0.28, 0.43, 0.56], 0.21, 0.115, 0.02)} />
      <FeatureCurve color={WHITE} opacity={0.7} radius={0.006} points={[[-0.075, 0.43, 0.57], [-0.03, 0.405, 0.6], [0.03, 0.405, 0.6], [0.075, 0.43, 0.57]]} />
      <FeatureCurve color={CYAN} opacity={0.78} radius={0.006} points={[[-0.39, 0.45, 0.59], [-0.28, 0.47, 0.62], [-0.17, 0.45, 0.59]]} />
      <FeatureCurve color={CYAN} opacity={0.78} radius={0.006} points={[[0.17, 0.45, 0.59], [0.28, 0.47, 0.62], [0.39, 0.45, 0.59]]} />
      <FeatureCurve color={WHITE} opacity={0.82} radius={0.008} points={[[0.0, 0.6, 0.55], [0.03, 0.44, 0.71], [0.0, 0.25, 0.83], [-0.06, 0.2, 0.69]]} />
      <FeatureCurve color={WHITE} opacity={0.62} radius={0.005} points={[[0.06, 0.2, 0.69], [0.13, 0.205, 0.62], [0.18, 0.18, 0.58]]} />
      <FeatureCurve color={PINK} opacity={0.62} radius={0.006} points={[[-0.21, 0.04, 0.55], [-0.08, 0.02, 0.61], [0, 0.025, 0.63], [0.08, 0.02, 0.61], [0.21, 0.04, 0.55]]} />
      <FeatureCurve color={PURPLE} opacity={0.66} radius={0.01} points={[[-0.44, 0.08, 0.43], [-0.36, -0.23, 0.56], [-0.14, -0.43, 0.63], [0, -0.48, 0.65], [0.14, -0.43, 0.63], [0.36, -0.23, 0.56], [0.44, 0.08, 0.43]]} />
      <FeatureCurve color={PURPLE} opacity={0.58} radius={0.009} points={[[-0.54, 0.74, 0.34], [-0.32, 0.86, 0.53], [0, 0.9, 0.6], [0.32, 0.86, 0.53], [0.54, 0.74, 0.34]]} />
      <FeatureCurve color={WHITE} opacity={0.52} radius={0.006} points={earPoints(-1)} />
      <FeatureCurve color={WHITE} opacity={0.52} radius={0.006} points={earPoints(1)} />

      <mesh position={[0, 0.24, 0.84]}>
        <sphereGeometry args={[0.028, 18, 18]} />
        <meshBasicMaterial
          blending={THREE.AdditiveBlending}
          color={WHITE}
          depthWrite={false}
          opacity={0.9}
          transparent
        />
      </mesh>
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
      <div className="absolute inset-8 opacity-80 [background-image:radial-gradient(circle,rgba(247,248,255,0.7)_1px,transparent_1.5px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_at_center,black_24%,transparent_70%)]" />
      <div className="absolute inset-16 opacity-55 [background-image:radial-gradient(circle,rgba(159,246,255,0.8)_1px,transparent_1.5px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_18%,transparent_68%)]" />
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
    return <VisualFallback label="Abstract wireframe portrait fallback for environments without WebGL" />;
  }

  return (
    <div
      aria-label="Reactive wireframe bust portrait"
      className="pointer-events-none fixed inset-y-0 right-0 z-0 h-screen w-full opacity-90 [mask-image:linear-gradient(to_left,black_48%,rgba(0,0,0,0.8)_74%,transparent_100%)] md:w-[62vw]"
      role="img"
    >
      <Canvas
        camera={{ position: [0, -0.06, 4.45], fov: 36 }}
        dpr={[1, 1.55]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      >
        <Bust mode={mode} />
      </Canvas>
    </div>
  );
}
