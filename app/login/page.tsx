import LoginForm from "@/components/LoginForm";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to access the private Felipe OS admin workspace.",
};

export default function LoginPage() {
  return (
    <section className="section">
      <div className="max-w-3xl">
        <p className="text-sm font-medium text-accent2">Login</p>
        <h1 className="mt-4 text-4xl font-semibold text-white md:text-6xl">Admin Access</h1>
        <p className="mt-6 text-lg leading-8 text-gray-300">
          Private admin tools manage public CV data and tailored application versions.
        </p>
      </div>
      <Suspense fallback={<p className="mt-10 text-gray-300">Loading sign-in form...</p>}>
        <LoginForm />
      </Suspense>
    </section>
  );
}
