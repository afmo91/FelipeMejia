"use client";

import { Html, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { ConvTopic } from "@/lib/conversation";

// ── Types ─────────────────────────────────────────────────────────
export type BustState = "assembling" | "idle" | "listening" | "thinking" | "speaking";

type SceneProps = {
  bustState: BustState;
  topic: ConvTopic;
  amplitudeRef: React.RefObject<number>;
  onAssembled: () => void;
};

// ── Constants ──────────────────────────────────────────────────────
const MODEL_URL = "/portrait/felipe-bust.glb";
const PURPLE = new THREE.Color("#8b5cf6");
const CYAN   = new THREE.Color("#22d3ee");
const AMBER  = new THREE.Color("#f59e0b");
const WHITE  = new THREE.Color("#f0f0ff");

function easeOutCubic(t: number) { return 1 - Math.pow(1 - t, 3); }
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

// ── Geometry builder ───────────────────────────────────────────────
function buildGeometry(scene: THREE.Group) {
  const meshes: THREE.Mesh[] = [];
  scene.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh && m.geometry) meshes.push(m); });
  const mesh = meshes.find((m) => m.name === "FBHead" || m.geometry.name === "FBHead_mesh") ?? meshes[0];
  if (!mesh) throw new Error("No mesh");

  const geo = mesh.geometry.clone();
  geo.computeVertexNormals();
  const pos = geo.getAttribute("position") as THREE.BufferAttribute;
  const box = new THREE.Box3().setFromBufferAttribute(pos);
  const center = new THREE.Vector3(); const size = new THREE.Vector3();
  box.getCenter(center); box.getSize(size);
  const scale = 2.8 / Math.max(size.y, 0.001);
  geo.translate(-center.x, -center.y, -center.z);
  geo.scale(scale, scale, scale);
  geo.computeVertexNormals(); geo.computeBoundingBox(); geo.computeBoundingSphere();

  const edges = new THREE.EdgesGeometry(geo, 22);

  // Point cloud with region tags
  const src = geo.getAttribute("position") as THREE.BufferAttribute;
  const nrm = geo.getAttribute("normal") as THREE.BufferAttribute | undefined;
  const fbox = geo.boundingBox ?? new THREE.Box3().setFromBufferAttribute(src);
  const fsz = new THREE.Vector3(); fbox.getSize(fsz);
  const stride  = Math.max(1, Math.ceil(src.count / 18000));
  const nPts    = Math.ceil(src.count / stride);
  const ptPos   = new Float32Array(nPts * 3);
  const ptCol   = new Float32Array(nPts * 3);
  const ptReg   = new Uint8Array(nPts); // 0=body 1=mouth 2=jaw 3=eye 4=brow
  const color   = new THREE.Color();
  let c = 0;

  for (let i = 0; i < src.count; i += stride) {
    const x = src.getX(i); const y = src.getY(i); const z = src.getZ(i);
    const nx = nrm?.getX(i) ?? 0; const ny = nrm?.getY(i) ?? 0; const nz = nrm?.getZ(i) ?? 1;
    const height = (y - fbox.min.y) / Math.max(fsz.y, 0.001);
    const depth  = (z - fbox.min.z) / Math.max(fsz.z, 0.001);
    const cBias  = 1 - Math.min(1, Math.abs(x) / Math.max(fsz.x * 0.48, 0.001));
    const front  = Math.max(0, depth * 0.78 + cBias * 0.22);

    color.copy(PURPLE).lerp(CYAN, Math.min(1, front * 0.82));
    color.lerp(WHITE, Math.min(0.7, depth * 0.44 + height * 0.16));
    color.multiplyScalar(0.6 + front * 0.55);

    ptPos[c*3]   = x + nx * 0.006;
    ptPos[c*3+1] = y + ny * 0.006;
    ptPos[c*3+2] = z + nz * 0.006;
    ptCol[c*3]   = color.r; ptCol[c*3+1] = color.g; ptCol[c*3+2] = color.b;

    // Region tagging (on scaled geometry, head height ≈ 2.8, centered at 0)
    if (y > -0.5 && y < -0.08 && Math.abs(x) < 0.42 && z > 0.15) ptReg[c] = 1; // mouth
    else if (y < -0.35 && Math.abs(x) < 0.5) ptReg[c] = 2; // jaw
    else if (y > 0.25 && y < 0.65 && Math.abs(x) > 0.12 && z > 0.2) ptReg[c] = 3; // eye area
    else if (y > 0.6 && y < 0.9 && Math.abs(x) < 0.4) ptReg[c] = 4; // brow
    else ptReg[c] = 0;
    c++;
  }

  const ptGeo = new THREE.BufferGeometry();
  ptGeo.setAttribute("position", new THREE.BufferAttribute(ptPos.slice(0, c * 3), 3));
  ptGeo.setAttribute("color",    new THREE.BufferAttribute(ptCol.slice(0, c * 3), 3));
  ptGeo.computeBoundingSphere();

  return { geo, edges, ptGeo, ptReg: ptReg.slice(0, c), origPos: ptPos.slice(0, c * 3), nPts: c };
}

