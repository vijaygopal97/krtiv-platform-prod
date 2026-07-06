"use client";

import Link from "next/link";
import { krtivLogo, krtivVisitLogo } from "@/lib/krtivPaths";
import { FooterSocialLinks } from "@/components/krtiv/FooterSocialLinks";
import { FooterExperiencesNav } from "@/components/krtiv/FooterExperiencesNav";
import { Editable } from "@/components/cms/Editable";

const footerLinkClass =
  "text-white/75 hover:text-white transition-colors duration-300 ease-out focus:outline-none focus-visible:text-white focus-visible:underline underline-offset-4";

export function SiteFooter() {
  return (
    <footer className="bg-[color:var(--ink)] text-white/85">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 pt-20 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 md:gap-10 min-w-0">
          <div className="sm:col-span-2 lg:col-span-5">
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
              <Editable
                cmsKey="global.footer.tagline"
                defaultValue="The official invitation to explore Maharashtra — its forts, ghats, coasts and quiet villages — designed for the unhurried traveler."
                as="span"
              />
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
                className="inline-flex items-center justify-center rounded-full bg-white text-[color:var(--ink)] text-sm px-4 h-9 hover:bg-white/90 transition duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>

          <div className="lg:col-span-3 min-w-0">
            <p className="eyebrow text-white/40">
              <Editable cmsKey="global.footer.experiencesLabel" defaultValue="Experiences" as="span" />
            </p>
            <FooterExperiencesNav />
          </div>

          <div className="lg:col-span-2">
            <p className="eyebrow text-white/40">
              <Editable cmsKey="global.footer.planLabel" defaultValue="Plan" as="span" />
            </p>
            <ul className="mt-5 space-y-3 text-[15px]">
              <li>
                <Link href="/dashboard" className={footerLinkClass}>
                  Itinerary builder
                </Link>
              </li>
              <li>
                <Link href="/about" className={footerLinkClass}>
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className={footerLinkClass}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="sm:col-span-2 lg:col-span-2 min-w-0">
            <p className="eyebrow text-white/40">Contact</p>
            <div className="mt-5">
              <FooterSocialLinks />
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row gap-4 items-center justify-between text-xs text-white/45">
          <p className="text-center md:text-left max-w-full break-words [overflow-wrap:anywhere]">
            <Editable
              cmsKey="global.footer.copyright"
              defaultValue={`© ${new Date().getFullYear()} Developed by eFlag Corp`}
              as="span"
            />
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className={`${footerLinkClass} text-xs text-white/45 hover:text-white`}>
              Privacy
            </a>
            <a href="#" className={`${footerLinkClass} text-xs text-white/45 hover:text-white`}>
              Terms
            </a>
            <select
              defaultValue="en"
              className="bg-transparent border border-white/15 rounded-full px-3 py-1 text-white/70 transition-colors duration-300 hover:border-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--saffron)]"
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
