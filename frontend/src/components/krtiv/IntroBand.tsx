import { ScrollReveal } from "./ScrollReveal";

const stats = [
  { value: "350+", label: "Forts to walk" },
  { value: "720 km", label: "Konkan coastline" },
  { value: "5", label: "UNESCO sites" },
  { value: "1,500+", label: "Years of art" },
];

export function IntroBand() {
  return (
    <section className="relative bg-[color:var(--bone)] py-24 md:py-32 border-y hairline">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 grid md:grid-cols-12 gap-12 items-end">
        <ScrollReveal className="md:col-span-7">
          <p className="eyebrow">An invitation</p>
          <h2 className="display-lg mt-4 text-balance">
            A state built like an epic — <em className="italic font-normal text-[color:var(--terracotta)]">read it slowly</em>.
          </h2>
        </ScrollReveal>
        <ScrollReveal className="md:col-span-5" delay={120}>
          <p className="lede">
            Maharashtra is the kind of place that doesn't fit into a weekend.
            It opens in chapters — the forts, the ghats, the bazaars, the long
            quiet shoreline. This is a guide for travelers who want to read
            them in order.
          </p>
        </ScrollReveal>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 md:px-10 mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6 border-t hairline pt-10">
        {stats.map((s, i) => (
          <ScrollReveal key={s.label} delay={i * 80}>
            <p className="display-md text-[color:var(--ink)]">{s.value}</p>
            <p className="mt-2 text-sm text-[color:var(--ink-soft)] tracking-wide">
              {s.label}
            </p>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