// ── Scatter for assembly ───────────────────────────────────────────
function buildScatter(origPos: Float32Array, nPts: number) {
  const s = new Float32Array(nPts * 3);
  for (let i = 0; i < nPts; i++) {
    s[i*3]   = origPos[i*3]   + (Math.random() - 0.5) * 7;
    s[i*3+1] = origPos[i*3+1] + (Math.random() - 0.5) * 6;
    s[i*3+2] = origPos[i*3+2] + (Math.random() - 0.5) * 4;
  }
  return s;
}

// ── Thinking orbit ring ────────────────────────────────────────────
function ThinkingRing({ active }: { active: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const N = 12;
  useFrame(({ clock }) => {
    if (!groupRef.current || !active) return;
    groupRef.current.rotation.y = clock.elapsedTime * 0.8;
    groupRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.4) * 0.18;
  });

  if (!active) return null;
  return (
    <group ref={groupRef}>
      {Array.from({ length: N }, (_, i) => {
        const angle = (i / N) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 1.9, Math.sin(angle * 0.5) * 0.2, Math.sin(angle) * 1.9]}>
            <sphereGeometry args={[0.045, 8, 8]} />
            <meshBasicMaterial color={AMBER} transparent opacity={0.75} />
          </mesh>
        );
      })}
    </group>
  );
}

// ── Ambient background shapes ──────────────────────────────────────
function AmbientShapes({ topic }: { topic: ConvTopic }) {
  const icoRef = useRef<THREE.Mesh>(null);
  const torRef = useRef<THREE.Mesh>(null);
  const octRef = useRef<THREE.Mesh>(null);
  const knotRef = useRef<THREE.Mesh>(null);

  const palette = useMemo(() => {
    if (topic === "ai") return ["#22d3ee", "#8b5cf6", "#ec4899", "#22d3ee"];
    if (topic === "results") return ["#f59e0b", "#22d3ee", "#8b5cf6", "#f59e0b"];
    if (topic === "experience") return ["#8b5cf6", "#ec4899", "#22d3ee", "#8b5cf6"];
    if (topic === "growth") return ["#22d3ee", "#14b8a6", "#8b5cf6", "#22d3ee"];
    return ["#8b5cf6", "#22d3ee", "#ec4899", "#8b5cf6"];
  }, [topic]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (icoRef.current) { icoRef.current.rotation.x = t * 0.14; icoRef.current.rotation.y = t * 0.22; }
    if (torRef.current) { torRef.current.rotation.x = t * 0.18; torRef.current.rotation.z = t * 0.12; }
    if (octRef.current) { octRef.current.rotation.y = t * 0.16; octRef.current.rotation.z = t * 0.1; }
    if (knotRef.current) { knotRef.current.rotation.x = t * 0.12; knotRef.current.rotation.y = t * 0.2; }
  });

  return (
    <>
      {/* Icosahedron — top right — product/structure */}
      <mesh ref={icoRef} position={[2.8, 1.7, -2.8]}>
        <icosahedronGeometry args={[0.95, 1]} />
        <meshBasicMaterial blending={THREE.AdditiveBlending} color={palette[0]} toneMapped={false} transparent opacity={0.3} wireframe />
      </mesh>
      {/* Torus — bottom left — growth cycles */}
      <mesh ref={torRef} position={[-2.7, -1.6, -2.2]}>
        <torusGeometry args={[0.78, 0.19, 8, 32]} />
        <meshBasicMaterial blending={THREE.AdditiveBlending} color={palette[1]} toneMapped={false} transparent opacity={0.25} wireframe />
      </mesh>
      {/* Octahedron — top background — data/AI */}
      <mesh ref={octRef} position={[0.4, 2.4, -4]}>
        <octahedronGeometry args={[0.72, 0]} />
        <meshBasicMaterial blending={THREE.AdditiveBlending} color={palette[2]} toneMapped={false} transparent opacity={0.2} wireframe />
      </mesh>
      <mesh ref={knotRef} position={[2.5, -1.2, -3.1]}>
        <torusKnotGeometry args={[0.42, 0.08, 80, 8]} />
        <meshBasicMaterial blending={THREE.AdditiveBlending} color={palette[3]} toneMapped={false} transparent opacity={0.24} wireframe />
      </mesh>
    </>
  );
}

