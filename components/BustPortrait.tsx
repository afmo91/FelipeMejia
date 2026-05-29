"use client";

import { useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { AnimatePresence, motion } from "framer-motion";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { PHRASES } from "@/lib/phrases";

// ── Types ─────────────────────────────────────────────────────────
export type BustState = "assembling" | "idle" | "listening" | "thinking" | "speaking" | "active";

type Props = {
  bustState: BustState;
  size?: "large" | "small";
  showPhrases?: boolean;
  onAssembled?: () => void;
};

// ── Constants ──────────────────────────────────────────────────────
const MODEL_URL = "/portrait/felipe-bust.glb";
const PURPLE = new THREE.Color("#8b5cf6");
const CYAN   = new THREE.Color("#22d3ee");
const AMBER  = new THREE.Color("#f59e0b");
const WHITE  = new THREE.Color("#f8fbff");

const STATE_COLORS: Record<BustState, THREE.Color> = {
  assembling: PURPLE,
  idle:       PURPLE,
  listening:  CYAN,
  thinking:   AMBER,
  speaking:   CYAN,
  active:     PURPLE,
};

// ── Geometry helpers ───────────────────────────────────────────────
function buildGeometries(scene: THREE.Group) {
  const meshes: THREE.Mesh[] = [];
  scene.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh && m.geometry) meshes.push(m); });
  const mesh = meshes.find((m) => m.name === "FBHead" || m.geometry.name === "FBHead_mesh") ?? meshes[0];
  if (!mesh) throw new Error("No mesh in GLB");

  const geo = mesh.geometry.clone();
  geo.computeVertexNormals();
  const pos = geo.getAttribute("position") as THREE.BufferAttribute;
  const box = new THREE.Box3().setFromBufferAttribute(pos);
  const center = new THREE.Vector3();
  const size   = new THREE.Vector3();
  box.getCenter(center);
  box.getSize(size);
  const scale = 2.8 / Math.max(size.y, 0.001);
  geo.translate(-center.x, -center.y, -center.z);
  geo.scale(scale, scale, scale);
  geo.computeVertexNormals();
  geo.computeBoundingBox();
  geo.computeBoundingSphere();

  // Edge geometry
  const edges = new THREE.EdgesGeometry(geo, 22);

  // Points geometry with per-vertex colour
  const srcPos  = geo.getAttribute("position") as THREE.BufferAttribute;
  const srcNorm = geo.getAttribute("normal")   as THREE.BufferAttribute | undefined;
  const fbox = geo.boundingBox ?? new THREE.Box3().setFromBufferAttribute(srcPos);
  const fsz  = new THREE.Vector3(); fbox.getSize(fsz);
  const stride   = Math.max(1, Math.ceil(srcPos.count / 20000));
  const nPts     = Math.ceil(srcPos.count / stride);
  const ptPos    = new Float32Array(nPts * 3);
  const ptCol    = new Float32Array(nPts * 3);
  const col      = new THREE.Color();
  let c = 0;
  for (let i = 0; i < srcPos.count; i += stride) {
    const y = srcPos.getY(i); const z = srcPos.getZ(i); const x = srcPos.getX(i);
    const height = (y - fbox.min.y) / Math.max(fsz.y, 0.001);
    const depth  = (z - fbox.min.z) / Math.max(fsz.z, 0.001);
    const cBias  = 1 - Math.min(1, Math.abs(x) / Math.max(fsz.x * 0.48, 0.001));
    const front  = Math.max(0, depth * 0.78 + cBias * 0.22);
    const nx = srcNorm?.getX(i) ?? 0; const ny = srcNorm?.getY(i) ?? 0; const nz = srcNorm?.getZ(i) ?? 1;
    col.copy(PURPLE).lerp(CYAN, Math.min(1, front * 0.82));
    col.lerp(WHITE, Math.min(0.7, depth * 0.44 + height * 0.16));
    col.multiplyScalar(0.6 + front * 0.55);
    ptPos[c*3]=x+nx*0.006; ptPos[c*3+1]=y+ny*0.006; ptPos[c*3+2]=z+nz*0.006;
    ptCol[c*3]=col.r; ptCol[c*3+1]=col.g; ptCol[c*3+2]=col.b;
    c++;
  }
  const ptGeo = new THREE.BufferGeometry();
  ptGeo.setAttribute("position", new THREE.BufferAttribute(ptPos, 3));
  ptGeo.setAttribute("color",    new THREE.BufferAttribute(ptCol, 3));
  ptGeo.computeBoundingSphere();

  return { geo, edges, ptGeo, nPts };
}

