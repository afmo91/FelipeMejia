"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  return (
    <form
      className="mt-10 grid max-w-md gap-5"
      onSubmit={async (event) => {
        event.preventDefault();
        setError("");
        setPending(true);

        const form = new FormData(event.currentTarget);
        const callbackUrl = searchParams.get("callbackUrl") || "/cv/product-manager";
        const result = await signIn("credentials", {
          callbackUrl,
          password: String(form.get("password") || ""),
          redirect: false,
          username: String(form.get("username") || ""),
        });

        setPending(false);

        if (result?.error) {
          setError("Invalid username or password.");
          return;
        }

        router.push(result?.url || callbackUrl);
        router.refresh();
      }}
    >
      <div>
        <label className="form-label" htmlFor="username">
          Username
        </label>
        <input
          autoComplete="username"
          className="form-field"
          id="username"
          name="username"
          required
          type="text"
        />
      </div>
      <div>
        <label className="form-label" htmlFor="password">
          Password
        </label>
        <input
          autoComplete="current-password"
          className="form-field"
          id="password"
          name="password"
          required
          type="password"
        />
      </div>
      <button className="button-primary w-fit disabled:cursor-not-allowed disabled:opacity-60" disabled={pending} type="submit">
        {pending ? "Signing in..." : "Sign in"}
      </button>
      {error ? (
        <p className="text-sm text-red-300" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