// ── Topic shapes ──────────────────────────────────────────────────
const METRICS = [
  { v: "+25%",   l: "Conversion", p: [1.18, 1.1, 0.35]   as [number,number,number] },
  { v: "€200K+", l: "Recovered",  p: [-1.2, 0.82, 0.35]  as [number,number,number] },
  { v: "5d→1d",  l: "Activation", p: [1.18, -0.72, 0.35] as [number,number,number] },
  { v: "−30%",   l: "CAC",        p: [-1.18, -0.9, 0.35] as [number,number,number] },
  { v: "€3M+",   l: "Budget",     p: [0, 1.18, 0.35]     as [number,number,number] },
];

function ResultsShapes() {
  return (
    <>
      {METRICS.map(({ v, l, p }) => (
        <Html key={v} position={p} center occlude={false}>
          <div style={{
            background: "rgba(8,8,16,0.88)", border: "1px solid rgba(139,92,246,0.35)",
            padding: "7px 11px", borderRadius: "10px", textAlign: "center",
            backdropFilter: "blur(10px)", pointerEvents: "none", minWidth: "70px",
            boxShadow: "0 0 20px rgba(139,92,246,0.15)",
          }}>
            <div style={{ fontSize: "1.2rem", fontWeight: 800, letterSpacing: "-0.04em", color: "#fff" }}>{v}</div>
            <div style={{ fontSize: "0.55rem", color: "rgba(34,211,238,0.85)", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: "2px" }}>{l}</div>
          </div>
        </Html>
      ))}
    </>
  );
}

// Neural network nodes for AI topic
const NN_NODES = [
  [-2, 0.7, 0.5], [-2, 0, 0.5], [-2, -0.7, 0.5],
  [0, 1, 0.5],  [0, 0.33, 0.5], [0, -0.33, 0.5], [0, -1, 0.5],
  [2, 0.5, 0.5], [2, -0.5, 0.5],
] as [number, number, number][];

const NN_EDGES = [
  [0,3],[0,4],[0,5],[0,6],[1,3],[1,4],[1,5],[1,6],[2,3],[2,4],[2,5],[2,6],
  [3,7],[3,8],[4,7],[4,8],[5,7],[5,8],[6,7],[6,8],
];

