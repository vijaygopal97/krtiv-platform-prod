import Link from "next/link";
import type { ReactNode } from "react";
import { krtivHeroImage, krtivLogo } from "@/lib/krtivPaths";

/**
 * Split-screen auth shell — editorial image on one side, form on the other.
 * Reusable across login / register / forgot-password / reset-password.
 */
export function AuthShell({
  title,
  subtitle,
  image = krtivHeroImage(),
  imageEyebrow = "Discover Maharashtra",
  imageQuote = "A state built like an epic — read it slowly.",
  reverse = false,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  image?: string;
  imageEyebrow?: string;
  imageQuote?: string;
  reverse?: boolean;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="min-h-[100svh] bg-[color:var(--ivory)] grid md:grid-cols-2">
      <div
        className={`relative min-h-[260px] md:min-h-screen ${
          reverse ? "md:order-2" : ""
        }`}
      >
        <img
          src={image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/20 to-black/70" />
        <div className="relative h-full p-8 md:p-12 flex flex-col justify-between text-white">
          <Link href="/" className="inline-flex items-center" aria-label="Home">
            <img
              src={krtivLogo()}
              alt=""
              className="w-12 h-12 md:w-14 md:h-14 object-contain"
            />
          </Link>
          <div className="max-w-md">
            <p className="text-[11px] tracking-[0.3em] uppercase text-white/70">
              {imageEyebrow}
            </p>
            <p className="font-display text-2xl md:text-3xl mt-4 text-balance leading-snug">
              {imageQuote}
            </p>
          </div>
        </div>
      </div>

      <div className="relative flex items-center justify-center px-6 md:px-12 py-16 md:py-20">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="text-sm text-[color:var(--ink-soft)] hover:text-[color:var(--ink)] inline-flex items-center gap-2 mb-10"
          >
            <span aria-hidden>←</span> Back to home
          </Link>
          <h1 className="display-md text-[color:var(--ink)] text-balance">
            {title}
          </h1>
          {subtitle && (
            <p className="lede mt-4 text-[15px]">{subtitle}</p>
          )}
          <div className="mt-10">{children}</div>
          {footer && (
            <div className="mt-8 text-sm text-[color:var(--ink-soft)]">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function Field({
  label,
  type = "text",
  name,
  placeholder,
  required,
  autoComplete,
}: {
  label: string;
  type?: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="block mb-5">
      <span className="block text-xs tracking-wide text-[color:var(--ink-soft)] mb-2">
        {label}
      </span>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        className="w-full h-12 px-4 rounded-xl bg-white border hairline text-[15px] text-[color:var(--ink)] placeholder:text-[color:var(--ink-soft)]/60 outline-none focus:border-[color:var(--ink)] transition"
      />
    </label>
  );
}

export function PrimaryButton({
  children,
  type = "submit",
}: {
  children: ReactNode;
  type?: "submit" | "button";
}) {
  return (
    <button
      type={type}
      className="w-full h-12 rounded-full bg-[color:var(--ink)] text-white text-sm font-medium hover:opacity-90 transition"
    >
      {children}
    </button>
  );
}
