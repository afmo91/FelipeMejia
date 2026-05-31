"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  STEPS, detectTopic, routeUserInput,
  type ConvState, type ConvTopic, type Message,
} from "@/lib/conversation";
import type { BustState } from "./BustScene";

let msgCounter = 0;
function uid() { return `msg-${++msgCounter}`; }
function sleep(ms: number) { return new Promise<void>((r) => setTimeout(r, ms)); }

// ── TTS hook ────────────────────────────────────────────────────────
function useTTS() {
  const ctxRef      = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef   = useRef<AudioBufferSourceNode | null>(null);
  const amplitudeRef = useRef(0);
  const rafRef       = useRef(0);

  function stopAudio() {
    try { sourceRef.current?.stop(); } catch {}
    sourceRef.current = null;
    cancelAnimationFrame(rafRef.current);
    amplitudeRef.current = 0;
  }

  async function speak(text: string): Promise<void> {
    stopAudio();

    let res: Response;
    try {
      res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
    } catch { return; }

    if (!res.ok) return;

    const buffer = await res.arrayBuffer();

    // Init AudioContext on first use (must be inside user-gesture chain)
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
      const analyser = ctxRef.current.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;
      analyser.connect(ctxRef.current.destination);
    }
    if (ctxRef.current.state === "suspended") await ctxRef.current.resume();

    const audioBuffer = await ctxRef.current.decodeAudioData(buffer);
    const source = ctxRef.current.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(analyserRef.current!);
    sourceRef.current = source;

    // Poll amplitude
    const data = new Uint8Array(analyserRef.current!.frequencyBinCount);
    function poll() {
      analyserRef.current?.getByteFrequencyData(data);
      amplitudeRef.current = Array.from(data).slice(0, 10).reduce((a, b) => a + b, 0) / 10 / 255;
      if (sourceRef.current) rafRef.current = requestAnimationFrame(poll);
      else amplitudeRef.current = 0;
    }
    poll();

    return new Promise<void>((resolve) => {
      source.onended = () => {
        amplitudeRef.current = 0;
        sourceRef.current = null;
        resolve();
      };
      source.start();
    });
  }

  return { amplitudeRef, speak, stopAudio };
}

// ── Main hook ───────────────────────────────────────────────────────
export type ConvHook = {
  messages: Message[];
  suggestions: string[];
  bustState: BustState;
  topic: ConvTopic;
  isLoading: boolean;
  audioEnabled: boolean | null;
  amplitudeRef: React.RefObject<number>;
  handleAssembled: () => void;
  sendMessage: (text: string) => void;
};

export function useConversation(): ConvHook {
  const [convState, setConvState] = useState<ConvState>("assembling");
  const [messages,  setMessages]  = useState<Message[]>([]);
  const [suggestions, setSugg]    = useState<string[]>([]);
  const [bustState, setBust]      = useState<BustState>("assembling");
  const [topic,     setTopic]     = useState<ConvTopic>("neutral");
  const [isLoading, setLoading]   = useState(false);
  const [audioEnabled, setAudio]  = useState<boolean | null>(null);

  const { amplitudeRef, speak, stopAudio } = useTTS();
  const historyRef = useRef<{ role: "user" | "assistant"; content: string }[]>([]);
  const busyRef    = useRef(false);

  // ── Typewriter ─────────────────────────────────────────────────────
  async function typewrite(msgId: string, text: string, durationMs = 0) {
    const totalChars = text.length;
    // If audio duration known, sync speed; else default 32ms/char
    const interval = durationMs > 0
      ? Math.max(12, Math.min(50, durationMs / totalChars))
      : 32;

    for (let i = 1; i <= totalChars; i++) {
      setMessages((prev) => prev.map((m) => m.id === msgId ? { ...m, text: text.slice(0, i) } : m));
      await sleep(interval);
    }
  }

  // ── Deliver a Felipe message ───────────────────────────────────────
  const deliverFelipe = useCallback(async (
    text: string,
    newTopic: ConvTopic,
    action?: Message["action"],
  ) => {
    setBust("speaking");
    setTopic(newTopic);

    const msgId = uid();
    const msg: Message = { id: msgId, role: "felipe", text: "", topic: newTopic, action };
    setMessages((prev) => [...prev, msg]);

    // Estimate speaking duration: ~2.8 words/sec
    const wordCount = text.trim().split(/\s+/).length;
    const estDurationMs = (wordCount / 2.8) * 1000;

    if (audioEnabled) {
      // Speak + typewrite in parallel
      const [_] = await Promise.all([
        speak(text),
        typewrite(msgId, text, estDurationMs),
      ]);
      void _;
    } else {
      await typewrite(msgId, text);
    }

    setBust("idle");
  }, [audioEnabled, speak]);

  // ── Deliver a scripted step ────────────────────────────────────────
  const deliverStep = useCallback(async (state: ConvState) => {
    const step = STEPS[state];
    if (!step?.text) return;
    setConvState(state);
    historyRef.current.push({ role: "assistant", content: step.text });
    await deliverFelipe(step.text, step.topic, step.action);
    setSugg(step.suggestions);
  }, [deliverFelipe]);

  // ── Assembly complete → audio gate ────────────────────────────────
  const handleAssembled = useCallback(() => {
    setBust("idle");
    setTimeout(() => { void deliverStep("audio_gate"); }, 700);
  }, [deliverStep]);

  // ── Handle user message ───────────────────────────────────────────
  const sendMessage = useCallback((text: string) => {
    if (busyRef.current) return;
    busyRef.current = true;

    // Handle audio gate
    if (convState === "audio_gate") {
      const wantsAudio = text.includes("🔊") || /yes|talk|audio|sound/i.test(text);
      setAudio(wantsAudio);
      if (!wantsAudio) stopAudio();
    }

    // Add user message
    const userMsg: Message = { id: uid(), role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    historyRef.current.push({ role: "user", content: text });
    setSugg([]);
    setLoading(true);
    setBust("thinking");

    void (async () => {
      await sleep(2400); // deliberate thinking pause

      const nextState = routeUserInput(text, convState);

      try {
        if (nextState === "freeform") {
          // LLM free-form response
          const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text, history: historyRef.current.slice(-6) }),
          });
          const data = (await res.json()) as { reply?: string; topic?: ConvTopic };
          const reply = data.reply ?? "Tell me more — what's the specific challenge?";
          const newTopic = data.topic ?? detectTopic(text);
          historyRef.current.push({ role: "assistant", content: reply });
          await deliverFelipe(reply, newTopic);
          // Keep previous suggestions or reset
          setSugg(STEPS[convState]?.suggestions ?? []);
        } else {
          await deliverStep(nextState);
        }
      } finally {
        setLoading(false);
        busyRef.current = false;
      }
    })();
  }, [convState, deliverStep, deliverFelipe, stopAudio]);

  return {
    messages, suggestions, bustState, topic, isLoading,
    audioEnabled, amplitudeRef, handleAssembled, sendMessage,
  };
}