function NeuralShapes() {
  const pulseRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!pulseRef.current) return;
    const t = (clock.elapsedTime * 0.7) % 1;
    const edge = NN_EDGES[Math.floor(clock.elapsedTime * 2) % NN_EDGES.length];
    const [a, b] = [NN_NODES[edge[0]], NN_NODES[edge[1]]];
    pulseRef.current.position.set(
      lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)
    );
  });

  const lineGeometry = useMemo(() => {
    const pts: number[] = [];
    for (const [i, j] of NN_EDGES) {
      pts.push(...NN_NODES[i], ...NN_NODES[j]);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pts), 3));
    return g;
  }, []);

  return (
    <group position={[1.9, 0, -1.1]} scale={0.72}>
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color="#8b5cf6" transparent opacity={0.3} />
      </lineSegments>
      {NN_NODES.map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[0.07, 10, 10]} />
          <meshBasicMaterial color={i < 3 ? "#8b5cf6" : i < 7 ? "#22d3ee" : "#ec4899"} transparent opacity={0.8} />
        </mesh>
      ))}
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.09, 8, 8]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.9} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

function GrowthShapes() {
  const groupRef = useRef<THREE.Group>(null);
  const RINGS = [1.3, 1.05, 0.8, 0.55, 0.3, 0.12];
  useFrame(({ clock }) => {
    if (groupRef.current) groupRef.current.rotation.y = clock.elapsedTime * 0.15;
  });
  return (
    <group ref={groupRef} position={[2, -0.1, -0.9]} scale={0.82}>
      {RINGS.map((r, i) => (
        <mesh key={i} position={[0, 1.2 - i * 0.52, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[r, 0.025, 8, 36]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.5 - i * 0.06} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
    </group>
  );
}

function ProductShapes() {
  const tetraRef = useRef<THREE.Mesh>(null);
  const boxRef = useRef<THREE.Mesh>(null);
  const octRef = useRef<THREE.Mesh>(null);
  const dodecaRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (tetraRef.current) {
      tetraRef.current.rotation.x = t * 0.22;
      tetraRef.current.rotation.y = t * 0.18;
    }
    if (boxRef.current) {
      boxRef.current.rotation.y = t * 0.2;
      boxRef.current.rotation.z = t * 0.14;
    }
    if (octRef.current) {
      octRef.current.rotation.x = t * 0.16;
      octRef.current.rotation.z = t * 0.22;
    }
    if (dodecaRef.current) {
      dodecaRef.current.rotation.y = t * 0.24;
      dodecaRef.current.rotation.x = t * 0.12;
    }
  });

  return (
    <>
      <mesh ref={tetraRef} position={[-2, 1.3, 0.8]}>
        <tetrahedronGeometry args={[0.5, 0]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.55} wireframe />
      </mesh>
      <mesh ref={boxRef} position={[2, 1.2, 0.8]}>
        <boxGeometry args={[0.75, 0.75, 0.75]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.55} wireframe />
      </mesh>
      <mesh ref={octRef} position={[-2, -0.9, 0.8]}>
        <octahedronGeometry args={[0.52, 0]} />
        <meshBasicMaterial color="#ec4899" transparent opacity={0.55} wireframe />
      </mesh>
      <mesh ref={dodecaRef} position={[2, -1, 0.8]}>
        <dodecahedronGeometry args={[0.44, 0]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.55} wireframe />
      </mesh>
    </>
  );
}

const EXP_NODES = [
  { yr: "2013", p: [-2.8, 0, 0.5] as [number,number,number], c: "#8b5cf6" },
  { yr: "2016", p: [-1.4, 0.4, 0.5] as [number,number,number], c: "#8b5cf6" },
  { yr: "2019", p: [0, 0, 0.5] as [number,number,number], c: "#22d3ee" },
  { yr: "2023", p: [1.4, 0.4, 0.5] as [number,number,number], c: "#22d3ee" },
  { yr: "Now",  p: [2.8, 0.9, 0.5] as [number,number,number], c: "#ec4899" },
];

function ExperienceShapes() {
  const lineGeo = useMemo(() => {
    const pts: number[] = [];
    for (let i = 0; i < EXP_NODES.length - 1; i++) {
      pts.push(...EXP_NODES[i].p, ...EXP_NODES[i + 1].p);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pts), 3));
    return g;
  }, []);

  return (
    <group position={[0, -1.35, -1]} scale={0.8}>
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial color="#8b5cf6" transparent opacity={0.3} />
      </lineSegments>
      {EXP_NODES.map(({ yr, p, c }) => (
        <group key={yr} position={p}>
          <mesh>
            <sphereGeometry args={[0.09, 10, 10]} />
            <meshBasicMaterial color={c} transparent opacity={0.85} />
          </mesh>
          <Html center occlude={false} position={[0, 0.22, 0]}>
            <div style={{ color: "rgba(240,240,248,0.7)", fontSize: "0.55rem", letterSpacing: "0.1em", pointerEvents: "none", fontFamily: "monospace", textAlign: "center" }}>{yr}</div>
          </Html>
        </group>
      ))}
    </group>
  );
}

