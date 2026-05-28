"use client";

import { useState } from "react";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  return (
    <form
      className="grid gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        console.log(Object.fromEntries(form));
        event.currentTarget.reset();
        setSent(true);
      }}
    >
      <div>
        <label className="form-label" htmlFor="name">
          Name
        </label>
        <input className="form-field" id="name" name="name" required type="text" />
      </div>
      <div>
        <label className="form-label" htmlFor="email">
          Email
        </label>
        <input className="form-field" id="email" name="email" required type="email" />
      </div>
      <div>
        <label className="form-label" htmlFor="message">
          Message
        </label>
        <textarea className="form-field min-h-40 resize-y" id="message" name="message" required />
      </div>
      <button className="button-primary w-fit" type="submit">
        Send project note
      </button>
      {sent ? (
        <p className="text-sm text-emerald-300" role="status">
          Message logged locally for now. Email delivery can be wired next.
        </p>
      ) : null}
    </form>
  );
}
