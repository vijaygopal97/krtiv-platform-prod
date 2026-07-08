"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { krtivLogo, krtivLogoHero } from "@/lib/krtivPaths";
import { SiteNavMenus } from "@/components/krtiv/SiteNavMenus";
import { PLAN_WITH_AI_HREF } from "@/lib/siteNavigation";
import {
  FEATURE_HEADER_ABOUT_LINK,
  FEATURE_HEADER_CONTEST_LINK,
} from "@/lib/featureFlags";
import { EditModeToggle } from "@/components/cms/EditModeToggle";
import { Editable } from "@/components/cms/Editable";
import { useMobileNav } from "@/components/navigation/MobileNavContext";

export function SiteHeader({
  variant = "auto",
  isAuthenticated = false,
  isAdmin = false,
  isContentEditor = false,
  userName,
  profilePicture,
  onLogout,
}: {
  variant?: "auto" | "solid";
  isAuthenticated?: boolean;
  isAdmin?: boolean;
  isContentEditor?: boolean;
  userName?: string;
  profilePicture?: string;
  onLogout?: () => void;
}) {
  const pathname = usePathname() ?? "/";
  const headerRef = useRef<HTMLElement>(null);
  const { open, setOpen } = useMobileNav();
  const [scrolled, setScrolled] = useState(variant === "solid");

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const syncHeight = () => {
      const h = el.offsetHeight;
      if (h > 0) {
        document.documentElement.style.setProperty("--site-header-height", `${h}px`);
      }
    };

    syncHeight();
    const ro = new ResizeObserver(syncHeight);
    ro.observe(el);
    window.addEventListener("resize", syncHeight, { passive: true });

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", syncHeight);
    };
  }, []);

  useEffect(() => {
    if (variant === "solid") return;
    const onScroll = () => setScrolled(window.scrollY > 12);
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
  const navTone = {
    textColor,
    linkHover,
  };

  return (
    <>
      <header
        ref={headerRef}
        className={`site-header fixed top-0 inset-x-0 z-[9998] ${
          isLight ? "site-header--opaque" : "site-header--transparent"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-5 md:px-10 h-16 md:h-20 flex items-center justify-between gap-2">
          <Link href="/" className={`relative flex shrink-0 items-center ${textColor}`} aria-label="Home">
            {/*
              Optical size match: both PNGs sit in the same slot, but the white hero
              mark has more internal empty padding (~15% smaller artwork). Scale it so
              the visible silhouette matches the scrolled orange logo — no size jump.
            */}
            <span className="relative block w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 overflow-visible">
              <img
                src={krtivLogoHero()}
                alt="Maharashtra Tourism"
                className={`absolute inset-0 w-full h-full object-contain origin-center scale-[1.15] transition-opacity duration-300 ${
                  isLight ? "opacity-0 pointer-events-none" : "opacity-100"
                }`}
              />
              <img
                src={krtivLogo()}
                alt=""
                aria-hidden={!isLight}
                className={`absolute inset-0 w-full h-full object-contain origin-center transition-opacity duration-300 ${
                  isLight ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              />
            </span>
          </Link>

          <nav
            className={`hidden lg:flex items-center gap-5 xl:gap-7 text-[13px] tracking-wide ${textColor}`}
          >
            <SiteNavMenus tone={navTone} pathname={pathname} />
            {FEATURE_HEADER_ABOUT_LINK ? (
              <Link href="/about" className={`min-h-[44px] inline-flex items-center transition-colors ${linkHover}`}>
                About
              </Link>
            ) : null}
            <Link href="/contact" className={`min-h-[44px] inline-flex items-center transition-colors ${linkHover}`}>
              <Editable cmsKey="nav.main.contact" defaultValue="Contact" as="span" />
            </Link>
            {FEATURE_HEADER_CONTEST_LINK ? (
              <Link
                href="/contest-registration"
                className={`min-h-[44px] inline-flex items-center transition-colors ${linkHover}`}
              >
                Contest
              </Link>
            ) : null}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {isContentEditor ? (
              <div className={`hidden md:block ${textColor}`}>
                <EditModeToggle />
              </div>
            ) : null}
            <Link
              href={PLAN_WITH_AI_HREF}
              className={`hidden md:inline-flex items-center gap-2 text-[13px] tracking-wide transition-colors ${textColor} ${linkHover}`}
            >
              <span>Plan your trip</span>
              <span aria-hidden>→</span>
            </Link>
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <>
                    <Link
                      href="/admin/analytics"
                      className={`hidden md:inline-flex text-[13px] px-3 h-9 items-center rounded-full transition-colors ${
                        isLight
                          ? "border hairline text-[color:var(--ink)] hover:bg-[color:var(--bone)]"
                          : "border border-white/25 text-white hover:bg-white/10"
                      }`}
                    >
                      Analytics
                    </Link>
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
                  </>
                )}
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt=""
                    width={36}
                    height={36}
                    className="hidden sm:block w-9 h-9 rounded-full border border-white/30 object-cover"
                  />
                ) : null}
                {userName ? (
                  <span className={`hidden md:inline text-[13px] max-w-[8rem] truncate ${textColor}`}>
                    {userName.split(" ")[0]}
                  </span>
                ) : null}
                <Link
                  href="/dashboard"
                  className={`text-[12px] sm:text-[13px] px-3 sm:px-4 h-9 inline-flex items-center rounded-full transition-colors ${
                    isLight
                      ? "bg-[color:var(--ink)] text-white hover:opacity-90"
                      : "bg-white/15 backdrop-blur-md text-white border border-white/25 hover:bg-white/25"
                  }`}
                >
                  Dashboard
                </Link>
                {onLogout ? (
                  <button
                    type="button"
                    onClick={onLogout}
                    className={`hidden lg:inline-flex text-[13px] px-3 h-9 rounded-full border transition-colors items-center ${
                      isLight
                        ? "hairline text-[color:var(--ink-soft)] hover:bg-[color:var(--bone)]"
                        : "border-white/25 text-white/90 hover:bg-white/10"
                    }`}
                  >
                    Logout
                  </button>
                ) : null}
              </>
            ) : (
              <Link
                href="/login"
                className={`text-[12px] sm:text-[13px] px-3 sm:px-4 h-9 inline-flex items-center rounded-full transition-colors ${
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
              aria-expanded={open}
              onClick={() => setOpen(true)}
              className={`lg:hidden inline-flex items-center justify-center min-w-[44px] min-h-[44px] w-11 h-11 rounded-full ${
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

      <div
        className={`fixed inset-0 z-[10001] lg:hidden transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} aria-hidden />
        <div
          className={`absolute inset-y-0 right-0 w-full max-w-[min(100%,24rem)] bg-[color:var(--ivory)] shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col z-[10002] ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex shrink-0 items-center justify-between h-16 px-4 sm:px-5 border-b hairline">
            <span className="font-display text-lg">Menu</span>
            <button
              type="button"
              aria-label="Close menu"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
              }}
              className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center text-[color:var(--ink)]"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 font-display">
            <SiteNavMenus tone={navTone} pathname={pathname} mobile onNavigate={() => setOpen(false)} />
            <div className="mt-4 pt-4 border-t hairline space-y-1">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="block py-3 min-h-[44px] text-lg font-semibold hover:text-[color:var(--saffron)] transition-colors"
                >
                  Profile
                </Link>
                {onLogout ? (
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      onLogout();
                    }}
                    className="block w-full text-left py-3 min-h-[44px] text-lg hover:text-[color:var(--saffron)] transition-colors"
                  >
                    Logout
                  </button>
                ) : null}
              </>
            ) : null}
            {isContentEditor ? (
              <div className="pb-4 mb-2 border-b hairline">
                <EditModeToggle />
              </div>
            ) : null}
              {isAdmin
                ? [
                    ["Analytics", "/admin/analytics"] as const,
                    ["Hero CMS", "/admin/hero"] as const,
                  ].map(([label, href]) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setOpen(false)}
                      className="block py-3 min-h-[44px] text-lg hover:text-[color:var(--saffron)] transition-colors"
                    >
                      {label}
                    </Link>
                  ))
                : null}
              {[
                ...(FEATURE_HEADER_ABOUT_LINK ? ([["About", "/about"]] as const) : []),
                ["Contact", "/contact"] as const,
                ...(FEATURE_HEADER_CONTEST_LINK
                  ? ([["Contest", "/contest-registration"]] as const)
                  : []),
                ["Plan your trip", PLAN_WITH_AI_HREF] as const,
              ].map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="block py-3 min-h-[44px] text-lg hover:text-[color:var(--saffron)] transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </nav>
          <div className="shrink-0 p-4 sm:p-5 flex gap-3 border-t hairline safe-area-pb">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="flex-1 text-center py-3 min-h-[44px] flex items-center justify-center rounded-full bg-[color:var(--ink)] text-white text-sm"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex-1 text-center py-3 min-h-[44px] flex items-center justify-center rounded-full border hairline text-sm"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="flex-1 text-center py-3 min-h-[44px] flex items-center justify-center rounded-full bg-[color:var(--ink)] text-white text-sm"
                >
                  Create account
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