// ── Scatter positions for assembly animation ───────────────────────
function buildScatterPositions(ptGeo: THREE.BufferGeometry, nPts: number) {
  const scatter = new Float32Array(nPts * 3);
  const orig    = (ptGeo.getAttribute("position") as THREE.BufferAttribute).array as Float32Array;
  for (let i = 0; i < nPts; i++) {
    scatter[i*3]   = orig[i*3]   + (Math.random() - 0.5) * 6;
    scatter[i*3+1] = orig[i*3+1] + (Math.random() - 0.5) * 5;
    scatter[i*3+2] = orig[i*3+2] + (Math.random() - 0.5) * 3;
  }
  return scatter;
}

// ── 3D Scene ───────────────────────────────────────────────────────
function Scene({ bustState, amplitude, onAssembled }: {
  bustState: BustState;
  amplitude: number;
  onAssembled: () => void;
}) {
  const { scene }   = useGLTF(MODEL_URL);
  const groupRef    = useRef<THREE.Group>(null);
  const ptRef       = useRef<THREE.Points>(null);
  const mouthRef    = useRef<THREE.Mesh>(null);
  const pointerRef  = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const assembleRef = useRef(0);
  const assembledRef= useRef(false);
  const ptWorkRef   = useRef<Float32Array | null>(null);

  const { geo, edges, ptGeo } = useMemo(() => buildGeometries(scene), [scene]);
  const nPts   = useMemo(() => (ptGeo.getAttribute("position") as THREE.BufferAttribute).count, [ptGeo]);
  const scatter= useMemo(() => buildScatterPositions(ptGeo, nPts), [ptGeo, nPts]);
  const origPos= useMemo(() => new Float32Array((ptGeo.getAttribute("position") as THREE.BufferAttribute).array as Float32Array), [ptGeo]);

  // Initialise working buffer to scatter positions
  useEffect(() => {
    ptWorkRef.current = new Float32Array(scatter);
    const attr = ptGeo.getAttribute("position") as THREE.BufferAttribute;
    attr.array = ptWorkRef.current;
    attr.needsUpdate = true;
  }, [scatter, ptGeo]);

  // Cleanup
  useEffect(() => () => { geo.dispose(); edges.dispose(); ptGeo.dispose(); }, [geo, edges, ptGeo]);

  // Pointer tracking
  useEffect(() => {
    const p = pointerRef.current;
    const onMove = (e: PointerEvent) => {
      p.tx = (e.clientX / window.innerWidth  - 0.5) * 2;
      p.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const p    = pointerRef.current;
    const work = ptWorkRef.current;
    const attr = ptGeo.getAttribute("position") as THREE.BufferAttribute;

    // Smooth pointer
    p.x = THREE.MathUtils.lerp(p.x, p.tx, 0.07);
    p.y = THREE.MathUtils.lerp(p.y, p.ty, 0.07);

    // Assembly animation
    if (bustState === "assembling" && !assembledRef.current) {
      assembleRef.current = Math.min(1, assembleRef.current + delta * 0.65);
      const t = easeOutCubic(assembleRef.current);
      if (work) {
        for (let i = 0; i < nPts * 3; i++) {
          work[i] = THREE.MathUtils.lerp(scatter[i], origPos[i], t);
        }
        attr.needsUpdate = true;
      }
      if (assembleRef.current >= 1 && !assembledRef.current) {
        assembledRef.current = true;
        onAssembled();
      }
    }

    // State-driven colour tint on points
    const targetCol = STATE_COLORS[bustState] ?? PURPLE;
    // (colour blending happens via opacity/material, not per-vertex here for perf)

    // Rotation
    const time = performance.now() * 0.001;
    const stateYaw: Record<BustState, number> = {
      assembling: 0,
      idle:       p.x * 0.22,
      listening:  p.x * 0.28 + Math.sin(time * 0.4) * 0.04,
      thinking:   Math.sin(time * 0.3) * 0.12,
      speaking:   p.x * 0.2  + Math.sin(time * 0.6) * 0.03,
      active:     p.x * 0.18,
    };
    const statePitch: Record<BustState, number> = {
      assembling: 0,
      idle:      -p.y * 0.12,
      listening: -p.y * 0.16 - 0.04,
      thinking:  -0.08 + Math.sin(time * 0.25) * 0.04,
      speaking:  -p.y * 0.1,
      active:    -p.y * 0.1,
    };
    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, stateYaw[bustState]  ?? 0, 0.07);
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, statePitch[bustState] ?? 0, 0.07);
    group.rotation.z = Math.sin(time * 0.12) * 0.005;

    // Mouth mesh scale driven by audio amplitude
    if (mouthRef.current) {
      const mouthOpen = amplitude * 0.45;
      mouthRef.current.scale.y = THREE.MathUtils.lerp(
        mouthRef.current.scale.y,
        bustState === "speaking" ? 0.3 + mouthOpen : 0.08,
        0.18
      );
      mouthRef.current.scale.x = THREE.MathUtils.lerp(
        mouthRef.current.scale.x,
        bustState === "speaking" ? 0.8 + mouthOpen * 0.4 : 0.5,
        0.14
      );
      (mouthRef.current.material as THREE.MeshBasicMaterial).opacity = bustState === "speaking"
        ? 0.55 + amplitude * 0.4
        : 0.15;
    }

    void targetCol;
  });

  return (
    <>
      <ambientLight intensity={0.9} />
      <pointLight color="#8b5cf6" intensity={1.5}  position={[1.8, 1.5, 2.5]} />
      <pointLight color="#22d3ee" intensity={0.9}  position={[-1.6, -0.3, 2.8]} />
      {/* Thinking warm light */}
      {bustState === "thinking" && (
        <pointLight color="#f59e0b" intensity={0.7} position={[0, -1, 2]} />
      )}

      <group ref={groupRef} scale={0.86}>
        {/* Depth mask */}
        <mesh geometry={geo} renderOrder={0}>
          <meshBasicMaterial colorWrite={false} depthWrite />
        </mesh>
        {/* Translucent surface */}
        <mesh geometry={geo} renderOrder={2}>
          <meshStandardMaterial
            color="#dfe7ff"
            emissive={bustState === "thinking" ? "#f59e0b" : "#8b5cf6"}
            emissiveIntensity={0.1}
            metalness={0.1}
            roughness={0.35}
            opacity={0.06}
            transparent
          />
        </mesh>
        {/* Wireframe overlay */}
        <mesh geometry={geo} renderOrder={3}>
          <meshBasicMaterial
            blending={THREE.AdditiveBlending}
            color="#f8fbff"
            depthTest depthWrite={false}
            opacity={0.028} transparent wireframe
          />
        </mesh>
        {/* Edge lines */}
        <lineSegments geometry={edges} renderOrder={3}>
          <lineBasicMaterial
            blending={THREE.AdditiveBlending}
            color="#ffffff"
            depthTest depthWrite={false}
            opacity={0.13} transparent
          />
        </lineSegments>
        {/* Point cloud */}
        <points ref={ptRef} geometry={ptGeo} renderOrder={4}>
          <pointsMaterial
            blending={THREE.AdditiveBlending}
            depthTest depthWrite={false}
            opacity={bustState === "active" ? 0.3 : 0.44}
            size={0.007} sizeAttenuation transparent vertexColors
          />
        </points>
        {/* Mouth mesh — animated ellipse */}
        <mesh ref={mouthRef} position={[0, -0.36, 1.01]} rotation={[0, 0, 0]} renderOrder={5}>
          <planeGeometry args={[0.18, 0.06, 1, 1]} />
          <meshBasicMaterial
            blending={THREE.AdditiveBlending}
            color="#22d3ee"
            depthWrite={false}
            opacity={0.15}
            transparent
          />
        </mesh>
      </group>
    </>
  );
}