function TopicShapes({ topic }: { topic: ConvTopic }) {
  if (topic === "results")    return <ResultsShapes />;
  if (topic === "ai")         return <NeuralShapes />;
  if (topic === "growth")     return <GrowthShapes />;
  if (topic === "product")    return <ProductShapes />;
  if (topic === "experience") return <ExperienceShapes />;
  return null;
}

// ── Main bust mesh ────────────────────────────────────────────────
function AnimatedBust({ bustState, amplitudeRef, onAssembled }: {
  bustState: BustState;
  amplitudeRef: React.RefObject<number>;
  onAssembled: () => void;
}) {
  const { scene } = useGLTF(MODEL_URL);
  const groupRef  = useRef<THREE.Group>(null);
  const ptRef     = useRef<THREE.Points>(null);
  const shellMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const mouthGlowRef = useRef<THREE.Mesh>(null);
  const ptrRef    = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const workRef   = useRef<Float32Array | null>(null);
  const assembleP = useRef(0);
  const assembled = useRef(false);

  const { geo, edges, ptGeo, ptReg, origPos, nPts } = useMemo(() => buildGeometry(scene), [scene]);
  const scatter = useMemo(() => buildScatter(origPos, nPts), [origPos, nPts]);

  // Init working buffer to scatter
  useEffect(() => {
    workRef.current = new Float32Array(scatter);
    const attr = ptGeo.getAttribute("position") as THREE.BufferAttribute;
    (attr as THREE.BufferAttribute & { array: Float32Array }).array = workRef.current;
    attr.needsUpdate = true;
  }, [scatter, ptGeo]);

  useEffect(() => () => { geo.dispose(); edges.dispose(); ptGeo.dispose(); }, [geo, edges, ptGeo]);

  useEffect(() => {
    const p = ptrRef.current;
    const onMove = (e: PointerEvent) => {
      p.tx = (e.clientX / window.innerWidth  - 0.5) * 2;
      p.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const p   = ptrRef.current;
    const work = workRef.current;
    const attr = ptGeo.getAttribute("position") as THREE.BufferAttribute;
    const amp  = amplitudeRef.current ?? 0;

    // Smooth pointer
    p.x = THREE.MathUtils.lerp(p.x, p.tx, 0.07);
    p.y = THREE.MathUtils.lerp(p.y, p.ty, 0.07);

    // ── Assembly animation ────────────────────────────────────────
    if (!assembled.current) {
      assembleP.current = Math.min(1, assembleP.current + delta * 0.65);
      const t = easeOutCubic(assembleP.current);
      if (work) {
        for (let i = 0; i < nPts * 3; i++) {
          work[i] = lerp(scatter[i], origPos[i], t);
        }
        attr.needsUpdate = true;
      }
      if (assembleP.current >= 1) {
        assembled.current = true;
        onAssembled();
      }
    } else if (work) {
      // ── Face region animation (applied after assembly) ─────────
      const mouthOpen = amp * 0.13; // jaw drop amount
      const t = state.clock.elapsedTime;
      const breathY = Math.sin(t * 0.5) * 0.006;

      for (let i = 0; i < nPts; i++) {
        const reg = ptReg[i];
        const oy = origPos[i * 3 + 1];
        const ox = origPos[i * 3];
        const oz = origPos[i * 3 + 2];

        const dx = 0;
        let dy = breathY;
        let dz = 0;

        if (reg === 1) {
          // Mouth vertices — open downward with amplitude
          dy += -mouthOpen * (1 - Math.abs(ox) / 0.4); // centre of mouth opens more
          dz += mouthOpen * 0.04; // slight forward push
        } else if (reg === 2) {
          // Jaw — drops with speech
          dy += -amp * 0.06;
        } else if (reg === 3 && bustState === "thinking") {
          // Eye area — subtle brightening (move slightly forward)
          dz += Math.sin(t * 3 + i) * 0.006;
        } else if (reg === 3 && bustState === "listening") {
          dz += 0.012 + Math.sin(t * 2 + i) * 0.003;
        } else if (reg === 4 && bustState === "thinking") {
          // Brow — raises slightly
          dy += 0.018 + Math.sin(t * 2) * 0.005;
        }

        work[i * 3]     = ox + dx;
        work[i * 3 + 1] = oy + dy;
        work[i * 3 + 2] = oz + dz;
      }
      attr.needsUpdate = true;
    }

    // ── Group rotation & position ─────────────────────────────────
    const isThinking = bustState === "thinking";
    const isListening = bustState === "listening";
    const targetZ   = isThinking ? -0.26 : isListening ? 0.03 : 0;
    const targetX   = isThinking ? 0.16 : isListening ? -0.08 : -p.y * 0.11;
    const targetY   = isThinking ? -0.15 + Math.sin(state.clock.elapsedTime * 0.3) * 0.05 : p.x * 0.2;
    const targetPosY = Math.sin(state.clock.elapsedTime * 0.5) * 0.022; // breathing
    const targetPosZ = isListening ? 0.1 : 0;

    group.rotation.z = THREE.MathUtils.lerp(group.rotation.z, targetZ, 0.05);
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, targetX, 0.055);
    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, targetY, 0.055);
    group.position.y = THREE.MathUtils.lerp(group.position.y, targetPosY, 0.04);
    group.position.z = THREE.MathUtils.lerp(group.position.z, targetPosZ, 0.05);

    if (shellMatRef.current) {
      const targetIntensity =
        bustState === "speaking" ? 0.08 + amp * 0.55 :
        bustState === "thinking" ? 0.2 :
        bustState === "listening" ? 0.16 : 0.1;
      shellMatRef.current.emissiveIntensity = THREE.MathUtils.lerp(shellMatRef.current.emissiveIntensity, targetIntensity, 0.12);
    }

    if (mouthGlowRef.current) {
      const material = mouthGlowRef.current.material as THREE.MeshBasicMaterial;
      const active = bustState === "speaking";
      material.opacity = THREE.MathUtils.lerp(material.opacity, active ? Math.min(0.1, amp * 0.18) : 0, 0.18);
      mouthGlowRef.current.scale.set(1 + amp * 0.45, 0.18 + amp * 0.18, 1);
    }

    // ── Camera subtle drift ───────────────────────────────────────
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, p.x * 0.06, 0.03);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, -p.y * 0.05, 0.03);
    state.camera.lookAt(0, -0.1, 0);
  });

  const emissiveColor =
    bustState === "thinking" ? "#f59e0b" :
    bustState === "speaking" || bustState === "listening" ? "#22d3ee" : "#8b5cf6";
  const ptOpacity = bustState === "speaking" ? 0.56 : bustState === "listening" ? 0.5 : 0.44;

  return (
    <group ref={groupRef} scale={0.86}>
      <mesh geometry={geo} renderOrder={0}>
        <meshBasicMaterial colorWrite={false} depthWrite />
      </mesh>
      <mesh geometry={geo} renderOrder={2}>
        <meshStandardMaterial ref={shellMatRef} color="#dfe7ff" emissive={emissiveColor} emissiveIntensity={0.1}
          metalness={0.1} roughness={0.35} opacity={0.06} transparent />
      </mesh>
      <mesh ref={mouthGlowRef} position={[0, -0.14, 0.92]} renderOrder={5}>
        <circleGeometry args={[0.08, 24]} />
        <meshBasicMaterial blending={THREE.AdditiveBlending} color="#22d3ee" depthWrite={false} opacity={0} side={THREE.DoubleSide} toneMapped={false} transparent />
      </mesh>
      <mesh geometry={geo} renderOrder={3}>
        <meshBasicMaterial blending={THREE.AdditiveBlending} color="#f8fbff"
          depthTest depthWrite={false} opacity={0.028} transparent wireframe />
      </mesh>
      <lineSegments geometry={edges} renderOrder={3}>
        <lineBasicMaterial blending={THREE.AdditiveBlending} color="#ffffff"
          depthTest depthWrite={false} opacity={0.13} transparent />
      </lineSegments>
      <points ref={ptRef} geometry={ptGeo} renderOrder={4}>
        <pointsMaterial blending={THREE.AdditiveBlending} depthTest depthWrite={false}
          opacity={ptOpacity} size={0.007} sizeAttenuation transparent vertexColors />
      </points>
    </group>
  );
}

