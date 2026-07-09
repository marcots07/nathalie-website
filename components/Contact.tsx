"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Dictionary, Locale } from "@/lib/i18n";
import SectionHeading from "./SectionHeading";

type FormState = "idle" | "submitting" | "success" | "error";

export default function Contact({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<FormState>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = dict.contact.form.required;
    if (!email.trim()) next.email = dict.contact.form.required;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = dict.contact.form.invalidEmail;
    if (!message.trim()) next.message = dict.contact.form.required;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, website, locale }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="relative py-24 md:py-36">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <SectionHeading eyebrow={dict.contact.eyebrow} heading={dict.contact.heading}>
          {dict.contact.intro}
        </SectionHeading>

        <div className="mt-16 md:mt-20 grid md:grid-cols-12 gap-10 md:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="md:col-span-5 space-y-6"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-sage-700 mb-2">
                Email
              </p>
              <a
                href={`mailto:${dict.contact.email}`}
                className="text-lg text-ink hover:text-sage-700 transition-colors editorial-link break-all"
              >
                {dict.contact.email}
              </a>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-sage-700 mb-2">
                {locale === "es" ? "Teléfono" : "Phone"}
              </p>
              <a
                href={`tel:${dict.contact.phone.replace(/[^0-9+]/g, "")}`}
                className="text-lg text-ink hover:text-sage-700 transition-colors editorial-link"
              >
                {dict.contact.phone}
              </a>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-sage-700 mb-2">
                {locale === "es" ? "Ubicación" : "Location"}
              </p>
              <p className="text-lg text-ink">{dict.contact.location}</p>
            </div>
            <a
              href="/cv/nathalie-gonzalez-perez-cv.pdf"
              download
              className="inline-flex items-center gap-2 mt-4 border border-sage-300 hover:border-sage-700 text-ink px-5 py-2.5 rounded-full transition-all duration-500 group"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                className="transition-transform duration-500 group-hover:translate-y-0.5"
              >
                <path
                  d="M8 2v9m0 0l-3.5-3.5M8 11l3.5-3.5M3 14h10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {dict.contact.downloadCv}
            </a>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.15 }}
            onSubmit={submit}
            className="md:col-span-7 space-y-5"
            noValidate
          >
            {/* Honeypot — visually hidden, off-screen, marked aria-hidden. */}
            <div className="absolute -left-[9999px]" aria-hidden>
              <label>
                Website
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </label>
            </div>

            <Field
              label={dict.contact.form.name}
              value={name}
              onChange={setName}
              error={errors.name}
              autoComplete="name"
            />
            <Field
              label={dict.contact.form.emailLabel}
              value={email}
              onChange={setEmail}
              error={errors.email}
              type="email"
              autoComplete="email"
            />
            <Field
              label={dict.contact.form.message}
              value={message}
              onChange={setMessage}
              error={errors.message}
              textarea
            />

            <div className="flex items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={status === "submitting"}
                className="inline-flex items-center gap-2 bg-sage-700 hover:bg-sage-800 disabled:opacity-60 text-cream-50 px-6 py-3 rounded-full transition-all duration-500 hover:gap-3"
              >
                {status === "submitting"
                  ? dict.contact.form.submitting
                  : dict.contact.form.submit}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8h10m0 0L9 4m4 4L9 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {status === "success" && (
                <motion.p
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sage-700 text-sm"
                >
                  {dict.contact.form.success}
                </motion.p>
              )}
              {status === "error" && (
                <motion.p
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-terracotta-500 text-sm"
                >
                  {dict.contact.form.error}
                </motion.p>
              )}
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  type = "text",
  textarea = false,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  textarea?: boolean;
  autoComplete?: string;
}) {
  const shared =
    "w-full bg-transparent border-b border-sage-200 focus:border-sage-700 outline-none py-3 text-ink placeholder-transparent transition-colors";
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.24em] text-sage-700">
        {label}
      </span>
      {textarea ? (
        <textarea
          rows={4}
          className={`${shared} resize-none mt-2`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type={type}
          autoComplete={autoComplete}
          className={`${shared} mt-2`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {error && <p className="text-terracotta-500 text-xs mt-1">{error}</p>}
    </label>
  );
}
