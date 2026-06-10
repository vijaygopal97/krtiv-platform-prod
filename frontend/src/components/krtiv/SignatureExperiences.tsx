import Link from "next/link";
import { ScrollReveal } from "./ScrollReveal";
import { categoryImage } from "@/lib/krtivPaths";

const experiences = [
  {
    title: "A sunrise on Kalsubai",
    region: "Sahyadri Range",
    image: "https://images.pexels.com/photos/1647121/pexels-photo-1647121.jpeg?auto=compress&cs=tinysrgb&w=1600",
    blurb:
      "Climb the iron ladders before first light and watch the valleys come up out of the mist.",
  },
  {
    title: "Kohinoor of the Deccan",
    region: "Ajanta Caves",
    image: "https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg?auto=compress&cs=tinysrgb&w=1600",
    blurb:
      "Sit with the 2nd-century paintings the way they were meant to be sat with — for an hour, in silence.",
  },
  {
    title: "Konkan, a slow lunch",
    region: "Alibaug",
    image: categoryImage('culinary-rural.jpg'),
    blurb:
      "Whole-fish, sol kadhi, rice with a thumbprint of coconut chutney. The coast at a table.",
  },
];

export function SignatureExperiences() {
  return (
    <section className="relative bg-[color:var(--ivory)] py-24 md:py-36">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-16">
          <ScrollReveal>
            <p className="eyebrow">Signature moments</p>
            <h2 className="display-lg mt-4 max-w-3xl text-balance">
              Three afternoons that stay with you for years.
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <Link href="/#explore-by-categories" className="story-link hover:story-link-on">
              See all journeys <span aria-hidden>→</span>
            </Link>
          </ScrollReveal>
        </div>

        <div className="grid md:grid-cols-12 gap-6 md:gap-8">
          <ScrollReveal className="md:col-span-7">
            <article className="group relative overflow-hidden rounded-[20px] aspect-[16/11]">
              <img
                src={experiences[0].image}
                alt={experiences[0].title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 text-white">
                <p className="text-[11px] tracking-[0.3em] uppercase text-white/80">
                  {experiences[0].region}
                </p>
                <h3 className="font-display text-3xl md:text-5xl mt-3 text-balance">
                  {experiences[0].title}
                </h3>
                <p className="mt-4 max-w-md text-white/85 text-[15px] leading-relaxed">
                  {experiences[0].blurb}
                </p>
              </div>
            </article>
          </ScrollReveal>

          <div className="md:col-span-5 grid grid-cols-1 gap-6 md:gap-8">
            {experiences.slice(1).map((e, i) => (
              <ScrollReveal key={e.title} delay={(i + 1) * 120}>
                <article className="group relative overflow-hidden rounded-[20px] aspect-[16/10]">
                  <img
                    src={e.image}
                    alt={e.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                    <p className="text-[11px] tracking-[0.3em] uppercase text-white/80">
                      {e.region}
                    </p>
                    <h3 className="font-display text-2xl md:text-3xl mt-2 text-balance">
                      {e.title}
                    </h3>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