useGLTF.preload(MODEL_URL);

// ── Lights ────────────────────────────────────────────────────────
function Lights({ bustState }: { bustState: BustState }) {
  return (
    <>
      <ambientLight intensity={0.85} />
      <pointLight color="#8b5cf6" intensity={1.5} position={[1.8, 1.5, 2.5]} />
      <pointLight color="#22d3ee" intensity={0.9} position={[-1.6, -0.3, 2.8]} />
      {bustState === "thinking" && (
        <pointLight color="#f59e0b" intensity={0.8} position={[0.5, -0.5, 2]} />
      )}
      {bustState === "speaking" && (
        <pointLight color="#22d3ee" intensity={0.4} position={[0, -1, 2.5]} />
      )}
    </>
  );
}

// ── Main export ───────────────────────────────────────────────────
export default function BustScene({ bustState, topic, amplitudeRef, onAssembled }: SceneProps) {
  const [webGL] = [
    typeof document === "undefined" ? true : (() => {
      try {
        const c = document.createElement("canvas");
        return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl")));
      } catch { return false; }
    })()
  ];

  const glowColor = {
    assembling: "rgba(139,92,246,0.12)",
    idle:       "rgba(139,92,246,0.14)",
    listening:  "rgba(34,211,238,0.16)",
    thinking:   "rgba(251,191,36,0.14)",
    speaking:   "rgba(34,211,238,0.18)",
  }[bustState] ?? "rgba(139,92,246,0.12)";

  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      {/* Background radial glow — reacts to state */}
      <div className="absolute inset-0 transition-all duration-700"
        style={{ background: `radial-gradient(ellipse 70% 80% at 50% 46%, ${glowColor}, transparent)` }} />

      {webGL ? (
        <div className="absolute inset-0"
          style={{ maskImage: "radial-gradient(circle at 50% 48%, black 28%, rgba(0,0,0,0.7) 60%, transparent 88%)" }}>
          <Suspense fallback={null}>
            <Canvas camera={{ position: [0, -0.02, 5.2], fov: 34 }}
              dpr={[1, 1.7]}
              gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}>
              <Lights bustState={bustState} />
              <AmbientShapes topic={topic} />
              <TopicShapes topic={topic} />
              <ThinkingRing active={bustState === "thinking"} />
              <AnimatedBust bustState={bustState} amplitudeRef={amplitudeRef} onAssembled={onAssembled} />
            </Canvas>
          </Suspense>
        </div>
      ) : (
        <div className="absolute inset-0 opacity-40"
          style={{ backgroundImage: "radial-gradient(circle, rgba(139,92,246,0.7) 1px, transparent 1.5px)", backgroundSize: "18px 18px" }} />
      )}
    </div>
  );
}
