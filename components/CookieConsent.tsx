"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const COOKIE_KEY = "felipe-os-cookie-consent";

type CookieConsentState = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  savedAt: string;
};

function saveConsent(analytics: boolean, marketing: boolean) {
  const consent: CookieConsentState = {
    analytics,
    marketing,
    necessary: true,
    savedAt: new Date().toISOString(),
  };
  window.localStorage.setItem(COOKIE_KEY, JSON.stringify(consent));
  window.dispatchEvent(new CustomEvent("felipe-os-cookie-consent-updated", { detail: consent }));
}

function readConsent() {
  const saved = window.localStorage.getItem(COOKIE_KEY);
  if (!saved) return null;
  try {
    return JSON.parse(saved) as CookieConsentState;
  } catch {
    return null;
  }
}

export default function CookieConsent() {
  const [ready, setReady] = useState(false);
  const [bannerOpen, setBannerOpen] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const saved = readConsent();
    if (saved) {
      setAnalytics(saved.analytics);
      setMarketing(saved.marketing);
    } else {
      setBannerOpen(true);
    }
    setReady(true);

    function openPreferences() {
      const current = readConsent();
      setAnalytics(Boolean(current?.analytics));
      setMarketing(Boolean(current?.marketing));
      setBannerOpen(false);
      setPreferencesOpen(true);
    }

    window.addEventListener("open-cookie-preferences", openPreferences);
    return () => window.removeEventListener("open-cookie-preferences", openPreferences);
  }, []);

  function acceptAll() {
    saveConsent(true, true);
    setAnalytics(true);
    setMarketing(true);
    setBannerOpen(false);
    setPreferencesOpen(false);
  }

  function rejectNonEssential() {
    saveConsent(false, false);
    setAnalytics(false);
    setMarketing(false);
    setBannerOpen(false);
    setPreferencesOpen(false);
  }

  function savePreferences() {
    saveConsent(analytics, marketing);
    setBannerOpen(false);
    setPreferencesOpen(false);
  }

  if (!ready) return null;

  return (
    <>
      <AnimatePresence>
        {bannerOpen ? (
          <motion.section
            animate={{ opacity: 1, y: 0 }}
            aria-label="Cookie consent"
            className="fixed inset-x-3 bottom-3 z-[90] mx-auto max-w-3xl rounded-[24px] border border-white/10 bg-[#090914]/92 p-4 text-white shadow-[0_24px_90px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:p-5"
            exit={{ opacity: 0, y: 20 }}
            initial={{ opacity: 0, y: 20 }}
          >
            <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <p className="text-sm font-semibold">Cookie preferences</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  I use cookies only to keep the site working and, if accepted, understand what content is useful.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 sm:justify-end">
                <button className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black" onClick={acceptAll} type="button">
                  Accept all
                </button>
                <button className="rounded-full border border-white/10 bg-white/[0.045] px-4 py-2 text-sm font-semibold text-white" onClick={rejectNonEssential} type="button">
                  Reject non-essential
                </button>
                <button className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100" onClick={() => setPreferencesOpen(true)} type="button">
                  Manage preferences
                </button>
              </div>
            </div>
          </motion.section>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {preferencesOpen ? (
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[95] grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
          >
            <motion.section
              animate={{ scale: 1, y: 0 }}
              aria-label="Manage cookie preferences"
              className="w-full max-w-lg rounded-[26px] border border-white/10 bg-[#090914] p-5 text-white shadow-[0_24px_90px_rgba(0,0,0,0.55)]"
              exit={{ scale: 0.98, y: 12 }}
              initial={{ scale: 0.98, y: 12 }}
            >
              <p className="text-xs uppercase tracking-[0.16em] text-cyan-100/60">Privacy</p>
              <h2 className="mt-2 text-2xl font-semibold">Cookie preferences</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Necessary cookies keep Felipe OS working. Analytics and marketing stay off unless you choose them.
              </p>
              <div className="mt-5 grid gap-3">
                <label className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <span>
                    <span className="block text-sm font-semibold">Necessary cookies</span>
                    <span className="mt-1 block text-xs leading-5 text-slate-400">Always on for core site behavior.</span>
                  </span>
                  <input checked disabled type="checkbox" />
                </label>
                <label className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <span>
                    <span className="block text-sm font-semibold">Analytics</span>
                    <span className="mt-1 block text-xs leading-5 text-slate-400">Optional signal about useful content.</span>
                  </span>
                  <input checked={analytics} onChange={(event) => setAnalytics(event.target.checked)} type="checkbox" />
                </label>
                <label className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <span>
                    <span className="block text-sm font-semibold">Marketing</span>
                    <span className="mt-1 block text-xs leading-5 text-slate-400">Optional campaign measurement if configured later.</span>
                  </span>
                  <input checked={marketing} onChange={(event) => setMarketing(event.target.checked)} type="checkbox" />
                </label>
              </div>
              <div className="mt-5 flex flex-wrap justify-end gap-2">
                <button className="rounded-full border border-white/10 bg-white/[0.045] px-4 py-2 text-sm font-semibold text-white" onClick={() => setPreferencesOpen(false)} type="button">
                  Close
                </button>
                <button className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black" onClick={savePreferences} type="button">
                  Save preferences
                </button>
              </div>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
