"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Message } from "@/lib/conversation";

const LINKEDIN_URL = "https://www.linkedin.com/in/felipemejiaosorio/";
const GITHUB_URL = "https://github.com/afmo91";
const EMAIL = "felipe.mejia@spotz.pro";

type Props = {
  messages: Message[];
  suggestions: string[];
  onSend: (text: string) => void;
  onToggleAudio: () => void;
  isLoading: boolean;
  audioEnabled: boolean;
};

function SendIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="15" viewBox="0 0 16 16" width="15">
      <path d="M2 8h11M8.5 3.5 13 8l-4.5 4.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function VolumeIcon({ muted }: { muted: boolean }) {
  if (muted) {
    return (
      <svg aria-hidden="true" fill="none" height="17" viewBox="0 0 18 18" width="17">
        <path d="M3 7v4h3l4 3V4L6 7H3Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />
        <path d="m13.3 7 2.4 2.4M15.7 7l-2.4 2.4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" fill="none" height="17" viewBox="0 0 18 18" width="17">
      <path d="M3 7v4h3l4 3V4L6 7H3Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />
      <path d="M12.5 6.2a4 4 0 0 1 0 5.6M14.5 4.5a6.6 6.6 0 0 1 0 9" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}

function Bubble({ msg }: { msg: Message }) {
  const isFelipe = msg.role === "felipe";

  return (
    <motion.div
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex flex-col ${isFelipe ? "items-start" : "items-end"}`}
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      transition={{ damping: 30, stiffness: 340, type: "spring" }}
    >
      {isFelipe ? (
        <div className="mb-1.5 flex items-center gap-2">
          <span className="h-5 w-5 rounded-full bg-[linear-gradient(135deg,#8b5cf6,#22d3ee)] shadow-[0_0_12px_rgba(34,211,238,0.3)]" />
          <span className="font-mono text-[0.62rem] uppercase text-cyan-200/60">Felipe</span>
        </div>
      ) : null}

      <div
        className={`max-w-[88%] border px-3.5 py-2.5 shadow-[0_12px_28px_rgba(0,0,0,0.2)] backdrop-blur-xl ${
          isFelipe
            ? "rounded-[5px_16px_16px_16px] border-white/10 bg-white/[0.055] text-slate-100/90"
            : "rounded-[16px_5px_16px_16px] border-cyan-300/20 bg-[linear-gradient(135deg,rgba(139,92,246,0.26),rgba(34,211,238,0.16))] text-white"
        }`}
      >
        <p className="m-0 whitespace-pre-wrap break-words text-[0.92rem] leading-6">{msg.text || "\u00a0"}</p>

        {msg.action === "show_cv" ? (
          <div className="mt-3 flex flex-wrap gap-3 border-t border-white/10 pt-3 text-sm">
            <Link className="text-cyan-200 transition hover:text-white" href="/cv">
              Open CV
            </Link>
            <a className="text-purple-200 transition hover:text-white" href={`mailto:${EMAIL}`}>
              Email
            </a>
          </div>
        ) : null}

        {msg.action === "show_contact" ? (
          <div className="mt-3 flex flex-wrap gap-3 border-t border-white/10 pt-3 text-sm">
            <a className="text-cyan-200 transition hover:text-white" href={LINKEDIN_URL} rel="noopener noreferrer" target="_blank">
              LinkedIn
            </a>
            <a className="text-purple-200 transition hover:text-white" href={`mailto:${EMAIL}`}>
              Email
            </a>
            <a className="text-slate-300 transition hover:text-white" href={GITHUB_URL} rel="noopener noreferrer" target="_blank">
              GitHub
            </a>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="flex items-center gap-2"
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
    >
      <span className="h-5 w-5 rounded-full bg-[linear-gradient(135deg,#8b5cf6,#22d3ee)]" />
      <span className="flex items-center gap-1 rounded-[5px_16px_16px_16px] border border-white/10 bg-white/[0.055] px-3 py-2">
        {[0, 1, 2].map((dot) => (
          <span
            className="h-1.5 w-1.5 rounded-full bg-cyan-200/70"
            key={dot}
            style={{ animation: `chat-dot 1.2s ease-in-out ${dot * 0.18}s infinite` }}
          />
        ))}
      </span>
    </motion.div>
  );
}

function Thread({ messages, isLoading }: { messages: Message[]; isLoading: boolean }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading]);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <style>{`
        @keyframes chat-dot { 0%,80%,100%{transform:scale(0.65);opacity:0.4} 40%{transform:scale(1);opacity:1} }
      `}</style>
      <div className="grid gap-3">
        {messages.map((message) => (
          <Bubble key={message.id} msg={message} />
        ))}
        <AnimatePresence>{isLoading ? <TypingIndicator key="typing" /> : null}</AnimatePresence>
      </div>
      <div ref={bottomRef} />
    </div>
  );
}

function Suggestions({
  disabled,
  items,
  onSelect,
}: {
  disabled: boolean;
  items: string[];
  onSelect: (text: string) => void;
}) {
  if (!items.length) return null;

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-2 border-t border-white/10 px-3 py-3"
      initial={{ opacity: 0, y: 6 }}
      transition={{ damping: 28, stiffness: 300, type: "spring" }}
    >
      {items.slice(0, 3).map((item) => (
        <button
          className="rounded-full border border-purple-300/25 bg-purple-400/10 px-3 py-1.5 text-left text-xs leading-5 text-slate-100/80 transition hover:border-cyan-300/40 hover:bg-cyan-300/10 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={disabled}
          key={item}
          onClick={() => onSelect(item)}
          type="button"
        >
          {item}
        </button>
      ))}
    </motion.div>
  );
}

function InputRow({ disabled, onSend }: { disabled: boolean; onSend: (text: string) => void }) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  function submit() {
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue("");
    if (inputRef.current) inputRef.current.style.height = "auto";
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  }

  function onChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setValue(event.target.value);
    if (!inputRef.current) return;
    inputRef.current.style.height = "auto";
    inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 132)}px`;
  }

  return (
    <div className="flex items-end gap-2 border-t border-white/10 px-3 py-3">
      <textarea
        aria-label="Hey Felipe question"
        className="min-h-10 flex-1 resize-none rounded-xl border border-white/10 bg-white/[0.055] px-3 py-2.5 text-[0.92rem] leading-5 text-slate-100 outline-none transition placeholder:text-slate-400/60 focus:border-cyan-300/30 focus:ring-2 focus:ring-cyan-300/10 disabled:opacity-60"
        disabled={disabled}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder="Ask anything..."
        ref={inputRef}
        rows={1}
        value={value}
      />
      <button
        aria-label="Send message"
        className="grid h-10 w-10 flex-none place-items-center rounded-xl border border-purple-300/30 bg-purple-500 text-white transition hover:bg-purple-400 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={disabled || !value.trim()}
        onClick={submit}
        type="button"
      >
        <SendIcon />
      </button>
    </div>
  );
}

function AudioControl({
  audioEnabled,
  onToggleAudio,
}: {
  audioEnabled: boolean;
  onToggleAudio: () => void;
}) {
  return (
    <button
      aria-label={audioEnabled ? "Mute audio" : "Unmute audio"}
      className={`grid h-9 w-9 place-items-center rounded-xl border transition ${
        audioEnabled
          ? "border-cyan-300/30 bg-cyan-300/[0.12] text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.18)]"
          : "border-white/10 bg-white/[0.045] text-slate-300/70 hover:text-white"
      }`}
      onClick={onToggleAudio}
      title={audioEnabled ? "Mute audio" : "Unmute audio"}
      type="button"
    >
      <VolumeIcon muted={!audioEnabled} />
    </button>
  );
}

function PanelHeader({
  audioEnabled,
  onToggleAudio,
}: {
  audioEnabled: boolean;
  onToggleAudio: () => void;
}) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <span className="h-8 w-8 flex-none rounded-full bg-[linear-gradient(135deg,#8b5cf6,#22d3ee)] shadow-[0_0_18px_rgba(139,92,246,0.28)]" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">Felipe Mejia</p>
          <p className="truncate font-mono text-[0.64rem] uppercase text-cyan-200/60">Product · Growth · AI</p>
        </div>
      </div>
      <AudioControl audioEnabled={audioEnabled} onToggleAudio={onToggleAudio} />
    </div>
  );
}

