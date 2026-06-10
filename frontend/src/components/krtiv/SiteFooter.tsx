"use client";

import Link from "next/link";
import { CATEGORIES } from "./data";
import { krtivLogo, krtivVisitLogo } from "@/lib/krtivPaths";

export function SiteFooter() {
  return (
    <footer className="bg-[color:var(--ink)] text-white/85">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-10 min-w-0">
          <div className="md:col-span-5">
            <div className="flex flex-wrap items-center gap-4 md:gap-5">
              <Link href="/" className="inline-flex shrink-0" aria-label="Home">
                <img
                  src={krtivLogo()}
                  alt=""
                  className="w-16 h-16 md:w-20 md:h-20 object-contain"
                />
              </Link>
              <img
                src={krtivVisitLogo()}
                alt="Visit Maharashtra"
                className="h-14 md:h-16 w-auto max-w-[220px] md:max-w-[260px] object-contain"
              />
            </div>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-white/65">
              The official invitation to explore Maharashtra — its forts, ghats,
              coasts and quiet villages — designed for the unhurried traveler.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-8 flex max-w-md items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-md p-1.5 pl-5"
            >
              <input
                type="email"
                placeholder="Your email for occasional dispatches"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-white/40"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-white text-[color:var(--ink)] text-sm px-4 h-9 hover:bg-white/90 transition"
              >
                Subscribe
              </button>
            </form>
          </div>

          <div className="md:col-span-3">
            <p className="eyebrow text-white/40">Explore</p>
            <ul className="mt-5 space-y-3 text-[15px]">
              {CATEGORIES.slice(0, 6).map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/category/${c.slug}`}
                    className="text-white/75 hover:text-white transition"
                  >
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="eyebrow text-white/40">Plan</p>
            <ul className="mt-5 space-y-3 text-[15px]">
              <li><Link href="/dashboard" className="text-white/75 hover:text-white">Itinerary builder</Link></li>
              <li><Link href="/#itinerary-generator" className="text-white/75 hover:text-white">AI planner</Link></li>
              <li><Link href="/about" className="text-white/75 hover:text-white">About</Link></li>
              <li><Link href="/contact" className="text-white/75 hover:text-white">Contact</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2 min-w-0">
            <p className="eyebrow text-white/40">Visit</p>
            <ul className="mt-5 space-y-3 text-[15px] text-white/75">
              <li className="break-words">Mantralaya, Mumbai</li>
              <li className="break-words">+91 22 0000 0000</li>
              <li className="min-w-0 break-words [overflow-wrap:anywhere]">
                <a
                  href="mailto:info@maharashtratourism.com"
                  className="hover:text-white transition break-words [overflow-wrap:anywhere]"
                >
                  info@maharashtratourism.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row gap-4 items-center justify-between text-xs text-white/45">
          <p className="text-center md:text-left max-w-full break-words [overflow-wrap:anywhere]">
            © {new Date().getFullYear()} Maharashtra Tourism · Developed by Convergent × SignPost
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <select
              defaultValue="en"
              className="bg-transparent border border-white/15 rounded-full px-3 py-1 text-white/70"
              aria-label="Language"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="mr">मराठी</option>
            </select>
          </div>
        </div>
      </div>
    </footer>
  );
}
