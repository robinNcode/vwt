"use client";

import { useState } from "react";
import { submitContact } from "@/lib/dataClient";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await submitContact({ name, email, phone, subject, message });
    setResult(
      res.source === "api"
        ? "Message sent successfully. Our team will contact you soon."
        : "API unavailable. Message saved in mock mode.",
    );
    setName("");
    setEmail("");
    setPhone("");
    setSubject("");
    setMessage("");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h2 className="text-2xl font-bold tracking-tight">Contact</h2>
      <form className="mt-6 space-y-3 rounded-2xl border border-neutral-200 p-4" onSubmit={onSubmit}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required type="email" className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm" />
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm" />
        <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm" />
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message" required className="min-h-24 w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm" />
        <button type="submit" className="w-full rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600">
          Send message
        </button>
      </form>
      {result ? <p className="mt-4 rounded-xl bg-neutral-100 px-4 py-3 text-sm">{result}</p> : null}
    </div>
  );
}

