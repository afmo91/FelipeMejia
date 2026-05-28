"use client";

import { useEffect, useState } from "react";

type PortraitMode = "parallax" | "static" | "touch";

const options: { label: string; mode: PortraitMode }[] = [
  { label: "Scroll Parallax", mode: "parallax" },
  { label: "Static", mode: "static" },
  { label: "Follow Touch", mode: "touch" },
];

export default function FloatingSettings() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<PortraitMode>("parallax");

  useEffect(() => {
    const stored = window.localStorage.getItem("portrait-mode") as PortraitMode | null;
    if (stored === "parallax" || stored === "static" || stored === "touch") {
      setMode(stored);
    }
  }, []);

  function updateMode(nextMode: PortraitMode) {
    setMode(nextMode);
    window.localStorage.setItem("portrait-mode", nextMode);
    window.dispatchEvent(new CustomEvent("portrait-mode-change", { detail: nextMode }));
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 md:hidden">
      <button
        aria-controls="portrait-settings"
        aria-expanded={open}
        className="border border-white/15 bg-black/80 px-4 py-3 text-sm text-white shadow-[0_0_30px_rgba(139,92,246,0.22)] backdrop-blur transition hover:border-accent"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        Portrait
      </button>

      {open ? (
        <div
          className="mt-3 w-56 border border-white/10 bg-black/90 p-4 text-sm text-white shadow-[0_0_38px_rgba(34,211,238,0.16)] backdrop-blur"
          id="portrait-settings"
        >
          <p className="text-xs uppercase text-accent2">Motion</p>
          <div className="mt-3 space-y-2">
            {options.map((option) => (
              <label className="flex cursor-pointer items-center gap-3 text-gray-300" key={option.mode}>
                <input
                  checked={mode === option.mode}
                  className="accent-purple-500"
                  name="portrait-mode"
                  onChange={() => updateMode(option.mode)}
                  type="radio"
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