useGLTF.preload(MODEL_URL);

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

// ── Voice / Audio player ───────────────────────────────────────────
function useVoicePlayer(active: boolean) {
  const audioRef    = useRef<HTMLAudioElement | null>(null);
  const ctxRef      = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataRef     = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [amplitude, setAmplitude] = useState(0);

  useEffect(() => {
    if (!active) return;
    let idx = 0;
    let cancelled = false;

    async function playNext() {
      if (cancelled) return;
      const src = `/audio/phrase-${idx + 1}.mp3`;
      const audio = new Audio(src);
      audio.crossOrigin = "anonymous";
      audioRef.current = audio;

      // Web Audio amplitude analyser
      if (!ctxRef.current) {
        const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        ctxRef.current = ctx;
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64;
        analyserRef.current = analyser;
        dataRef.current = new Uint8Array(analyser.frequencyBinCount) as Uint8Array<ArrayBuffer>;
        const src2 = ctx.createMediaElementSource(audio as unknown as HTMLMediaElement);
        src2.connect(analyser);
        analyser.connect(ctx.destination);
      }

      setPhraseIdx(idx);
      try { await audio.play(); } catch { /* no autoplay permission */ }

      audio.onended = () => {
        if (cancelled) return;
        setTimeout(() => {
          idx = (idx + 1) % PHRASES.length;
          playNext();
        }, 2200);
      };
    }

    // Poll amplitude
    const raf = { id: 0 };
    function pollAmp() {
      raf.id = requestAnimationFrame(pollAmp);
      const analyser = analyserRef.current;
      const data     = dataRef.current;
      if (!analyser || !data) { setAmplitude(0); return; }
      analyser.getByteFrequencyData(data);
      const avg = Array.from(data).slice(0, 8).reduce((a, b) => a + b, 0) / 8 / 255;
      setAmplitude(avg);
    }
    pollAmp();
    playNext();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf.id);
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, [active]);

  return { phraseIdx, amplitude };
}

