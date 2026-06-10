import { ScrollReveal } from "./ScrollReveal";

export function CtaBand() {
  return (
    <section id="itinerary-generator" className="bg-[color:var(--ivory)] py-24 md:py-36">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        <div className="relative overflow-hidden rounded-[24px] grid md:grid-cols-2 min-h-[520px]">
          <div className="relative bg-[color:var(--ink)] text-white p-10 md:p-16 flex flex-col justify-between">
            <ScrollReveal>
              <p className="eyebrow text-white/55">AI itinerary builder</p>
              <h3 className="display-md mt-5 text-balance">
                Tell us how you travel. We'll write the days.
              </h3>
              <p className="lede mt-5 text-white/70 max-w-md">
                Share your interests, pace and the cities you fly from — our planner returns a day-by-day itinerary you can edit, share and live by.
              </p>
            </ScrollReveal>

            <div className="mt-12">
              <a
                href="/dashboard"
                className="inline-flex items-center gap-2 h-12 px-6 rounded-full bg-[color:var(--saffron)] text-white text-sm font-medium hover:opacity-90 transition"
              >
                Generate my itinerary <span aria-hidden>→</span>
              </a>
              <ul className="mt-10 grid grid-cols-3 gap-4 text-xs text-white/65">
                <li>
                  <p className="text-white text-base font-display mb-1">Personal</p>
                  Built around your interests and travel companions.
                </li>
                <li>
                  <p className="text-white text-base font-display mb-1">Time-aware</p>
                  Optimized hour by hour, not just day by day.
                </li>
                <li>
                  <p className="text-white text-base font-display mb-1">Editable</p>
                  Tweak any moment — the rest of the plan adapts.
                </li>
              </ul>
            </div>
          </div>

          <div className="relative min-h-[320px] md:min-h-full">
            <img
              src="/krtiv/hero-image.jpeg"
              alt="Maharashtra landscape"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-transparent md:bg-gradient-to-r md:from-[color:var(--ink)]/40 md:via-transparent md:to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