function MobilePanel(props: Props) {
  const [expanded, setExpanded] = useState(false);
  const dragStartY = useRef<number | null>(null);

  function onPointerDown(event: React.PointerEvent<HTMLButtonElement>) {
    dragStartY.current = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerUp(event: React.PointerEvent<HTMLButtonElement>) {
    if (dragStartY.current === null) return;
    const delta = event.clientY - dragStartY.current;
    if (delta < -32) setExpanded(true);
    if (delta > 32) setExpanded(false);
    dragStartY.current = null;
  }

  return (
    <motion.div
      animate={{ height: expanded ? "80vh" : "40vh", y: 0 }}
      className="fixed inset-x-0 bottom-0 z-[60] flex flex-col rounded-t-[20px] border border-b-0 border-white/10 bg-[linear-gradient(160deg,rgba(13,12,26,0.95),rgba(5,13,18,0.92))] shadow-[0_-18px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
      initial={{ y: "100%" }}
      transition={{ damping: 30, stiffness: 280, type: "spring" }}
    >
      <button
        aria-label={expanded ? "Collapse chat panel" : "Expand chat panel"}
        className="grid h-8 place-items-center rounded-t-[20px] text-slate-300/70"
        onClick={() => setExpanded((value) => !value)}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        type="button"
      >
        <span className="h-1 w-11 rounded-full bg-white/[0.22]" />
      </button>

      <PanelHeader audioEnabled={props.audioEnabled} onToggleAudio={props.onToggleAudio} />
      <Thread isLoading={props.isLoading} messages={props.messages} />
      <Suggestions disabled={props.isLoading} items={props.suggestions} onSelect={props.onSend} />
      <InputRow disabled={props.isLoading} onSend={props.onSend} />
    </motion.div>
  );
}

function DesktopPanel(props: Props) {
  return (
    <motion.div
      animate={{ opacity: 1, x: 0 }}
      className="fixed bottom-0 left-0 top-14 z-[60] flex w-[clamp(21rem,38vw,34rem)] flex-col rounded-r-[20px] border border-l-0 border-white/10 bg-[linear-gradient(160deg,rgba(13,12,26,0.92),rgba(5,13,18,0.88))] shadow-[18px_0_55px_rgba(0,0,0,0.38)] backdrop-blur-2xl"
      initial={{ opacity: 0, x: -28 }}
      transition={{ damping: 30, stiffness: 260, type: "spring" }}
    >
      <PanelHeader audioEnabled={props.audioEnabled} onToggleAudio={props.onToggleAudio} />
      <Thread isLoading={props.isLoading} messages={props.messages} />
      <Suggestions disabled={props.isLoading} items={props.suggestions} onSelect={props.onSend} />
      <InputRow disabled={props.isLoading} onSend={props.onSend} />
    </motion.div>
  );
}

export default function ChatPanel(props: Props) {
  const [isMobile, setMobile] = useState(false);

  useEffect(() => {
    const update = () => setMobile(window.innerWidth < 1024);
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  return isMobile ? <MobilePanel {...props} /> : <DesktopPanel {...props} />;
}
