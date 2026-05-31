"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  SCRIPTED_AUDIO_FILES,
  STEPS,
  detectTopic,
  isAudioOptIn,
  isAudioOptOut,
  nextStep,
  type ConvState,
  type ConvTopic,
  type Message,
  type ScriptedStep,
} from "@/lib/conversation";
import type { BustState } from "./BustScene";

let msgCounter = 0;
function uid() {
  msgCounter += 1;
  return `msg-${msgCounter}`;
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

type Playback = {
  done: Promise<void>;
};

function estimateDuration(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(900, (words / 2.9) * 1000);
}

function useVoice() {
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const amplitudeRef = useRef(0);
  const rafRef = useRef(0);

  const ensureContext = useCallback(() => {
    if (!ctxRef.current) {
      const Ctx =
        window.AudioContext ||
        (window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) {
        throw new Error("AudioContext is not available.");
      }
      const context = new Ctx();
      const analyser = context.createAnalyser();
      analyser.fftSize = 64;
      analyser.connect(context.destination);
      ctxRef.current = context;
      analyserRef.current = analyser;
    }

    return ctxRef.current;
  }, []);

  const stopAudio = useCallback(() => {
    try {
      sourceRef.current?.stop();
    } catch {
      // Already stopped.
    }
    sourceRef.current = null;
    cancelAnimationFrame(rafRef.current);
    amplitudeRef.current = 0;
  }, []);

  const unlockAudio = useCallback(() => {
    try {
      const context = ensureContext();
      if (context.state === "suspended") {
        void context.resume();
      }
    } catch {
      // Browser denied audio until a later gesture.
    }
  }, [ensureContext]);

  const playBuffer = useCallback(
    async (buffer: ArrayBuffer): Promise<Playback | null> => {
      let context: AudioContext;
      try {
        context = ensureContext();
        if (context.state === "suspended") {
          await context.resume();
        }
      } catch {
        return null;
      }

      stopAudio();

      try {
        const audioBuffer = await context.decodeAudioData(buffer.slice(0));
        const source = context.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(analyserRef.current!);
        sourceRef.current = source;

        const data = new Uint8Array(analyserRef.current!.frequencyBinCount);
        const poll = () => {
          if (!sourceRef.current) {
            amplitudeRef.current = 0;
            return;
          }
          analyserRef.current?.getByteFrequencyData(data);
          amplitudeRef.current =
            Array.from(data)
              .slice(0, 12)
              .reduce((sum, value) => sum + value, 0) /
            12 /
            255;
          rafRef.current = requestAnimationFrame(poll);
        };

        const done = new Promise<void>((resolve) => {
          source.onended = () => {
            if (sourceRef.current === source) {
              sourceRef.current = null;
            }
            amplitudeRef.current = 0;
            resolve();
          };
        });

        source.start();
        poll();
        return { done };
      } catch {
        amplitudeRef.current = 0;
        return null;
      }
    },
    [ensureContext, stopAudio],
  );

  const playUrl = useCallback(
    async (src: string) => {
      try {
        const response = await fetch(src);
        if (!response.ok) return null;
        return playBuffer(await response.arrayBuffer());
      } catch {
        return null;
      }
    },
    [playBuffer],
  );

  const playTts = useCallback(
    async (text: string) => {
      try {
        const response = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
        if (!response.ok) return null;
        return playBuffer(await response.arrayBuffer());
      } catch {
        return null;
      }
    },
    [playBuffer],
  );

  useEffect(() => stopAudio, [stopAudio]);

  return { amplitudeRef, playTts, playUrl, stopAudio, unlockAudio };
}

export type ConvHook = {
  messages: Message[];
  suggestions: string[];
  bustState: BustState;
  topic: ConvTopic;
  isLoading: boolean;
  audioEnabled: boolean;
  amplitudeRef: React.RefObject<number>;
  handleAssembled: () => void;
  sendMessage: (text: string) => void;
  toggleAudio: () => void;
};

export function useConversation(): ConvHook {
  const [convState, setConvState] = useState<ConvState>("welcome");
  const [messages, setMessages] = useState<Message[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [bustState, setBustState] = useState<BustState>("assembling");
  const [topic, setTopic] = useState<ConvTopic>("neutral");
  const [isLoading, setLoading] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);

  const audioEnabledRef = useRef(false);
  const busyRef = useRef(false);
  const startedRef = useRef(false);
  const playedClipsRef = useRef(new Set<string>());
  const historyRef = useRef<{ role: "user" | "assistant"; content: string }[]>([]);

  const { amplitudeRef, playTts, playUrl, stopAudio, unlockAudio } = useVoice();

  useEffect(() => {
    audioEnabledRef.current = audioEnabled;
  }, [audioEnabled]);

  useEffect(() => {
    SCRIPTED_AUDIO_FILES.forEach((src) => {
      const clip = new Audio(src);
      clip.preload = "auto";
    });
  }, []);

  const setAudio = useCallback(
    (enabled: boolean) => {
      audioEnabledRef.current = enabled;
      setAudioEnabled(enabled);
      if (enabled) {
        unlockAudio();
      } else {
        stopAudio();
      }
    },
    [stopAudio, unlockAudio],
  );

  const typewrite = useCallback(async (msgId: string, text: string) => {
    const total = text.length;
    const interval = Math.max(12, Math.min(42, estimateDuration(text) / Math.max(total, 1)));

    for (let index = 1; index <= total; index += 1) {
      setMessages((prev) => prev.map((msg) => (msg.id === msgId ? { ...msg, text: text.slice(0, index) } : msg)));
      await sleep(interval);
    }
  }, []);

  const deliverFelipe = useCallback(
    async (
      payload: Pick<ScriptedStep, "text" | "topic" | "suggestedReplies" | "voiceFile" | "action">,
      options: { dynamicTts?: boolean; forceSilent?: boolean } = {},
    ) => {
      const replies = payload.suggestedReplies.slice(0, 3);
      const msgId = uid();
      const message: Message = {
        id: msgId,
        role: "felipe",
        text: "",
        topic: payload.topic,
        voiceFile: payload.voiceFile,
        suggestedReplies: [],
        action: payload.action,
      };

      setTopic(payload.topic);
      setBustState("speaking");
      setSuggestions([]);
      setMessages((prev) => [...prev, message]);

      const shouldPlay = audioEnabledRef.current && !options.forceSilent;
      const playbackPromise = (async (): Promise<void> => {
        if (!shouldPlay) return;

        let playback: Playback | null = null;
        if (payload.voiceFile && !playedClipsRef.current.has(payload.voiceFile)) {
          playback = await playUrl(payload.voiceFile);
          if (playback) playedClipsRef.current.add(payload.voiceFile);
        } else if (!payload.voiceFile && options.dynamicTts) {
          playback = await playTts(payload.text);
        }

        await playback?.done;
      })();

      await Promise.all([typewrite(msgId, payload.text), playbackPromise]);

      setMessages((prev) => prev.map((msg) => (msg.id === msgId ? { ...msg, suggestedReplies: replies } : msg)));
      setSuggestions(replies);
      historyRef.current.push({ role: "assistant", content: payload.text });
      setBustState("listening");
    },
    [playTts, playUrl, typewrite],
  );

  const deliverStep = useCallback(
    async (state: ConvState, options?: { forceSilent?: boolean }) => {
      const step = STEPS[state];
      if (!step.text) return;
      setConvState(state);
      await deliverFelipe(step, options);
    },
    [deliverFelipe],
  );

  const handleAssembled = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    setBustState("idle");
    void (async () => {
      await sleep(450);
      await deliverStep("welcome", { forceSilent: true });
    })();
  }, [deliverStep]);

  const toggleAudio = useCallback(() => {
    setAudio(!audioEnabledRef.current);
  }, [setAudio]);

  const sendMessage = useCallback(
    (text: string) => {
      const input = text.trim();
      if (!input || busyRef.current) return;

      busyRef.current = true;

      if (isAudioOptIn(input)) {
        setAudio(true);
      } else if (isAudioOptOut(input)) {
        setAudio(false);
      }

      const userMsg: Message = { id: uid(), role: "user", text: input };
      setMessages((prev) => [...prev, userMsg]);
      historyRef.current.push({ role: "user", content: input });
      setSuggestions([]);
      setLoading(true);
      setBustState("thinking");

      void (async () => {
        const target = nextStep(input, convState);

        try {
          if (target === "freeform") {
            await sleep(650);
            const response = await fetch("/api/chat", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ message: input, history: historyRef.current.slice(-6) }),
            });
            const data = (await response.json().catch(() => ({}))) as { reply?: string; topic?: ConvTopic };
            const reply = data.reply ?? "Good question — tell me more about the context and I'll give you the honest version.";
            const nextTopic = data.topic ?? detectTopic(input);
            setConvState("freeform");
            setLoading(false);
            await deliverFelipe(
              {
                text: reply,
                topic: nextTopic,
                suggestedReplies: STEPS.freeform.suggestedReplies,
              },
              { dynamicTts: true },
            );
          } else {
            await sleep(target === "free" ? 300 : 520);
            setLoading(false);
            await deliverStep(target, { forceSilent: target === "free" });
          }
        } finally {
          setLoading(false);
          busyRef.current = false;
        }
      })();
    },
    [convState, deliverFelipe, deliverStep, setAudio],
  );

  return {
    messages,
    suggestions,
    bustState,
    topic,
    isLoading,
    audioEnabled,
    amplitudeRef,
    handleAssembled,
    sendMessage,
    toggleAudio,
  };
}
