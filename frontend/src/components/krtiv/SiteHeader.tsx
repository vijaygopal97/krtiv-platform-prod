"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { krtivLogo } from "@/lib/krtivPaths";

export function SiteHeader({
  variant = "auto",
  isAuthenticated = false,
  isAdmin = false,
}: {
  /** "auto" = transparent over hero, frosted on scroll. "solid" = always frosted on ivory. */
  variant?: "auto" | "solid";
  isAuthenticated?: boolean;
  isAdmin?: boolean;
}) {
  const [scrolled, setScrolled] = useState(variant === "solid");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (variant === "solid") return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [variant]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isLight = scrolled || variant === "solid";
  const textColor = isLight ? "text-[color:var(--ink)]" : "text-white";
  const linkHover = isLight
    ? "hover:text-[color:var(--saffron)]"
    : "hover:text-white/80";

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          isLight ? "frosted border-b hairline" : "bg-transparent"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 h-16 md:h-20 flex items-center justify-between">
          <Link href="/" className={`flex items-center ${textColor}`} aria-label="Home">
            <img
              src={krtivLogo()}
              alt=""
              className="w-16 h-16 md:w-20 md:h-20 object-contain"
            />
          </Link>

          <nav
            className={`hidden lg:flex items-center gap-9 text-[13px] tracking-wide ${textColor}`}
          >
            <Link href="/#explore-by-categories" className={`transition-colors ${linkHover}`}>
              Explore
            </Link>
            <Link href="/category/historical" className={`transition-colors ${linkHover}`}>
              Heritage
            </Link>
            <Link href="/category/adventure" className={`transition-colors ${linkHover}`}>
              Adventure
            </Link>
            <Link href="/category/culinary" className={`transition-colors ${linkHover}`}>
              Culinary
            </Link>
            <Link href="/about" className={`transition-colors ${linkHover}`}>
              About
            </Link>
            <Link href="/contact" className={`transition-colors ${linkHover}`}>
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/#itinerary-generator"
              className={`hidden md:inline-flex items-center gap-2 text-[13px] tracking-wide transition-colors ${textColor} ${linkHover}`}
            >
              <span>Plan your trip</span>
              <span aria-hidden>→</span>
            </Link>
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link
                    href="/admin/hero"
                    className={`hidden md:inline-flex text-[13px] px-3 h-9 items-center rounded-full transition-colors ${
                      isLight
                        ? "border hairline text-[color:var(--ink)] hover:bg-[color:var(--bone)]"
                        : "border border-white/25 text-white hover:bg-white/10"
                    }`}
                  >
                    Hero CMS
                  </Link>
                )}
                <Link
                  href="/dashboard"
                className={`text-[13px] px-4 h-9 inline-flex items-center rounded-full transition-colors ${
                  isLight
                    ? "bg-[color:var(--ink)] text-white hover:opacity-90"
                    : "bg-white/15 backdrop-blur-md text-white border border-white/25 hover:bg-white/25"
                }`}
              >
                Dashboard
              </Link>
              </>
            ) : (
              <Link
                href="/login"
                className={`text-[13px] px-4 h-9 inline-flex items-center rounded-full transition-colors ${
                  isLight
                    ? "bg-[color:var(--ink)] text-white hover:opacity-90"
                    : "bg-white text-[color:var(--ink)] hover:bg-white/90"
                }`}
              >
                Sign in
              </Link>
            )}
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
              className={`lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-full ${
                isLight ? "text-[color:var(--ink)]" : "text-white"
              }`}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M3 7h18M3 12h18M3 17h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setOpen(false)}
          aria-hidden
        />
        <div
          className={`absolute inset-y-0 right-0 w-[88%] max-w-sm bg-[color:var(--ivory)] shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between h-16 px-5 border-b hairline">
            <span className="font-display text-lg">Menu</span>
            <button
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="w-10 h-10 inline-flex items-center justify-center text-[color:var(--ink)]"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <nav className="flex flex-col p-5 gap-1 text-lg font-display">
            {[
              ["Explore", "/#explore-by-categories"],
              ["Heritage", "/category/historical"],
              ["Adventure", "/category/adventure"],
              ["Spiritual", "/category/spiritual"],
              ["Culinary", "/category/culinary"],
              ["Art & Culture", "/category/art-culture"],
              ["Urban", "/category/urban"],
              ["Weddings", "/category/weddings"],
              ["About", "/about"],
              ["Contact", "/contact"],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="py-3 border-b hairline last:border-0 hover:text-[color:var(--saffron)] transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="px-5 mt-2 flex gap-3">
            <Link
              href="/login"
              className="flex-1 text-center py-3 rounded-full border hairline text-sm"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="flex-1 text-center py-3 rounded-full bg-[color:var(--ink)] text-white text-sm"
            >
              Create account
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
