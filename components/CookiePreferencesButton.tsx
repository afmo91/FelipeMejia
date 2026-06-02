"use client";

export default function CookiePreferencesButton() {
  return (
    <button
      className="footer-link"
      onClick={() => window.dispatchEvent(new Event("open-cookie-preferences"))}
      type="button"
    >
      Cookie preferences
    </button>
  );
}