// ── Phrase display overlay ─────────────────────────────────────────
function PhraseDisplay({ phraseIdx, bustState }: { phraseIdx: number; bustState: BustState }) {
  const phrase = PHRASES[phraseIdx % PHRASES.length];
  const show   = bustState !== "assembling" && bustState !== "active";

  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          key={phraseIdx}
          className="phrase-display"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="phrase-headline">{phrase.headline}</div>
          <motion.div
            className="phrase-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.5 }}
          >
            {phrase.subtitle}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Speech bar (visual speaking indicator) ─────────────────────────
function SpeechBar({ amplitude }: { amplitude: number }) {
  const bars = [0.5, 1, 0.7, 1.2, 0.8, 1, 0.6];
  return (
    <div className="bust-speech-bar" aria-hidden>
      {bars.map((h, i) => (
        <div
          key={i}
          className="bust-speech-bar-bar"
          style={{
            animationDelay: `${i * 0.11}s`,
            opacity: 0.4 + amplitude * 0.6,
            height: `${4 + amplitude * 14 * h}px`,
          }}
        />
      ))}
    </div>
  );
}

// ── Fallback ───────────────────────────────────────────────────────
function Fallback() {
  return (
    <div
      className="absolute inset-0 opacity-60"
      style={{
        backgroundImage: "radial-gradient(circle, rgba(139,92,246,0.7) 1px, transparent 1.5px)",
        backgroundSize: "18px 18px",
        maskImage: "radial-gradient(ellipse at 50% 44%, black 18%, transparent 62%)",
      }}
    />
  );
}

// ── Main export ────────────────────────────────────────────────────
export default function BustPortrait({ bustState, size = "large", showPhrases = true, onAssembled }: Props) {
  const voiceActive = bustState !== "assembling" && bustState !== "active";
  const { phraseIdx, amplitude } = useVoicePlayer(voiceActive && showPhrases);

  const [webGL] = useState(() => {
    if (typeof document === "undefined") return true;
    try {
      const c = document.createElement("canvas");
      return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl")));
    } catch { return false; }
  });

  const containerClass = size === "large"
    ? "pointer-events-none absolute inset-0 z-0"
    : "pointer-events-none absolute inset-0 z-0 opacity-80";

  const glowColor = {
    assembling: "rgba(139,92,246,0.15)",
    idle:       "rgba(139,92,246,0.15)",
    listening:  "rgba(34,211,238,0.18)",
    thinking:   "rgba(251,191,36,0.15)",
    speaking:   "rgba(34,211,238,0.2)",
    active:     "rgba(139,92,246,0.1)",
  }[bustState];

  return (
    <>
      {/* Background glow */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-all duration-700"
        style={{
          background: `radial-gradient(ellipse 60% 70% at 50% 50%, ${glowColor}, transparent)`,
        }}
      />

      {/* 3D canvas */}
      {webGL ? (
        <div
          className={containerClass}
          style={{
            maskImage: "radial-gradient(circle at 50% 50%, black 30%, rgba(0,0,0,0.7) 58%, transparent 85%)",
          }}
        >
          <Suspense fallback={<Fallback />}>
            <Canvas
              camera={{ position: [0, -0.02, 4.9], fov: 34 }}
              dpr={[1, 1.6]}
              gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
            >
              <Scene
                bustState={bustState}
                amplitude={amplitude}
                onAssembled={onAssembled ?? (() => {})}
              />
            </Canvas>
          </Suspense>
        </div>
      ) : (
        <div className={containerClass}>
          <Fallback />
        </div>
      )}

      {/* Phrase display */}
      {showPhrases && size === "large" && (
        <PhraseDisplay phraseIdx={phraseIdx} bustState={bustState} />
      )}

      {/* Speech bar */}
      {bustState === "speaking" && size === "large" && (
        <div className="pointer-events-none absolute bottom-[38%] left-1/2 -translate-x-1/2 z-10">
          <SpeechBar amplitude={amplitude} />
        </div>
      )}
    </>
  );
}
