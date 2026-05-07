"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useAuthStore, type AuthUser } from "@/store/authStore";

type RegisterResponse = { token: string; user: AuthUser };

export default function CustomerRegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<RegisterResponse>("/auth/customers/register", {
        method: "POST",
        body: JSON.stringify({ name, email, phone: phone || null, password }),
      });
      setAuth(res.data.token, res.data.user);
      router.replace("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-soft">
        <h1 className="text-xl font-bold tracking-tight">Create account</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Register as a customer to track orders and manage your details.
        </p>

        {error ? (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-2 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500"
              placeholder="Your name"
              autoComplete="name"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">Email</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              className="mt-2 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">Phone</span>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-2 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500"
              placeholder="01XXXXXXXXX"
              autoComplete="tel"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">Password</span>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              className="mt-2 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500"
              placeholder="••••••••"
              autoComplete="new-password"
              minLength={6}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-70"
          >
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}

